"use strict";
// ？？？？哦哦，我算是看懂了，这是构建产物。。。产物为什么要提交上来？
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_DIR = void 0;
const path_1 = __importDefault(require("path"));
exports.UPLOAD_DIR = path_1.default.resolve(__dirname, "../temp"); // 设置上传文件的存储路径
