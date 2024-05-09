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
const const_1 = require("../const");
const files_1 = require("../storages/files");
const path_1 = __importDefault(require("path"));
const uploadFileController = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const hash = ctx.request.body.hash;
    const index = ctx.request.body.index;
    const tempath = (_b = (_a = ctx.request.files) === null || _a === void 0 ? void 0 : _a.chunk) === null || _b === void 0 ? void 0 : _b.filepath;
    if (!tempath) {
        throw console.error("文件地址无效！");
    }
    // 如果文件夾不存在 則創建
    const hashDir = path_1.default.resolve(const_1.UPLOAD_DIR, hash);
    if (!fs_1.default.existsSync(hashDir)) {
        fs_1.default.mkdirSync(hashDir, { recursive: true });
    }
    const filePath = path_1.default.resolve(hashDir, index);
    // 写入之前判断文件是否已经存在
    if ((0, files_1.isExistFile)(filePath)) {
        ctx.body = {
            code: 0,
            message: '该分片已经存在',
        };
        return;
    }
    try {
        (0, files_1.writeFile)(filePath, (0, files_1.readFile)(tempath));
        ctx.body = {
            code: 0,
            message: '上传成功',
        };
    }
    catch (error) {
        ctx.body = {
            code: -1,
            message: '上传分片失败',
        };
        return;
    }
    // const { file, index, chunk, fileName, hash } = ctx.request.body;
    // 检查该分片是否已上传
    //     if (chunkExists(parseInt(index), fileName)) {
    //         ctx.body = {
    //             success: true,
    //             message: '该分片已经存在',
    //         };
    //         return;
    //     }
    //     // 生成唯一的文件名
    //     const fileId: string = uuidv4();
    //     const filePath = `${UPLOAD_DIR}/${fileId}_${fileName}`;
    //     // 将分片保存到指定路径
    //     const reader: fs.ReadStream = fs.createReadStream(file.path);
    //     const writer: fs.WriteStream = fs.createWriteStream(filePath, { flags: 'a' });
    //     reader.pipe(writer);
    //     ctx.body = {
    //         success: true,
    //         message: '上传成功！',
    //     };
    //     // 检查是否所有分片都已上传完毕
    //   if (parseInt(index) === parseInt(chunk) - 1) {
    //     ctx.body = {
    //         success: true,
    //         message: '上传完毕！',
    //     };
    //   }
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
