"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFileController = void 0;
const files_1 = require("../storages/files");
const path_1 = __importDefault(require("path"));
const const_1 = require("../const");
const findFileController = (ctx) => {
    let flag = false;
    let hashDir = "";
    const hash = ctx.request.body.hash;
    const index = ctx.request.body.index;
    if (hash && !index) {
        hashDir = path_1.default.resolve(const_1.UPLOAD_DIR, hash);
    }
    if (hash && index) {
        hashDir = path_1.default.resolve(const_1.UPLOAD_DIR, `${hash}/${index}`);
    }
    flag = (0, files_1.isExistFile)(hashDir);
    ctx.body = {
        code: 0,
        flag,
        message: '查询成功',
    };
    return;
};
exports.findFileController = findFileController;
