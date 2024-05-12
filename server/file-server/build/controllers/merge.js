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
exports.mergeFileController = void 0;
const fs_1 = __importDefault(require("fs"));
const const_1 = require("../const");
const path_1 = __importDefault(require("path"));
const files_1 = require("../storages/files");
const mergeFileController = (ctx) => {
    // 获取当前目录下的文件列表
    const hash = ctx.request.body.hash;
    const filename = ctx.request.body.filename;
    const hashDir = path_1.default.resolve(const_1.UPLOAD_DIR, hash);
    const flag = (0, files_1.isExistFile)(hashDir);
    if (!flag) {
        ctx.body = {
            code: 0,
            flag,
            message: '文件不存在！',
        };
    }
    fs_1.default.readdir(hashDir, (err, files) => __awaiter(void 0, void 0, void 0, function* () {
        files === null || files === void 0 ? void 0 : files.sort((a, b) => (a - b)).map(chunkPath => {
            // 合并文件
            fs_1.default.appendFileSync(path_1.default.join(const_1.UPLOAD_DIR, filename), fs_1.default.readFileSync(`${hashDir}\\${chunkPath}`));
        });
    }));
    // 删除临时文件夹
    try {
        //removeDir(hashDir);
    }
    catch (error) {
        console.log("清空临时文件");
    }
    // rmEmptyDir(hashDir);
    // 返回文件地址
    ctx.body = {
        code: 0,
        flag,
        message: '合并完毕',
    };
};
exports.mergeFileController = mergeFileController;
