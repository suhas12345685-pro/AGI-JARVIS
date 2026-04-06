import os
import struct
import numpy as np

try:
    import pvporcupine
    PORCUPINE_AVAILABLE = True
except ImportError:
    PORCUPINE_AVAILABLE = False
    print("Warning: pvporcupine not installed. Wake word detection disabled.")

try:
    import sounddevice as sd
    AUDIO_AVAILABLE = True
except (ImportError, OSError):
    AUDIO_AVAILABLE = False
    print("Warning: sounddevice not available. Audio input disabled.")


def create_detector():
    if not PORCUPINE_AVAILABLE:
        return None
    access_key = os.environ.get('PORCUPINE_ACCESS_KEY', '')
    if not access_key:
        print("Warning: PORCUPINE_ACCESS_KEY not set. Wake word detection disabled.")
        return None
    return pvporcupine.create(
        access_key=access_key,
        keywords=['jarvis']
    )


def listen_for_wake_word(detector, callback):
    """Continuously listens for 'Hey JARVIS' wake word."""
    if not detector or not AUDIO_AVAILABLE:
        print("Wake word detection not available. Falling back to keyboard input.")
        while True:
            input("Press Enter to simulate wake word...")
            callback()
        return

    with sd.InputStream(
        samplerate=detector.sample_rate,
        channels=1,
        dtype='int16',
        blocksize=detector.frame_length
    ) as stream:
        print("JARVIS is listening for wake word...")
        while True:
            frame, _ = stream.read(detector.frame_length)
            keyword_index = detector.process(frame.flatten())
            if keyword_index >= 0:
                print("Wake word detected!")
                callback()
