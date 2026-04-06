import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { confirmPayment } from '../services/jarvisApi';

interface Props {
  visible: boolean;
  payment: {
    amount: number;
    recipient: string;
    method: string;
    reason: string;
  };
  onDone: () => void;
}

export function PaymentConfirmModal({ visible, payment, onDone }: Props) {
  async function handle(approved: boolean) {
    await confirmPayment(approved);
    onDone();
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Payment Request</Text>
          <Text style={styles.amount}>₹{payment?.amount}</Text>
          <Text style={styles.detail}>To: {payment?.recipient}</Text>
          <Text style={styles.detail}>Via: {payment?.method?.toUpperCase()}</Text>
          {payment?.reason ? <Text style={styles.reason}>{payment.reason}</Text> : null}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.approveBtn} onPress={() => handle(true)}>
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} onPress={() => handle(false)}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#1a1a2e', borderRadius: 16, padding: 24, width: '85%', alignItems: 'center' },
  title: { color: '#00d4ff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  amount: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginBottom: 8 },
  detail: { color: '#ccc', fontSize: 16, marginBottom: 4 },
  reason: { color: '#888', fontSize: 14, marginTop: 8, marginBottom: 16 },
  buttons: { flexDirection: 'row', marginTop: 20, gap: 12 },
  approveBtn: { backgroundColor: '#00c853', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  rejectBtn: { backgroundColor: '#ff1744', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
