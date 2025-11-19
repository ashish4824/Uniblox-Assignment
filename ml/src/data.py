import os
import pandas as pd
from sklearn.model_selection import train_test_split

def load_dataset(path):
    if not os.path.exists(path):
        raise FileNotFoundError(path)
    df = pd.read_csv(path)
    return df

def get_feature_sets(df, target='enrolled'):
    if target not in df.columns:
        raise ValueError('missing_target')
    X = df.drop(columns=[target])
    y = df[target].astype(int)
    numeric = [c for c in X.columns if pd.api.types.is_numeric_dtype(X[c])]
    categorical = [c for c in X.columns if c not in numeric]
    return X, y, numeric, categorical

def split(X, y, test_size=0.2, random_state=42):
    return train_test_split(X, y, test_size=test_size, random_state=random_state, stratify=y)