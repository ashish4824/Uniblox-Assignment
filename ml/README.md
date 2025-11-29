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

---

## REST API (Bonus Feature)

A FastAPI-based REST API is provided for serving predictions.

### Starting the API Server

```bash
# From the project root directory
uvicorn ml.api:app --reload --port 8000

# Or run directly
python -m ml.api
```

The API will be available at `http://localhost:8000`

### API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/model/info` | Model information and metrics |
| POST | `/predict` | Single employee prediction |
| POST | `/predict/batch` | Batch predictions (up to 100) |

### Example Prediction Request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35,
    "gender": "Male",
    "marital_status": "Married",
    "salary": 75000.00,
    "employment_type": "Full-time",
    "region": "West",
    "has_dependents": "Yes",
    "tenure_years": 5.5
  }'
```

### Example Response

```json
{
  "enrolled": true,
  "probability": 0.8234,
  "confidence": "high",
  "recommendation": "Strong candidate for enrollment. Prioritize for outreach."
}
```

### Input Schema

| Field | Type | Valid Values |
|-------|------|--------------|
| age | integer | 18-100 |
| gender | string | Male, Female, Other |
| marital_status | string | Single, Married, Divorced, Widowed |
| salary | float | >= 0 |
| employment_type | string | Full-time, Part-time, Contract |
| region | string | West, Midwest, Northeast, South |
| has_dependents | string | Yes, No |
| tenure_years | float | >= 0 |

### Response Fields

| Field | Description |
|-------|-------------|
| enrolled | Predicted enrollment status (true/false) |
| probability | Probability of enrollment (0-1) |
| confidence | Confidence level: high, medium, or low |
| recommendation | Business recommendation based on prediction |
