import { findFile, uploadChunk, mergeFile } from '../api/file';

// 文件操作工具
 export  interface FilePiece {
    chunk: Blob;
    size: number;
 }
 // 分片的长度
 const CHUNK_SIZE = 5 * 1024 * 1024;
 /** 
  * @file 目标文件
  * @chunkSize 分片大小
  */
export const splitFile = (file: File, chunkSize = CHUNK_SIZE) => {
  const fileChunkList: FilePiece[] = [];
  let len = 0
  while (len < file.size) {
    // 一个分片
    const piece = file.slice(len, len + chunkSize);
    fileChunkList.push({
      chunk: piece,
      size: piece.size,
    })
    len += chunkSize;
  }
  return fileChunkList
}

 
 /** 
  * @pieces 所有的文件分片
  * @hash 计算好的hash
  * @onTick 进度的回调函数
  */
 export const uploadChunks = async (params: {pieces: FilePiece[]; hash: string; onTick?: (progress: number) => void;}) => {
   const { pieces: originChunks, hash, onTick } = params;
   const total = originChunks.length;
   const pool: Promise<any>[] = []; // 并发池

   const doUpload = async (pieces: FilePiece[]) => {
      if (pieces.length === 0) {
        console.log('上传完成');
        onTick?.(100);
      }
      for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        const params = { hash, chunk: piece.chunk, index: i };

        onTick?.(Number(((i / total) * 100).toFixed(2)));
        // const { exists } = await findFile({ hash, index: i }); //查找文件是否已经上传过 没上传则继续上传
        // if (!exists) {
        //   await  uploadChunk({ ...params });
        //   return;
        // }
        await  uploadChunk({ ...params });

      }
      onTick?.(100);
   }
   await doUpload(originChunks);
 };


 // 这里做文件加密和
export const createHash = ({chunks, onTick}:{chunks: FilePiece[],  onTick?:(percentage: number) => void}): Promise<string> => {
    
  return new Promise( resolve => {
    // 开启多线程
    const worker = new Worker(new URL('./worker', import.meta.url), {
      type: 'module',
    })
    worker.postMessage(chunks);
    worker.onmessage = (e) => {
      // console.log("我回收到的message", e.data);
      const { hash, percentage} = e.data; 
      onTick?.(parseInt(percentage.toFixed(2)));
      if (hash) {
        resolve(hash);
      }
    }
  })
     
}

