import { type Context } from 'koa';
import fs from 'fs';
import { UPLOAD_DIR } from "../const"
import path from "path"
import { isExistFile  } from '../storages/files';

export const mergeFileController = async (ctx: Context) => {
    // 获取当前目录下的文件列表
    const {hash, filename} = ctx.request.body;
    const hashDir = path.resolve(UPLOAD_DIR, hash)


    const flag = await isExistFile(hashDir)
    
    if (!flag) {
      ctx.body = {
        code: 0,
        flag,
        message: '文件不存在！',
      }
    }
    
    fs.readdir(hashDir, async (err: NodeJS.ErrnoException | null, files: string[]) => {

      const fn2idx = (filename: string) => +path.basename(filename);
      files?.sort((r1, r2) => (fn2idx(r1) - fn2idx(r2))).map(chunkPath => {
        // 合并文件
        fs.appendFileSync(
          path.join(UPLOAD_DIR, filename),
          fs.readFileSync(`${hashDir}\\${chunkPath}`)
        )

      })

    }); 

    
    // rmEmptyDir(hashDir);
    // 返回文件地址
    ctx.body = {
      code: 0,
      flag,
      message: '合并完毕',
    }
}
