import os
import json
import joblib
from pathlib import Path
from src.data import load_dataset, get_feature_sets, split
from src.model import build_pipeline, evaluate

def main():
    root = Path(__file__).resolve().parent.parent
    data_path = root / 'employee_data.csv'
    df = load_dataset(str(data_path))
    X, y, numeric, categorical = get_feature_sets(df)
    X_train, X_test, y_train, y_test = split(X, y)
    model = build_pipeline(numeric, categorical)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]
    metrics = evaluate(y_test, y_pred, y_prob)
    artifacts = root / 'artifacts'
    os.makedirs(artifacts, exist_ok=True)
    joblib.dump(model, artifacts / 'model.pkl')
    with open(artifacts / 'metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
    print(json.dumps(metrics))

if __name__ == '__main__':
    main()