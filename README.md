# Mimo - E-commerce Backend

Mimo is a backend application for an e-commerce platform, built using **Node.js**, **Express**, and **MongoDB**. This backend handles key functionalities such as products, orders, users, and payments.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) - Version 20+ recommended
- [Typescript.js](https://www.typescriptlang.org/) - Version 5+ recommended
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

4. Build the development environment database

```bash
docker compose -f compose.dev.yaml build
```

6. Start the development environment database

````bash
docker compose -f compose.dev.yaml up -d

7. Start the application:

```bash
npm run start
````

## Project Structure

The **Mimo** project is organized by components. Each component represents a core entity or feature of the application, such as products, orders, users, and payments.

```bash
mimo-backend/
├── dist/                    # Contains the compiled JavaScript code
│   ├── apps/                # Compiled application-specific modules
│   ├── config/              # Compiled configuration files
│   ├── libraries/           # Compiled reusable libraries
│   ├── index.js             # Compiled application entry point
│   └── ...                  # Other compiled files
├── src/                     # Main source code (TypeScript)
│   ├── apps/                # Application-specific modules
│   │   ├── users/           # Users module
│   │   │   ├── api/         # Routes and controllers
│   │   │   │   ├── routes.ts
│   │   │   │   └── userController.ts
│   │   │   ├── domain/      # Business logic for users
│   │   │   │   └── userService.ts
│   │   │   ├── data-access/ # Data access (models, repositories)
│   │   │       ├── userModel.ts
│   │   │       └── userRepository.ts
│   │   ├── products/        # Products module
│   │   │   ├── api/
│   │   │   │   └── productController.ts
│   │   │   ├── domain/
│   │   │   │   └── productService.ts
│   │   │   ├── data-access/
│   │   │       ├── productModel.ts
│   │   │       └── productRepository.ts
│   │   ├── payments/        # Payments module
│   │       ├── api/
│   │       │   └── paymentController.ts
│   │       ├── domain/
│   │       │   └── paymentService.ts
│   │       ├── data-access/
│   │           └── paymentModel.ts
│   ├── config/              # Configuration files
│   │   ├── db.ts            # MongoDB connection configuration
│   │   └── config.ts        # Other global settings
│   ├── libraries/           # Reusable cross-component libraries
│   │   ├── logger/          # Log management
│   │   │   └── logger.ts
│   │   ├── authenticator/   # Authentication and JWT management
│   │       └── authMiddleware.ts
│   ├── tests/               # Unit and integration tests
│   ├── index.ts             # Application entry point
│   ├── .env                 # Environment variables
│   └── README.md            # Project documentation
├── docs/                    # Detailed project documentation
│   ├── api_routes.md        # API route documentation
│   └── *.md                 # Other detailed documentation
├── .gitignore               # Git ignore file for untracked files
├── package.json             # Main project dependencies and scripts
└── tsconfig.json            # TypeScript configuration

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
