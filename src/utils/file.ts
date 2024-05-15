import { findFile, uploadChunk, mergeFile, test } from '../api/file';
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
//  捋一下这个函数的逻辑，它需要：1. 外部传入分割完的切片；2. 外部传入文件名；就挺啰嗦的
 export const uploadChunks = async (params: {pieces: FilePiece[]; hash: string; file: File | null; onTick?: (progress: number) => void;}) => {
   const { pieces: originChunks, hash, file,onTick } = params;
   const total = originChunks.length;
  //  这个变量没用到
   const pool: Promise<any>[] = []; // 并发池

   const doUpload = async (pieces: FilePiece[]) => {

      for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i];
        const params = { hash, chunk: piece.chunk, index: i };

        
        try {
          const { flag } = await findFile({ hash, index: i }); //查找文件是否已经上传过 没上传则继续上传
          if (!flag) {
            onTick?.(Number(((i / total) * 100).toFixed(2)));
            await  uploadChunk({ ...params });
          }
        } catch (error) {
          console.log(error, "error")
          return;
        }
        
         //await  uploadChunk({ ...params });
        if ((pieces.length-1) === i) {
          console.log('上传完成');
          mergeFile({hash, filename: file?.name})
          onTick?.(100);
        }
      }
      // onTick?.(100);
   }
   await doUpload(originChunks);
 };


 // 这里做文件加密和
export const createHash = ({chunks, onTick}:{chunks: FilePiece[],  onTick?:(percentage: number) => void}): Promise<string> => {
    
  return new Promise( resolve => {
    // 开启多线程
    // 这种方式，能 work 吗？
    // ts 文件会被编译吗？
    // 另外，每次调用这个函数都会加载 worker，确定没问题吗？
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

