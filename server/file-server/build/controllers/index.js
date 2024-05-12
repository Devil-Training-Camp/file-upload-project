"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const koa_body_1 = require("koa-body");
const find_1 = require("./find");
const upload_1 = require("./upload");
const merge_1 = require("./merge");
const router = new koa_router_1.default();
router.get('/test', (ctx) => {
    // 测试
    ctx.body = {
        success: true,
        message: [123, 456],
    };
    return;
});
router.post('/findFile', find_1.findFileController);
router.post('/uploadFile', (0, koa_body_1.koaBody)({ multipart: true }), upload_1.uploadFileController);
router.post('/mergeFile', merge_1.mergeFileController);
exports.default = router;
