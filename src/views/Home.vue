<template>
  <div class="home">
    <div @click="download('downloadUrl')" v-show="!downIs && appIsShow">下载资源Mac</div>
    <!-- <div @click="download('exeDownUrl')" v-show="!downIs && appIsShow">下载资源win</div> -->
    <div @click="download('exeDownUrlZip')" v-show="!downIs && appIsShow">下载资源winzip</div>
    <div @click="restartApp">restartApp</div>
    <div v-show="downIs">{{apiCon.downName}} 开始下载</div>
    <div v-show="appIsShow">APP 未安装</div>
    <div v-show="!appIsShow">APP 已安装</div>
    <div v-show="downIs">{{ parseFloat((arg * 100).toFixed(2)) }}%</div>
    <div v-show="filePath">文件下载地址：{{filePath}}</div>
    <proBar :numBase="arg"></proBar>
    <!-- <div @click="unzip(item)" v-for="item in zip" :key="item">{{item}}</div> -->
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
      zip: ['DecompressZip', 'unzip', 'AdmZip', 'StreamZip', 'compressing', 'extractFile'],
      arg: 0,
      downIs: false,
      appIsShow: '',
      appIsDone: '',
      // apiCon: {
      //   downloadUrl: 'https://github.com/agalwood/Motrix/releases/download/v1.5.15/Motrix-1.5.15-mac.zip',
      //   zipPath: '/Users/luuman/Downloads/Motrix-1.5.15-mac.zip',
      //   downName: 'Motrix'
      // },
      apiCon: {
        downloadUrl: 'https://github.com/michaelvillar/timer-app/releases/download/1.5.5/Timer.app.zip',
        exeDownUrl: 'https://apkstore.reworlder.com/Launcher/LaunchPlayer.exe',
        exeDownUrlZip: 'https://github.com/luuman/Index/releases/download/world/ReworldLauncher.zip',
        zipPath: '/Users/luuman/Downloads/Timer.app.zip',
        downName: 'Timer'
      },
      filePath: ''
    }
  },
  mounted () {
    this.appIs()
  },
  methods: {
    restartApp () {
      ipcRenderer.send('restartApp', this.apiCon.downName)
    },
    // app是否安装
    appIs () {
      console.log('appIs')
      ipcRenderer.send('appIs', this.apiCon.downName)
      this.appIsShow = true
      ipcRenderer.on('appIs-finish', (event, buffer) => {
        console.log('buffer', buffer)
        if (buffer) {
          this.openApp(this.apiCon.downName)
          // clearInterval(this.appIsDone)
          this.appIsShow = false
        } else this.appIsShow = true
      })
    },
    unzip (name) {
      // ipcRenderer.send(name, '/Users/luuman/Downloads/Motrix-1.5.15-mac.zip', '/Users/luuman/Downloads/Motrix')
      ipcRenderer.send(name, this.apiCon.zipPath, '/Users/luuman/Downloads/ZipDown')
      // ipcRenderer.send(name, '/Users/luuman/Library/Caches/electron/httpsgithub.comelectronelectronreleasesdownloadv10.1.0electron-v10.1.0-darwin-x64.zip/electron-v10.1.0-darwin-x64.zip', '/Users/luuman/Downloads/Motrix')
      // ipcRenderer.send(name, '/Users/luuman/Downloads/galshir.zip', '/Users/luuman/Downloads/Motrix')
    },
    // 打开app
    openApp (appName) {
      ipcRenderer.send('openApp', appName)
    },
    // 下载
    download (keys) {
      this.downIs = true
      ipcRenderer.send('download', this.apiCon[keys], '/Users/luuman/Downloads')
      ipcRenderer.on('download-reply', (event, arg) => {
        // console.time()
        this.arg = arg
        // console.log(arg)
        // console.timeEnd()
      })
      ipcRenderer.on('download-finish', (event, filePath) => {
          this.appIs()
        // this.appIsDone = setInterval(() => {
        // }, 2000)
        // this.filePath = filePath
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
