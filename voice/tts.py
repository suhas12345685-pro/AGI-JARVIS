import subprocess
import tempfile
import os
import platform

PIPER_MODEL = os.path.join(os.path.dirname(__file__), 'models', 'en_GB-alan-medium.onnx')


def speak(text):
    """Converts text to speech using Piper (local, no API key needed)."""
    if not text:
        return

    # Check if piper is available
    try:
        subprocess.run(['piper', '--version'], capture_output=True, check=True)
    except (FileNotFoundError, subprocess.CalledProcessError):
        print(f"[TTS] {text}")
        return

    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
        tmp_path = f.name

    try:
        subprocess.run([
            'piper',
            '--model', PIPER_MODEL,
            '--output_file', tmp_path
        ], input=text.encode(), check=True)

        system = platform.system()
        if system == 'Linux':
            subprocess.run(['aplay', tmp_path], check=True)
        elif system == 'Darwin':
            subprocess.run(['afplay', tmp_path], check=True)
        elif system == 'Windows':
            subprocess.run(['powershell', '-c',
                          f'(New-Object Media.SoundPlayer "{tmp_path}").PlaySync()'],
                          check=True)
    except Exception as e:
        print(f"[TTS Error] {e}")
        print(f"[TTS Fallback] {text}")
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def speak_elevenlabs(text):
    """Premium TTS via ElevenLabs API (requires API key)."""
    import requests

    api_key = os.environ.get('ELEVENLABS_API_KEY')
    if not api_key:
        print("[ElevenLabs] No API key set. Falling back to local TTS.")
        speak(text)
        return

    voice_id = 'pNInz6obpgDQGcFmaJgB'  # Adam voice
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {'xi-api-key': api_key, 'Content-Type': 'application/json'}
    res = requests.post(url, headers=headers, json={
        'text': text,
        'model_id': 'eleven_monolingual_v1',
        'voice_settings': {'stability': 0.7, 'similarity_boost': 0.8}
    })

    if res.status_code == 200:
        tmp_path = '/tmp/jarvis_response.mp3'
        with open(tmp_path, 'wb') as f:
            f.write(res.content)
        try:
            subprocess.run(['mpg123', tmp_path], check=True)
        except FileNotFoundError:
            subprocess.run(['ffplay', '-nodisp', '-autoexit', tmp_path], check=True)
    else:
        print(f"[ElevenLabs Error] {res.status_code}: {res.text}")
        speak(text)
