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
exports.removeDir = exports.mkdir = exports.isExistFile = exports.readFile = exports.writeFile = void 0;
// 文件操作
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
const mkdir = (hashDir, cur) => {
    return fs_1.default.mkdirSync(hashDir, { recursive: cur });
};
exports.mkdir = mkdir;
const removeDir = (folderPath) => {
    //判断文件夹是否存在
    if (fs_1.default.existsSync(folderPath)) {
        //读取文件夹下的文件目录，以数组形式输出
        fs_1.default.readdirSync(folderPath).forEach((file) => {
            //拼接路径
            const curPath = path_1.default.resolve(folderPath, file);
            //判断是不是文件夹，如果是，继续递归
            if (fs_1.default.existsSync(curPath)) {
                fs_1.default.unlinkSync(curPath);
            }
        });
        //仅可用于删除空目录
        fs_1.default.rmdirSync(folderPath);
    }
};
exports.removeDir = removeDir;
