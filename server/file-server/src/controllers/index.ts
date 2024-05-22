import Router from 'koa-router'
import { koaBody } from 'koa-body';

import { findFileController } from './find';
import { uploadFileController } from './upload';
import { mergeFileController } from './merge';

const router = new Router();

router.post('/findFile',koaBody(), findFileController)

router.post('/uploadFile', koaBody({multipart: true}), uploadFileController)

router.post('/mergeFile',koaBody(), mergeFileController)

export default router