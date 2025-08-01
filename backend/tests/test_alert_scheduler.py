import os
import io
import json
import shutil
import tempfile
import pytest
from pathlib import Path
from datetime import datetime, timedelta

import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import alert_scheduler

from unittest import mock

@pytest.fixture
def sample_dir(tmp_path):
    # Setup temporary directory for JSON/history/report
    orig_base = alert_scheduler.BASE_DIR
    orig_software = alert_scheduler.SOFTWARE_ALERT_HISTORY
    orig_hardware = alert_scheduler.HARDWARE_ALERT_HISTORY
    orig_reports = alert_scheduler.REPORTS_DIR

    # Patch module-level paths
    alert_scheduler.BASE_DIR = tmp_path
    alert_scheduler.SOFTWARE_ALERT_HISTORY = tmp_path / "software_alerts_history.json"
    alert_scheduler.HARDWARE_ALERT_HISTORY = tmp_path / "hardware_alerts_history.json"
    alert_scheduler.REPORTS_DIR = tmp_path / "reports"
    alert_scheduler.REPORTS_DIR.mkdir(exist_ok=True)

    yield tmp_path

    # Restore
    alert_scheduler.BASE_DIR = orig_base
    alert_scheduler.SOFTWARE_ALERT_HISTORY = orig_software
    alert_scheduler.HARDWARE_ALERT_HISTORY = orig_hardware
    alert_scheduler.REPORTS_DIR = orig_reports

@pytest.fixture
def sample_json_files(sample_dir):
    sw_alerts = {
        "MyBank": [
            {"system": "Core", "software": "App1", "status": "Critical", "timestamp": "2025-08-01 08:00:00"},
            {"system": "Web", "software": "App2", "status": "Warning", "timestamp": "2025-08-01 08:10:00"}
        ]
    }
    hw_alerts = {
        "MyBank": [
            {"atm": "ATM-001", "status": "Critical", "timestamp": "2025-08-01 08:05:00"},
            {"atm": "ATM-002", "status": "Warning", "timestamp": "2025-08-01 08:15:00"}
        ]
    }
    with open(alert_scheduler.SOFTWARE_ALERT_HISTORY, "w", encoding="utf-8") as f:
        json.dump(sw_alerts, f)
    with open(alert_scheduler.HARDWARE_ALERT_HISTORY, "w", encoding="utf-8") as f:
        json.dump(hw_alerts, f)
    return sw_alerts, hw_alerts

def test_load_json_empty(sample_dir):
    # File does not exist → should return {}
    empty = alert_scheduler.load_json(sample_dir / "not_exist.json")
    assert empty == {}
    # File exists but empty → should return {}
    empty_file = sample_dir / "empty.json"
    empty_file.write_text("")
    assert alert_scheduler.load_json(empty_file) == {}

def test_load_json_corrupt(sample_dir):
    # Corrupt JSON returns {}
    file = sample_dir / "bad.json"
    file.write_text("{bad json")
    assert alert_scheduler.load_json(file) == {}

def test_get_new_alerts_for_bank(sample_json_files):
    # Only alerts since last_check_time included
    sw_alerts, hw_alerts = sample_json_files
    last = datetime.strptime("2025-08-01 08:08:00", "%Y-%m-%d %H:%M:%S")
    alerts = alert_scheduler.get_new_alerts_for_bank("MyBank", last)
    # Should skip first software and hardware (before cutoff)
    assert len(alerts["software"]) == 1
    assert alerts["software"][0]["software"] == "App2"
    assert len(alerts["hardware"]) == 1
    assert alerts["hardware"][0]["atm"] == "ATM-002"

def test_get_new_alerts_for_bank_all(sample_json_files):
    # Should get all if last_check_time is old
    alerts = alert_scheduler.get_new_alerts_for_bank("MyBank", datetime(2025, 7, 1))
    assert len(alerts["software"]) == 2
    assert len(alerts["hardware"]) == 2

def test_get_new_alerts_for_bank_none(sample_json_files):
    # Unknown bank returns empty
    alerts = alert_scheduler.get_new_alerts_for_bank("Unknown", datetime(2025, 7, 1))
    assert alerts["software"] == []
    assert alerts["hardware"] == []

def test_get_new_alerts_for_bank_malformed(sample_dir):
    # Malformed alert entries are skipped
    bank = "MalformedBank"
    malformed_sw = {"MalformedBank": [{"bad": "data"}]}
    malformed_hw = {"MalformedBank": [{"atm": "ATM-X", "timestamp": "not-a-date"}]}
    with open(alert_scheduler.SOFTWARE_ALERT_HISTORY, "w", encoding="utf-8") as f:
        json.dump(malformed_sw, f)
    with open(alert_scheduler.HARDWARE_ALERT_HISTORY, "w", encoding="utf-8") as f:
        json.dump(malformed_hw, f)
    alerts = alert_scheduler.get_new_alerts_for_bank(bank, datetime(2025, 7, 1))
    assert alerts["software"] == []
    assert alerts["hardware"] == []

def test_create_pdf_report_creates_file(sample_json_files, sample_dir):
    alerts = alert_scheduler.get_new_alerts_for_bank("MyBank", datetime(2025, 7, 1))
    bank_name = "MyBank"
    pdf_path = alert_scheduler.create_pdf_report(bank_name, alerts)
    assert pdf_path.exists()
    assert pdf_path.suffix == ".pdf"
    # Check PDF is not empty
    assert pdf_path.stat().st_size > 0

def test_create_pdf_report_empty_alerts(sample_dir):
    # No alerts → PDF with "No new alerts to report."
    alerts = {"software": [], "hardware": []}
    pdf_path = alert_scheduler.create_pdf_report("NoBank", alerts)
    assert pdf_path.exists()
    content = pdf_path.read_bytes()
    assert len(content) > 0

@mock.patch("alert_scheduler.smtplib.SMTP_SSL")
def test_send_consolidated_mail(mock_smtp, sample_json_files, sample_dir):
    # Patch PDF generation (use real), patch email sending
    alerts = alert_scheduler.get_new_alerts_for_bank("MyBank", datetime(2025, 7, 1))
    user_email = "fakeuser@example.com"
    bank_name = "MyBank"
    # Simulate sending mail (no actual mail sent)
    alert_scheduler.send_consolidated_mail(user_email, bank_name, alerts)
    # Should create and then remove the PDF (report file should not exist)
    pdfs = list((sample_dir / "reports").glob("Report_*.pdf"))
    assert len(pdfs) == 0
    # Check SMTP_SSL called
    mock_smtp.assert_called()

def test_send_consolidated_mail_handles_exception(sample_json_files, sample_dir, monkeypatch):
    alerts = alert_scheduler.get_new_alerts_for_bank("MyBank", datetime(2025, 7, 1))
    user_email = "fail@example.com"
    bank_name = "MyBank"
    # Simulate SMTP failure
    class FakeSMTP:
        def __enter__(self): return self
        def __exit__(self, exc_type, exc_val, exc_tb): pass
        def login(self, user, pw): raise Exception("fail login")
        def send_message(self, msg): pass
    monkeypatch.setattr(alert_scheduler.smtplib, "SMTP_SSL", lambda *a, **k: FakeSMTP())
    # Should not raise, should cleanup the file
    alert_scheduler.send_consolidated_mail(user_email, bank_name, alerts)
    pdfs = list((sample_dir / "reports").glob("Report_*.pdf"))
    assert len(pdfs) == 0

def test_notification_dispatcher_logic(monkeypatch, sample_json_files, sample_dir):
    # Test core loop for due user & correct mail logic
    # Patch MongoDB collection
    fake_users = [
        {
            "_id": 1,
            "email": "user1@x.com",
            "bank": "MyBank",
            "timer": 1,
            "last_notified_at": datetime.now() - timedelta(minutes=10)
        },
        {   # Should skip - no email
            "_id": 2,
            "bank": "MyBank",
            "timer": 1,
            "last_notified_at": datetime.now() - timedelta(minutes=10)
        },
        {   # Should skip - nonint timer
            "_id": 3,
            "email": "user3@x.com",
            "bank": "MyBank",
            "timer": "bad",
            "last_notified_at": datetime.now() - timedelta(minutes=10)
        },
        {   # Should skip - no new alerts
            "_id": 4,
            "email": "user4@x.com",
            "bank": "Unknown",
            "timer": 1,
            "last_notified_at": datetime.now() - timedelta(minutes=10)
        }
    ]
    sent_emails = []
    updates = []

    class FakeUsersColl:
        def find(self):
            return fake_users
        def update_one(self, qry, update):
            updates.append((qry, update))

    # Patch users_collection, send_consolidated_mail, and time.sleep
    monkeypatch.setattr(alert_scheduler, "users_collection", FakeUsersColl())
    monkeypatch.setattr(alert_scheduler, "send_consolidated_mail", lambda e, b, a: sent_emails.append((e, b, a)))
    monkeypatch.setattr(alert_scheduler.time, "sleep", lambda s: (_ for _ in ()).throw(StopIteration))

    # End after first sleep
    with pytest.raises(StopIteration):
        alert_scheduler.notification_dispatcher()

    # Only user1 should be emailed, and update_one called
    assert len(sent_emails) == 1
    assert sent_emails[0][0] == "user1@x.com"
    assert updates and updates[0][0]["_id"] == 1

def test_notification_dispatcher_skips_on_connection_error(monkeypatch):
    # Simulate MongoDB connection error
    monkeypatch.setattr(alert_scheduler, "users_collection", None)
    monkeypatch.setattr(alert_scheduler.time, "sleep", lambda s: (_ for _ in ()).throw(StopIteration))
    # Patch functions to skip actual work
    monkeypatch.setattr(alert_scheduler, "get_new_alerts_for_bank", lambda bank, last: {"software": [], "hardware": []})
    with pytest.raises(StopIteration):
        alert_scheduler.notification_dispatcher()

def test_notification_dispatcher_handles_bad_last_notified(monkeypatch, sample_json_files, sample_dir):
    # last_notified_at is not a datetime, should default to now-local - 1 day
    fake_users = [{
        "_id": 123,
        "email": "badtime@x.com",
        "bank": "MyBank",
        "timer": 1,
        "last_notified_at": "not-a-datetime"
    }]
    sent = []
    updated = []
    class FakeUsersColl:
        def find(self): return fake_users
        def update_one(self, qry, update): updated.append(qry)
    monkeypatch.setattr(alert_scheduler, "users_collection", FakeUsersColl())
    monkeypatch.setattr(alert_scheduler, "send_consolidated_mail", lambda e, b, a: sent.append(e))
    monkeypatch.setattr(alert_scheduler.time, "sleep", lambda s: (_ for _ in ()).throw(StopIteration))
    with pytest.raises(StopIteration):
        alert_scheduler.notification_dispatcher()
    assert sent and updated

def test_notification_dispatcher_handles_timer_cast_exception(monkeypatch, sample_json_files, sample_dir):
    # timer is a string that can't be cast, should print a message and skip
    fake_users = [{
        "_id": 124,
        "email": "timerfail@x.com",
        "bank": "MyBank",
        "timer": "fail",
        "last_notified_at": datetime.now() - timedelta(minutes=10)
    }]
    called = []
    class FakeUsersColl:
        def find(self): return fake_users
        def update_one(self, qry, update): called.append(qry)
    monkeypatch.setattr(alert_scheduler, "users_collection", FakeUsersColl())
    monkeypatch.setattr(alert_scheduler, "send_consolidated_mail", lambda e, b, a: called.append(e))
    monkeypatch.setattr(alert_scheduler.time, "sleep", lambda s: (_ for _ in ()).throw(StopIteration))
    with pytest.raises(StopIteration):
        alert_scheduler.notification_dispatcher()
    # No mail should be sent or update called
    assert not called