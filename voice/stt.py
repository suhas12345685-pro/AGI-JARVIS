import numpy as np
import whisper
import webrtcvad

try:
    import sounddevice as sd
    AUDIO_AVAILABLE = True
except (ImportError, OSError):
    AUDIO_AVAILABLE = False

model = None


def load_model(size='base'):
    global model
    if model is None:
        print(f"Loading Whisper model ({size})...")
        model = whisper.load_model(size)
        print("Whisper model loaded.")
    return model


def record_until_silence(samplerate=16000, silence_timeout=1.5):
    """Records audio until silence is detected."""
    if not AUDIO_AVAILABLE:
        print("Audio not available. Enter text manually.")
        return None

    vad = webrtcvad.Vad(3)
    frames = []
    silent_frames = 0
    max_silent = int(silence_timeout * samplerate / 320)

    with sd.InputStream(samplerate=samplerate, channels=1, dtype='int16',
                        blocksize=320) as stream:
        print("Recording...")
        while True:
            frame, _ = stream.read(320)
            frames.append(frame.copy())

            is_speech = vad.is_speech(frame.tobytes(), samplerate)
            if not is_speech:
                silent_frames += 1
                if silent_frames > max_silent:
                    break
            else:
                silent_frames = 0

    audio = np.concatenate(frames).astype(np.float32) / 32768.0
    print(f"Recorded {len(audio) / samplerate:.1f}s of audio")
    return audio


def transcribe(audio):
    if audio is None:
        return ''
    m = load_model()
    result = m.transcribe(audio, language='en')
    return result['text'].strip()
