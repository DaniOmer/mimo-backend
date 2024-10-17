"use strict";
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("mongoose");
dotenv_1.default.config();
console.log("Architecture configuration");
// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String,
});
// 3. Create a Model.
const User = (0, mongoose_1.model)("User", userSchema);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // 4. Connect to MongoDB
        yield (0, mongoose_1.connect)("mongodb://localhost:27017/mimo");
        const user = new User({
            name: "Bill",
            email: "bill@initech.com",
            avatar: "https://i.imgur.com/dM7Thhn.png",
        });
        yield user.save();
        return user.email;
    });
}
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    try {
        res.send(`Express + TypeScript Server`);
    }
    catch (error) {
        console.log(`User creation failed: ${error}`);
    }
});
app.listen(port, () => {
    run().catch((err) => console.log(err));
    console.log(`Example app listening on port http://localhost:${port}. Connect`);
});
