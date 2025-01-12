# Management Dashboard

## Description
The **Management Dashboard** is a web application designed to manage categories and products effectively using CRUD operations. The application features a user-friendly interface to add, update, and delete categories and products, with seamless integration of MySQL as the database and Node.js as the backend. The frontend is built using EJS templates and styled with Bootstrap.

## Features
- **Category Management**:
  - Add new categories.
  - Update existing category details.
  - Delete categories (with validation to ensure products linked to the category are removed first).
- **Product Management**:
  - Add new products linked to specific categories.
  - Update existing product details.
  - Delete products.
- **Pagination**:
  - Product list supports pagination for easy navigation through large datasets.
- **Validation**:
  - Ensures form inputs are correctly handled to prevent errors.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Frontend**: EJS (Embedded JavaScript Templates), Bootstrap
- **Other Tools**: Method-Override for handling PUT and DELETE requests.

## Installation

Follow the steps below to set up the project locally:

1. **Clone the repository**:
   ```bash
   
