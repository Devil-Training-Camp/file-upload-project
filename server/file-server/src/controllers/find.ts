import { type Context } from 'koa';
import { isExistFile  } from '../storages/files';
import path from "path"
import { UPLOAD_DIR } from "../const"

export const findFileController = (ctx: Context) => {
    let flag = false;
    let hashDir = "";
    const hash = ctx.request.body.hash;
    const index = ctx.request.body.index;
    
    if (hash && !index) {
        hashDir = path.resolve(UPLOAD_DIR, hash);
    }
    if (hash && index) {
        hashDir = path.resolve(UPLOAD_DIR, `${hash}/${index}`);
    }

    flag = isExistFile(hashDir);

    ctx.body = {
        code: 0,
        flag,
        message: '查询成功',
    }
    return;
}