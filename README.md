# Mimo - E-commerce Backend

Mimo is a backend application for an e-commerce platform, built using **Node.js**, **Express**, and **MongoDB**. This backend handles key functionalities such as products, orders, users, and payments.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) - Version 14+ recommended
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [npm](https://www.npmjs.com/) - Node.js package manager

## Installation

1. Clone the repository to your local environment:

```bash
git clone https://github.com/DaniOmer/mimo-backend.git
cd mimo-backend
```

2. Install project dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory to configure environment variables. See examples in `.env.example` file.

4. Start the application:

```bash
npm run start
```

## Project Structure

The **Mimo** project is organized by components. Each component represents a core entity or feature of the application, such as products, orders, users, and payments.

```bash
mimo-ecommerce/
├── apps/                    # Application-specific components
│   ├── users/               # Users module
│   │   ├── api/
│   │   │   └── userController.js
│   │   ├── domain/
│   │   │   └── userService.js
│   │   ├── data-access/
│   │       ├── userModel.js
│   │       └── userRepository.js
│   ├── products/            # Products module
│   │   ├── api/
│   │   │   └── productController.js
│   │   ├── domain/
│   │   │   └── productService.js
│   │   ├── data-access/
│   │       ├── productModel.js
│   │       └── productRepository.js
│   └── payments/            # Payments module
│       ├── api/
│       │   └── paymentController.js
│       ├── domain/
│       │   └── paymentService.js
│       ├── data-access/
│           └── paymentModel.js
├── config/                  # Application configuration files
│   ├── db.js                # MongoDB connection configuration
│   └── config.js            # Other global settings
├── docs/                    # Application detailed documentation
│   ├── api_routes.md        # Explained documentation of the API routes
│   └── *.md                 # Other detailed documentation
├── libraries/               # Reusable cross-component features
│   ├── logger/              # Log management
│   │   └── logger.js
│   ├── authenticator/       # Authentication and JWT management
│       └── authMiddleware.js
├── tests/                   # Unit and integration tests
├── .env                     # Environment variables
├── package.json             # Main project dependencies
└── README.md                # Project documentation
```

### Folder Explanations

- **apps/**: Contains the core components of the application. Each component (e.g., orders, users, products) has:
  - **api/**: Handles routes and controllers.
  - **domain/**: Business logic (e.g., rules, calculations, and validations).
  - **data-access/**: Manages database interactions (e.g., models and repositories).
- **libraries/**: Contains shared modules (e.g., logger, authentication) used across multiple components.

- **config/**: Configuration files for database connections and other global settings.

- **tests/**: Contains unit and integration tests for the application.

- **docs/**: Contains details documentation for the application.

## Useful Commands

## Documentation

##### `1. API Routes`

For a detailed explanation of available routes, please refer to the [API Documentation](docs/api_routes.md).

## Contribution

Contributions are welcome! If you find any bugs or have suggestions for improvements, feel free to create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

This README provides a solid foundation for your **Mimo** e-commerce backend. You can modify it as needed for your specific project, especially the `api_routes.md` file, which should contain the detailed routes and usage examples for your API.
