import { Platform, PermissionsAndroid, NativeModules } from 'react-native';
import { sendOTP } from './jarvisApi';

export async function setupOTPReader(): Promise<void> {
  if (Platform.OS !== 'android') {
    console.log('OTP reading not available on iOS');
    return;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_SMS,
    {
      title: 'JARVIS SMS Permission',
      message: 'JARVIS needs SMS access to handle payment OTPs automatically.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    }
  );

  if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;

  const SmsRetriever = NativeModules.RNSmsRetriever;
  if (!SmsRetriever) {
    console.log('SmsRetriever native module not available');
    return;
  }

  SmsRetriever.startSmsRetriever((message: string) => {
    const match = message.match(/\b\d{6}\b/);
    if (match) {
      console.log('OTP intercepted, forwarding to JARVIS brain...');
      sendOTP(match[0]);
    }
  });
}
