<template>
  <div class="hello">
    <div>
      <input type="file" @change="getFile" />
    </div>

    <div class="demo-progress">
      <el-progress
        :text-inside="true"
        :stroke-width="26"
        :percentage="totalPercentage"
      />
    </div>
    <div class="file-btn">
      <el-button type="primary" @click="onStartUpload"> 开始</el-button>
      <el-button @click="onPause">{{ upload ? '暂停' : '继续' }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  createHash,
  splitFile,
  uploadChunks,
  type FilePiece,
} from '../utils/file'
import axios from 'axios'

const file = ref<File | null>(null)
const hash = ref<string>('')
const fileChunks = ref<FilePiece[]>([])
const totalPercentage = ref<number>(0)
const upload = ref<boolean>(true)

const CancelToken = axios.CancelToken
let source = CancelToken.source()
// 选择文件
const getFile = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

// 开始上传
const onStartUpload = async () => {
  if (!file.value) {
    alert('请选择文件再上传！')
    return
  }

  //进行分片
  const fileChunkList = splitFile(file.value)
  hash.value = await createHash({ chunks: fileChunkList })
  
  await uploadChunks({
    pieces: fileChunkList,
    hash: hash.value,
    file: file.value,
    onTick: (progress) => {
      totalPercentage.value = progress
    },
    cancelToken: source,
  })
}

//继续和暂停
const onPause = async () => {
  upload.value = !upload.value
  if (!upload.value) {
    source.cancel('终止上传！')
    source = CancelToken.source()
  } else {
    // 比之前版本简单了很多了，不错
    await uploadChunks({
      pieces: fileChunks.value,
      hash: hash.value,
      file: file.value,
      onTick: (progress) => {
        totalPercentage.value = progress
      },
      cancelToken: source,
    })
  }
}

</script>

<style scoped lang="scss">
.demo-progress {
  text-align: center;
  text-align: -webkit-center;
  margin: 15px 0;
}
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
.file-btn button {
  margin: 0 10px;
}
</style>
