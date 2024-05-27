// 文件操作
import fs from 'fs'
import path from 'path'

export const writeFile = (filepath: string, content: Buffer) => {
  fs.writeFileSync(filepath, content)
}

export const readFile = (filepath: string) => {
  return fs.readFileSync(filepath)
}

export const isExistFile = (filepath: string) => {
  return fs.existsSync(filepath)
}

export const mkdir = (hashDir: string, cur: boolean) => {
  return fs.mkdirSync(hashDir, { recursive: cur })
}
export const removeDir = (folderPath: string) => {
  //判断文件夹是否存在
  if (fs.existsSync(folderPath)) {
    //读取文件夹下的文件目录，以数组形式输出
    fs.readdirSync(folderPath).forEach((file) => {
      //拼接路径
      const curPath = path.resolve(folderPath, file)
      //判断是不是文件夹，如果是，继续递归
      if (fs.existsSync(curPath)) {
        fs.unlinkSync(curPath)
      }
    })
    //仅可用于删除空目录
    fs.rmdirSync(folderPath)
  }
}
