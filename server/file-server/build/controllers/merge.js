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
const mergeFileController = (ctx) => {
    // 获取当前目录下的文件列表
    fs_1.default.readdir(const_1.UPLOAD_DIR, (err, files) => __awaiter(void 0, void 0, void 0, function* () {
        // 调用合并分片的函数
        yield mergeChunks(files, const_1.UPLOAD_DIR, "fileName");
        if (err) {
            ctx.body = {
                success: false,
                message: err,
            };
            return;
        }
    }));
    return;
};
exports.mergeFileController = mergeFileController;
// 合并分片的函数，根据分片文件列表进行合并
function mergeChunks(files, UPLOAD_DIR, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const mergedFilePath = `${UPLOAD_DIR}/${fileName}`;
            const writeStream = fs_1.default.createWriteStream(mergedFilePath);
            files
                .sort((a, b) => parseInt(a.split('_')[0]) - parseInt(b.split('_')[0]))
                .forEach((file) => {
                const readStream = fs_1.default.createReadStream(`${UPLOAD_DIR}/${file}`);
                readStream.pipe(writeStream, { end: false });
            });
            writeStream.on('close', () => {
                // 合并完成后删除所有分片
                files.forEach((file) => fs_1.default.unlinkSync(`${UPLOAD_DIR}/${file}`));
                console.log('文件合并成功:', mergedFilePath);
                resolve(mergedFilePath);
            });
            writeStream.on('error', (err) => {
                console.error('Error merging files:', err);
                reject(err);
            });
        });
    });
}
