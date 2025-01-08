jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");

  class MockSchema {
    methods = {};
    statics = {};
    pre = jest.fn();
    static Types = {
      ObjectId: jest.fn(() => "mockObjectId"),
    };
    constructor() {}
  }

  return {
    ...actualMongoose,
    connect: jest.fn(),
    model: jest.fn(() => ({
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
      create: jest.fn().mockResolvedValue({}),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      findByIdAndUpdate: jest.fn().mockResolvedValue({}),
      findByIdAndDelete: jest.fn().mockResolvedValue({}),
    })),
    Schema: MockSchema,
    Types: {
      ObjectId: jest.fn(() => "mockObjectId"),
    },
  };
});

jest.mock("./src/utils/security.utils", () => ({
  ...jest.requireActual("./src/utils/security.utils"),
  comparePassword: jest.fn().mockResolvedValue(true),
  hashPassword: jest.fn().mockResolvedValue("mockHashedPassword"),
  generateJWTToken: jest.fn().mockResolvedValue("mockToken"),
}));

jest.mock("./src/config/app.config", () => ({
  AppConfig: {
    jwt: {
      secret: "mockSecret",
      expiresIn: "1h",
    },
    client: {
      url: "http://localhost",
    },
    notification: {
      email: {
        brevoApiKey: "mockBrevoApiKey",
      },
    },
    token: {
      defaultExpiresIn: 3600,
    },
  },
}));
