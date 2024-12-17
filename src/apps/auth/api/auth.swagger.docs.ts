export const authSwaggerDocs = {
  "/api/auth/register/{strategy}": {
    post: {
      summary: "Create a new user",
      parameters: [
        {
          name: "strategy",
          in: "path",
          description: "Authentication strategy",
          required: false,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserCreate",
            },
          },
        },
      },
      responses: {
        "200": {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserResponse",
              },
            },
          },
        },
      },
    },
  },
  "/api/auth/password/reset-request": {
    post: {
      summary: "Request a password reset",
      description: "Send a password reset link to the user's email",
      responses: {
        "200": {
          description: "Password reset link sent",
        },
        "400": {
          description: "Invalid email",
        },
      },
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                },
              },
              required: ["email"],
            },
          },
        },
      },
    },
  },
};
