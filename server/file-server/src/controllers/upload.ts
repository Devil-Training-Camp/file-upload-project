import { type Context } from 'koa';
import fs from 'fs';
import { UPLOAD_DIR } from "../const"
import { readFile, writeFile, isExistFile  } from '../storages/files';

import path from "path"

interface testFile{
    filepath?: string
}

export const uploadFileController = async (ctx: Context) => {
    const hash = ctx.request.body.hash;
    const index = ctx.request.body.index;
    const tempath = (ctx.request.files?.chunk as testFile)?.filepath;

    if (!tempath) {
        throw console.error("文件地址无效！");
    }
    
    // 如果文件夾不存在 則創建
    const hashDir = path.resolve(UPLOAD_DIR, hash);
    if (!fs.existsSync(hashDir)) {
        fs.mkdirSync(hashDir, { recursive: true });
    }
    
    const filePath = path.resolve(hashDir, index);

    // 写入之前判断文件是否已经存在
    if(isExistFile(filePath)) {
        ctx.body = {
             code: 0,
             message: '该分片已经存在',
        };
        return;
    }
    try {
        writeFile(filePath, readFile(tempath));

        ctx.body = {
            code: 0,
            message: '上传成功',
        };
    } catch (error) {
        ctx.body = {
            code: -1,
            message: '上传分片失败',
       };
       return;
    }
    
    // const { file, index, chunk, fileName, hash } = ctx.request.body;
    // 检查该分片是否已上传
//     if (chunkExists(parseInt(index), fileName)) {
//         ctx.body = {
//             success: true,
//             message: '该分片已经存在',
//         };
//         return;
//     }

//     // 生成唯一的文件名
//     const fileId: string = uuidv4();
//     const filePath = `${UPLOAD_DIR}/${fileId}_${fileName}`;

//     // 将分片保存到指定路径
//     const reader: fs.ReadStream = fs.createReadStream(file.path);
//     const writer: fs.WriteStream = fs.createWriteStream(filePath, { flags: 'a' });
//     reader.pipe(writer);

//     ctx.body = {
//         success: true,
//         message: '上传成功！',
//     };

//     // 检查是否所有分片都已上传完毕
//   if (parseInt(index) === parseInt(chunk) - 1) {

//     ctx.body = {
//         success: true,
//         message: '上传完毕！',
//     };
//   }
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

