#!/usr/bin/env python3
"""
JARVIS Voice Pipeline — Full interceptor loop.
Wake word → Record → STT → Brain → TTS → Repeat
"""
import os
import sys
import requests
from dotenv import load_dotenv

# Add voice directory to path
sys.path.insert(0, os.path.dirname(__file__))

from wakeword import create_detector, listen_for_wake_word
from stt import record_until_silence, transcribe
from tts import speak

load_dotenv()
BRAIN_URL = f"http://localhost:{os.environ.get('JARVIS_PORT', 3000)}"


def on_wake_word():
    """Called when 'Hey JARVIS' is detected."""
    speak("Yes, sir?")

    # Record user's command
    audio = record_until_silence()

    if audio is None:
        # Audio not available, get text input
        text = input("You: ").strip()
    else:
        text = transcribe(audio)

    if not text or len(text.strip()) < 2:
        speak("I didn't catch that, sir.")
        return

    print(f"Heard: {text}")

    # Send to brain
    try:
        res = requests.post(f"{BRAIN_URL}/think", json={
            'input': text,
            'source': 'voice',
            'userId': 'user'
        }, timeout=30)
        response_text = res.json().get('response', "I'm sorry, I couldn't process that.")
    except Exception as e:
        response_text = f"I encountered an error, sir: {str(e)}"

    print(f"JARVIS: {response_text}")
    speak(response_text)


def main():
    print("=" * 50)
    print("  J.A.R.V.I.S. Voice Pipeline Starting...")
    print("=" * 50)

    detector = create_detector()
    listen_for_wake_word(detector, on_wake_word)


if __name__ == '__main__':
    main()
