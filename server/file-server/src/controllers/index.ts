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

router.get('/findFile', findFileController)

router.post('/uploadFile', koaBody({ multipart: true }), uploadFileController)

router.get('/mergeFile', mergeFileController)

export default router
