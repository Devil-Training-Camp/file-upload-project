import { findFile, uploadChunk, mergeFile, test } from '../api/file'
import { type CancelTokenSource } from 'axios'
import { getUploadedChunks, saveChunkInfo, clearChunks } from "./indexDB"
// 文件操作工具
export interface FilePiece {
  chunk: Blob
  size: number
}
// 分片的长度
const CHUNK_SIZE = 5 * 1024 * 1024

let workerInstance: Worker | null = null
/**
 * @file 目标文件
 * @chunkSize 分片大小
 */
export const splitFile = (file: File, chunkSize = CHUNK_SIZE) => {
  const fileChunkList: FilePiece[] = []
  let len = 0
  while (len < file.size) {
    // 一个分片
    const piece = file.slice(len, len + chunkSize)
    fileChunkList.push({
      chunk: piece,
      size: piece.size,
    })
    len += chunkSize
  }
  return fileChunkList
}

/**
 * @pieces 所有的文件分片
 * @hash 计算好的hash
 * @onTick 进度的回调函数
 */
export const uploadChunks = async (params: {
  pieces: FilePiece[]
  hash: string
  file: File | null
  onTick?: (progress: number) => void
  cancelToken: CancelTokenSource
}) => {
  const { pieces: originChunks, hash, file, onTick, cancelToken } = params;
  const total = originChunks.length;
  const poolLimit = 5; // 并发限制数
  let currentIndex = 0; // 当前上传的分片索引
  let completed = 0; // 完成的分片数量
  // 这个 test 函数是干啥的
  test();

  const pool: Promise<void>[] = [];

  // 获取已上传的分片信息
  const uploadedChunks = await getUploadedChunks(hash);
  const uploadedIndexes = uploadedChunks.map(chunk => chunk.index);
  completed = uploadedIndexes.length;

  const doUpload = async (piece: FilePiece, index: number) => {
    const params = { hash, chunk: piece.chunk, index };
    try {
      const { flag } = await findFile({ hash, index });
      if (!flag) {
        onTick?.(Number(((completed / total) * 100).toFixed(2)));
        await uploadChunk({ ...params, cancelToken });
        await saveChunkInfo(hash, index);
      }
    } catch (error) {
      console.log(error, 'error');
      if (!navigator.onLine) {
        await saveChunkInfo(hash, index);
      }
      return;
    }

    completed += 1;
    onTick?.(Number(((completed / total) * 100).toFixed(2)));

    if (completed === total) {
      console.log('上传完成');
      await mergeFile({ hash, filename: file?.name });
      onTick?.(100);
      await clearChunks(hash); 
    }

    if (currentIndex < total) {
      const nextPiece = originChunks[currentIndex];
      currentIndex += 1;
      pool.push(doUpload(nextPiece, currentIndex - 1).then(() => {
        pool.splice(pool.findIndex(p => p === this), 1);
      }));
    }
  };

  while (currentIndex < poolLimit && currentIndex < total) {
    const piece = originChunks[currentIndex];
    currentIndex += 1;
    pool.push(doUpload(piece, currentIndex - 1).then(() => {
      pool.splice(pool.findIndex(p => p === this), 1);
    }));
  }

  await Promise.all(pool);
};



// 这里做文件加密和
export const createHash = ({
  chunks,
  onTick,
}: {
  chunks: FilePiece[]
  onTick?: (percentage: number) => void
}): Promise<string> => {
  return new Promise((resolve) => {
    // 开启多线程
    const worker = getWorker()
    worker.postMessage(chunks)
    worker.onmessage = (e) => {
      // console.log("我回收到的message", e.data);
      const { hash, percentage } = e.data
      onTick?.(parseInt(percentage.toFixed(2)))
      if (hash) {
        resolve(hash)
      }
    }
  })
}

export const getWorker = (): Worker => {
  if (!workerInstance) {
    workerInstance = new Worker(new URL('./worker', import.meta.url), {
      type: 'module',
    })
  }
  return workerInstance
}
