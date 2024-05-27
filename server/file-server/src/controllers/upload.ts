import path from 'path'
import { type Context } from 'koa'
import { UPLOAD_DIR } from '../const'
import { readFile, writeFile, isExistFile, mkdir } from '../storages/files'

interface testFile {
  filepath?: string
}

export const uploadFileController = (ctx: Context) => {
  const { hash, index } = ctx.request.body.hash
  const tempath = (ctx.request.files?.chunk as testFile)?.filepath

  if (!tempath) {
    throw console.error('文件地址无效！')
  }

  // 如果文件夾不存在 則創建
  const hashDir = path.resolve(UPLOAD_DIR, hash)
  if (!isExistFile(hashDir)) {
    mkdir(hashDir, true)
  }
  const filePath = path.resolve(hashDir, index)

  // 写入之前判断文件是否已经存在
  if (isExistFile(filePath)) {
    ctx.body = {
      code: 0,
      message: '该分片已经存在',
    }
    return
  }
  try {
    writeFile(filePath, readFile(tempath))

    ctx.body = {
      code: 0,
      message: '上传成功',
    }
  } catch (error) {
    ctx.body = {
      code: -1,
      message: '上传分片失败',
    }
    return
  }
}
