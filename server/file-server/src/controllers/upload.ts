import { type Context } from 'koa';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_DIR } from "../const"

export const uploadFileController = async (ctx: Context) => {
    console.log("enter 1")
    const { file, index, chunk, fileName, hash } = ctx.request.body;
    // 检查该分片是否已上传
    if (chunkExists(parseInt(index), fileName)) {
        ctx.body = {
            success: true,
            message: '该分片已经存在',
        };
        return;
    }

    // 生成唯一的文件名
    const fileId: string = uuidv4();
    const filePath = `${UPLOAD_DIR}/${fileId}_${fileName}`;

    // 将分片保存到指定路径
    const reader: fs.ReadStream = fs.createReadStream(file.path);
    const writer: fs.WriteStream = fs.createWriteStream(filePath, { flags: 'a' });
    reader.pipe(writer);

    ctx.body = {
        success: true,
        message: '上传成功！',
    };

    // 检查是否所有分片都已上传完毕
  if (parseInt(index) === parseInt(chunk) - 1) {

    ctx.body = {
        success: true,
        message: '上传完毕！',
    };
  }
}

// 检查分片是否已上传
function chunkExists(chunkIndex: number, fileName: string): boolean {
    const chunkFilePath = `${UPLOAD_DIR}/${chunkIndex}_${fileName}`;
    return fs.existsSync(chunkFilePath);
}

// 检查文件是否存在的函数
function fileExists(filePath: string): Promise<boolean> {
    return new Promise((resolve) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            resolve(false);
        } else {
            resolve(true);
        }
        });
    });
}

