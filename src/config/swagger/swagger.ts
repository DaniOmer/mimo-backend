import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";

import { authSwaggerDocs } from "../../apps/auth/api/auth.swagger.docs";

dotenv.config();

export const swaggerOptions = {
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
      ...authSwaggerDocs,
    },
    components: {
      schemas: {
        UserCreate: {
          type: "object",
          properties: {
            firstName: {
              type: "string",
              description: "The user's first name",
            },
            lastName: {
              type: "string",
              description: "The user's last name",
            },
            email: {
              type: "string",
              description: "The user's email",
            },
            password: {
              type: "string",
              description: "The user's password",
            },
            avatar: {
              type: "string",
              description: "URL of the user's avatar",
            },
            role: {
              type: "string",
              enum: ["User", "Admin"],
              description: "The user's role",
            },
            isTermsOfSale: {
              type: "boolean",
              description: "Whether the user has agreed to the terms of sale",
            },
          },
          required: ["firstName", "lastName", "email", "password"],
        },
        UserResponse: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The auto-generated id of the user",
            },
            firstName: {
              type: "string",
              description: "The user's first name",
            },
            lastName: {
              type: "string",
              description: "The user's last name",
            },
            email: {
              type: "string",
              description: "The user's email",
            },
            password: {
              type: "string",
              description: "The user's password",
            },
            avatar: {
              type: "string",
              description: "URL of the user's avatar",
            },
            role: {
              type: "string",
              enum: ["User", "Admin"],
              description: "The user's role",
            },
            isTermsOfSale: {
              type: "boolean",
              description: "Whether the user has agreed to the terms of sale",
            },
          },
          required: ["firstName", "lastName", "email", "password"],
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

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
