"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const userRoute_1 = __importDefault(require("./apps/users/api/userRoute"));
const swagger_1 = require("./config/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Swagger Configuration
const swaggerDocs = (0, swagger_jsdoc_1.default)(swagger_1.swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.get("/", (req, res) => {
    try {
        res.send(`Express + TypeScript Server`);
    }
    catch (error) {
        console.log(`User creation failed: ${error}`);
    }
});
app.use("/api", userRoute_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}. Connect`);
});
