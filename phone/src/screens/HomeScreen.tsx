import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { sendMessage } from '../services/jarvisApi';

interface Message {
  id: string;
  role: 'user' | 'jarvis';
  text: string;
}

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessage(input);
      const jarvisMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'jarvis',
        text: response
      };
      setMessages(prev => [...prev, jarvisMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'jarvis',
        text: 'I appear to be offline, sir. Check your connection.'
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>J.A.R.V.I.S.</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={m => m.id}
        style={styles.messageList}
        renderItem={({ item }) => (
          <View style={[styles.bubble,
            item.role === 'user' ? styles.userBubble : styles.jarvisBubble]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Speak to JARVIS..."
          placeholderTextColor="#666"
          onSubmitEditing={send}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send} disabled={loading}>
          <Text style={styles.sendText}>{loading ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { padding: 16, paddingTop: 50, backgroundColor: '#111', alignItems: 'center' },
  headerText: { color: '#00d4ff', fontSize: 20, fontWeight: 'bold', letterSpacing: 3 },
  messageList: { flex: 1, padding: 16 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 8 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#1a3a5c' },
  jarvisBubble: { alignSelf: 'flex-start', backgroundColor: '#1a1a2e' },
  bubbleText: { color: '#e0e0e0', fontSize: 15 },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#111', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#1a1a1a', color: '#fff', padding: 12, borderRadius: 24, fontSize: 15, marginRight: 8 },
  sendBtn: { backgroundColor: '#00d4ff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  sendText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});
