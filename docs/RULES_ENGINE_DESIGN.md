# Rules Engine Editor/Visualizer
## Design Documentation

**Author:** Product Designer Assignment Submission
**Date:** November 2025
**Version:** 1.0

---

## Executive Summary

This document presents the UI/UX design for a Rules Engine Editor/Visualizer targeted at insurance underwriters. The design enables non-technical users to create, edit, and visualize complex business rules without writing code.

---

## 1. Design Overview

### 1.1 Design Approach

After analyzing the requirements and user needs, I chose a **Multi-View Builder Pattern** that combines:

1. **Form-Based Builder** - For creating/editing rules (intuitive, low learning curve)
2. **Decision Tree Visualization** - For understanding rule flow (visual clarity)
3. **List View** - For managing multiple rules (organization)

This hybrid approach balances power with usability, serving both novice and experienced underwriters.

### 1.2 Design Principles

1. **Progressive Disclosure** - Show simple first, reveal complexity as needed
2. **Immediate Feedback** - Real-time validation and preview
3. **Error Prevention** - Guide users toward valid configurations
4. **Consistency** - Familiar patterns across all interactions
5. **Accessibility** - WCAG 2.1 AA compliant

---

## 2. Information Architecture

```
Rules Engine Editor
├── Dashboard (Home)
│   ├── Quick Stats
│   ├── Recent Rules
│   └── Create New Rule
├── Rules List
│   ├── Search & Filter
│   ├── Rule Cards
│   └── Bulk Actions
├── Rule Builder
│   ├── Rule Details
│   ├── Conditions Builder
│   ├── Actions Builder
│   └── Test Panel
├── Rule Visualizer
│   ├── Decision Tree View
│   ├── Flow Diagram
│   └── Table View
└── Settings
    ├── Field Definitions
    ├── Action Types
    └── Templates
```

---

## 3. Key Screens

### 3.1 Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│  RULES ENGINE                                    [Search...] [? Help]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Welcome back, Sarah                              [+ Create New Rule]│
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│  │     12       │ │      4       │ │      8       │ │      2       ││
│  │ Total Rules  │ │   Active     │ │   Draft      │ │   Disabled   ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
│                                                                      │
│  RECENT RULES                                          [View All →] │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ ● Age Eligibility Check          Active    Modified 2 hours ago ││
│  │ ○ BMI Assessment Rule            Draft     Modified yesterday   ││
│  │ ● Product Assignment             Active    Modified 3 days ago  ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  QUICK TEMPLATES                                                     │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐          │
│  │ [icon]         │ │ [icon]         │ │ [icon]         │          │
│  │ Age-Based      │ │ Multi-Condition│ │ State-Based    │          │
│  │ Eligibility    │ │ Assessment     │ │ Options        │          │
│  └────────────────┘ └────────────────┘ └────────────────┘          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Rules List View

```
┌─────────────────────────────────────────────────────────────────────┐
│  RULES ENGINE  >  All Rules                      [Search...] [? Help]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [+ Create Rule]  [Import]  [Export]                                 │
│                                                                      │
│  Filter: [All Status ▼] [All Types ▼] [Date Range ▼]  [Clear]       │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ □  RULE NAME               STATUS     TYPE        MODIFIED      ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ □  Applicant Type &        ●Active    Assignment  Nov 25, 2025  ││
│  │    Product Assignment                                            ││
│  │    IF role = Employee THEN show Alpha, Beta, Gamma              ││
│  │    [Edit] [Test] [Duplicate] [...]                              ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ □  Age-Based Eligibility   ●Active    Eligibility Nov 24, 2025  ││
│  │    IF Employee AND age > 80 THEN decline                        ││
│  │    [Edit] [Test] [Duplicate] [...]                              ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ □  BMI Assessment          ○Draft     Assessment  Nov 23, 2025  ││
│  │    IF BMI > 20 THEN decline ELSE approve                        ││
│  │    [Edit] [Test] [Duplicate] [...]                              ││
│  ├─────────────────────────────────────────────────────────────────┤│
│  │ □  State Gender Options    ●Active    Options     Nov 22, 2025  ││
│  │    IF state IN (NJ,FL,WA,KS,NY) THEN Nonbinary option           ││
│  │    [Edit] [Test] [Duplicate] [...]                              ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Showing 4 of 4 rules                              [< 1 2 3 ... >]  │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Rule Builder - Main Interface

```
┌─────────────────────────────────────────────────────────────────────┐
│  RULES ENGINE  >  Edit Rule                      [Save Draft] [Test]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────┬───────────────────────────────┐│
│  │ RULE DETAILS                    │ PREVIEW                       ││
│  │                                 │                               ││
│  │ Rule Name:                      │ ┌─────────────────────────┐  ││
│  │ ┌─────────────────────────────┐ │ │                         │  ││
│  │ │ Age-Based Eligibility       │ │ │    [Decision Tree]      │  ││
│  │ └─────────────────────────────┘ │ │                         │  ││
│  │                                 │ │  ┌─────────────┐        │  ││
│  │ Description:                    │ │  │ Applicant   │        │  ││
│  │ ┌─────────────────────────────┐ │ │  │   Role      │        │  ││
│  │ │ Decline applications based  │ │ │  └──────┬──────┘        │  ││
│  │ │ on applicant age limits     │ │ │    ┌────┴────┐          │  ││
│  │ └─────────────────────────────┘ │ │ Employee  Spouse        │  ││
│  │                                 │ │    │         │          │  ││
│  │ Status: ○ Draft ● Active        │ │  Age>80?  Age>70?       │  ││
│  │                                 │ │  Yes│No   Yes│No        │  ││
│  │ Priority: [5] (1=highest)       │ │    ▼  ▼     ▼  ▼        │  ││
│  │                                 │ │  [X][✓]   [X][✓]        │  ││
│  │                                 │ └─────────────────────────┘  ││
│  ├─────────────────────────────────┤                               ││
│  │ CONDITIONS                [+ Add Condition]                     ││
│  │                                 │ [Tree View] [Flow] [Table]   ││
│  │ ┌───────────────────────────────┴───────────────────────────┐  ││
│  │ │  IF                                                        │  ││
│  │ │  ┌────────────┐ ┌────────┐ ┌─────────────┐                │  ││
│  │ │  │ role     ▼ │ │ equals▼│ │ Employee  ▼ │  [×]           │  ││
│  │ │  └────────────┘ └────────┘ └─────────────┘                │  ││
│  │ │                                                            │  ││
│  │ │  [AND ▼]                                                   │  ││
│  │ │                                                            │  ││
│  │ │  ┌────────────┐ ┌────────┐ ┌─────────────┐                │  ││
│  │ │  │ age      ▼ │ │ >    ▼ │ │ 80          │  [×]           │  ││
│  │ │  └────────────┘ └────────┘ └─────────────┘                │  ││
│  │ │                                                            │  ││
│  │ │  [+ Add Condition]                                         │  ││
│  │ └────────────────────────────────────────────────────────────┘  ││
│  │                                 │                               ││
│  ├─────────────────────────────────┤                               ││
│  │ THEN (Action)                   │                               ││
│  │                                 │                               ││
│  │ ┌────────────────────────────────────────────────────────────┐  ││
│  │ │  ┌────────────────┐ ┌──────────────────────────────┐       │  ││
│  │ │  │ Set Decision ▼ │ │ decline                    ▼ │       │  ││
│  │ │  └────────────────┘ └──────────────────────────────┘       │  ││
│  │ └────────────────────────────────────────────────────────────┘  ││
│  │                                 │                               ││
│  │ ELSE (Optional)          [+ Add Else Action]                    ││
│  │                                 │                               ││
│  │ ┌────────────────────────────────────────────────────────────┐  ││
│  │ │  Continue to next rule                                     │  ││
│  │ └────────────────────────────────────────────────────────────┘  ││
│  │                                 │                               ││
│  └─────────────────────────────────┴───────────────────────────────┘│
│                                                                      │
│  [Cancel]                                    [Save Draft] [Publish] │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.4 Condition Builder - Nested Conditions

```
┌─────────────────────────────────────────────────────────────────────┐
│  CONDITIONS                                        [+ Add Condition]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─ IF ──────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │  ┌─ Condition Group (ALL must match) ─────────────────────┐   │  │
│  │  │                                                         │   │  │
│  │  │  ┌────────────┐ ┌────────┐ ┌───────────────┐           │   │  │
│  │  │  │ role     ▼ │ │ =    ▼ │ │ Employee    ▼ │    [×]    │   │  │
│  │  │  └────────────┘ └────────┘ └───────────────┘           │   │  │
│  │  │                                                  [AND]  │   │  │
│  │  │  ┌────────────┐ ┌────────┐ ┌───────────────┐           │   │  │
│  │  │  │ age      ▼ │ │ >    ▼ │ │ 80            │    [×]    │   │  │
│  │  │  └────────────┘ └────────┘ └───────────────┘           │   │  │
│  │  │                                                         │   │  │
│  │  │  [+ Add Condition to Group]                             │   │  │
│  │  └─────────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │                              [OR]                              │  │
│  │                                                                │  │
│  │  ┌─ Condition Group (ALL must match) ─────────────────────┐   │  │
│  │  │                                                         │   │  │
│  │  │  ┌────────────┐ ┌────────┐ ┌───────────────┐           │   │  │
│  │  │  │ role     ▼ │ │ =    ▼ │ │ Spouse      ▼ │    [×]    │   │  │
│  │  │  └────────────┘ └────────┘ └───────────────┘           │   │  │
│  │  │                                                  [AND]  │   │  │
│  │  │  ┌────────────┐ ┌────────┐ ┌───────────────┐           │   │  │
│  │  │  │ age      ▼ │ │ >    ▼ │ │ 70            │    [×]    │   │  │
│  │  │  └────────────┘ └────────┘ └───────────────┘           │   │  │
│  │  │                                                         │   │  │
│  │  │  [+ Add Condition to Group]                             │   │  │
│  │  └─────────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │  [+ Add Condition Group]                                       │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.5 State-Based Options Rule (Multi-Select Values)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Rule: State-Based Gender Options                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CONDITIONS                                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  IF                                                            │  │
│  │  ┌─────────────────┐ ┌────────────┐ ┌───────────────────────┐ │  │
│  │  │ address.state ▼ │ │ is in    ▼ │ │ Select states...    ▼ │ │  │
│  │  └─────────────────┘ └────────────┘ └───────────────────────┘ │  │
│  │                                                                │  │
│  │  Selected States:                                              │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ [NJ ×] [FL ×] [WA ×] [KS ×] [NY ×]                      │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │ Available States:                                        │  │  │
│  │  │ [ ] AL  [ ] AK  [ ] AZ  [ ] AR  [ ] CA  [ ] CO  [ ] CT  │  │  │
│  │  │ [ ] DE  [✓] FL  [ ] GA  [ ] HI  [ ] ID  [ ] IL  [ ] IN  │  │  │
│  │  │ [ ] IA  [✓] KS  [ ] KY  [ ] LA  [ ] ME  [ ] MD  [ ] MA  │  │  │
│  │  │ [ ] MI  [ ] MN  [ ] MS  [ ] MO  [ ] MT  [ ] NE  [ ] NV  │  │  │
│  │  │ [ ] NH  [✓] NJ  [ ] NM  [✓] NY  [ ] NC  [ ] ND  [ ] OH  │  │  │
│  │  │ [ ] OK  [ ] OR  [ ] PA  [ ] RI  [ ] SC  [ ] SD  [ ] TN  │  │  │
│  │  │ [ ] TX  [ ] UT  [ ] VT  [ ] VA  [✓] WA  [ ] WV  [ ] WI  │  │  │
│  │  │ [ ] WY                                                   │  │  │
│  │  │                                    [Select All] [Clear]  │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  THEN                                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ┌──────────────────────┐ ┌─────────────────────────────────┐ │  │
│  │  │ Set gender_options ▼ │ │ Male, Female, Nonbinary       ▼ │ │  │
│  │  └──────────────────────┘ └─────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ELSE                                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ┌──────────────────────┐ ┌─────────────────────────────────┐ │  │
│  │  │ Set gender_options ▼ │ │ Male, Female                  ▼ │ │  │
│  │  └──────────────────────┘ └─────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.6 BMI Calculation Rule (Calculated Fields)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Rule: BMI Assessment                                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CONDITIONS                                                          │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  IF                                                            │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │ ⓘ BMI is calculated automatically from Height and Weight │ │  │
│  │  │   Formula: weight(kg) / (height(m))²                      │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  │  ┌───────────────────┐ ┌──────────┐ ┌───────────────────┐     │  │
│  │  │ calculated.BMI  ▼ │ │ >      ▼ │ │ 20                │     │  │
│  │  └───────────────────┘ └──────────┘ └───────────────────┘     │  │
│  │                                                                │  │
│  │  Input fields required:                                        │  │
│  │  • heightCm (number) - Height in centimeters                   │  │
│  │  • weightKg (number) - Weight in kilograms                     │  │
│  │                                                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  THEN                                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ┌────────────────┐ ┌─────────────────────────────────────┐   │  │
│  │  │ Set decision ▼ │ │ decline                           ▼ │   │  │
│  │  └────────────────┘ └─────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │  ┌────────────────┐ ┌─────────────────────────────────────┐   │  │
│  │  │ Set reason   ▼ │ │ "BMI exceeds threshold of 20"       │   │  │
│  │  └────────────────┘ └─────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ELSE                                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ┌────────────────┐ ┌─────────────────────────────────────┐   │  │
│  │  │ Set decision ▼ │ │ approve                           ▼ │   │  │
│  │  └────────────────┘ └─────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.7 Decision Tree Visualizer

```
┌─────────────────────────────────────────────────────────────────────┐
│  RULE VISUALIZER                              [Tree] [Flow] [Table] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Complete Application Rules Flow:                                    │
│                                                                      │
│                        ┌─────────────────┐                          │
│                        │    START        │                          │
│                        │  (Applicant)    │                          │
│                        └────────┬────────┘                          │
│                                 │                                    │
│                                 ▼                                    │
│                   ┌─────────────────────────┐                       │
│                   │   What is your role?    │                       │
│                   │   [Employee / Spouse]   │                       │
│                   └────────────┬────────────┘                       │
│                      ┌─────────┴─────────┐                          │
│                      ▼                   ▼                          │
│         ┌──────────────────┐   ┌──────────────────┐                │
│         │    EMPLOYEE      │   │     SPOUSE       │                │
│         │ Products: Alpha, │   │ Products: Delta, │                │
│         │ Beta, Gamma      │   │ Epsilon          │                │
│         └────────┬─────────┘   └────────┬─────────┘                │
│                  │                       │                          │
│                  ▼                       ▼                          │
│         ┌──────────────────┐   ┌──────────────────┐                │
│         │   Age > 80?      │   │   Age > 70?      │                │
│         └────────┬─────────┘   └────────┬─────────┘                │
│            Yes┌──┴──┐No           Yes┌──┴──┐No                     │
│               ▼     ▼                ▼     ▼                        │
│         ┌─────────┐ │          ┌─────────┐ │                        │
│         │ DECLINE │ │          │ DECLINE │ │                        │
│         │  (age)  │ │          │  (age)  │ │                        │
│         └─────────┘ │          └─────────┘ │                        │
│                     ▼                      ▼                        │
│         ┌───────────────────────────────────────┐                  │
│         │           BMI Calculation              │                  │
│         │   (Height & Weight → BMI)              │                  │
│         └───────────────────┬───────────────────┘                  │
│                             │                                       │
│                             ▼                                       │
│                   ┌──────────────────┐                             │
│                   │   BMI > 20?      │                             │
│                   └────────┬─────────┘                             │
│                      Yes┌──┴──┐No                                  │
│                         ▼     ▼                                     │
│                   ┌─────────┐ ┌─────────┐                          │
│                   │ DECLINE │ │ APPROVE │                          │
│                   │  (BMI)  │ │         │                          │
│                   └─────────┘ └─────────┘                          │
│                                                                      │
│  Legend: [Start] [Decision] [Outcome-Positive] [Outcome-Negative]   │
│                                                                      │
│  [Zoom In] [Zoom Out] [Fit Screen] [Export PNG] [Export PDF]        │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.8 Test Panel

```
┌─────────────────────────────────────────────────────────────────────┐
│  TEST RULE                                                [× Close] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Enter test data to see how the rule evaluates:                      │
│                                                                      │
│  ┌─────────────────────────────┬───────────────────────────────────┐│
│  │ INPUT                       │ OUTPUT                            ││
│  ├─────────────────────────────┼───────────────────────────────────┤│
│  │                             │                                   ││
│  │ role:                       │ RESULT:                           ││
│  │ ┌───────────────────────┐   │ ┌─────────────────────────────┐  ││
│  │ │ Employee            ▼ │   │ │ ✓ APPROVED                  │  ││
│  │ └───────────────────────┘   │ └─────────────────────────────┘  ││
│  │                             │                                   ││
│  │ Date of Birth:              │ Products Shown:                   ││
│  │ ┌───────────────────────┐   │ • Alpha                          ││
│  │ │ 1990-05-15            │   │ • Beta                           ││
│  │ └───────────────────────┘   │ • Gamma                          ││
│  │ (Calculated age: 34)        │                                   ││
│  │                             │ Gender Options:                   ││
│  │ Height (cm):                │ • Male                            ││
│  │ ┌───────────────────────┐   │ • Female                          ││
│  │ │ 175                   │   │                                   ││
│  │ └───────────────────────┘   │ Evaluation Path:                  ││
│  │                             │ 1. ✓ Role = Employee              ││
│  │ Weight (kg):                │ 2. ✓ Age (34) ≤ 80                ││
│  │ ┌───────────────────────┐   │ 3. ✓ BMI (19.6) ≤ 20             ││
│  │ │ 60                    │   │ 4. → Approved                     ││
│  │ └───────────────────────┘   │                                   ││
│  │ (Calculated BMI: 19.6)      │                                   ││
│  │                             │                                   ││
│  │ State:                      │                                   ││
│  │ ┌───────────────────────┐   │                                   ││
│  │ │ CA                  ▼ │   │                                   ││
│  │ └───────────────────────┘   │                                   ││
│  │                             │                                   ││
│  │ [Run Test]  [Clear]         │ [Export Result] [Share]           ││
│  └─────────────────────────────┴───────────────────────────────────┘│
│                                                                      │
│  TEST HISTORY                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ Test 1: Employee, Age 34, BMI 19.6, CA → ✓ Approved            ││
│  │ Test 2: Spouse, Age 75, BMI 18.0, NY → ✗ Declined (age)        ││
│  │ Test 3: Employee, Age 85, BMI 19.0, TX → ✗ Declined (age)      ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. User Flows

### 4.1 Creating a New Rule

```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│  Dashboard │───▶│  Select    │───▶│   Define   │───▶│   Define   │
│  + Create  │    │  Template  │    │ Conditions │    │  Actions   │
└────────────┘    │  or Blank  │    └────────────┘    └────────────┘
                  └────────────┘           │                 │
                                          ▼                 ▼
                                    ┌────────────┐    ┌────────────┐
                                    │  Add More  │    │    Test    │
                                    │ Conditions │◀──▶│    Rule    │
                                    └────────────┘    └────────────┘
                                                           │
                                                           ▼
                                    ┌────────────┐    ┌────────────┐
                                    │   Review   │───▶│  Publish   │
                                    │  & Name    │    │  or Save   │
                                    └────────────┘    └────────────┘
```

### 4.2 Editing an Existing Rule

```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│ Rules List │───▶│  Click     │───▶│   Modify   │───▶│    Test    │
│            │    │   Edit     │    │   Rule     │    │  Changes   │
└────────────┘    └────────────┘    └────────────┘    └────────────┘
                                                           │
                                          ┌────────────────┼────────────────┐
                                          ▼                ▼                ▼
                                    ┌────────────┐  ┌────────────┐  ┌────────────┐
                                    │   Save     │  │  Revert    │  │  Publish   │
                                    │   Draft    │  │  Changes   │  │  Changes   │
                                    └────────────┘  └────────────┘  └────────────┘
```

### 4.3 Testing a Rule

```
┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│   Open     │───▶│   Enter    │───▶│  Run Test  │───▶│   View     │
│ Test Panel │    │ Test Data  │    │            │    │  Results   │
└────────────┘    └────────────┘    └────────────┘    └────────────┘
                                                           │
                                          ┌────────────────┼────────────────┐
                                          ▼                ▼                ▼
                                    ┌────────────┐  ┌────────────┐  ┌────────────┐
                                    │   Adjust   │  │   Export   │  │   Save     │
                                    │    Rule    │  │  Results   │  │  to History│
                                    └────────────┘  └────────────┘  └────────────┘
```

---

## 5. Design Rationale

### 5.1 Why Form-Based Builder?

**Decision:** Use form-based builder for primary rule creation.

**Rationale:**
- Familiar pattern for non-technical users
- Lower cognitive load than visual programming
- Faster for simple rules
- Better for accessibility (screen readers)

**Trade-offs Considered:**
- Visual flow builder (rejected: higher learning curve)
- Code editor (rejected: requires technical skills)
- Natural language (considered for V2: AI interpretation)

### 5.2 Why Decision Tree Visualization?

**Decision:** Provide decision tree as secondary view.

**Rationale:**
- Underwriters think in terms of decision flows
- Easier to spot logic errors visually
- Better for stakeholder communication
- Matches industry mental models

**Trade-offs Considered:**
- Flowchart only (rejected: hard to create from scratch)
- Table view only (rejected: poor for nested logic)
- Hybrid approach (chosen: best of both worlds)

### 5.3 Why Inline Testing?

**Decision:** Integrate testing directly in rule builder.

**Rationale:**
- Immediate feedback reduces errors
- Faster iteration cycle
- Builds user confidence
- Reduces production issues

**Trade-offs Considered:**
- Separate test environment (rejected: friction)
- Batch testing only (rejected: less intuitive)

---

## 6. Accessibility Considerations

### 6.1 WCAG 2.1 AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | Minimum 4.5:1 ratio for all text |
| Keyboard Navigation | Full keyboard support with visible focus |
| Screen Readers | ARIA labels on all interactive elements |
| Focus Management | Logical tab order, focus trapping in modals |
| Error Identification | Clear error messages with suggestions |

### 6.2 Assistive Technology Support

- Screen reader announcements for dynamic updates
- Alternative text for visual diagrams
- Keyboard shortcuts for common actions
- High contrast mode support

---

## 7. Scalability Considerations

### 7.1 Handling Many Rules (50+)

- Virtual scrolling in list view
- Folder/category organization
- Advanced search and filtering
- Rule dependencies visualization

### 7.2 Complex Rule Sets

- Rule groups and sub-rules
- Import/export functionality
- Version control and history
- Conflict detection

---

## 8. Design Specifications

### 8.1 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | Inter | 24px | 600 |
| Subheadings | Inter | 18px | 500 |
| Body | Inter | 14px | 400 |
| Labels | Inter | 12px | 500 |
| Code/Values | Fira Code | 14px | 400 |

### 8.2 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #4F46E5 | Buttons, links, active states |
| Success | #10B981 | Approved, valid, success |
| Warning | #F59E0B | Warnings, attention needed |
| Danger | #EF4444 | Declined, errors, delete |
| Neutral | #6B7280 | Secondary text, borders |
| Background | #F9FAFB | Page background |
| Surface | #FFFFFF | Card backgrounds |

### 8.3 Spacing

- Base unit: 4px
- Component padding: 16px (4 units)
- Section spacing: 24px (6 units)
- Page margins: 32px (8 units)

### 8.4 Interactive States

| State | Style |
|-------|-------|
| Hover | Background lightens, cursor changes |
| Focus | 2px blue outline, offset 2px |
| Active | Background darkens slightly |
| Disabled | 50% opacity, no pointer events |
| Loading | Skeleton or spinner |

---

## 9. Implementation Notes

### 9.1 Component Library

Recommend using existing design system or:
- Tailwind CSS for styling
- Headless UI for accessible components
- React Flow for diagram visualization
- React Hook Form for form handling

### 9.2 Key Technical Considerations

1. **State Management:** Use context or Redux for rule builder state
2. **Validation:** Real-time validation on blur and submit
3. **Undo/Redo:** Implement command pattern for builder
4. **Auto-save:** Debounced auto-save to drafts
5. **Responsive:** Mobile-optimized for review, desktop for creation

---

## 10. Assumptions Made

1. Users work primarily on desktop (1920x1080 or higher)
2. Rules are evaluated in priority order (lowest number first)
3. Maximum 10-15 conditions per rule for MVP
4. Users have moderate technical literacy (can use Excel)
5. English language only for MVP
6. Modern browser support (Chrome, Firefox, Safari, Edge)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 2025 | Designer | Initial design documentation |

---

**End of Design Document**
