import json
import os
from pathlib import Path
import subprocess
import sys

def test_training_runs_and_saves_artifacts():
    root = Path(__file__).resolve().parents[2]
    env = os.environ.copy()
    cmd = [sys.executable, str(root / 'ml' / 'train.py')]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    assert proc.returncode == 0
    artifacts = root / 'artifacts'
    assert (artifacts / 'model.pkl').exists()
    assert (artifacts / 'metrics.json').exists()
    metrics = json.loads(proc.stdout.strip())
    assert 0 <= metrics['accuracy'] <= 1
    assert 0 <= metrics['roc_auc'] <= 1