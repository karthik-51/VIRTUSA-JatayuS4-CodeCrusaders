import sys
import os
import json
import pytest
from flask_jwt_extended import create_access_token

# Ensure app.py is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app as flask_app

@pytest.fixture
def client():
    flask_app.config["TESTING"] = True
    flask_app.config["JWT_SECRET_KEY"] = "test-secret"
    with flask_app.app_context():
        with flask_app.test_client() as client:
            yield client

@pytest.fixture
def token():
    with flask_app.app_context():
        return create_access_token(identity="test@example.com")

def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}

# --------- AUTH TESTS ----------

def test_signup_success(mocker, client):
    mocker.patch("app.users_collection.find_one", return_value=None)
    mocker.patch("app.users_collection.insert_one", return_value=None)
    payload = {
        "email": "user1@example.com",
        "password": "Password1!",
        "name": "Test User",
        "phone_no": "1234567890",
        "bank": "HDFC Bank",
        "designation": "Manager"
    }
    resp = client.post("/api/signup", json=payload)
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["message"] == "Signup successful"
    assert "access_token" in data

def test_signup_missing_fields(client):
    payload = {"email": "", "password": ""}
    resp = client.post("/api/signup", json=payload)
    assert resp.status_code == 400
    assert "error" in resp.get_json()

def test_signup_already_exists(mocker, client):
    mocker.patch("app.users_collection.find_one", return_value={"email": "user1@example.com"})
    payload = {"email": "user1@example.com", "password": "Password1!"}
    resp = client.post("/api/signup", json=payload)
    assert resp.status_code == 400
    assert "User already exists" in resp.get_json()["error"]

def test_signup_internal_error(mocker, client):
    mocker.patch("app.users_collection.find_one", side_effect=Exception("db-error"))
    payload = {
        "email": "err@example.com",
        "password": "Password1!",
        "name": "Test User",
        "phone_no": "1234567890",
        "bank": "HDFC Bank",
        "designation": "Manager"
    }
    resp = client.post("/api/signup", json=payload)
    assert resp.status_code == 500
    assert "error" in resp.get_json()

def test_login_success(mocker, client):
    import bcrypt
    hashed = bcrypt.hashpw("Password1!".encode(), bcrypt.gensalt())
    mocker.patch("app.users_collection.find_one", return_value={"email": "user1@example.com", "password": hashed})
    resp = client.post("/api/login", json={"email": "user1@example.com", "password": "Password1!"})
    assert resp.status_code == 200
    assert "access_token" in resp.get_json()

def test_login_wrong_password(mocker, client):
    mocker.patch("app.users_collection.find_one", return_value=None)
    resp = client.post("/api/login", json={"email": "user1@example.com", "password": "wrong"})
    assert resp.status_code == 401
    assert "error" in resp.get_json()

def test_login_missing_fields(client):
    resp = client.post("/api/login", json={"email": ""})
    assert resp.status_code == 400
    assert "error" in resp.get_json()

def test_login_internal_error(mocker, client):
    mocker.patch("app.users_collection.find_one", side_effect=Exception("db-error"))
    resp = client.post("/api/login", json={"email": "user1@example.com", "password": "Password1!"})
    assert resp.status_code == 500
    assert "error" in resp.get_json()

def test_logout(mocker, client, token):
    mocker.patch("app.get_jwt", return_value={"jti": "testjti"})
    resp = client.post("/api/logout", headers=auth_headers(token))
    assert resp.status_code == 200
    assert "Successfully logged out" in resp.get_json()["message"]

def test_logout_no_token(client):
    resp = client.post("/api/logout")
    assert resp.status_code == 401

def test_change_password_success(mocker, client):
    mocker.patch("app.users_collection.find_one", return_value={"email": "user1@example.com"})
    mocker.patch("app.users_collection.update_one", return_value=None)
    payload = {"emai": "user1@example.com", "new_password": "NewPassword2!"}
    resp = client.post("/api/change_password", json=payload)
    assert resp.status_code == 200
    assert resp.get_json()["message"] == "Password changed successfully"

def test_change_password_missing_fields(client):
    resp = client.post("/api/change_password", json={"emai": "user1@example.com"})
    assert resp.status_code == 400
    assert "error" in resp.get_json()

def test_change_password_no_user(mocker, client):
    mocker.patch("app.users_collection.find_one", return_value=None)
    resp = client.post("/api/change_password", json={"emai": "nouser@example.com", "new_password": "x"})
    assert resp.status_code == 401
    assert "No user found" in resp.get_json()["error"]

def test_change_password_internal_error(mocker, client):
    mocker.patch("app.users_collection.find_one", side_effect=Exception("db-error"))
    payload = {"emai": "user1@example.com", "new_password": "NewPassword2!"}
    resp = client.post("/api/change_password", json=payload)
    assert resp.status_code == 500
    assert "error" in resp.get_json()

# --------- TIMER TESTS ----------

def test_add_timer_success(mocker, client, token):
    mocker.patch("app.users_collection.find_one", return_value={"email": "user1@example.com"})
    mocker.patch("app.users_collection.update_one", return_value=None)
    resp = client.put("/api/timer", headers=auth_headers(token), json={"timer": 60})
    assert resp.status_code == 200
    assert "Successfully  added timer" in resp.get_json()["message"]

def test_add_timer_missing_value(mocker, client, token):
    mocker.patch("app.users_collection.find_one", return_value={"email": "user1@example.com"})
    resp = client.put("/api/timer", headers=auth_headers(token), json={})
    assert resp.status_code == 401
    assert "Timer value is Requierd" in resp.get_json()["error"]

def test_add_timer_no_user(mocker, client, token):
    mocker.patch("app.users_collection.find_one", return_value=None)
    resp = client.put("/api/timer", headers=auth_headers(token), json={"timer": 60})
    assert resp.status_code == 404
    assert "Not found email" in resp.get_json()["error"]

def test_add_timer_no_token(client):
    resp = client.put("/api/timer", json={"timer": 60})
    assert resp.status_code == 401

# --------- BANK INFO TESTS ----------

def test_get_bank_success(mocker, client, token):
    mocker.patch("app.users_collection.find_one", return_value={"email": "user1@example.com", "bank": "HDFC Bank"})
    resp = client.get("/api/get-bank", headers=auth_headers(token))
    assert resp.status_code == 200
    assert resp.get_json()["bank"] == "HDFC Bank"

def test_get_bank_no_user(mocker, client, token):
    mocker.patch("app.users_collection.find_one", return_value=None)
    resp = client.get("/api/get-bank", headers=auth_headers(token))
    assert resp.status_code == 404
    assert "Not found email" in resp.get_json()["error"]

def test_get_bank_no_token(client):
    resp = client.get("/api/get-bank")
    assert resp.status_code == 401

# --------- SOFTWARE METRICS TESTS ----------

def test_get_software_metrics(tmp_path, mocker, client):
    data = {"test": "metrics"}
    path = tmp_path / "software_metrics.json"
    with open(path, "w") as f:
        json.dump(data, f)
    mocker.patch("app.FILE_PATH", str(path))
    resp = client.get("/api/software-metrics")
    assert resp.status_code == 200
    assert resp.get_json() == data

def test_get_software_metrics_exception(mocker, client):
    mocker.patch("builtins.open", side_effect=Exception("fail"))
    resp = client.get("/api/software-metrics")
    assert resp.status_code == 500
    assert "error" in resp.get_json()

# --------- HARDWARE METRICS TESTS ----------

def test_get_hardware_metrics(tmp_path, mocker, client):
    data = {"hardware": "metrics"}
    path = tmp_path / "hardware_metrics.json"
    with open(path, "w") as f:
        json.dump(data, f)
    mocker.patch("app.FILE_PATH_HARDWARE", str(path))
    resp = client.get("/api/hardware-metrics")
    assert resp.status_code == 200
    assert resp.get_json() == data

def test_get_hardware_metrics_exception(mocker, client):
    mocker.patch("builtins.open", side_effect=Exception("fail"))
    resp = client.get("/api/hardware-metrics")
    assert resp.status_code == 500
    assert "error" in resp.get_json()

# --------- SOFTWARE ALERTS TESTS ----------

def test_get_software_alerts_success(tmp_path, mocker, client):
    path = tmp_path / "software_alerts_history.json"
    data = {"alerts": ["ok"]}
    with open(path, "w") as f:
        json.dump(data, f)
    mocker.patch("app.open", lambda *a, **k: open(str(path)))
    resp = client.get("/api/software-alerts")
    assert resp.status_code == 200
    assert resp.get_json() == data

def test_get_software_alerts_not_found(mocker, client):
    mocker.patch("builtins.open", side_effect=FileNotFoundError)
    resp = client.get("/api/software-alerts")
    assert resp.status_code == 404
    assert "software_alerts_history.json not found" in resp.get_json()["error"]

def test_get_software_alerts_exception(mocker, client):
    mocker.patch("builtins.open", side_effect=Exception("whoops"))
    resp = client.get("/api/software-alerts")
    assert resp.status_code == 500
    assert "error" in resp.get_json()

# --------- HARDWARE ALERTS TESTS ----------

def test_get_hardware_alerts_success(tmp_path, mocker, client):
    path = tmp_path / "hardware_alerts_history.json"
    data = {"alerts": ["ok"]}
    with open(path, "w") as f:
        json.dump(data, f)
    mocker.patch("app.open", lambda *a, **k: open(str(path)))
    resp = client.get("/api/hardware-alerts")
    assert resp.status_code == 200
    assert resp.get_json() == data

def test_get_hardware_alerts_not_found(mocker, client):
    mocker.patch("builtins.open", side_effect=FileNotFoundError)
    resp = client.get("/api/hardware-alerts")
    assert resp.status_code == 404
    assert "hardware_alerts_history.json not found" in resp.get_json()["error"]

def test_get_hardware_alerts_exception(mocker, client):
    mocker.patch("builtins.open", side_effect=Exception("whoops"))
    resp = client.get("/api/hardware-alerts")
    assert resp.status_code == 500
    assert "error" in resp.get_json()

# --------- PDF REPORT TESTS ----------

def test_generate_report_pdf_endpoint_success(mocker, client, token):
    user = {"email": "test@example.com", "bank": "HDFC Bank"}
    mocker.patch("app.users_collection.find_one", return_value=user)
    class DummyBuffer:
        def read(self, size=-1): return b"PDF"   # <-- FIXED
        def close(self): pass
        def seek(self, n): pass
    mocker.patch("app.generate_pdf_report", return_value=(DummyBuffer(), None))
    payload = {"fromDate": "2024-01-01", "toDate": "2024-01-31"}
    resp = client.post("/api/generate-report-pdf", headers=auth_headers(token), json=payload)
    assert resp.status_code == 200
    assert resp.mimetype == "application/pdf"

def test_generate_report_pdf_endpoint_no_bank_in_jwt_or_body(mocker, client, token):
    # No bank in user and no bank in payload
    mocker.patch("app.users_collection.find_one", return_value={"email": "nobank@example.com"})
    mocker.patch("app.generate_pdf_report", return_value=(None, "Some error"))
    resp = client.post("/api/generate-report-pdf", headers=auth_headers(token), json={})
    assert resp.status_code == 400 or resp.status_code == 500

def test_generate_report_pdf_endpoint_error(mocker, client, token):
    user = {"email": "test@example.com", "bank": "HDFC Bank"}
    mocker.patch("app.users_collection.find_one", return_value=user)
    mocker.patch("app.generate_pdf_report", side_effect=Exception("pdf-error"))
    payload = {"fromDate": "2024-01-01", "toDate": "2024-01-31"}
    resp = client.post("/api/generate-report-pdf", headers=auth_headers(token), json=payload)
    assert resp.status_code == 500
    assert "error" in resp.get_json()

def test_generate_report_pdf_endpoint_no_token(client):
    resp = client.post("/api/generate-report-pdf", json={})
    assert resp.status_code == 401

# --------- GLOBAL ERROR HANDLER TESTS ----------

def test_global_http_exception(client):
    resp = client.get("/not-a-real-route")
    assert resp.status_code == 404
    err = resp.get_json()
    assert "error" in err
    assert "code" in err

def test_global_generic_exception(monkeypatch, client, token):
    # Patch get_bank to raise an error
    def error_func(*args, **kwargs):  # <-- FIXED signature
        raise Exception("Test generic error")
    monkeypatch.setattr("app.get_bank", error_func)
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.get("/api/get-bank", headers=headers)
    assert resp.status_code == 500
    assert "error" in resp.get_json()