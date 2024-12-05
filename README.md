# Costplan: Budgeting Web Application

## Description

Costplan is a web application designed for efficient budgeting of civil engineering projects. Built with Django, HTML, Sass, and vanilla JavaScript, it enables users to create projects and generate Cost Breakdown Sheets (CBS) based on predefined Cost Compositions. Unlike generic budgeting tools, Costplan specializes in a specific project type. Upon project creation, standard activities are automatically generated, and users only need to adjust quantities, streamlining the budgeting process.

## Table of Contents

1. [Features](#features)
2. [Distinctiveness and Complexity](#distinctiveness-and-complexity)
3. [Installation](#installation)
4. [How to run the application](#how-to-run-the-application)
5. [Project Structure](#project-structure)
6. [Front End](#front-end)
   - [Templates](#templates)
   - [Javascript Files](#javascript-files)
   - [Sass and CSS Files](#sass-and-css-files)
7. [Back End](#back-end)
   - [Models](#models)
   - [URLs and Views](#urls-and-views)
   - [Utilities](#utilities)
   - [Admin Page](#admin-page)

## Features

- **Project Creation:** Name projects and store detailed information.
- **Cost Breakdown Sheet (CBS):** Automatically generate a CBS with standard activities; users only need to input quantities.
- **Cost Compositions:** Define resource requirements for CBS items once and reuse them across projects.
- **Cost Breakdown Templates:** Create templates to adjust quantities for projects in different contexts (e.g., regional variations).
- **Budgeting Difference Income (BDI):** Apply taxes and profit margins using a dedicated BDI table.
- **Resource Models:** Store market prices for materials, labor, and services for accurate cost estimations.
- **Admin Page:** Allow admins to manage all models, including resource prices.
- **Single Page Application (SPA):** Enjoy a seamless user experience with dynamic, real-time updates and navigation using AJAX.
- **Mobile Responsiveness:** Access and manage projects on any device.
- **PDF Export:** Generate professional PDF reports of CBS and project information.

## Distinctiveness and Complexity

### Distinctiveness

Costplan is a web application designed specifically for budgeting in civil engineering projects, offering a unique focus compared to CS50W projects like social media platforms or e-commerce sites. It stands out by automating the creation of project activities based on a predefined Cost Breakdown Sheet (CBS). This approach reduces manual data entry, allowing users to simply adjust quantities, which streamlines the budgeting process.

### Complexity

Costplan demonstrates complexity through its backend architecture and dynamic frontend features:

1. **Backend**:

   - Utilizes **10 Django models**, including hierarchical relationships, to represent real-world engineering data.
   - Automates project setup by generating standard activities automatically during creation.
2. **Frontend**:

   - Features a **Single-Page Application (SPA)**, requiring extensive use of AJAX and additional API routes for dynamic content updates.
   - Implements real-time calculations for totals based on user input.
   - Includes a sidebar-based layout, adding complexity to responsive design.

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Steps

1. Clone the repository:

```bash
git clone https://github.com/Harddus0/costplan.git
```

2. Navigate to the project directory:
   `cd costplan`
3. Create virtual enviroment:

```bash
python3 -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
```

4. Install dependencies

```bash
pip install -r requirements.txt
```

## How to run the application

1. Run the application:
   `python manage.py runserver`
2. Open your browser and navigate to:
   `http://127.0.0.1:8000`
3. Perform these steps:

   - Register or log in.
   - Create a new project inside `/project` and open it.
   - Modify quantities in the tables and export the CBS as a PDF.
   - (Optional) Customize the database through the admin page.
4. Admin page (optional).

   - Create a superuser:
     `python manage.py createsuperuser`.
   - Open the admin page at `http://127.0.0.1:8000/admin` and modify models as needed.

## project structure

```
costplan/
├── costplan/                     # Main project folder (Django settings)
├── budgeting/                    # Core application folder
│   ├── __init__.py               # Marks this directory as a Python package
│   ├── admin.py                  # Admin site configuration
│   ├── apps.py                   # App-specific configuration
│   ├── models.py                 # Database models for the application
│   ├── tests.py                  # Test cases for the application
│   ├── urls.py                   # URL routing specific to this app
│   ├── views.py                  # View functions handling logic and rendering
│   ├── utils.py                  # Utility functions for the app
│   ├── static/                   # Static assets (CSS, JS, Images)
│   │   ├── css/                  # Stylesheets
│   │   │   ├── styles.scss       # Main Sass file (compiled into styles.css)
│   │   │   └── styles.css        # Compiled CSS file
│   │   ├── img/                  # Image assets
│   │   └── js/                   # JavaScript files
│   │       ├── main.js           # Handles SPA navigation
│   │       ├── utils.js          # Utility JavaScript functions
│   │       ├── project.js        # Handles project selection page
│   │       ├── report.js         # Handles PDF generation
│   │       └── pages/            # SPA-specific JavaScript files
│   │           ├── bdi.js                 # Budgeting Difference Income page logic
│   │           ├── cbs.js                 # Cost Breakdown Sheet page logic
│   │           ├── costComposition.js     # Cost Composition page logic
│   │           ├── costCompositionAll.js  # Global Cost Compositions logic
│   │           ├── registration.js        # Project Registration page logic
│   │           └── resource.js            # Resource page logic
│   └── templates/                # HTML templates for the app
│       ├── index.html            # SPA base template
│       ├── layout.html           # Base layout template
│       ├── login.html            # Login page template
│       ├── register.html         # Registration page template
│       ├── project.html          # Project selection page
│       └── report.html           # PDF generation template
└── manage.py                     # Command-line utility for Django
```

## Front End

### Overview

The front-end of Costplan is designed to provide a seamless and responsive user experience. Built with a combination of Django templates, vanilla JavaScript, and Sass, the application ensures consistent styling and functionality across devices.

### Templates

Templates are used to render HTML pages in the web application. Below is an overview of each template:

- **index.html**The main template for the Single Page Application (SPA). It serves as the core structure for displaying all project-related information. The page includes a header section, a sidebar for navigation within the SPA, and a main section with unique `<div>` containers for each page. It lazily loads the required JavaScript and provides links to the project selection page and the logout function.
- **layout.html**The foundational template for the web application. It provides a shared structure that ensures consistency across all pages. The `layout.html` template includes:

  - **Header**: links to common stylesheets and resources, including **Bootstrap**, the compiled stylesheet (`styles.css`), a block for page-specific styles (`{% block style %}`), **Font Awesome** and favicon.
  - **Body**:  Provides the main container for the page content. This section includes a block (`{% block body %}`) where child templates define their specific content.
  - **Footer**: Includes a block (`{% block script %}`) for page-specific JavaScript scripts, allowing child templates to add custom functionality as needed.
  - **Extensibility**: Other templates inherit from `layout.html`, leveraging its consistent design while adding their unique elements where necessary.
- **login.html**
  The login page template. It renders the form for user authentication and redirects users to the project selection page upon successful login.
- **register.html**
  The registration page template. It allows new users to create an account, validates input, and displays error messages if the registration process fails.
- **project.html**
  This template displays a list of the user's projects and provides an interface for project creation. Upon clicking the "New Project" button, a project creation form appears in a pop-up. The project list shows each project's name and includes buttons to generate a PDF report or view the project, opening the SPA with the selected project loaded.
- **report.html**
  This template generates a printable PDF report for the project's Cost Breakdown Sheet (CBS). It is optimized for the browser's built-in print functionality, eliminating the need for external libraries. This template also includes a styles tag responsible for formatting the print layout.

### JavaScript Files

The JavaScript files handle client-side logic and enhance user interactions. Below is an explanation of each file's function:

- **main.js**
  Manages SPA navigation and overall functionality. It listens for URL hash changes to dynamically load sections of the application without full page reloads. Additionally, it manages sidebar interactions, such as highlighting the selected page and ensuring submenu functionality.
- **utils.js**
  A collection of utility functions used throughout the app. Functions include retrieving CSRF tokens for AJAX requests, converting numbers to Brazilian formats and functions that are used by more than one file.
- **project.js**
  Handles project selection and management. This file enables project creation via AJAX and updates the project list dynamically. It also attaches event listeners to buttons for generating PDF reports, redirecting users to the report template.
- **report.js**
  Facilitates PDF generation for the CBS report.

  - Reuses the same table-construction methods as the CBS and Resource pages by importing utility functions from `utils.js`.
  - Fetches data via API routes to build the CBS and Resource tables dynamically.
  - Most functions are asynchronous (`async`) to ensure the tables are fully constructed before calling `window.print()`.
  - Includes logic to handle redirection after PDF generation or cancellation, returning users to the SPA or project selection page.

#### Page-Specific JavaScript Files

- **bdi.js**
  Manages the Budgeting Difference Income (BDI) page, where users input taxes, profit margins, and related values. Event listeners dynamically calculate totals and subtotals as users fill in the fields. A "Save" button sends a PUT request via AJAX to `/update_bdi`.
- **cbs.js**
  Handles the Cost Breakdown Sheet (CBS) page, allowing users to view and edit project cost details. Users can enter quantities and see calculated total costs. Event listeners are added for saving updates via a PUT request to `/update_cbs` and for opening related cost composition sheets.
- **costComposition.js**
  Handles the Cost Composition page, where users manage resources for each CBS item. Users search for a specific template and cost composition using a form, triggering an AJAX GET request to `/api/cost_composition` with relevant parameters. The page also allows users to create templates through a pop-up form, sending a POST request to `/template`. If a template is user-created (not public), input fields appear for resource quantities, which can be saved via a "Save" button.
- **costCompositionAll.js**
  Manages the Cost Composition All page, which provides a broader view of all cost compositions with pagination for displaying 10 items per page. It retrieves data using an AJAX GET request to `/api/cost_composition_all`.
- **registration.js**
  Handles project editing and CBS template selection. Users can update project details via a form, submitting a PUT request to `/update_project` using AJAX.
- **resource.js**
  Manages the Resource page, where all resources used in the project can be seen. It retrieves data using an AJAX GET request to `/api/get_project_resource`.

### Sass and CSS Files

The app includes a custom `styles.scss` file, which is compiled into a `styles.css` file. The `styles.css.map` file is generated for debugging purposes. The `styles.scss` file provides personalized styles and media queries for responsiveness, while the compiled `styles.css` is used in the final application. Below are the key features of the Sass file and its compiled output, grouped by functionality:

- **Global Styling:**
  - Customizes font sizes, colors, and paddings to ensure uniformity across pages.
  - Defines consistent margins and spacing for elements not covered by Bootstrap.

- **Responsive Design:**
  - Introduces media queries to optimize layouts for various screen sizes.
  - Adjusts padding and font sizes of certain elements for smaller screens.
  - Converts the sidebar into a bottom navbar for devices with limited screen width.

## Back End

The back end of the application manages the database models, API endpoints, and business logic that powers the front end. It supports core functionalities such as user authentication, project management, cost calculations and the admin page.

---

### Models

The data models are structured to represent key entities and relationships in the system. Below are the primary models, grouped by their purpose:

#### Core Entities

##### User

- **Description**: Represents the user. Inherits from Django's `AbstractUser` class and includes all default fields.
- **Relationships**:
  - None (users manage their own projects and templates).

---

##### Project

- **Description**: Represents a project in the application. Each project includes cost breakdown sheets (CBS), budget difference income (BDI) and associated resources.
- **Fields**:
  - `user`, `code`, `name`, `date`, `description`, `location`, `template`.
- **Relationships**:
  - Many-to-one with `User` (a user can have multiple projects).
  - Many-to-one with `CostBreakdownTemplate`.
  - Many-to-many with `CBS` through `ProjectCostBreakdown`.
  - Many-to-many with `BDI` through `ProjectBDI`.
- **Methods**:
  - `generate_cost_breakdown`, `generate_bdi`.

---

#### BDI Entity

##### BudgetDifferenceIncome (BDI)

- **Description**: Represents budget difference income items, grouped into hierarchical categories.
- **Fields**:
  - `id`, `category`, `description`, `default_rate`.
- **Relationships**:
  - Many-to-many with `Project` through `ProjectBDI`.

---

##### ProjectBDI

- **Description**: Stores project-specific rates for BDI items.
- **Fields**:
  - `project`, `bdi_item`, `rate`.
- **Relationships**:
  - Many-to-one with `Project`.
  - Many-to-one with `BDI`.

---

#### Cost Breakdown Management

##### CostBreakdownTemplate

- **Description**: Defines templates for cost breakdown sheets (CBS). Can be user-specific or public.
- **Fields**:
  - `name`, `description`, `created_at`, `user`.
- **Relationships**:
  - Many-to-one with `User`.
- **Methods**:
  - `get_visible_templates`: Retrieves visible templates for a user.

---

##### CostBreakdownSheet (CBS)

- **Description**: Represents hierarchical cost breakdowns for projects.
- **Fields**:
  - `id`, `name`, `unit`, `parent`, `is_leaf`, `resources`.
- **Relationships**:
  - Many-to-one with `Project`.
  - Many-to-many with `Resource` through `CostComposition`.
- **Methods**:
  - `unit_cost`: Calculates the total cost or aggregates costs from child items.

---

##### CostComposition

- **Description**: Defines the resource requirements for CBS items, linking reusable resources with templates.
- **Fields**:
  - `item`, `resource`, `template`, `quantity`.
- **Relationships**:
  - Many-to-one with `Resource`.
  - Many-to-one with `CostBreakdownTemplate`.
- **Methods**:
  - `total_cost`: Calculates the total cost for a resource in a composition.

---

#### Resource Management

##### Resource

- **Description**: Represents resources (e.g., materials, labor, equipment) with a hierarchical parent-child structure.
- **Fields**:
  - `id`, `name`, `unit`, `cost`.

---

### URLs and Views

#### Authentication

- **`/login`**: Handles user login.
- **`/logout`**: Logs out the user.
- **`/register`**: Handles user registration.

---

#### Project Management

- **`/project`**: Allows project selection or creation.
- **`/update_project`**: Updates project details.
- **`/`**: Index page. Loads or sets the active project in the session.

---

#### Cost Breakdown Management

- **`/template`**: Creates new templates.
- **`/update_cbs`**: Updates quantities in `ProjectCostBreakdown`.
- **`/api/get_cbs`**: Fetches CBS data for display.
- **`/update_composition/<int:template_id>/<str:composition_id>`**: Edits cost composition entries.
- **`/api/cost_composition`**: Fetches detailed data for a single cost composition.
- **`/api/cost_composition_all`**: Provides paginated data for multiple cost compositions.
- **`/api/get_project_resource`**: Fetches resource data with total quantities and cost.

---

#### Budget Difference Income (BDI) Management

- **`/update_bdi`**: Edits project-specific BDI rates.
- **`/api/get_bdi`**: Fetches BDI data.

---

#### Reports

- **`/pdf/report/<int:project_id>`**: Generates a PDF report for a given project.

---

### Utilities

#### `utils.py`

The `utils.py` file provides a reusable function handle complex calculations and data formatting for API responses.

##### `build_cost_composition_data(cost_compositions, project_cost_breakdown, bdi)`

- **Purpose**:Converts `CostComposition` data into a JSON-serializable format. The output includes resource details, total costs, and header information about the project.
- **Parameters**:

  - `cost_compositions` (`QuerySet`): A Django QuerySet of `CostComposition` objects to be serialized.
  - `project_cost_breakdown` (`ProjectCostBreakdown`): Represents the project's cost breakdown structure.
  - `bdi` (`Decimal`): The aggregate value of the `ProjectBDI` rate applied to the project.
- **Returns**:A dictionary structured as follows:

  - **Header**: Metadata about the `ProjectCostBreakdown` and total costs.
  - **Resources**: Details about each resource in the cost composition, including quantities and individual costs.
- **Usage**:This function powers the following endpoints:

  - `/api/cost_composition`: Retrieves a single cost composition.
  - `/api/cost_composition_all`: Provides paginated data for multiple cost compositions.

### Admin Page

The admin page provides superusers with comprehensive access to manage all models in the application. Each model is displayed in a table format, and many include a search bar for efficient navigation. Special restrictions are implemented for specific models to preserve critical structures or ensure proper functionality.

#### Special Restrictions

1. BudgetDifferenceIncome

- This model has a fixed structure where each object's primary key (id) determines its position in a hierarchy. Because of this the primary key can only be seen and no objects can be created or deleted. The remaining fields can be edited.

2. CostBreakdownTemplate

- The first object in this model serves as the standard template and is integral to the application's functionality, thus it can't be altered in any way.
