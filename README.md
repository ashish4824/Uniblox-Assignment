# Multi-Assignment Repository

This repository contains comprehensive implementations for multiple technical assignments demonstrating:
- Full-stack development (E-commerce API + UI)
- Automation testing (Playwright E2E)
- Machine Learning (Python ML pipeline + FastAPI)
- Product Management (PRD documentation)
- Product Design (Rules Engine UI/UX)

---

## Repository Structure

```
.
├── src/                    # E-commerce API source code
├── public/                 # Frontend UI (E-commerce + Rules Engine demo)
├── tests/                  # Unit tests (Jest)
├── automation/             # E2E automation tests (Playwright)
├── ml/                     # Machine Learning assignment
├── docs/                   # Documentation (PRD, Design specs)
├── postman/                # Postman API collection
├── artifacts/              # ML model artifacts
├── package.json            # Node.js dependencies
└── README.md               # This file
```

---

## Assignment 1: E-commerce Store API

### Overview
A complete e-commerce store backend with cart management, checkout functionality, and dynamic discount code generation.

### Features
- **Shopping Cart**: Add, update, remove items
- **Checkout**: Process orders with optional discount codes
- **Discount System**: Generates 10% discount codes every Nth order (default N=3)
- **Admin APIs**: Generate discounts, view statistics, reset store
- **Rules Engine**: Insurance applicant evaluation
- **Web UI**: Full-featured frontend for testing

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Testing**: Jest + Supertest
- **Storage**: In-memory (no database required)

### Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start
# Server runs on http://localhost:3000

# Run unit tests
npm test
```

### API Endpoints

#### Customer APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cart/:userId/items` | Add item to cart |
| GET | `/cart/:userId` | Get cart contents |
| DELETE | `/cart/:userId/items/:itemId` | Remove item from cart |
| PATCH | `/cart/:userId/items/:itemId` | Update item quantity |
| POST | `/checkout/:userId` | Process checkout |

#### Admin APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/discounts/generate` | Generate discount code |
| GET | `/admin/stats` | Get store statistics |
| POST | `/admin/reset` | Reset application state |

#### Rules Engine API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/rules/evaluate` | Evaluate insurance applicant |

### Web UI

Access the frontend at `http://localhost:3000` after starting the server:
- **E-commerce Store**: Main page with product catalog, cart, checkout
- **Rules Engine Demo**: `/rules-engine-demo.html` - Interactive wireframe

### Postman Collection

Import the collection from `postman/ecommerce-api.postman_collection.json` for API testing.

### Discount Code Logic
- Every Nth order (default N=3) makes a discount available
- Discount code can only be generated when threshold is reached
- Each discount code is single-use (10% off entire order)
- Only one active unused discount can exist at a time

---

## Assignment 2: Automation Testing

End-to-end automation tests for the e-commerce application using Playwright.

### Technology
- **Framework**: Playwright
- **Language**: JavaScript

### Running Tests

```bash
# Start the server first
npm start

# Run E2E tests (in another terminal)
TEST_URL=http://localhost:3000 npm run test:e2e
```

### Test Coverage
- Reset application state
- Create multiple orders to reach discount threshold
- Generate and validate discount codes
- Apply discount to checkout
- Verify single-use enforcement
- Admin statistics validation

See [automation/README.md](automation/README.md) for detailed documentation.

---

## Assignment 3: Machine Learning - Insurance Enrollment Prediction

A complete ML pipeline to predict employee enrollment in voluntary insurance products.

### Technology Stack
- **Language**: Python 3.12+
- **Libraries**: scikit-learn, pandas, numpy, FastAPI
- **Testing**: pytest

### Model Performance
| Metric | Score |
|--------|-------|
| Accuracy | 89.6% |
| Precision | 91.0% |
| Recall | 92.1% |
| F1 Score | 91.6% |
| ROC-AUC | 97.0% |

### Quick Start

```bash
# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r ml/requirements.txt

# Train the model
python ml/train.py

# Run ML tests
pytest ml/tests/ -v

# Start the prediction API
uvicorn ml.api:app --reload --port 8000
# API docs at http://localhost:8000/docs
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
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
    "salary": 75000,
    "employment_type": "Full-time",
    "region": "West",
    "has_dependents": "Yes",
    "tenure_years": 5.5
  }'
```

### Output Artifacts
- `artifacts/model.pkl` - Trained model
- `artifacts/metrics.json` - Performance metrics

See [ml/README.md](ml/README.md) and [ml/report.md](ml/report.md) for detailed documentation.

---

## Assignment 4: Product Manager - PRD

A complete Product Requirements Document (PRD) for an AI-Powered Document Summarization feature.

### Deliverable Location
`docs/PRODUCT_MANAGER_PRD.md`

### Contents
1. **Part 1: Feature PRD**
   - Problem Statement
   - User Persona (Sarah - Corporate Analyst)
   - Proposed Solution
   - Functional Requirements (User Stories)
   - Success Metrics (RICE framework)
   - Risks & Mitigations

2. **Part 2: Prioritization**
   - RICE scoring for 3 features
   - MVP scope definition
   - Iterative roadmap (V1.0 → V2.0)
   - Data validation approach

3. **Part 3: Feasibility & GTM**
   - Technical considerations
   - Business considerations
   - AI validation strategy
   - User adoption plan
   - Post-launch KPIs

---

## Assignment 5: Product Designer - Rules Engine

Design documentation and interactive wireframes for a Rules Engine Editor/Visualizer.

### Deliverable Locations
- **Design Document**: `docs/RULES_ENGINE_DESIGN.md`
- **Interactive Wireframe**: `public/rules-engine-demo.html`

### Features Designed
1. **Applicant Type Rule** - Employee/Spouse product assignment
2. **Age-Based Eligibility** - Decline rules for age thresholds
3. **BMI Assessment** - Calculated field with approve/decline logic
4. **State-Based Options** - Multi-select for state-dependent gender options

### Design Highlights
- Form-based rule builder (primary interface)
- Decision tree visualization
- Inline testing with real-time feedback
- Nested condition groups (AND/OR logic)
- Multi-select chip interface for state selection

### View the Demo
Start the server and navigate to:
```
http://localhost:3000/rules-engine-demo.html
```

---

## Running All Tests

```bash
# Unit tests (Jest)
npm test

# E2E tests (Playwright) - requires running server
TEST_URL=http://localhost:3000 npm run test:e2e

# ML tests (pytest)
pytest ml/tests/ -v
```

---

## Project Statistics

### Code Quality
- Modular, maintainable code structure
- Comprehensive error handling
- Clear separation of concerns
- Well-documented APIs and functions

### Test Coverage
- **Unit Tests**: 7+ tests (Jest) - All passing
- **E2E Tests**: Complete discount flow (Playwright)
- **ML Tests**: Pipeline validation (pytest)

### Documentation
- Main README (this file)
- ML assignment README and comprehensive report
- Automation testing README
- Product Manager PRD
- Product Designer specification
- Code comments throughout

---

## Dependencies

### Node.js (E-commerce API)
```json
{
  "express": "Web framework",
  "uuid": "Unique ID generation",
  "jest": "Testing framework",
  "supertest": "HTTP testing",
  "@playwright/test": "E2E testing"
}
```

### Python (ML Pipeline)
```
pandas==2.2.2
scikit-learn==1.5.2
numpy==2.1.2
joblib==1.4.2
pytest==8.3.3
fastapi==0.115.0
uvicorn==0.31.0
pydantic==2.9.2
```

---

## Troubleshooting

### Port already in use
```bash
# Change port
PORT=3001 npm start
```

### Tests failing
```bash
# Reset application state
curl -X POST http://localhost:3000/admin/reset

# Or restart the server
```

### Python environment issues
```bash
# Recreate virtual environment
python -m venv .venv
.venv\Scripts\activate
pip install -r ml/requirements.txt
```

### Postman collection not loading
- Ensure you're importing the JSON file from `postman/` directory
- Check that the `baseUrl` variable is set to `http://localhost:3000`

---

## Assignment Requirements Checklist

### E-commerce Assignment
- [x] Cart management APIs (add, update, remove, get)
- [x] Checkout with optional discount code
- [x] Discount generation (every Nth order)
- [x] Single-use discount validation
- [x] Admin statistics API
- [x] **Web UI** (stretch goal completed)
- [x] **Postman collection**
- [x] Unit tests with Jest
- [x] Code quality and comments
- [x] README documentation

### Automation Assignment
- [x] Playwright framework
- [x] Functional test automation
- [x] Code quality
- [x] Documentation

### ML Assignment
- [x] Data processing pipeline
- [x] Model development (Logistic Regression)
- [x] Evaluation metrics
- [x] Functional code with tests
- [x] requirements.txt
- [x] README with clear instructions
- [x] Comprehensive report
- [x] **REST API (FastAPI)** - Bonus completed

### Product Manager Assignment
- [x] Feature PRD with all sections
- [x] Prioritization framework (RICE)
- [x] MVP scope definition
- [x] Iterative roadmap
- [x] Technical feasibility assessment
- [x] Go-to-market plan
- [x] Success metrics and KPIs

### Product Designer Assignment
- [x] Rule creation interface design
- [x] Rule visualization (decision tree)
- [x] Nested condition handling
- [x] Calculated fields (BMI)
- [x] Multi-select (state list)
- [x] Test panel design
- [x] Design rationale documentation
- [x] Interactive wireframe demo
- [x] Accessibility considerations

---

## Author

Assignment submission demonstrating:
- Backend API development (Node.js/Express)
- Frontend development (HTML/CSS/JavaScript)
- Test automation (Jest, Playwright)
- Machine learning (Python, scikit-learn)
- API development (FastAPI)
- Product management (PRD writing)
- Product design (UI/UX wireframes)
- Clean code practices
- Comprehensive documentation

---

## License

This is an assignment submission for evaluation purposes.
