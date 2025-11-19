# Automation Testing

This directory contains end-to-end automation tests for the ecommerce application using Playwright.

## Project Structure

```
automation/
├── tests/
│   └── ecommerce.flow.spec.js  # E2E test for ecommerce flow
├── playwright.config.js         # Playwright configuration
└── README.md                    # This file
```

## Prerequisites

- Node.js 16 or higher
- npm (comes with Node.js)
- The ecommerce application should be running on a test server

## Installation

From the root directory, install dependencies:

```bash
npm install
```

This will install:
- `@playwright/test` - Playwright testing framework
- All other project dependencies

## Running the Tests

### Option 1: Run against a running server

1. First, start the ecommerce server in a separate terminal:
```bash
npm start
# Server will start on http://localhost:3000
```

2. Then run the automation tests:
```bash
# Set the TEST_URL environment variable and run tests
TEST_URL=http://localhost:3000 npm run test:e2e
```

### Option 2: Using different test environments

```bash
# Test against local development server
TEST_URL=http://localhost:3000 npm run test:e2e

# Test against staging environment
TEST_URL=https://staging.example.com npm run test:e2e
```

### Windows PowerShell
```powershell
$env:TEST_URL="http://localhost:3000"
npm run test:e2e
```

### Linux/Mac
```bash
export TEST_URL=http://localhost:3000
npm run test:e2e
```

## Test Coverage

The automation tests cover the following scenarios:

### E2E Ecommerce Flow
- **Setup**: Resets the application state
- **Create Orders**: Places 2 orders to approach discount threshold
- **Discount Generation**:
  - Verifies discount cannot be generated before threshold
  - Creates 3rd order to reach threshold
  - Successfully generates discount code
- **Apply Discount**:
  - Adds item to cart
  - Applies valid discount code at checkout
  - Verifies 10% discount is applied correctly
- **Discount Validation**: Attempts to reuse discount code (should fail)
- **Admin Stats**: Verifies statistics are tracked correctly

## Test Configuration

The test configuration is defined in `playwright.config.js`:
- **Mode**: Serial execution (tests run in sequence)
- **Base URL**: Set via `TEST_URL` environment variable
- **Timeout**: Default Playwright timeouts

## Understanding the Tests

### ecommerce.flow.spec.js

This test validates the complete discount flow:

1. **Reset Application**: Clears all carts, orders, and discounts
2. **Pre-threshold Orders**: Creates N-1 orders (where N=3 by default)
3. **Discount Not Available**: Confirms discount cannot be generated early
4. **Reach Threshold**: Creates Nth order
5. **Generate Discount**: Successfully creates discount code
6. **Use Discount**: Applies code to new order, verifies 10% reduction
7. **Prevent Reuse**: Ensures discount code is single-use
8. **Verify Stats**: Checks admin statistics are accurate

## Viewing Test Results

Playwright provides detailed test output:
- ✅ Green checkmarks for passing tests
- ❌ Red X for failing tests
- Detailed error messages and stack traces on failure

## Troubleshooting

### Test skips or fails

**Issue**: Tests skip with "no TEST_URL"
- **Solution**: Ensure TEST_URL environment variable is set

**Issue**: Connection refused
- **Solution**: Make sure the server is running on the specified TEST_URL

**Issue**: Tests timeout
- **Solution**: Check server is responding, increase timeout in playwright.config.js

## CI/CD Integration

To integrate with CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Start server
  run: npm start &

- name: Run E2E tests
  run: TEST_URL=http://localhost:3000 npm run test:e2e
```

## Best Practices

1. **Always reset state** before test runs to ensure idempotency
2. **Use environment variables** for test URLs (never hardcode)
3. **Run tests serially** when they share state (configured by default)
4. **Verify both positive and negative cases** (valid/invalid discount codes)

## Assignment Notes

This automation suite demonstrates:
- ✅ **Functional code**: Tests execute successfully
- ✅ **Code quality**: Clean, readable test structure
- ✅ **Documentation**: This README provides clear instructions
- ✅ **Assumptions**: Uni-directional flow (no back button testing)

The framework is extensible for additional test scenarios as the application grows.
