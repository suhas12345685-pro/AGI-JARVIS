#!/usr/bin/env python3
"""
JARVIS Laptop Control Agent
Runs on the user's machine, accepts commands from the brain.
"""
import subprocess
import os
import platform

from flask import Flask, request, jsonify

try:
    import pyautogui
    PYAUTOGUI_AVAILABLE = True
except (ImportError, KeyError):
    PYAUTOGUI_AVAILABLE = False
    print("Warning: pyautogui not available (no display?). GUI actions disabled.")

try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False

app = Flask(__name__)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'online', 'platform': platform.system()})


@app.route('/action', methods=['POST'])
def handle_action():
    data = request.json
    action = data.get('action')
    params = data.get('params', {})

    handlers = {
        'open_app':       lambda: open_app(params.get('app', '')),
        'open_url':       lambda: open_url(params.get('url', '')),
        'type_text':      lambda: type_text(params.get('text', '')),
        'press_key':      lambda: press_key(params.get('key', '')),
        'screenshot':     lambda: take_screenshot(),
        'run_command':    lambda: run_command(params.get('cmd', '')),
        'set_dnd':        lambda: set_dnd(params.get('value', True)),
        'set_volume':     lambda: set_volume(params.get('level', 50)),
        'list_processes': lambda: get_processes(),
    }

    handler = handlers.get(action)
    if not handler:
        return jsonify({'error': f'Unknown action: {action}'}), 400

    try:
        result = handler()
        return jsonify({'status': 'done', 'result': result or ''})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def open_app(app_name):
    system = platform.system()
    if system == 'Darwin':
        subprocess.Popen(['open', '-a', app_name])
    elif system == 'Windows':
        subprocess.Popen(['start', app_name], shell=True)
    else:
        subprocess.Popen([app_name])
    return f'Opened {app_name}'


def open_url(url):
    system = platform.system()
    if system == 'Darwin':
        subprocess.Popen(['open', url])
    elif system == 'Windows':
        subprocess.Popen(['start', url], shell=True)
    else:
        subprocess.Popen(['xdg-open', url])
    return f'Opened {url}'


def type_text(text):
    if not PYAUTOGUI_AVAILABLE:
        return 'pyautogui not available'
    pyautogui.write(text, interval=0.05)
    return f'Typed: {text[:50]}'


def press_key(key):
    if not PYAUTOGUI_AVAILABLE:
        return 'pyautogui not available'
    pyautogui.press(key)
    return f'Pressed: {key}'


def take_screenshot():
    if not PYAUTOGUI_AVAILABLE:
        return 'pyautogui not available'
    path = '/tmp/jarvis_screenshot.png'
    img = pyautogui.screenshot()
    img.save(path)
    return path


def run_command(cmd):
    # Safety: block destructive commands
    blocked = ['rm -rf /', 'mkfs', 'format c:', ':(){']
    for pattern in blocked:
        if pattern in cmd:
            return f'Blocked dangerous command: {cmd}'

    result = subprocess.run(cmd, shell=True, capture_output=True, timeout=30, text=True)
    return (result.stdout + result.stderr).strip()


def set_dnd(enable):
    system = platform.system()
    status = 'ON' if enable else 'OFF'
    if system == 'Linux':
        subprocess.run(['notify-send', '--app-name=JARVIS',
                       f'Do Not Disturb {status}'])
    return f'DND {status}'


def set_volume(level):
    system = platform.system()
    if system == 'Linux':
        subprocess.run(['amixer', 'sset', 'Master', f'{level}%'],
                      capture_output=True)
    elif system == 'Darwin':
        subprocess.run(['osascript', '-e', f'set volume output volume {level}'],
                      capture_output=True)
    return f'Volume set to {level}%'


def get_processes():
    if not PSUTIL_AVAILABLE:
        return 'psutil not available'
    return [p.name() for p in psutil.process_iter(['name'])][:20]


if __name__ == '__main__':
    print("JARVIS Laptop Control Agent starting on port 8080...")
    app.run(host='0.0.0.0', port=8080)
