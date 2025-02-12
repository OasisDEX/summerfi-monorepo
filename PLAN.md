# SUMR Token Bridging Feature – Implementation Plan

This document outlines the plan to create a bridging UI that allows users to bridge the SUMR token between chains. The plan covers changes in three main areas:

- **@earn-protocol** (the Next.js application)
- **@app-earn-ui** (UI components and design system)
- **@sdk** (the core SDK functionality)

---

## 1. Overview & Objectives

- **Goal:**  
  Build an independent view for bridging the SUMR token between chains.  
  Users should be able to:
  - Select source and destination chains.
  - Input an amount of SUMR to bridge.
  - Receive fee estimates and information about the bridging transaction.
  - Initiate the bridging transaction via a backend API handler that in turn calls SDK functions.

- **Key Areas:**  
  - **UI (Frontend):**  
    Develop a bridging page that is visually consistent with the existing design and leverages existing UI components.
  - **Server Handlers (Backend):**  
    Create new API endpoints in the earn-protocol server-handlers directory to forward bridging requests.
  - **SDK (Business Logic):**  
    Build new bridging functionalities to handle bridging fee estimation, transaction initialization, and status retrieval.

---

## 2. Architectural Overview

- **Frontend (Earn Protocol App):**
  - Create a new route (for example, `/bridge`) under the `apps/earn-protocol/app` directory.
  - The bridging page will render a form/UI that includes:
    - Chain selector dropdowns for "Transfer from" and "Transfer to" with chain icons
    - A token selector (pre-set to SUMR) with token icon
    - Balance display showing available amount in USDC
    - Quick action buttons for amount selection (25%, 50%, Max)
    - Amount input with USD value display
    - Collapsible "Important info" section
    - Primary "Bridge" button and secondary "Cancel" button
  - Dark theme UI with rounded corners and consistent spacing
  - Page will communicate with new API endpoints (e.g., `/api/bridge`) using fetch calls.

- **UI Components (@app-earn-ui):**
  - Create (or extend) UI components for bridging use cases:
    - **ChainSelector:** Dropdown with chain icon and name
    - **TokenSelector:** Dropdown with token icon and symbol
    - **AmountInput:** Numeric input with USD conversion
    - **QuickActionButtons:** Button group for percentage selections
    - **InfoAccordion:** Collapsible section for important information
    - **BridgeForm:** Container component that composes all the above
  - Add new styling matching the dark theme shown in the design

- **SDK (@sdk):**
  - Build or extend existing modules to support:
    - **Estimation Function:** Compute expected fees and bridging parameters for the SUMR token bridging.
    - **Transaction Function:** Initiate the bridging transaction by interacting with the appropriate bridging smart contract or gateway.
    - **Status Function:** Retrieve and relay the status (pending, confirmed, failed) of bridging transactions.
  - These functions should be callable from server-handlers in the earn-protocol app.

---

## 3. Detailed Steps

### 3.1. Frontend – Create Bridging View in @earn-protocol

- **Route Setup:**  
  Create a new file for the bridging page, for example:  
  `apps/earn-protocol/app/bridge/page.tsx`  
  This page will:
  - Receive user inputs for source chain, destination chain, and the amount.
  - Call the appropriate API endpoints once the "Bridge" button is clicked.
  - Optionally, display bridging status (e.g., via polling or web sockets).

- **UI Integration:**  
  Import and use the new **BridgeForm** component from the @app-earn-ui package for consistent styling.

### 3.2. UI Components – Extend @app-earn-ui

- **Create Individual Components:**
  - **ChainSelector Component:**
    - Props: selectedChain, availableChains, onSelect
    - Shows chain icon and name in a dropdown
    - Styled as a dark button with hover states
  
  - **TokenSelector Component:**
    - Props: selectedToken, balance, onSelect (if needed)
    - Shows token icon and symbol
    - Displays available balance
    
  - **AmountInput Component:**
    - Props: amount, maxAmount, onAmountChange
    - Numeric input with USD conversion display
    - Integration with QuickActionButtons
    
  - **QuickActionButtons Component:**
    - Props: onPercentageSelect, selectedPercentage
    - Buttons for 25%, 50%, and Max
    - Highlight selected percentage
    
  - **InfoAccordion Component:**
    - Props: items (array of info items)
    - Collapsible section with arrow indicator
    - Each item shows label and value

- **Compose BridgeForm Component:**
  - Arrange all components according to the design
  - Handle state management and validation
  - Implement responsive layout
  - Add proper spacing and alignment

### 3.3. Server Handlers – Bridge API endpoints in @earn-protocol

- **Create API Routes:**  
  In `apps/earn-protocol/app/api`, create a new directory for bridging:
  - Example file: `apps/earn-protocol/app/api/bridge/route.ts`
  - **Endpoints to implement:**
    - **GET:** (Optional) For retrieving current fee estimates or bridge status.
    - **POST:** To initiate the bridging transaction.
  - **Handler Logic:**
    - Validate request inputs (source chain, destination chain, amount).
    - Call the corresponding SDK function (e.g., `initiateBridge`).
    - Return transaction details or error messages as JSON.

- **Integrate in Server Handlers Directory:**  
  Follow the patterns seen in existing files (e.g., `/app/api/rpc/...`, `/app/api/forecast/...`) to ensure consistency with revalidation times and error handling.

### 3.4. SDK Changes – Bridging Functionality in @sdk

- **New Bridging Module:**  
  - **Location:** Create a new directory or file such as `sdk/bridge` (or integrate into existing bridging modules if available).
  - **Functions to Implement:**
    - `estimateBridgeFee`: Given parameters (token, amount, source chain, destination chain), returns fee estimates.
    - `initiateBridge`: Accepts the bridging parameters and returns a bridging transaction payload or transaction hash.
    - `getBridgeStatus`: Retrieves the bridging status for a given transaction.
  - **Integration:**  
    These functions will be called by server-handlers – ensure that they can run in a Node.js environment (using libraries like viem if needed or direct smart contract calls).

- **Configuration & Environment Variables:**  
  - Consider setting new environment variables (if required) for bridging gateway URLs, API keys, or smart contract addresses.
  - Update SDK documentation with instructions on bridging integration.

---

## 4. Testing & Quality Assurance

- **Unit Tests:**  
  - Write tests for the SDK bridging functions.
  - Write component tests for the UI (BridgeForm) using existing testing utilities from @summerfi/testing-utils (if available).
- **Integration Tests:**  
  - Test API endpoints with Postman or integration test frameworks within the earn-protocol environment.
  - Verify that bridging requests correctly trigger SDK functions and return expected results.
- **User Experience (UX):**  
  - Perform manual end-to-end testing in a staging environment.
  - Validate error handling (e.g., when input is invalid or the bridging endpoint fails).

---

## 5. Timeline & Next Steps

1. **Design Phase (Frontend & UI):**
   - Sketch/Design the bridging form view.
   - Identify reusable components from @app-earn-ui.
2. **Development Phase:**
   - Implement the bridging view in the earn-protocol app.
   - Develop the new BridgeForm component within the `/apps/earn-protocol/features/bridge` folder.
     - This component is now structured similarly to other features (e.g., claim-and-delegate) using a dedicated components subfolder and an index file for exports.
   - Build the API endpoints (server-handlers) and SDK bridging functions.
3. **Testing & QA:**
   - Write unit tests for UI and SDK changes.
   - Perform integration tests (local & staging) and gather feedback.
4. **Documentation & Deployment:**
   - Update documentation for end users and developers.
   - Merge and deploy the changes.

---

## 6. Summary

This plan leverages existing infrastructure in the earn-protocol, app-earn-ui, and SDK projects to introduce bridging functionality for the SUMR token. It emphasizes consistency with current code conventions (e.g., eslint, Next.js routes, and styling) and reuses common components as much as possible.

**Next Steps:**  
- Finalize UI design mockups.  
- Create PRs for each repository, starting with the SDK module followed by server-handlers and finally the UI components and bridging view.

---

*End of Bridging Feature Implementation Plan* 