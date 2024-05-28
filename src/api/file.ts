import { type CancelTokenSource } from 'axios'
import api from './server'
import {
  FindFileParams,
  UploadFileParams,
  MergeFileParams,
  FindFileInfo,
  UploadFileInfo,
  MergeFileInfo,
} from './types'

export const test = async () => {
  const res = await api.get<any>('/api/test')
  return res
}

export const findFile = async (params: FindFileParams) => {
  const res = await api.get<FindFileInfo>('/api/findFile', params)
  return res
}

export const uploadChunk = async (
  params: UploadFileParams & { cancelToken?: CancelTokenSource }
) => {
  const { chunk, hash, index, cancelToken } = params
  const formData = new FormData()
  formData.append('hash', hash)
  formData.append('chunk', chunk)
  formData.append('index', index + '')
  console.log(cancelToken, 'cancelToken')

  const res = await api.post<UploadFileInfo>('/api/uploadFile', formData, {
    cancelToken: cancelToken?.token,
  })
  return res
}

export const mergeFile = async (params: MergeFileParams) => {
  const res = await api.get<MergeFileInfo>('/api/mergeFile', params)
  return res
}
