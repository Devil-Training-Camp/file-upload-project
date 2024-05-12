import Router from 'koa-router'
import { koaBody } from 'koa-body';

import { findFileController } from './find';
import { uploadFileController } from './upload';
import { mergeFileController } from './merge';

const router = new Router();

router.get('/test', (ctx: any) => {
    // 测试
    ctx.body = {
        success: true,
        message: [123,456],
    };
    return
} )

router.post('/findFile', findFileController)

router.post('/uploadFile', koaBody({multipart: true}), uploadFileController)

router.post('/mergeFile', mergeFileController)

export default router