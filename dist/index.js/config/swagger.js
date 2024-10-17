"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "API Documentation for Mimo.",
            contact: {
                name: "API Support",
                url: "http://www.example.com/support",
                email: "support@example.com",
            },
        },
        paths: {
            "/api/users": {
                get: {
                    summary: "Get all users",
                    responses: {
                        "200": {
                            description: "A list of users",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/User",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/products": {
                get: {
                    summary: "Get all products",
                    responses: {
                        "200": {
                            description: "A list of products",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Product",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/payments": {
                get: {
                    summary: "Get all payments",
                    responses: {
                        "200": {
                            description: "A list of payments",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Payment",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        components: {
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "The auto-generated id of the user",
                        },
                        name: {
                            type: "string",
                            description: "The user's name",
                        },
                        email: {
                            type: "string",
                            description: "The user's email",
                        },
                        avatar: {
                            type: "string",
                            description: "URL of the user's avatar",
                        },
                    },
                    required: ["name", "email"],
                },
                Product: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "The auto-generated id of the product",
                        },
                        title: {
                            type: "string",
                            description: "The title of the product",
                        },
                        price: {
                            type: "number",
                            format: "float",
                            description: "The price of the product",
                        },
                        description: {
                            type: "string",
                            description: "A detailed description of the product",
                        },
                    },
                    required: ["title", "price"],
                },
                Payment: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "The auto-generated id of the payment",
                        },
                        amount: {
                            type: "number",
                            format: "float",
                            description: "The amount paid",
                        },
                        userId: {
                            type: "string",
                            description: "The id of the user who made the payment",
                        },
                        status: {
                            type: "string",
                            description: "The status of the payment (e.g., completed, pending)",
                        },
                    },
                    required: ["amount", "userId", "status"],
                },
            },
        },
        servers: [
            {
                url: process.env.API_URL,
            },
        ],
    },
    apis: ["./src/apps/**/api/*.ts"],
};
