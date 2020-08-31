<template>
  <div class="home">
    <div @click="download" v-show="!downIs && appIsShow">下载资源</div>
    <div v-show="downIs">开始下载</div>
    <div v-show="appIsShow">APP 未安装</div>
    <div v-show="!appIsShow">APP 已安装</div>
    <div v-show="downIs">{{ parseFloat((arg * 100).toFixed(2)) }}%</div>
    <div v-show="filePath">文件下载地址：{{filePath}}</div>
    <proBar :numBase="arg"></proBar>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { ipcRenderer } from 'electron'
// import bodymovin from 'bodymovin'
// const animationData = require('../../static/planets-spinning.json')
import proBar from '@/components/ui/progress-bar'
export default {
  name: 'Home',
  components: {
    proBar
  },
  data() {
    return {
      arg: 0,
      downIs: false,
      appIsShow: false,
      appIsDone: '',
      filePath: '',
      downloadUrl: 'https://github.com/agalwood/Motrix/releases/download/v1.5.15/Motrix-1.5.15-mac.zip',
      downName: 'Motrix'
    }
  },
  mounted () {
    this.appIs()
  },
  methods: {
    // app是否安装
    appIs () {
      ipcRenderer.send('appIs', this.downName)
      ipcRenderer.on('appIs-finish', (event, buffer) => {
        console.log(buffer)
        if (buffer) {
          this.openApp(this.downName)
          clearInterval(this.appIsDone)
          this.appIsShow = false
        } else this.appIsShow = true
      })
    },
    // 打开app
    openApp (appName) {
      ipcRenderer.send('openApp', appName)
    },
    // 下载
    download () {
      this.downIs = true
      ipcRenderer.send('download', this.downloadUrl)
      ipcRenderer.on('download-reply', (event, arg) => {
        console.time()
        this.arg = arg
        console.log(arg)
        console.timeEnd()
      })
      ipcRenderer.on('download-finish', (event, filePath) => {
        this.appIsDone = setInterval(() => {
          this.appIs()
        }, 2000)
        this.filePath = filePath
      })
    }
  }
}
</script>
<style lang="scss">
  body{
    background: #2a2a2a url("../assets/image/bg.png") 0 0 repeat;
    color: #fff;
  }
</style>
