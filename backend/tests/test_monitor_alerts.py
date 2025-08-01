import json
import time
import tempfile
import shutil
from pathlib import Path
from unittest import mock
import pytest

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))
import monitor_alerts

@pytest.fixture
def tmp_dir(tmp_path):
    orig_base = monitor_alerts.BASE_DIR
    orig_sw_file = monitor_alerts.SOFTWARE_FILE
    orig_hw_file = monitor_alerts.HARDWARE_FILE
    orig_sw_hist = monitor_alerts.SOFTWARE_ALERT_HISTORY
    orig_hw_hist = monitor_alerts.HARDWARE_ALERT_HISTORY

    monitor_alerts.BASE_DIR = tmp_path
    monitor_alerts.SOFTWARE_FILE = tmp_path / "predicted_software_status.json"
    monitor_alerts.HARDWARE_FILE = tmp_path / "prediction_hardware_status.json"
    monitor_alerts.SOFTWARE_ALERT_HISTORY = tmp_path / "software_alerts_history.json"
    monitor_alerts.HARDWARE_ALERT_HISTORY = tmp_path / "hardware_alerts_history.json"

    yield tmp_path

    monitor_alerts.BASE_DIR = orig_base
    monitor_alerts.SOFTWARE_FILE = orig_sw_file
    monitor_alerts.HARDWARE_FILE = orig_hw_file
    monitor_alerts.SOFTWARE_ALERT_HISTORY = orig_sw_hist
    monitor_alerts.HARDWARE_ALERT_HISTORY = orig_hw_hist

def test_load_json_missing(tmp_dir):
    assert monitor_alerts.load_json(tmp_dir / "does_not_exist.json") == {}

def test_load_json_corrupt(tmp_dir):
    corrupt = tmp_dir / "corrupt.json"
    corrupt.write_text("{not json")
    assert monitor_alerts.load_json(corrupt) == {}

def test_load_json_valid(tmp_dir):
    f = tmp_dir / "test.json"
    d = {"a": 1}
    f.write_text(json.dumps(d))
    assert monitor_alerts.load_json(f) == d

def test_save_json_and_load(tmp_dir):
    d = {"x": [1,2,3]}
    f = tmp_dir / "file.json"
    monitor_alerts.save_json(d, f)
    assert json.loads(f.read_text()) == d

def test_detect_software_alerts_majority_critical():
    # 3 out of 4 models = "Critical"
    data = {
        "Bank1": {
            "AppA": {
                "Core": {
                    "Random Forest": "Critical",
                    "Decision Tree": "Critical",
                    "XGBoost": "Critical",
                    "Logistic Regression": "Warning"
                }
            }
        }
    }
    alerts = monitor_alerts.detect_software_alerts(data)
    assert "Bank1" in alerts
    alert = alerts["Bank1"][0]
    assert alert["software"] == "AppA"
    assert alert["status"] == "Critical"
    assert alert["system"] == "Core"
    assert "timestamp" in alert

def test_detect_software_alerts_majority_warning():
    # 3 out of 4 models = "Warning"
    data = {
        "Bank1": {
            "AppA": {
                "Core": {
                    "Random Forest": "Warning",
                    "Decision Tree": "Warning",
                    "XGBoost": "Warning",
                    "Logistic Regression": "Critical"
                }
            }
        }
    }
    alerts = monitor_alerts.detect_software_alerts(data)
    # Majority is "Warning"
    assert "Bank1" in alerts
    alert = alerts["Bank1"][0]
    assert alert["status"] == "Warning"

def test_detect_software_alerts_less_than_three_alerts():
    # Only two models give "Critical" or "Warning", should not trigger
    data = {
        "Bank1": {
            "AppA": {
                "Core": {
                    "Random Forest": "Critical",
                    "Decision Tree": "Critical",
                    "XGBoost": "Operational",
                    "Logistic Regression": "Operational"
                }
            }
        }
    }
    alerts = monitor_alerts.detect_software_alerts(data)
    assert alerts == {}

def test_detect_software_alerts_ignores_non_dict():
    # Should skip non-dict preds
    data = {"Bank": {"App": {"Sys": "notadict"}}}
    alerts = monitor_alerts.detect_software_alerts(data)
    assert alerts == {}

def test_detect_hardware_alerts_majority_critical():
    data = {
        "Bank1": {
            "ATM1": {
                "Random Forest": "Critical",
                "SVM": "Critical",
                "ANN": "Critical"
            }
        }
    }
    alerts = monitor_alerts.detect_hardware_alerts(data)
    assert "Bank1" in alerts
    alert = alerts["Bank1"][0]
    assert alert["atm"] == "ATM1"
    assert alert["status"] == "Critical"
    assert "timestamp" in alert

def test_detect_hardware_alerts_majority_warning():
    data = {
        "Bank1": {
            "ATM1": {
                "Random Forest": "Warning",
                "SVM": "Warning",
                "ANN": "Critical"
            }
        }
    }
    alerts = monitor_alerts.detect_hardware_alerts(data)
    assert "Bank1" in alerts
    alert = alerts["Bank1"][0]
    assert alert["status"] == "Warning"

def test_detect_hardware_alerts_fewer_than_three_alerts():
    # Only two alert models, should not trigger
    data = {
        "Bank1": {
            "ATM1": {
                "Random Forest": "Warning",
                "SVM": "Critical",
                "ANN": "Operational"
            }
        }
    }
    alerts = monitor_alerts.detect_hardware_alerts(data)
    assert alerts == {}

def test_detect_hardware_alerts_ignores_non_dict():
    data = {"Bank1": {"ATM1": "notadict"}}
    alerts = monitor_alerts.detect_hardware_alerts(data)
    assert alerts == {}

def test_append_alerts_new(tmp_dir):
    hist = {}
    new = {"BankA": [{"a": 1}, {"a": 2}]}
    changed = monitor_alerts.append_alerts(hist, new)
    assert changed
    assert hist == new

def test_append_alerts_existing(tmp_dir):
    hist = {"BankA": [{"a": 1}]}
    new = {"BankA": [{"a": 1}, {"a": 2}]}
    changed = monitor_alerts.append_alerts(hist, new)
    assert changed
    assert hist == {"BankA": [{"a": 1}, {"a": 2}]}

def test_append_alerts_no_update(tmp_dir):
    hist = {"BankA": [{"a": 1}]}
    new = {"BankA": [{"a": 1}]}
    changed = monitor_alerts.append_alerts(hist, new)
    assert not changed

def test_monitor_loop_missing_files(tmp_dir, monkeypatch):
    # Should print error and sleep
    # Patch time.sleep to raise StopIteration after first call
    monkeypatch.setattr(monitor_alerts.time, "sleep", lambda s: (_ for _ in ()).throw(StopIteration))
    # Patch print to capture output
    output = []
    monkeypatch.setattr("builtins.print", lambda *a, **k: output.append(" ".join(map(str, a))))
    with pytest.raises(StopIteration):
        monitor_alerts.monitor_loop()
    assert any("Missing prediction files" in line for line in output)

def test_monitor_loop_alerts(tmp_dir, monkeypatch):
    # Set up files with content, patch time.sleep to stop after one loop, patch print to track
    sw_data = {
        "Bank": {
            "App": {
                "Sys": {
                    "Random Forest": "Critical",
                    "Decision Tree": "Critical",
                    "XGBoost": "Critical",
                    "Logistic Regression": "Warning"
                }
            }
        }
    }
    hw_data = {
        "Bank": {
            "ATM": {
                "Random Forest": "Critical",
                "SVM": "Critical",
                "ANN": "Critical"
            }
        }
    }
    monitor_alerts.save_json(sw_data, monitor_alerts.SOFTWARE_FILE)
    monitor_alerts.save_json(hw_data, monitor_alerts.HARDWARE_FILE)
    monitor_alerts.save_json({}, monitor_alerts.SOFTWARE_ALERT_HISTORY)
    monitor_alerts.save_json({}, monitor_alerts.HARDWARE_ALERT_HISTORY)
    monkeypatch.setattr(monitor_alerts.time, "sleep", lambda s: (_ for _ in ()).throw(StopIteration))
    output = []
    monkeypatch.setattr("builtins.print", lambda *a, **k: output.append(" ".join(map(str, a))))
    with pytest.raises(StopIteration):
        monitor_alerts.monitor_loop()
    assert any("New software alerts saved" in l or "New hardware alerts saved" in l for l in output)

def test_monitor_loop_handles_exception(tmp_dir, monkeypatch):
    # Corrupt file should trigger exception handler
    monitor_alerts.SOFTWARE_FILE.write_text("{bad json")
    monitor_alerts.HARDWARE_FILE.write_text("{bad json")
    monkeypatch.setattr(monitor_alerts.time, "sleep", lambda s: (_ for _ in ()).throw(StopIteration))
    output = []
    monkeypatch.setattr("builtins.print", lambda *a, **k: output.append(" ".join(map(str, a))))
    with pytest.raises(StopIteration):
        monitor_alerts.monitor_loop()
    assert any("[ERROR]" in l for l in output)