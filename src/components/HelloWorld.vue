<template>
  <!-- 这个文件的命名是怎么回事 -->
  <div class="hello">
    <div>
      <input type="file" @change="fileUpload">
    </div>
    
    <div class="demo-progress">
      <el-progress :text-inside="true" :stroke-width="26" :percentage="totalPercentage" />
    </div>
    <div class="file-btn">
      <el-button type="primary" @click="onStartUpload" > 开始</el-button>
      <el-button @click="onPause">{{upload ? '暂停' : '继续'}}</el-button>
    </div>
   
  </div>
</template>
z
<script setup lang="ts">
import { ref } from "vue";
import { createHash, splitFile,uploadChunks, type FilePiece} from "../utils/file"
import store from "@/store"
const file = ref<File | null>(null);
const hash = ref<string>("");
const fileChunks = ref<FilePiece[]>([]);
const totalPercentage = ref<number>(0);
const upload = ref<boolean>(true);
// 选择文件
// 这方法名，跟函数的作用，好像没关系
function fileUpload(e: any) {
  file.value = e.target.files[0];
}

// 开始上传
// 尽可能用箭头函数
async function onStartUpload() {
  
  if(!file.value) {
    alert("请选择文件再上传！")
    return;
  }
  //进行分片
  const fileChunkList = splitFile(file.value);
  // 为什么要把这个 chunks 存储到 vue 响应式系统中？
  // 普通的变量应就能满足需求了吧
  fileChunks.value = fileChunkList
  hash.value = await createHash({ chunks: fileChunkList });
  //开始上传
  await uploadChunks({pieces: fileChunks.value, hash: hash.value, file: file.value, onTick: progress => {
      //console.log(progress, "progress");
      totalPercentage.value = progress;
    },})
}

//继续和暂停
async function onPause() {
  upload.value = !upload.value;
  if (!upload.value) {
    // requests 是怎么来的？这看起来是一个全局副作用，是一种比较不好的设计
    // 比如，如果需要支持同时上传多个文件。。。这就 gg 了吧？
    store.state.requests.forEach((v: any) => v.cancel("取消请求"));
    store.commit('setClearRequests');
    // source = CancelToken.source();
  } else {
      await uploadChunks({pieces: fileChunks.value, hash: hash.value, file: file.value, onTick: progress => {
      //console.log(progress, "progress");
      totalPercentage.value = progress;
    },})
  }
}
// setup 和 class不能共存
// import { Options, Vue } from 'vue-class-component';
// @Options({
//   props: {
//     msg: String
//   }
// })
// export default class HelloWorld extends Vue {
//   msg!: string
// }
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
  margin: 0 10px;;
}
</style>
