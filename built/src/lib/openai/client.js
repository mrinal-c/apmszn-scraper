"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const openai_1 = __importDefault(require("openai"));
exports.client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
    // baseURL: "https://api.pawan.krd/cosmosrp/v1"
});
