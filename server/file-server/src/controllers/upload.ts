import path from "path"
import { type Context } from 'koa';
import { UPLOAD_DIR } from "../const"
import { readFile, writeFile, isExistFile, mkdir  } from '../storages/files';

interface testFile{
    filepath?: string
}

export const uploadFileController = async (ctx: Context) => {
    const hash = ctx.request.body.hash;
    const index = ctx.request.body.index;
    // 额。。。如果你是用客户端传过来的 filepath 作为文件名，那可能会遇到很多问题
    // 比如 filepath='a_-+ /c' 之类的，有特殊符号的时候
    const tempath = (ctx.request.files?.chunk as testFile)?.filepath;

    if (!tempath) {
        throw console.error("文件地址无效！");
    }
    
    // 如果文件夾不存在 則創建
    const hashDir = path.resolve(UPLOAD_DIR, hash);
    if (!isExistFile(hashDir)) {
        mkdir(hashDir, true);
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
        // fs 都改成异步操作
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

}


