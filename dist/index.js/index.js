"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app_config_1 = require("./config/app.config");
const swagger_1 = require("./config/swagger/swagger");
const logger_config_1 = require("./config/logger/logger.config");
const mongoose_config_1 = require("./config/mongoose/mongoose.config");
const auth_route_1 = __importDefault(require("./apps/auth/api/auth.route"));
const error_middleware_1 = require("./librairies/middlewares/error.middleware");
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = app_config_1.AppConfig.server.port;
        const router = (0, express_1.Router)();
        const loggerInit = logger_config_1.LoggerConfig.get();
        try {
            const databaseInit = yield mongoose_config_1.MongooseConfig.get();
            app.use(express_1.default.json());
            // API documentation
            app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerDocs));
            // Authentication routes
            app.use("/api/auth", (0, auth_route_1.default)(router));
            // Error handling middleware
            app.use(error_middleware_1.errorHandler);
            app.listen(port, () => {
                databaseInit.mongoose;
                loggerInit.logger.info(`Mimo app listening on port http://localhost:${port}.`);
            });
        }
        catch (error) {
            loggerInit.logger.error("Error starting the application:", error);
            process.exit(1);
        }
    });
}
startApp();
