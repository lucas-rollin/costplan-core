# Costplan: Budgeting Web Application

## Video Demo: TODO

## Description
Costplan is a web application designed for efficient budgeting of engineering projects. Built with Django, HTML, CSS, and vanilla JavaScript, it enables users to create projects and generate Cost Breakdown Sheets (CBS) based on predefined Cost Compositions. Unlike generic budgeting tools, Costplan specializes in a specific project type. Upon project creation, standard activities are automatically generated, and users only need to adjust quantities, streamlining the budgeting process.

## Distinctiveness and Complexity

### Distinctiveness
Costplan is a web application tailored for budgeting in engineering projects, setting it apart from typical CS50W projects like social media or e-commerce applications. It introduces a domain-specific approach by automating the creation of Cost Breakdown Sheets (CBS) and standard project activities based on predefined compositions. Users can simply adjust quantities rather than manually entering extensive data, streamlining the budgeting process.

Unlike other projects, Costplan emphasizes automation and domain expertise, reducing CRUD operations and focusing on efficient data management. Additionally, the hierarchical structure of data (e.g., CBS and Cost Compositions) reflects real-world complexities unique to engineering projects, making it distinct from more general-purpose applications.

### Complexity
Costplan’s complexity is evident in its backend and frontend design:

1. **Backend**:
   - Utilizes **15 Django models**, some with hierarchical relationships, to model real-world engineering data.
   - Implements automation for project initialization, generating standard activities and cost breakdowns automatically.

2. **Frontend**:
   - The main page operates as a **Single-Page Application (SPA)**, requiring extensive use of AJAX and additional API routes for dynamic content updates.
   - Designed for mobile responsiveness, balancing a rich user interface with compatibility across devices.
   - Includes a sidebar-based layout, adding complexity to responsive design.

Costplan combines backend automation, real-world data modeling, and frontend interactivity to deliver a specialized and sophisticated tool for engineering project budgeting.


## Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Project Structure](#project-structure)
5. [Front End](#front-end)
   - [Templates](#templates)
   - [Javascript Files](#javascript-files)
   - [CSS File](#css-file)
6. [Back End](#back-end)
   - [Models](#models)
   - [URLs and Views](#urls-and-views)

## Features
- **Project Creation:** Name projects and store detailed information.
- **Cost Breakdown Sheet (CBS):** Automatically generate a CBS with standard activities; users only need to input quantities.
- **Cost Compositions:** Define resource requirements for CBS items once and reuse them across projects.
- **Cost Breakdown Templates:** Create templates to adjust quantities for projects in different contexts (e.g., regional variations).
- **Budgeting Difference Income (BDI):** Apply taxes and profit margins using a dedicated BDI table.
- **Social Charges:** Account for labor costs by filling in the Charges table.
- **Resource Models:** Store market prices for materials, labor, and services for accurate cost estimations.
- **Admin Page:** Allow admins to manage all models, including resource prices.
- **Single Page Application:** Enjoy a seamless user experience with dynamic, real-time updates and navigation using AJAX.
- **Mobile Responsiveness:** Access and manage projects on any device.
- **PDF Export:** Generate professional PDF reports of CBS and project information.


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
`python3 -m venv venv`
`source venv/bin/activate`  # For Windows: venv\Scripts\activate

4. Install dependencies
`pip install -r requirements.txt`

5. Run the application:
`python manage.py runserver`

6. Open your browser and navigate to:
`http://127.0.0.1:8000`

## Usage

1. After running the application, navigate to `http://127.0.0.1:8000` in your browser.
2. Register for an account or log in if you already have one.
3. Create a new project, change values for tables and export your CBS as PDF.

## project structure
```
costplan/
├── costplan/                     # Main project folder (Django settings)
│   ├── __init__.py               # Marks this directory as a Python package
│   ├── asgi.py                   # ASGI configuration for async support
│   ├── settings.py               # Main project settings
│   ├── urls.py                   # URL routing for the entire project
│   └── wsgi.py                   # WSGI configuration for deployment
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
│   │   │   └── styles.css        # Main CSS file
│   │   ├── img/                  # Image assets
│   │   └── js/                   # JavaScript files
│   │       ├── main.js           # Handles SPA navigation
│   │       ├── utils.js          # Utility JavaScript functions
│   │       ├── project.js        # Handles project selection page
│   │       ├── report.js         # Handles PDF generation
│   │       └── pages/            # SPA-specific JavaScript files
│   │           ├── bdi.js        # Budgeting Difference Income page logic
│   │           ├── cbs.js        # Cost Breakdown Sheet page logic
│   │           ├── charges.js    # Charges table logic
│   │           ├── costComposition.js  # Cost Composition page logic
│   │           ├── costCompositionAll.js  # Global Cost Compositions logic
│   │           └── registration.js  # Project Registration page logic
│   ├── templates/                # HTML templates for the app
│   │   ├── index.html            # SPA base template
│   │   ├── layout.html           # Base layout template
│   │   ├── login.html            # Login page template
│   │   ├── register.html         # Registration page template
│   │   ├── project.html          # Project selection page
│   │   └── report.html           # PDF generation template
└── manage.py                     # Command-line utility for Django
```

## Front End

### Overview
The front-end of Costplan is designed to provide a seamless and responsive user experience. Built with a combination of Django templates, vanilla JavaScript, and a custom CSS file, the application ensures consistent styling and functionality across devices. Bootstrap is utilized to expedite development and maintain a clean, modern interface, while custom JavaScript and CSS files enhance interactivity and responsiveness.

### Templates
Templates are used to render HTML pages in the web application. Below is an overview of each template:

- **index.html**  
  The main template for the Single Page Application (SPA). It serves as the core structure for displaying all project-related information. The page includes a header section, a sidebar for navigation within the SPA, and a main section with unique `<div>` containers for each page. It lazily loads the required JavaScript and provides links to the project selection page and the logout function.

- **layout.html**  
  The base layout template for all pages. It includes common styles and scripts used across the application. Other templates extend this file to ensure consistency in design and functionality.

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
A collection of utility functions used throughout the app. Functions include retrieving CSRF tokens for AJAX requests and converting numbers to Brazilian formats, among others.

- **project.js**
Handles project selection and management. This file enables project creation via AJAX and updates the project list dynamically. It also attaches event listeners to buttons for generating PDF reports, redirecting users to the report template.

- **report.js**
Facilitates PDF generation for the CBS report. It uses the same method for constructing the CBS table as the CBS page, fetching data via an AJAX request to `/api/get_cbs`. After PDF generation or cancellation, the page redirects users back to the SPA or the project selection page.

#### Page-Specific JavaScript Files
- **bdi.js** 
Manages the Budgeting Difference Income (BDI) page, where users input taxes, profit margins, and related values. Event listeners dynamically calculate totals and subtotals as users fill in the fields. A "Save" button sends a PUT request via AJAX to `/update_bdi`.

- **cbs.js**
Handles the Cost Breakdown Sheet (CBS) page, allowing users to view and edit project cost details. Users can enter quantities and see calculated total costs. Event listeners are added for saving updates via a PUT request to `/update_cbs` and for opening related cost composition sheets.

- **charges.js**
Manages the social charges page, where users input labor-related charges, such as taxes. Like bdi.js, it dynamically calculates totals and subtotals and sends updates via a PUT request to `/update_charges`.

- **costComposition.js**
Handles the Cost Composition page, where users manage resources for each CBS item. Users search for a specific template and cost composition using a form, triggering an AJAX GET request to `/api/cost_composition` with relevant parameters. The page also allows users to create templates through a pop-up form, sending a POST request to `/template`. If a template is user-created (not public), input fields appear for resource quantities, which can be saved via a "Save" button.

- **costCompositionAll.js**
Manages the Cost Composition All page, which provides a broader view of all cost compositions with pagination for displaying 10 items per page. It retrieves data using an AJAX GET request to `/api/cost_composition_all`.

- **registration.js**
Handles project editing and CBS template selection. Users can update project details via a form, submitting a PUT request to `/update_project` using AJAX.

### CSS File

Includes the styles.css file. The app uses Bootstrap whenever possible for simplification while styles.css adds personalized styles as well as media queries for responsiveness such as reduce padding and letter size for smaller screens or turn the sidebar into a bottom navbar. 

### CSS File
The app includes a custom `styles.css` file to complement Bootstrap. This file provides personalized styles and media queries for responsiveness. Below are its key features, grouped by functionality:

- **Global Styling:**
  - Customizes font sizes, colors, and paddings to ensure uniformity across pages.
  - Defines consistent margins and spacing for elements not covered by Bootstrap.

- **Responsive Design:**
  - Introduces media queries to optimize layouts for various screen sizes.
  - Adjusts padding, font sizes, and visibility of certain elements for smaller screens.
  - Converts the sidebar into a bottom navbar for devices with limited screen width.

## Back End

The back end of the application manages the database models, API endpoints, and business logic that powers the front end. It supports core functionalities such as user authentication, project management, cost composition, and reporting.

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
- **Description**: Represents a project in the application. Each project includes cost breakdown sheets (CBS), budget difference income (BDI), charges, and associated resources.  
- **Fields**:  
  - `user`, `notice`, `name`, `type`, `date`, `execution_regime`, `requesting_area`, `contract_term`, `execution_term`, `mobilization_term`, `template`.  
- **Relationships**:  
  - Many-to-one with `User` (a user can have multiple projects).  
  - Many-to-one with `CostBreakdownTemplate`.  
  - Many-to-many with `CBS` through `ProjectCostBreakdown`.  
  - Many-to-many with `BDI` through `ProjectBDI`.  
  - Many-to-many with `Charge` through `ProjectCharge`.  
- **Methods**:  
  - `generate_cost_breakdown`, `generate_bdi`, `generate_charge`.

---

#### BDI and Charge Entities

##### BudgetDifferenceIncome (BDI)
- **Description**: Represents budget difference income items, grouped into hierarchical categories.
- **Fields**:  
  - `id`, `category`, `description`, `default_rate`.  
- **Relationships**:  
  - Many-to-many with `Project` through `ProjectBDI`.

---

##### Charge
- **Description**: Represents social charges applied to labor, with a structure similar to BDI.  
- **Fields**:  
  - `id`, `category`, `description`, `default_rate`.  
- **Relationships**:  
  - Many-to-many with `Project` through `ProjectCharge`.

---

##### ProjectBDI / ProjectCharge
- **Description**: Stores project-specific rates for BDI and Charge items.  
- **Fields**:  
  - `project`, `bdi_item`, `rate` (for `ProjectBDI`).  
  - `project`, `charge_item`, `rate` (for `ProjectCharge`).  
- **Relationships**:  
  - Many-to-one with `Project`.  
  - Many-to-one with `BDI` / `Charge`.

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
- **Description**: Represents resources (e.g., materials, labor, services) with a hierarchical parent-child structure.  
- **Fields**:  
  - `id`, `name`, `unit`, `resource_type`, `parent`, `is_leaf`.  
- **Methods**:  
  - `get_cost`: Calculates resource cost based on its type.

##### Material / Labor / Service (Inherit from Resource)
- **Material**: Includes a `cost` field and `get_cost` method to return the material cost.  
- **Labor**: Includes `base_cost`, `type`, and `dangerousness` fields. Adjusts cost based on social charges.  
- **Service**: Includes a `cost` field and `get_cost` method to return the service cost.

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

---

#### Budget Difference Income (BDI) Management
- **`/update_bdi`**: Edits project-specific BDI rates.  
- **`/api/get_bdi`**: Fetches BDI data.

---

#### Charge Management
- **`/update_charges`**: Edits project-specific charge rates.  
- **`/api/get_charges`**: Fetches charge data.

---

#### Reports
- **`/pdf/report/<int:project_id>`**: Generates a PDF report for a given project.

---

### Utilities

#### `utils.py`
The `utils.py` file provides a reusable function handle complex calculations and data formatting for API responses.

##### `build_cost_composition_data(cost_compositions, project_cost_breakdown, bdi)`

- **Purpose**:  
  Converts `CostComposition` data into a JSON-serializable format. The output includes resource details, total costs, and header information about the project.

- **Parameters**:  
  - `cost_compositions` (`QuerySet`): A Django QuerySet of `CostComposition` objects to be serialized.  
  - `project_cost_breakdown` (`ProjectCostBreakdown`): Represents the project's cost breakdown structure.  
  - `bdi` (`Decimal`): The aggregate value of the `ProjectBDI` rate applied to the project.  

- **Returns**:  
  A dictionary structured as follows:  
  - **Header**: Metadata about the `ProjectCostBreakdown` and total costs.  
  - **Resources**: Details about each resource in the cost composition, including quantities and individual costs.

- **Usage**:  
  This function powers the following endpoints:  
  - `/api/cost_composition`: Retrieves a single cost composition.  
  - `/api/cost_composition_all`: Provides paginated data for multiple cost compositions.

