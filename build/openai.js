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
exports.fetchAnswer = void 0;
const axios_1 = __importDefault(require("axios"));
const token = process.env.TOKEN || '';
function fetchAnswer(question) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, axios_1.default)({
            method: 'post',
            url: 'https://api.openai.com/v1/completions',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                model: "text-davinci-003",
                prompt: question,
                temperature: 0,
                max_tokens: 1000
            }
        });
        console.log('receive', response.data);
        return response.data.choices[0].text.replace('\n', '');
    });
}
exports.fetchAnswer = fetchAnswer;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        fetchAnswer("你是谁");
    });
}
// main()
