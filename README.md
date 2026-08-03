# Inventory & Order Management Portal — NovaMart Distributors

A freestyle **SAPUI5** application developed as a Product Inventory & Order Management Portal for **NovaMart Distributors**. The application demonstrates a responsive master-detail user interface using **FlexibleColumnLayout**, allowing users to browse, search, filter, sort, group, add, edit, delete, and manage inventory information.

The application is completely **client-side** and uses a **JSONModel** as its data source. No backend or database is used, making it suitable as a prototype or learning project for SAPUI5 development.

---

# 1. How to Run

1. Open the project in **SAP Business Application Studio (BAS)**.
2. Install project dependencies.

```bash
npm install
```

3. Start the application.

```bash
npm start
```

This launches the application in the SAP Fiori Launchpad sandbox.

4. To run without the Launchpad:

```bash
npm run start-noflp
```

5. To build the project:

```bash
npm run build
```

---

# 2. Project Structure

```text
inventory-portal/
│
├── webapp/
│   ├── Component.js
│   ├── manifest.json
│   ├── index.html
│   │
│   ├── controller/
│   │   ├── App.controller.js
│   │   ├── BaseController.js
│   │   ├── List.controller.js
│   │   ├── Detail.controller.js
│   │   └── NotFound.controller.js
│   │
│   ├── view/
│   │   ├── App.view.xml
│   │   ├── List.view.xml
│   │   ├── Detail.view.xml
│   │   └── NotFound.view.xml
│   │
│   ├── fragment/
│   │   ├── AddEditProduct.fragment.xml
│   │   └── ViewSettings.fragment.xml
│   │
│   ├── model/
│   │   ├── formatter.js
│   │   └── products.json
│   │
│   ├── i18n/
│   │   ├── i18n.properties
│   │   ├── i18n_en.properties
│   │   └── i18n_de.properties
│   │
│   └── css/
│       └── style.css
```

---

# 3. Features

## Product List

- Displays all products in a responsive **sap.m.Table** using a JSONModel.
- Each product displays:
  - Product Name
  - Product ID
  - Category
  - Price
  - Stock Quantity
  - Stock Status
- Live search by Product Name and Category.
- View Settings Dialog supporting:
  - Sort
  - Filter
  - Group
- Live product count displayed in the table header.
- Multi-selection support for deleting products.
- Toolbar actions:
  - Add Product
  - Edit Product
  - Delete Product
  - Sort / Filter / Group

---

## Product Detail

Displays detailed product information including:

- Product Name
- SKU
- Category
- Supplier
- Warehouse
- Description
- Price
- Stock Quantity
- Reorder Threshold
- Last Updated
- Product Image

Users can:

- Edit Product
- Delete Product
- Reorder Stock
- Navigate back to the Product List

---

## Add / Edit Product

A reusable dialog fragment is used for both Add and Edit operations.

Features include:

- Required field validation
- Numeric validation
- ValueState and ValueStateText feedback
- Save and Cancel functionality

Changes are reflected immediately in the JSON model.

---

## Search

- Live search using **SearchField**
- Searches by:
  - Product Name
  - Product Category

---

## Sorting

Products can be sorted by:

- Product Name
- Category
- Price
- Stock Quantity

---

## Filtering

### Category

- Warehouse Equipment
- Packaging
- Safety Gear
- Office Equipment
- Office Supplies
- Tools

### Stock Status

- Available
- Low Stock
- Out of Stock

### Price Range

- Below $100
- $100 – $500
- Above $500

---

## Grouping

Products can be grouped by:

- Category
- Supplier

---

## Stock Status

Stock status is determined using custom formatter functions.

| Stock Quantity | Status | ValueState |
|---------------|--------|------------|
| 0 | Out of Stock | Error |
| 1 – 10 | Low Stock | Warning |
| Greater than 10 | Available | Success |

---

## Responsive Layout

The application uses **sap.f.FlexibleColumnLayout** to provide a responsive master-detail experience.

- One-column layout for the Product List
- Two-column layout when viewing Product Details

---

## Internationalization (i18n)

The application supports multiple languages through Resource Bundles.

Languages included:

- English
- German

Localized content includes:

- Labels
- Buttons
- Tooltips
- Messages
- Dialog Titles
- Validation Messages
- Table Headers
- Filter Labels
- Status Texts

---

## User Feedback

The application uses:

- MessageToast
- MessageBox

to provide feedback for:

- Add
- Edit
- Delete
- Reorder
- Cancel Confirmation
- Validation Errors

---

# 4. SAPUI5 Concepts Covered

| Topic | Status |
|--------|--------|
| MVC Architecture | ✔ |
| Component.js | ✔ |
| manifest.json | ✔ |
| XML Views | ✔ |
| Controllers | ✔ |
| JSON Model | ✔ |
| Resource Model (i18n) | ✔ |
| Property Binding | ✔ |
| Aggregation Binding | ✔ |
| Element Binding | ✔ |
| Expression Binding | ✔ |
| Custom Formatter | ✔ |
| Routing | ✔ |
| Fragments | ✔ |
| FlexibleColumnLayout | ✔ |
| Search | ✔ |
| Sorting | ✔ |
| Filtering | ✔ |
| Grouping | ✔ |
| CRUD Operations | ✔ |
| Responsive Design | ✔ |
| SAP Fiori Controls | ✔ |

---

# 5. Technologies Used

- SAPUI5
- SAP Business Application Studio (BAS)
- SAP Fiori Tools
- JavaScript
- XML Views
- JSON Model
- CSS
- Resource Bundles (i18n)

---

# 6. Known Limitations

- The application uses a local JSON file instead of a backend service.
- Changes made through Add, Edit, Delete, or Reorder exist only during the current session.
- Refreshing the application reloads the original `products.json`.
- Category filter values are based on the predefined sample data.
- No authentication or persistent database is implemented.