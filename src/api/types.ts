interface FileHashParam {
  hash: string
  index?: number
}

export interface FindFileParams extends FileHashParam {
  filename?: string
  directory?: string
}

export interface UploadFileParams extends FileHashParam {
  chunk: Blob
}

export interface MergeFileParams extends FileHashParam {
  filename?: string
}

export interface FindFileInfo {
  flag: boolean
  code: number
  message: string
}

export interface UploadFileInfo {
  flag: boolean
}

export interface MergeFileInfo {
  flag: boolean
}
