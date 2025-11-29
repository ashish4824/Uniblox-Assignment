"""
FastAPI Prediction API for Insurance Enrollment Model

This module provides a REST API endpoint for predicting employee
enrollment in voluntary insurance products using the trained ML model.

Endpoints:
    POST /predict - Predict enrollment probability for an employee
    GET /health - Health check endpoint
    GET /model/info - Get model information and feature requirements

Usage:
    uvicorn ml.api:app --reload --port 8000
"""

import os
import json
from typing import Optional
from enum import Enum

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator

# Initialize FastAPI app
app = FastAPI(
    title="Insurance Enrollment Prediction API",
    description="ML model API for predicting employee enrollment in voluntary insurance products",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and metrics at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "artifacts", "model.pkl")
METRICS_PATH = os.path.join(os.path.dirname(__file__), "..", "artifacts", "metrics.json")

model = None
metrics = None


class Gender(str, Enum):
    """Valid gender values"""
    male = "Male"
    female = "Female"
    other = "Other"


class MaritalStatus(str, Enum):
    """Valid marital status values"""
    single = "Single"
    married = "Married"
    divorced = "Divorced"
    widowed = "Widowed"


class EmploymentType(str, Enum):
    """Valid employment type values"""
    full_time = "Full-time"
    part_time = "Part-time"
    contract = "Contract"


class Region(str, Enum):
    """Valid region values"""
    west = "West"
    midwest = "Midwest"
    northeast = "Northeast"
    south = "South"


class HasDependents(str, Enum):
    """Has dependents values"""
    yes = "Yes"
    no = "No"


class EmployeeInput(BaseModel):
    """
    Input schema for employee prediction.

    All fields correspond to the features used in model training.
    """
    age: int = Field(..., ge=18, le=100, description="Employee age (18-100)")
    gender: Gender = Field(..., description="Employee gender")
    marital_status: MaritalStatus = Field(..., description="Marital status")
    salary: float = Field(..., ge=0, description="Annual salary in USD")
    employment_type: EmploymentType = Field(..., description="Type of employment")
    region: Region = Field(..., description="Geographic region")
    has_dependents: HasDependents = Field(..., description="Whether employee has dependents")
    tenure_years: float = Field(..., ge=0, description="Years of employment tenure")

    class Config:
        schema_extra = {
            "example": {
                "age": 35,
                "gender": "Male",
                "marital_status": "Married",
                "salary": 75000.00,
                "employment_type": "Full-time",
                "region": "West",
                "has_dependents": "Yes",
                "tenure_years": 5.5
            }
        }


class PredictionResponse(BaseModel):
    """Response schema for prediction endpoint"""
    enrolled: bool = Field(..., description="Predicted enrollment status")
    probability: float = Field(..., description="Probability of enrollment (0-1)")
    confidence: str = Field(..., description="Confidence level: high, medium, or low")
    recommendation: str = Field(..., description="Business recommendation based on prediction")


class HealthResponse(BaseModel):
    """Response schema for health check"""
    status: str
    model_loaded: bool
    version: str


class ModelInfoResponse(BaseModel):
    """Response schema for model information"""
    model_type: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    features: list
    target: str


@app.on_event("startup")
async def load_model():
    """Load the ML model and metrics on startup"""
    global model, metrics

    try:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
            print(f"Model loaded successfully from {MODEL_PATH}")
        else:
            print(f"Warning: Model file not found at {MODEL_PATH}")
            print("Run 'python ml/train.py' to train the model first.")

        if os.path.exists(METRICS_PATH):
            with open(METRICS_PATH, 'r') as f:
                metrics = json.load(f)
            print(f"Metrics loaded: {metrics}")
    except Exception as e:
        print(f"Error loading model: {e}")


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Insurance Enrollment Prediction API",
        "docs": "/docs",
        "health": "/health",
        "predict": "/predict"
    }


@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint.

    Returns the status of the API and whether the model is loaded.
    """
    return HealthResponse(
        status="healthy" if model is not None else "degraded",
        model_loaded=model is not None,
        version="1.0.0"
    )


@app.get("/model/info", response_model=ModelInfoResponse, tags=["Model"])
async def model_info():
    """
    Get model information and performance metrics.

    Returns details about the trained model including accuracy,
    precision, recall, F1 score, and ROC-AUC.
    """
    if metrics is None:
        raise HTTPException(
            status_code=503,
            detail="Model metrics not available. Train the model first."
        )

    return ModelInfoResponse(
        model_type="Logistic Regression with preprocessing pipeline",
        accuracy=metrics.get("accuracy", 0),
        precision=metrics.get("precision", 0),
        recall=metrics.get("recall", 0),
        f1_score=metrics.get("f1", 0),
        roc_auc=metrics.get("roc_auc", 0),
        features=["age", "gender", "marital_status", "salary",
                  "employment_type", "region", "has_dependents", "tenure_years"],
        target="enrolled"
    )


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict(employee: EmployeeInput):
    """
    Predict insurance enrollment for an employee.

    Takes employee demographic and employment data and returns:
    - Predicted enrollment status (enrolled/not enrolled)
    - Probability of enrollment
    - Confidence level
    - Business recommendation

    Example request:
    ```json
    {
        "age": 35,
        "gender": "Male",
        "marital_status": "Married",
        "salary": 75000.00,
        "employment_type": "Full-time",
        "region": "West",
        "has_dependents": "Yes",
        "tenure_years": 5.5
    }
    ```
    """
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Run 'python ml/train.py' to train the model first."
        )

    try:
        # Prepare input data as DataFrame-like dict
        import pandas as pd

        input_data = pd.DataFrame([{
            "age": employee.age,
            "gender": employee.gender.value,
            "marital_status": employee.marital_status.value,
            "salary": employee.salary,
            "employment_type": employee.employment_type.value,
            "region": employee.region.value,
            "has_dependents": employee.has_dependents.value,
            "tenure_years": employee.tenure_years
        }])

        # Make prediction
        prediction = model.predict(input_data)[0]
        probability = model.predict_proba(input_data)[0]

        # Get probability of enrollment (class 1)
        enroll_prob = float(probability[1])

        # Determine confidence level
        if enroll_prob >= 0.8 or enroll_prob <= 0.2:
            confidence = "high"
        elif enroll_prob >= 0.6 or enroll_prob <= 0.4:
            confidence = "medium"
        else:
            confidence = "low"

        # Generate recommendation
        if prediction == 1:
            if enroll_prob >= 0.8:
                recommendation = "Strong candidate for enrollment. Prioritize for outreach."
            elif enroll_prob >= 0.6:
                recommendation = "Likely to enroll. Consider targeted communication."
            else:
                recommendation = "May enroll with proper incentives. Follow up recommended."
        else:
            if enroll_prob <= 0.2:
                recommendation = "Unlikely to enroll. Minimal outreach recommended."
            elif enroll_prob <= 0.4:
                recommendation = "Low probability. Consider for broader campaigns only."
            else:
                recommendation = "Uncertain. May benefit from personalized approach."

        return PredictionResponse(
            enrolled=bool(prediction),
            probability=round(enroll_prob, 4),
            confidence=confidence,
            recommendation=recommendation
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.post("/predict/batch", tags=["Prediction"])
async def predict_batch(employees: list[EmployeeInput]):
    """
    Batch prediction for multiple employees.

    Takes a list of employee records and returns predictions for all.
    Maximum 100 employees per request.
    """
    if len(employees) > 100:
        raise HTTPException(
            status_code=400,
            detail="Maximum 100 employees per batch request"
        )

    results = []
    for emp in employees:
        result = await predict(emp)
        results.append(result)

    return {"predictions": results, "count": len(results)}


# Run with: uvicorn ml.api:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
