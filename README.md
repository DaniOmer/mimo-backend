# Mimo - E-commerce Backend

Mimo is a backend application for an e-commerce platform, built using **Node.js**, **Express**, and **MongoDB**. This backend handles key functionalities such as products, orders, users, and payments.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) - Version 20+ recommended
- [TypeScript](https://www.typescriptlang.org/) - Version 5+ recommended
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

3. Create a `.env` file in the root directory to configure environment variables. See examples in the `.env.example` file.

4. Build the development environment database:

```bash
docker compose -f compose.yaml build
```

5. Start the development environment database:

```bash
docker compose -f compose.yaml up -d
```

6. Start the application:

```bash
npm run start
```

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

## Testing

Testing is an essential part of the development process to ensure code quality, functionality, and stability. This project uses **Jest** as the testing framework and **ts-jest** for TypeScript support.

### Types of Tests

1. **Unit Tests**:  
   Test individual functions or methods in isolation to ensure they work as expected. Unit tests are located in files with the `.unit.test.ts` suffix.

2. **Integration Tests**:  
   Test the interaction between multiple modules or components, such as API endpoints or database queries. Integration tests are located in files with the `.integration.test.ts` suffix.

### Running Tests

- To run **all tests** (unit and integration):

  ```bash
  npm run test:all
  ```

- To run **unit tests** only:

  ```bash
  npm run test:unit
  ```

- To run **integration tests** only:
  ```bash
  npm run test:integration
  ```

### Test Coverage

This project tracks test coverage to ensure critical parts of the codebase are adequately tested. After running tests, coverage reports are generated in the `./coverage` directory. To view coverage reports:

1. Run tests with coverage enabled:

   ```bash
   npm run test
   ```

2. Open the generated `covearge/lcov-report/index.html` file in a browser for a detailed view.

### Writing Tests

Tests are written in the `__tests__` directories within each module. For example:

- Unit tests for the `users` module are in `src/apps/users/__tests__/userService.unit.test.ts`.
- Integration tests for the `products` module are in `src/apps/products/__tests__/productController.integration.test.ts`.

Each test file follows a structured approach:

- Setup: Mock dependencies or initialize required data.
- Execution: Call the function or API endpoint under test.
- Assertions: Verify the result matches expectations.

### Mocking and Test Utilities

- **Mockingoose**: Used for mocking Mongoose models in unit tests.
- **MongoDB Memory Server**: Provides an in-memory MongoDB instance for integration tests.

### Example Test Commands

- Run a specific unit test file:

  ```bash
  npx jest src/apps/users/__tests__/userService.unit.test.ts
  ```

- Run tests with verbose output:
  ```bash
  npm run test -- --verbose
  ```

## Contribution

Contributions are welcome! If you find any bugs or have suggestions for improvements, feel free to create an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
