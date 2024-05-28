import { type Context } from 'koa'
import { readdir, appendFile, readFile } from 'fs/promises'
import { UPLOAD_DIR } from '../const'
import path from 'path'
import { isExistFile } from '../storages/files'

export const mergeFileController = async (ctx: Context) => {
  // 获取当前目录下的文件列表
  const { hash, filename } = ctx.request.query
  const hashDir = path.resolve(UPLOAD_DIR, hash as string)

  const flag = isExistFile(hashDir)

  if (!flag) {
    ctx.body = {
      code: 0,
      flag,
      message: '文件不存在！',
    }
  }

  try {
    // 读取目录中的文件
    const files = await readdir(hashDir)

    // 文件名转换为索引并排序
    const fn2idx = (filename: string) => +path.basename(filename)
    const sortedFiles = files.sort((r1, r2) => fn2idx(r1) - fn2idx(r2))

    // 读取所有文件的内容，使用 Promise.all 进行并行读取
    const fileReadPromises = sortedFiles.map((chunkPath) => {
      return readFile(path.join(hashDir, chunkPath))
    })

    // 等待所有文件读取完成
    const fileContents = await Promise.all(fileReadPromises)

    // 逐个将读取到的文件内容写入目标文件
    for (const chunkData of fileContents) {
      await appendFile(path.join(UPLOAD_DIR, filename as string), chunkData)
    }

    console.log('Files merged successfully!')
  } catch (error) {
    console.error('Error merging files:', error)
  }

  // readdir(
  //   hashDir,
  //   async (err: NodeJS.ErrnoException | null, files: string[]) => {
  //     const fn2idx = (filename: string) => +path.basename(filename)
  //     files
  //       ?.sort((r1, r2) => fn2idx(r1) - fn2idx(r2))
  //       .map((chunkPath) => {
  //         // 合并文件
  //         appendFile(
  //           path.join(UPLOAD_DIR, filename),
  //           readFile(`${hashDir}\\${chunkPath}`)
  //         )
  //       })
  //   }
  // )

  // rmEmptyDir(hashDir);
  // 返回文件地址
  ctx.body = {
    code: 0,
    flag,
    message: '合并完毕',
  }
}
