import { type Context } from 'koa'
import { isExistFile } from '../storages/files'
import path from 'path'
import { UPLOAD_DIR } from '../const'

export const findFileController = (ctx: Context) => {
  let flag = false
  let hashDir = ''
  const { hash, index } = ctx.request.body

  const hashD = path.resolve(UPLOAD_DIR, hash)
  hashDir = path.resolve(hashD, index)
  flag = isExistFile(hashDir)

  ctx.body = {
    code: 0,
    flag: flag,
    message: '查询成功',
  }
  return
}
