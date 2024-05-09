// 文件操作
import fs from "fs"

export const writeFile = async (filepath:string, content:Buffer) => {
    await fs.writeFileSync(filepath, content);
}

export const readFile = (filepath:string) => {
    return fs.readFileSync(filepath);
}

export const isExistFile = (filepath: string) => {
    return fs.existsSync(filepath);
}