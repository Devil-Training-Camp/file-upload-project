import { type Context } from 'koa';
import fs from 'fs';
import { UPLOAD_DIR } from "../const"

export const mergeFileController = (ctx: Context) => {
    // 获取当前目录下的文件列表
    fs.readdir(UPLOAD_DIR, async (err: NodeJS.ErrnoException | null, files: string[]) => {
        // 调用合并分片的函数
        await mergeChunks(files, UPLOAD_DIR, "fileName");
        if (err) {
            ctx.body = {
                success: false,
                message: err,
            };
            return;
        }
    }); 
    return
}

// 合并分片的函数，根据分片文件列表进行合并
async function mergeChunks(files: string[], UPLOAD_DIR: string, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const mergedFilePath = `${UPLOAD_DIR}/${fileName}`;
  
      const writeStream: fs.WriteStream = fs.createWriteStream(mergedFilePath);
  
      files
        .sort((a: string, b: string) => parseInt(a.split('_')[0]) - parseInt(b.split('_')[0]))
        .forEach((file: string) => {
          const readStream: fs.ReadStream = fs.createReadStream(`${UPLOAD_DIR}/${file}`);
          readStream.pipe(writeStream, { end: false });
        });
  
      writeStream.on('close', () => {
        // 合并完成后删除所有分片
        files.forEach((file: string) => fs.unlinkSync(`${UPLOAD_DIR}/${file}`));
  
        console.log('文件合并成功:', mergedFilePath);
        resolve(mergedFilePath);
      });
  
      writeStream.on('error', (err) => {
        console.error('Error merging files:', err);
        reject(err);
      });
    });
  }