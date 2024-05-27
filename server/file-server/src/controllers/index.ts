import Router from 'koa-router'
import { koaBody } from 'koa-body'
import { type Context } from 'koa'
import { findFileController } from './find'
import { uploadFileController } from './upload'
import { mergeFileController } from './merge'

const router = new Router()

router.get('/test', async (ctx: Context) => {
  ctx.body = {
    code: 0,
    message: 'testData',
  }
})

router.post('/findFile', koaBody(), findFileController)

router.post('/uploadFile', koaBody({ multipart: true }), uploadFileController)

router.post('/mergeFile', koaBody(), mergeFileController)

export default router
