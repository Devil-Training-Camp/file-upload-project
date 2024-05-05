<template>
  <div class="hello">
    <div>
      <input type="file" @change="fileUpload">
    </div>
    
    <div class="demo-progress">
      <el-progress :text-inside="true" :stroke-width="26" :percentage="totalPercentage" />
    </div>
    <div class="file-btn">
      <el-button type="primary" @click="onStartUpload" > 开始</el-button>
      <el-button>暂停</el-button>
    </div>
   
  </div>
</template>
z
<script setup lang="ts">
import { ref } from "vue";
import { createHash, splitFile,uploadChunks, type FilePiece} from "../utils/file"

const file = ref<File | null>(null);
const hash = ref<string>();
const fileChunks = ref<FilePiece[]>([]);
const totalPercentage = ref<number>(0);

// 选择文件
function fileUpload(e: any) {
  file.value = e.target.files[0];
}

// 开始上传
async function onStartUpload() {
  
  if(!file.value) {
    alert("请选择文件再上传！")
    return;
  }
  //进行分片
  const fileChunkList = splitFile(file.value);
  fileChunks.value = fileChunkList
  console.log(fileChunkList,"fileChunkList");
  hash.value = await createHash({ chunks: fileChunkList });
  //开始上传
  await uploadChunks({pieces: fileChunks.value, hash: hash.value, onTick: progress => {
      //console.log(progress, "progress");
      totalPercentage.value = progress;
    },})
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
