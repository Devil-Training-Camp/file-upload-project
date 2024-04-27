<template>
  <div class="hello">
    <div>
      <input type="file" @change="fileUpload">
    </div>
    
    <div class="demo-progress">
      <el-progress :text-inside="true" :stroke-width="26" :percentage="0" />
    </div>
    <div class="file-btn">
      <el-button type="primary">开始</el-button>
      <el-button>暂停</el-button>
    </div>
   
  </div>
</template>

<script setup lang="ts">



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
