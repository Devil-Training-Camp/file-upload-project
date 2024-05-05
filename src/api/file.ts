import { type CancelTokenSource } from 'axios';
import api from "./server";

export const findFile = async (params: any) => {
  const res = await api.get<any>("/findFile", {
    params,
  });
  return res.data.data;
};

export const uploadChunk = async (
  params: any & { cancelToken?: CancelTokenSource },
) => {
  const { chunk, hash, index } = params;
  const formData = new FormData();
  formData.append('hash', hash);
  formData.append('chunk', chunk);
  formData.append('index', index + '');

  const res = await api.post<any>("/uploadFile",formData,);
  return res.data.data;
};

export const mergeFile = async (params: any) => {
  const res = await api.post<any>("/mergeFile",params,);
  return res.data.data;
};

