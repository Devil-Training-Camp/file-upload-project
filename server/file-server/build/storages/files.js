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
exports.isExistFile = exports.readFile = exports.writeFile = void 0;
// 文件操作
const fs_1 = __importDefault(require("fs"));
const writeFile = (filepath, content) => __awaiter(void 0, void 0, void 0, function* () {
    yield fs_1.default.writeFileSync(filepath, content);
});
exports.writeFile = writeFile;
const readFile = (filepath) => {
    return fs_1.default.readFileSync(filepath);
};
exports.readFile = readFile;
const isExistFile = (filepath) => {
    return fs_1.default.existsSync(filepath);
};
exports.isExistFile = isExistFile;
