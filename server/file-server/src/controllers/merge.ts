import { type Context } from 'koa';
import fs from 'fs';
import { UPLOAD_DIR } from "../const"
import path from "path"
import { isExistFile, removeDir  } from '../storages/files';

export const mergeFileController = (ctx: Context) => {
    // 获取当前目录下的文件列表
    const hash = ctx.request.body.hash;
    const filename = ctx.request.body.filename;
    const hashDir = path.resolve(UPLOAD_DIR, hash)


    const flag = isExistFile(hashDir)
    
    if (!flag) {
      ctx.body = {
        code: 0,
        flag,
        message: '文件不存在！',
      }
    }
    // 改成用 `fs/promises` 把
    fs.readdir(hashDir, async (err: NodeJS.ErrnoException | null, files: string[]) => {

// 少用 any。。。
// sort 函数里面的 a - b 是什么逻辑？a/b 是什么类型？
      files?.sort((a:any, b:any) => (a - b)).map(chunkPath => {
        // 合并文件
        // 这种写法，效率太低了
        fs.appendFileSync(
          path.join(UPLOAD_DIR, filename),
          fs.readFileSync(`${hashDir}\\${chunkPath}`)
        )

      })

    }); 

    // 删除临时文件夹
    try {
      //removeDir(hashDir);
    } catch (error) {
      console.log("清空临时文件")
    }
    
    // rmEmptyDir(hashDir);
    // 返回文件地址
    ctx.body = {
      code: 0,
      flag,
      message: '合并完毕',
    }
}
