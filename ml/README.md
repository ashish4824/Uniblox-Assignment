# ML Assignment: Predicting Insurance Enrollment

This project implements a machine learning pipeline to predict whether an employee will enroll in a voluntary insurance product based on demographic and employment data.

## Project Structure

```
ml/
├── src/
│   ├── data.py      # Data loading and preprocessing
│   └── model.py     # Model building and evaluation
├── tests/
│   └── test_pipeline.py  # Pipeline tests
├── train.py         # Main training script
├── requirements.txt # Python dependencies
└── README.md        # This file
```

## Setup Instructions

### Prerequisites
- Python 3.12 or higher
- Virtual environment (recommended)

### Installation

1. Create and activate a virtual environment (if not already done):
```bash
python -m venv .venv
.venv\Scripts\activate  # On Windows
source .venv/bin/activate  # On Linux/Mac
```

2. Install dependencies:
```bash
pip install -r ml/requirements.txt
```

## Running the Model

### Training the Model

To train the model and generate predictions:

```bash
python ml/train.py
```

This will:
1. Load the employee_data.csv dataset
2. Preprocess the data (handle missing values, encode categorical features)
3. Split data into train/test sets (80/20 split)
4. Train a Logistic Regression model
5. Evaluate the model on the test set
6. Save the trained model to `artifacts/model.pkl`
7. Save evaluation metrics to `artifacts/metrics.json`
8. Print metrics to console

### Running Tests

To run the ML pipeline tests:

```bash
pytest ml/tests/ -v
```

Or from the root directory:
```bash
python -m pytest ml/tests/ -v
```

## Output

After training, you'll find:
- `artifacts/model.pkl` - Trained model (can be loaded with joblib)
- `artifacts/metrics.json` - Performance metrics (accuracy, precision, recall, F1, ROC-AUC)

## Model Performance

Current model performance metrics:
- Accuracy: ~89.6%
- Precision: ~91.0%
- Recall: ~92.1%
- F1 Score: ~91.6%
- ROC-AUC: ~97.0%

For detailed analysis and observations, see [report.md](report.md).
