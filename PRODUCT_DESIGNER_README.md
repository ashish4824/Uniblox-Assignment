# Product Designer Assignment

##  Assignment Overview

This is a Product Design take-home assignment focused on designing a **Rules Engine Editor/Visualizer** for insurance underwriters. The assignment tests your UX/UI design skills, understanding of complex workflows, and ability to create intuitive interfaces for technical systems.

##  Objective

Design a Rules Engine Editor that allows insurance underwriters to configure and visualize business rules without writing code.

**Reference Implementation**: [json-rules-engine](https://www.npmjs.com/package/json-rules-engine)

---

##  Business Requirements

### Use Case: Insurance Application Rules

An underwriter needs to configure the following rules in the system:

#### Rule 1: Applicant Type & Product Assignment
- **Question**: "Are you an Employee or Spouse?"
- **Logic**:
  - If **Employee** → Show products: Alpha, Beta, Gamma
  - If **Spouse** → Show products: Delta, Epsilon

#### Rule 2: Age-Based Eligibility
- **Question**: "What is your Date of Birth?"
- **Logic**:
  - If **Employee** AND age > 80 → **Decline application**
  - If **Spouse** AND age > 70 → **Decline application**

#### Rule 3: BMI-Based Approval
- **Question**: "What is your Height and Weight?"
- **Calculation**: BMI = weight(kg) / (height(m))²
- **Logic**:
  - If BMI > 20 → **Decline application**
  - If BMI ≤ 20 → **Approve application**

#### Rule 4: State-Based Gender Options
- **Question**: "What is your address?"
- **Logic**:
  - If state IN (NJ, FL, WA, KS, NY) → Gender options: Male, Female, Nonbinary
  - If state NOT IN (NJ, FL, WA, KS, NY) → Gender options: Male, Female

---

##  Design Deliverables

Your submission should include:

### 1. User Interface Design
- Wireframes or high-fidelity mockups
- Key screens and user flows
- Rule creation/editing interface
- Rule visualization interface

### 2. User Experience Flow
- How users navigate the system
- Step-by-step rule creation process
- Editing and managing existing rules
- Error states and validation

### 3. Design Rationale
- Why you made specific design decisions
- How the design solves user problems
- Accessibility considerations
- Scalability for complex rule sets

---

##  Target User Persona

### Primary User: Insurance Underwriter

**Background**:
- Job title: Underwriter, Risk Analyst, or Business Analyst
- Experience: 3-10 years in insurance
- Technical skill: Moderate (uses Excel, insurance software)
- NOT a developer (should not need to write code)

**Goals**:
- Configure insurance eligibility rules quickly
- Ensure rules are applied consistently
- Update rules when regulations change
- Understand rule logic at a glance

**Pain Points**:
- Current rule changes require IT involvement
- Hard to visualize complex conditional logic
- Difficult to test rules before deployment
- No audit trail of rule changes

**Success Criteria**:
- Can create/edit rules without developer help
- Can understand rule logic visually
- Can test rules before going live
- Feels confident rules are correct

---

##  Functional Requirements

### Core Features

#### 1. Rule Creation
- [ ] Visual rule builder (no code required)
- [ ] Support for conditional logic (IF/THEN/ELSE)
- [ ] Multiple condition types (AND/OR)
- [ ] Comparison operators (>, <, =, ≥, ≤, IN, NOT IN)
- [ ] Field selection from predefined list
- [ ] Value input with validation

#### 2. Rule Visualization
- [ ] Clear visual representation of rule flow
- [ ] Hierarchical display of conditions
- [ ] Color coding for rule outcomes (approve/decline)
- [ ] Expandable/collapsible rule sections
- [ ] Decision tree or flowchart view

#### 3. Rule Management
- [ ] List view of all rules
- [ ] Search and filter rules
- [ ] Enable/disable rules
- [ ] Rule versioning/history
- [ ] Duplicate existing rules

#### 4. Validation & Testing
- [ ] Real-time validation of rule logic
- [ ] Test rules with sample data
- [ ] Highlight conflicting rules
- [ ] Preview rule outcomes

#### 5. User Actions
- [ ] Create new rule
- [ ] Edit existing rule
- [ ] Delete rule (with confirmation)
- [ ] Reorder rule priority
- [ ] Save draft rules
- [ ] Publish rules to production

---

##  Design Considerations

### 1. Complexity Management
**Challenge**: Rules can become very complex with nested conditions

**Design Solutions**:
- Progressive disclosure (show simple, hide complex)
- Visual grouping of related conditions
- Indentation or nesting indicators
- Breadcrumbs for deep rule hierarchies
- Collapse/expand functionality

### 2. Error Prevention
**Challenge**: Users might create invalid or conflicting rules

**Design Solutions**:
- Inline validation with clear error messages
- Autocomplete for field names
- Dropdown for valid values
- Warning for conflicting rules
- Required field indicators

### 3. Learnability
**Challenge**: First-time users need to understand the system quickly

**Design Solutions**:
- Guided onboarding/tutorial
- Templates for common rule patterns
- Tooltips and contextual help
- Example rules pre-loaded
- Clear labels and terminology

### 4. Efficiency
**Challenge**: Power users need to create rules quickly

**Design Solutions**:
- Keyboard shortcuts
- Bulk operations
- Rule templates and duplication
- Quick edit mode
- Recent rules/frequent actions

---

##  Design Patterns to Consider

### Visual Rule Representation Options

#### Option 1: Form-Based Builder
```
IF [Applicant Type] [equals] [Employee]
THEN [Show Products] [Alpha, Beta, Gamma]
```
**Pros**: Familiar, easy to learn
**Cons**: Can become cluttered with complex rules

#### Option 2: Flow Chart / Decision Tree
```
[Applicant Type]
├─ Employee ──→ [Show: Alpha, Beta, Gamma]
└─ Spouse ────→ [Show: Delta, Epsilon]
```
**Pros**: Highly visual, shows logic flow
**Cons**: Requires more screen space

#### Option 3: Nested Card/Block UI
```
┌─ Rule: Applicant Type ─────────────┐
│ IF applicant type = Employee       │
│ ┌─ THEN ──────────────────────┐    │
│ │ Show products:              │    │
│ │ • Alpha • Beta • Gamma      │    │
│ └─────────────────────────────┘    │
└────────────────────────────────────┘
```
**Pros**: Organized, clear hierarchy
**Cons**: Vertical space consumption

### Recommended Approach
Combine multiple patterns:
- **Builder view**: For creating/editing
- **Visual view**: For understanding flow
- **List view**: For managing multiple rules

---

##  User Flows to Design

### Flow 1: Creating a New Rule
1. User clicks "Create New Rule"
2. User names the rule
3. User selects rule type/template (optional)
4. User defines conditions (IF statements)
5. User defines actions (THEN outcomes)
6. User validates rule
7. User saves draft or publishes

### Flow 2: Editing an Existing Rule
1. User finds rule in list
2. User clicks edit
3. System shows current rule configuration
4. User modifies conditions/actions
5. User validates changes
6. User saves with version comment

### Flow 3: Testing a Rule
1. User selects rule to test
2. User enters sample input data
3. System shows rule evaluation path
4. System highlights which conditions matched
5. System shows final outcome
6. User adjusts rule if needed

---

##  Visual Design Guidelines

### Layout
- **Left sidebar**: Rule list/navigation
- **Center area**: Rule builder/editor
- **Right panel**: Properties/settings (optional)
- **Top bar**: Actions (Save, Publish, Test)

### Typography
- Clear hierarchy (headings vs body text)
- Readable font sizes (14px+ for body)
- Monospace for technical values
- Consistent spacing

### Color Coding
- **Green**: Approved/success conditions
- **Red**: Declined/error conditions
- **Blue**: Information/neutral states
- **Yellow**: Warnings
- **Gray**: Disabled/inactive rules

### Icons
- Use consistent icon set
- Icons for common actions (edit, delete, copy)
- Visual indicators for rule types
- Status badges (active, draft, disabled)

---

##  Submission Format

### Required Deliverables

1. **Design Files**
   - Figma, Sketch, Adobe XD, or PDF
   - Minimum 3-5 key screens
   - Annotated with explanations

2. **User Flows**
   - Visual flow diagrams
   - Show key interactions
   - Indicate decision points

3. **Design Rationale** (1-2 pages)
   - Why you chose this approach
   - How it solves user problems
   - Trade-offs you considered
   - Alternative approaches considered

### Optional Enhancements
- Interactive prototype
- Design system components
- Responsive/mobile considerations
- Accessibility annotations
- Animation/transition specs

---

##  Evaluation Criteria

### 1. Usability (40%)
- **Ease of use**: Can underwriters create rules easily?
- **Clarity**: Is the rule logic clear and understandable?
- **Efficiency**: Can users accomplish tasks quickly?
- **Error prevention**: Does the design prevent mistakes?

### 2. Visual Design (25%)
- **Aesthetics**: Is it visually appealing?
- **Consistency**: Consistent patterns and styles?
- **Hierarchy**: Clear visual organization?
- **Polish**: Attention to detail?

### 3. Problem Solving (25%)
- **User needs**: Does it address underwriter pain points?
- **Complexity handling**: Manages complex rules well?
- **Scalability**: Works with many rules?
- **Innovation**: Creative solutions to challenges?

### 4. Communication (10%)
- **Documentation**: Clear explanations?
- **Rationale**: Justified design decisions?
- **Presentation**: Professional delivery?

---

##  Tips for Success

### Do's 
- **Focus on the user**: Design for underwriters, not developers
- **Show your thinking**: Explain design decisions
- **Consider edge cases**: What if rules conflict?
- **Think about scale**: What if there are 100 rules?
- **Test your design**: Walk through the flows yourself
- **Be realistic**: Don't over-design, focus on core needs

### Don'ts 

- Don't assume users know technical concepts
- Don't create overly complex interfaces
- Don't ignore accessibility
- Don't forget about error states
- Don't submit without annotations
- Don't skip the "why" behind your choices

---

##  Design Challenges to Solve

### Challenge 1: Representing Nested Conditions
**Problem**: Rule 2 has nested logic (Employee AND age > 80)

**Consider**:
- How do you show AND/OR relationships visually?
- How do users add/remove conditions?
- How do you indicate operator precedence?

### Challenge 2: Calculated Fields
**Problem**: Rule 3 requires BMI calculation

**Consider**:
- Should users see the formula?
- How do you input height and weight?
- What units (imperial vs metric)?
- Where does the calculation happen in the flow?

### Challenge 3: Dynamic Lists
**Problem**: Rule 4 has a list of states (NJ, FL, WA, KS, NY)

**Consider**:
- How do users input multiple values?
- Dropdown vs multi-select vs chips?
- How to handle large lists?
- Can users save reusable lists?

---

##  Inspiration & Examples

### Rule Engine UIs
- Zapier (workflow automation)
- IFTTT (if-this-then-that)
- Salesforce Process Builder
- Microsoft Power Automate
- AWS Step Functions (visual workflow)

### Design Patterns
- Form builders (Typeform, Google Forms)
- Query builders (MongoDB Compass)
- Visual programming (Scratch, Node-RED)
- Decision trees (flowchart tools)

---

##  Sample Annotations

When documenting your designs, include:

```
Screen: Rule Builder

1. Rule Name Field
   - Users can name rules descriptively
   - Auto-saves as they type
   - Shows character count (50 max)

2. Condition Builder
   - Drag & drop fields from left panel
   - Select operator from dropdown
   - Type or select value
   - "+" button to add more conditions

3. Logic Operator Toggle
   - Switch between AND/OR
   - Color changes to indicate selected
   - Tooltip explains difference

4. Outcome Definition
   - Choose action from predefined list
   - Configure action parameters
   - Multiple outcomes supported
```

---

##  Time Management

Recommended time allocation:

- **Research & Understanding**: 1-2 hours
- **User flow planning**: 2-3 hours
- **Wireframing**: 3-4 hours
- **Visual design**: 4-6 hours
- **Documentation**: 2-3 hours

**Total**: 12-18 hours

---

##  Deliverable Checklist

Before submitting, ensure you have:

- [ ] Rule creation interface designed
- [ ] Rule visualization/viewing interface
- [ ] Rule list/management interface
- [ ] At least one complete user flow
- [ ] All 4 example rules can be created with your design
- [ ] Error states and validation shown
- [ ] Design rationale documented
- [ ] Annotations explaining key decisions
- [ ] Files properly named and organized
- [ ] Proofread for clarity

---

##  Questions to Ask Yourself

As you design, keep asking:

1. Can a non-technical person use this?
2. Is the rule logic visually clear?
3. What happens if users make mistakes?
4. How does this scale to 50+ rules?
5. Can users find and edit rules easily?
6. Does this reduce dependency on IT?

---

##  Clarifying Questions

If you need to make assumptions:
- State them clearly in your documentation
- Explain why you made that assumption
- Show how you would validate it with users
- Demonstrate flexible thinking

**Example assumptions**:
- "Assumed underwriters work on desktop (1920x1080)"
- "Assumed rules are evaluated in priority order"
- "Assumed max 10 conditions per rule for MVP"

---

**Good luck with your design!** 

Remember: This is about demonstrating your design thinking process, not creating a pixel-perfect production UI. Show how you think through problems and make design decisions.
