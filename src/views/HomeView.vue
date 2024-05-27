<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <FileHome msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import FileHome from '@/components/FileHome.vue' // @ is an alias to /src

@Options({
  components: {
    FileHome,
  },
})
export default class HomeView extends Vue {}
</script>
