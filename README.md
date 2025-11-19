# Multi-Assignment Repository

This repository contains implementations for multiple technical assignments demonstrating full-stack development, automation testing, and machine learning capabilities.

##  Repository Structure

```
.
├── src/                    # Ecommerce API source code
├── tests/                  # Unit tests (Jest)
├── automation/             # E2E automation tests (Playwright)
├── ml/                     # Machine Learning assignment
├── package.json            # Node.js dependencies and scripts
└── README.md              # This file
```

---

##  Assignment 1: Ecommerce Store API

### Overview
An ecommerce store backend with cart management, checkout functionality, and dynamic discount code generation.

### Features
- **Shopping Cart**: Add/remove items, view cart
- **Checkout**: Process orders with optional discount codes
- **Discount System**: Generates 10% discount codes every Nth order
- **Admin APIs**: Generate discounts, view statistics
- **Rules Engine**: Insurance applicant evaluation (product designer assignment)

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Testing**: Jest + Supertest
- **Storage**: In-memory (no database required)

### API Endpoints

#### Customer APIs
```
POST   /cart/:userId/items          # Add item to cart
GET    /cart/:userId                # Get cart contents
POST   /checkout/:userId            # Checkout with optional discount code
```

#### Admin APIs
```
POST   /admin/discounts/generate    # Generate discount code (if eligible)
GET    /admin/stats                 # Get purchase statistics
POST   /admin/reset                 # Reset application state
```

#### Rules Engine API
```
POST   /rules/evaluate              # Evaluate insurance applicant
```

### Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Run the server**:
```bash
npm start
# Server runs on http://localhost:3000
```

3. **Run unit tests**:
```bash
npm test
```

### Example Usage

```bash
# Add item to cart
curl -X POST http://localhost:3000/cart/user1/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Product A", "price": 100, "quantity": 2}'

# Checkout
curl -X POST http://localhost:3000/cart/user1/checkout \
  -H "Content-Type: application/json" \
  -d '{"discountCode": "CODE-ABC123"}'

# Get stats
curl http://localhost:3000/admin/stats
```

### Discount Code Logic
- Every Nth order (default N=3) makes a discount available
- Discount code can only be generated when threshold is reached
- Each discount code is single-use (10% off entire order)
- Only one active unused discount can exist at a time

### Test Coverage
-  Add items to cart and retrieve
-  Checkout without discount
-  Discount generation validation
-  Discount application and single-use enforcement
-  Admin statistics tracking
-  Rules engine evaluation

---

##  Assignment 2: Automation Testing

End-to-end automation tests for the ecommerce application.

### Technology
- **Framework**: Playwright
- **Language**: JavaScript

### Running Automation Tests

1. **Start the server**:
```bash
npm start
```

2. **Run E2E tests** (in another terminal):
```bash
TEST_URL=http://localhost:3000 npm run test:e2e
```

For detailed instructions, see [automation/README.md](automation/README.md).

---

##  Assignment 3: Machine Learning - Insurance Enrollment Prediction

A machine learning pipeline to predict employee enrollment in voluntary insurance products.

### Technology Stack
- **Language**: Python 3.12
- **Libraries**: scikit-learn, pandas, numpy
- **Testing**: pytest

### Features
- Data preprocessing with imputation and scaling
- Logistic Regression classification model
- Comprehensive evaluation metrics
- Model persistence (joblib)

### Performance
- **Accuracy**: 89.6%
- **ROC-AUC**: 97.0%
- **F1 Score**: 91.6%

### Quick Start

1. **Activate virtual environment**:
```bash
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac
```

2. **Install ML dependencies**:
```bash
pip install -r ml/requirements.txt
```

3. **Train the model**:
```bash
python ml/train.py
```

4. **Run ML tests**:
```bash
pytest ml/tests/ -v
```

### Output Artifacts
- `artifacts/model.pkl` - Trained model
- `artifacts/metrics.json` - Performance metrics

For detailed analysis, see:
- [ml/README.md](ml/README.md) - Setup and usage instructions
- [ml/report.md](ml/report.md) - Comprehensive analysis and findings

---

##  Project Statistics

### Code Quality
-  Modular, maintainable code structure
-  Comprehensive error handling
-  Clear separation of concerns
-  Well-documented APIs and functions

### Testing
- **Unit Tests**: 7 tests (Jest) - All passing
- **E2E Tests**: 1 comprehensive flow (Playwright)
- **ML Tests**: 1 pipeline test (pytest) - Passing

### Documentation
-  Main README (this file)
-  ML assignment README and report
-  Automation testing README
-  Code comments throughout

---

##  Development Workflow

### Running All Tests
```bash
# Unit tests
npm test

# E2E tests (requires running server)
TEST_URL=http://localhost:3000 npm run test:e2e

# ML tests
pytest ml/tests/ -v
```

### Development Mode
```bash
# Start server with auto-reload
npm run dev
```

---

##  Assignment Requirements Checklist

### Ecommerce Assignment
-  Functional cart and checkout APIs
-  Discount code generation and validation
-  Admin statistics API
-  In-memory storage
-  Unit tests with Jest
-  Code quality and comments
-  README documentation

### Automation Assignment
-  Functional test automation
-  Playwright framework
-  Code quality
-  Documentation

### ML Assignment
-  Data processing pipeline
-  Model development and training
-  Functional code with tests
-  Evaluation metrics
-  requirements.txt
-  README with clear instructions
-  Comprehensive report with findings

---

## 🔧 Troubleshooting

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

---

##  Dependencies

### Node.js
- express: Web framework
- uuid: Unique ID generation
- jest: Testing framework
- supertest: HTTP testing
- @playwright/test: E2E testing

### Python
- pandas: Data manipulation
- scikit-learn: ML algorithms
- numpy: Numerical computing
- joblib: Model persistence
- pytest: Testing framework

---

##  Author


Assignment completion demonstrating:
- Backend API development
- Test automation
- Machine learning
- Clean code practices
- Comprehensive documentation

---

##  License

This is an assignment submission for evaluation purposes.
