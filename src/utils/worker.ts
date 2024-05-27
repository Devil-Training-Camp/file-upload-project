import { type FilePiece } from './file'
import SparkMD5 from 'spark-md5'

self.onmessage = async (e) => {
  const fileChunkList = e.data as FilePiece[]
  const spark = new SparkMD5.ArrayBuffer()
  for (let i = 0; i < fileChunkList.length; i++) {
    const chunk = fileChunkList[i].chunk
    // console.log(chunk, "chunk")
    const res = await readChunk(chunk)
    spark.append(res as ArrayBuffer)

    self.postMessage({
      percentage: ((i + 1) / fileChunkList.length) * 100,
    })
  }
  self.postMessage({
    percentage: 100,
    hash: spark.end(),
  })

  self.close()
}

const readChunk = async (chunk: Blob) => {
  return new Promise((resolve, reject) => {
    const read = new FileReader()

    read.readAsArrayBuffer(chunk)
    read.onload = (e) => {
      // console.log(e.target?.result,"res");
      if (e.target) {
        resolve(e.target.result)
      }
    }
  })
}
