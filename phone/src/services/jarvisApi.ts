import axios from 'axios';

let serverUrl = 'http://localhost:3000';

export function setServerUrl(url: string): void {
  serverUrl = url;
}

export function getServerUrl(): string {
  return serverUrl;
}

export async function sendMessage(input: string): Promise<string> {
  const res = await axios.post(`${serverUrl}/think`, {
    input,
    source: 'phone',
    userId: 'user'
  }, { timeout: 30000 });
  return res.data.response;
}

export async function confirmPayment(approved: boolean): Promise<void> {
  await axios.post(`${serverUrl}/payments/confirm`, { approved });
}

export async function sendOTP(otp: string): Promise<void> {
  await axios.post(`${serverUrl}/otp/receive`, { otp });
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await axios.get(`${serverUrl}/health`, { timeout: 5000 });
    return res.data.status === 'online';
  } catch {
    return false;
  }
}
