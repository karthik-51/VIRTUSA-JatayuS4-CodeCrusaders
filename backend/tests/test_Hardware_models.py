import os
import joblib
import shutil
import pandas as pd
import numpy as np
import pytest

from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier

# Directory and filenames to match training script
OUTPUT_DIR = "banking_prediction/backend/classification_methods/hardware_prediction"
MODEL_FILES = [
    "svm_hardware.pkl",
    "random_forest_hardware.pkl",
    "ann_hardware.pkl",
    "hardware_label_encoder.pkl",
    "hardware_scaler.pkl"
]

@pytest.fixture(scope="module")
def dummy_data(tmp_path_factory):
    # Create a small dummy dataset
    data = {
        "ATM Vibration": [0.2, 0.5, 0.1, 0.6, 0.8],
        "Power Supply": [0.9, 0.7, 0.8, 0.6, 0.4],
        "CPU Usage": [45, 55, 50, 60, 70],
        "Memory": [32, 30, 35, 28, 20],
        "Storage": [240, 230, 250, 220, 210],
        "Status": ["Healthy", "Healthy", "Warning", "Critical", "Critical"]
    }
    df = pd.DataFrame(data)
    file_path = tmp_path_factory.mktemp("data") / "hardware_maintenance_balanced_dataset.csv"
    df.to_csv(file_path, index=False)
    return str(file_path), df

@pytest.fixture(scope="module", autouse=True)
def clean_output_dir():
    # Clean OUTPUT_DIR before and after tests in this module
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    yield
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)

@pytest.fixture(scope="module")
def run_training(dummy_data):
    # Patch pandas.read_csv to use our dummy data for the script
    import pandas as pd
    csv_path, df = dummy_data
    real_read_csv = pd.read_csv

    def custom_read_csv(path, *args, **kwargs):
        if os.path.basename(str(path)) == "hardware_maintenance_balanced_dataset.csv":
            return real_read_csv(csv_path, *args, **kwargs)
        return real_read_csv(path, *args, **kwargs)

    orig_read_csv = pd.read_csv
    pd.read_csv = custom_read_csv

    # Dynamically import and run the script
    import importlib.util
    script_path = os.path.join(os.path.dirname(__file__), "../Hardware_models.py")
    spec = importlib.util.spec_from_file_location("Hardware_models", script_path)
    script_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(script_module)

    # Restore pandas.read_csv
    pd.read_csv = orig_read_csv

    # Confirm all files are created
    for fname in MODEL_FILES:
        fpath = os.path.join(OUTPUT_DIR, fname)
        assert os.path.isfile(fpath), f"{fname} not found after training"

def test_training_script_runs_and_exports(run_training):
    # If run_training passes, this test passes.
    pass

def test_model_predictions(dummy_data, run_training):
    _, df = dummy_data
    X = df[["ATM Vibration", "Power Supply", "CPU Usage", "Memory", "Storage"]]
    y = df["Status"]

    scaler = joblib.load(os.path.join(OUTPUT_DIR, "hardware_scaler.pkl"))
    encoder = joblib.load(os.path.join(OUTPUT_DIR, "hardware_label_encoder.pkl"))
    X_scaled = scaler.transform(X)
    y_encoded = encoder.transform(y)

    models = {
        "svm_hardware.pkl": SVC,
        "random_forest_hardware.pkl": RandomForestClassifier,
        "ann_hardware.pkl": MLPClassifier,
    }
    for model_file, model_type in models.items():
        model = joblib.load(os.path.join(OUTPUT_DIR, model_file))
        y_pred = model.predict(X_scaled)
        assert y_pred.shape == y_encoded.shape
        assert set(np.unique(y_pred)).issubset(set(np.unique(y_encoded)))
        assert isinstance(model, model_type)

def test_encoder_and_scaler_files_exist(run_training):
    assert os.path.isfile(os.path.join(OUTPUT_DIR, "hardware_label_encoder.pkl")), "Encoder file missing"
    assert os.path.isfile(os.path.join(OUTPUT_DIR, "hardware_scaler.pkl")), "Scaler file missing"

def test_label_encoder_inverse_transform(dummy_data, run_training):
    _, df = dummy_data
    encoder = joblib.load(os.path.join(OUTPUT_DIR, "hardware_label_encoder.pkl"))
    y = df["Status"]
    y_encoded = encoder.transform(y)
    y_decoded = encoder.inverse_transform(y_encoded)
    assert np.all(y.to_numpy() == y_decoded)

def test_scaler_transform_invertible(dummy_data, run_training):
    _, df = dummy_data
    scaler = joblib.load(os.path.join(OUTPUT_DIR, "hardware_scaler.pkl"))
    X = df[["ATM Vibration", "Power Supply", "CPU Usage", "Memory", "Storage"]]
    X_scaled = scaler.transform(X)
    X_inv = scaler.inverse_transform(X_scaled)
    np.testing.assert_almost_equal(X.values, X_inv)