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
exports.uploadFileController = void 0;
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const const_1 = require("../const");
const uploadFileController = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { file, index, chunk, fileName, hash } = ctx.request.body;
    debugger;
    // 检查该分片是否已上传
    if (chunkExists(parseInt(index), fileName)) {
        ctx.body = {
            success: true,
            message: '该分片已经存在',
        };
        return;
    }
    // 生成唯一的文件名
    const fileId = (0, uuid_1.v4)();
    const filePath = `${const_1.UPLOAD_DIR}/${fileId}_${fileName}`;
    // 将分片保存到指定路径
    const reader = fs_1.default.createReadStream(file.path);
    const writer = fs_1.default.createWriteStream(filePath, { flags: 'a' });
    reader.pipe(writer);
    ctx.body = {
        success: true,
        message: '上传成功！',
    };
    // 检查是否所有分片都已上传完毕
    if (parseInt(index) === parseInt(chunk) - 1) {
        ctx.body = {
            success: true,
            message: '上传完毕！',
        };
    }
});
exports.uploadFileController = uploadFileController;
// 检查分片是否已上传
function chunkExists(chunkIndex, fileName) {
    const chunkFilePath = `${const_1.UPLOAD_DIR}/${chunkIndex}_${fileName}`;
    return fs_1.default.existsSync(chunkFilePath);
}
// 检查文件是否存在的函数
function fileExists(filePath) {
    return new Promise((resolve) => {
        fs_1.default.access(filePath, fs_1.default.constants.F_OK, (err) => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
