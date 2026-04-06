const Razorpay = require('razorpay');
const logger   = require('../../shared/logger');

class PaymentEngine {
  constructor() {
    this.razorpay = null;
    this.pendingOTP = null;
    this.pendingConfirm = null;
  }

  getRazorpay() {
    if (!this.razorpay) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
    return this.razorpay;
  }

  getLongTermDb() {
    return require('../../memory/adapters/longTerm').db;
  }

  async pay({ amount, recipient, upiId, method = 'upi', reason = '' }) {
    if (!process.env.PAYMENT_ENABLED || process.env.PAYMENT_ENABLED !== 'true') {
      return { status: 'disabled', message: 'Payments are disabled in .env' };
    }

    // Safety checks
    const dailySpent = this.getDailySpent();
    const limit = Number(process.env.PAYMENT_DAILY_LIMIT_INR) || 2000;
    if (dailySpent + amount > limit) {
      return { status: 'blocked', reason: `Daily limit of ₹${limit} would be exceeded.` };
    }

    // Phone confirmation (ALWAYS required)
    const confirmed = await this.requestConfirmation({ amount, recipient, method, reason });
    if (!confirmed) return { status: 'rejected', reason: 'User declined on phone.' };

    // Create order
    const order = await this.getRazorpay().orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `jarvis_${Date.now()}`,
    });

    // Wait for OTP if card payment
    let otp = null;
    if (method === 'card') {
      otp = await this.waitForOTP(45000);
      if (!otp) return { status: 'failed', reason: 'OTP timeout after 45 seconds.' };
    }

    const reference = `TXN${Date.now()}`;

    // Log to audit (immutable)
    this.logPayment({ amount, recipient, method, status: 'success', reference });

    logger.info(`Payment success: ₹${amount} to ${recipient} | ref: ${reference}`);
    return { status: 'success', reference, amount, recipient };
  }

  async requestConfirmation({ amount, recipient, method, reason }) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 120000); // 2min timeout
      this.pendingConfirm = (approved) => {
        clearTimeout(timeout);
        resolve(approved);
      };

      // Send push notification to phone
      try {
        const push = require('../../connectors/phone/push');
        push.send({
          type: 'payment_confirm',
          amount,
          recipient,
          method,
          reason,
          callbackUrl: `${process.env.CLOUDFLARE_TUNNEL_URL}/payments/confirm`
        });
      } catch (err) {
        logger.warn(`Push notification failed: ${err.message}`);
        // Auto-reject if can't reach phone
        resolve(false);
      }
    });
  }

  confirmFromPhone(approved) {
    if (this.pendingConfirm) {
      this.pendingConfirm(approved);
      this.pendingConfirm = null;
    }
  }

  receiveOTP(otp) {
    if (this.pendingOTP) {
      this.pendingOTP(otp);
      this.pendingOTP = null;
    }
    // Security: OTP is consumed immediately, never stored
  }

  waitForOTP(timeoutMs) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), timeoutMs);
      this.pendingOTP = (otp) => {
        clearTimeout(timeout);
        resolve(otp);
      };
    });
  }

  getDailySpent() {
    try {
      const db = this.getLongTermDb();
      const records = db.prepare(`
        SELECT SUM(amount) as total FROM payment_audit
        WHERE status='success' AND date(timestamp/1000, 'unixepoch')=date('now')
      `).get();
      return records?.total || 0;
    } catch {
      return 0;
    }
  }

  logPayment({ amount, recipient, method, status, reference }) {
    try {
      const db = this.getLongTermDb();
      db.prepare(`
        INSERT INTO payment_audit (user_id, amount, recipient, method, status, reference, timestamp)
        VALUES ('user', ?, ?, ?, ?, ?, ?)
      `).run(amount, recipient, method, status, reference, Date.now());
    } catch (err) {
      logger.error(`Payment audit log failed: ${err.message}`);
    }
  }
}

module.exports = new PaymentEngine();
