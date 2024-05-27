import { type CancelTokenSource } from 'axios'
import api from './server'

export const test = async () => {
  const res = await api.get<any>('/api/test', {})
  return res
}

export const findFile = async (params: any) => {
  const res = await api.post<any>('/api/findFile', params)
  return res
}

export const uploadChunk = async (
  params: any & { cancelToken?: CancelTokenSource }
) => {
  const { chunk, hash, index } = params
  const formData = new FormData()
  formData.append('hash', hash)
  formData.append('chunk', chunk)
  formData.append('index', index + '')
  // console.log(cancelToken, "cancelToken")

  const res = await api.post<any>('/api/uploadFile', formData)
  return res
}

export const mergeFile = async (params: any) => {
  const res = await api.post<any>('/api/mergeFile', params)
  return res
}
