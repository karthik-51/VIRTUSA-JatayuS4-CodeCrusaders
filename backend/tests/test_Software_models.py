import os
import joblib
import shutil
import pandas as pd
import numpy as np
import pytest

from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier

# Match your script's output directory
OUTPUT_DIR = "banking_prediction/backend/classification_methods/software_predictions"
MODEL_FILES = [
    "Random_forest_software.pkl",
    "Decision_tree_software.pkl",
    "XGBoost_software.pkl",
    "Logistic_regression_software.pkl",
    "software_label_encoder.pkl",
    "software_scaler.pkl"
]

@pytest.fixture(scope="module")
def dummy_data(tmp_path_factory):
    # Small dummy dataset
    data = {
        "Error Rate": [0.1, 0.2, 0.3, 0.2, 0.5],
        "Response Time": [0.6, 0.7, 0.8, 0.7, 0.9],
        "Crashes/Week": [1, 0, 2, 1, 0],
        "Uptime": [99.9, 99.7, 99.8, 99.6, 99.5],
        "Status": ["Operational", "Operational", "Degraded", "Operational", "Failure"]
    }
    df = pd.DataFrame(data)
    file_path = tmp_path_factory.mktemp("data") / "banking_software_unbalanced_dataset.csv"
    df.to_csv(file_path, index=False)
    return str(file_path), df

@pytest.fixture(scope="module", autouse=True)
def clean_output_dir():
    # Remove OUTPUT_DIR before and after the whole module
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    yield
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)

@pytest.fixture(scope="module")
def run_training(dummy_data):
    # Patch pandas.read_csv to use our dummy csv for the script import
    import pandas as pd
    csv_path, df = dummy_data
    real_read_csv = pd.read_csv

    def custom_read_csv(path, *args, **kwargs):
        # Use the dummy data if the filename matches
        if os.path.basename(str(path)) == "banking_software_unbalanced_dataset.csv":
            return real_read_csv(csv_path, *args, **kwargs)
        return real_read_csv(path, *args, **kwargs)

    orig_read_csv = pd.read_csv
    pd.read_csv = custom_read_csv

    # Dynamically import and run the script
    import importlib.util
    script_path = os.path.join(os.path.dirname(__file__), "../Software_models.py")
    spec = importlib.util.spec_from_file_location("Software_models", script_path)
    script_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(script_module)

    # Restore pandas.read_csv
    pd.read_csv = orig_read_csv

    # Confirm files created
    for fname in MODEL_FILES:
        fpath = os.path.join(OUTPUT_DIR, fname)
        assert os.path.isfile(fpath), f"{fname} not found after training"

def test_training_script_runs_and_exports(run_training):
    # If run_training passes, this test passes.
    pass

def test_model_predictions(dummy_data, run_training):
    _, df = dummy_data
    X = df[["Error Rate", "Response Time", "Crashes/Week", "Uptime"]]
    y = df["Status"]

    scaler = joblib.load(os.path.join(OUTPUT_DIR, "software_scaler.pkl"))
    encoder = joblib.load(os.path.join(OUTPUT_DIR, "software_label_encoder.pkl"))
    X_scaled = scaler.transform(X)
    y_encoded = encoder.transform(y)

    models = {
        "Random_forest_software.pkl": RandomForestClassifier,
        "Decision_tree_software.pkl": DecisionTreeClassifier,
        "XGBoost_software.pkl": XGBClassifier,
        "Logistic_regression_software.pkl": LogisticRegression,
    }
    for model_file, model_type in models.items():
        model = joblib.load(os.path.join(OUTPUT_DIR, model_file))
        y_pred = model.predict(X_scaled)
        assert y_pred.shape == y_encoded.shape
        # Allow for different encoding values, but all predictions must be valid encoded labels
        assert set(np.unique(y_pred)).issubset(set(np.unique(y_encoded)))
        assert isinstance(model, model_type)

def test_encoder_and_scaler_files_exist(run_training):
    assert os.path.isfile(os.path.join(OUTPUT_DIR, "software_label_encoder.pkl")), "Encoder file missing"
    assert os.path.isfile(os.path.join(OUTPUT_DIR, "software_scaler.pkl")), "Scaler file missing"

def test_label_encoder_inverse_transform(dummy_data, run_training):
    _, df = dummy_data
    encoder = joblib.load(os.path.join(OUTPUT_DIR, "software_label_encoder.pkl"))
    y = df["Status"]
    y_encoded = encoder.transform(y)
    y_decoded = encoder.inverse_transform(y_encoded)
    # Use .to_numpy() for comparison to avoid pandas index issues
    assert np.all(y.to_numpy() == y_decoded)

def test_scaler_transform_invertible(dummy_data, run_training):
    _, df = dummy_data
    scaler = joblib.load(os.path.join(OUTPUT_DIR, "software_scaler.pkl"))
    X = df[["Error Rate", "Response Time", "Crashes/Week", "Uptime"]]
    X_scaled = scaler.transform(X)
    X_inv = scaler.inverse_transform(X_scaled)
    np.testing.assert_almost_equal(X.values, X_inv)