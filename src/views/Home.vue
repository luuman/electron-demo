<template>
  <div class="home">
    <div>下载进度：{{ parseFloat((arg * 100).toFixed(2)) || 0 }}%</div>
    <proBar :numBase="arg"></proBar>
    <div class="content">
      <div class="box" :class="{'disabled': downIs}">
        <p>-----通知下载-----</p>
        <div @click="download('downloadUrl')">下载资源Mac</div>
        <div @click="download('exeDownUrl')">下载资源win</div>
        <div @click="download('exeDownUrlZip')">下载资源winzip</div>
      </div>
      <div class="box" :class="{'disabled': downIs}">
        <p>-----隐秘下载-----</p>
        <div @click="download('downloadUrl')">下载资源Mac</div>
        <div @click="download('exeDownUrl')">下载资源win</div>
        <div @click="download('exeDownUrlZip')">下载资源winzip</div>
      </div>
      <div class="box">
        <p>-----解压-----</p>
        <div @click="zipOpen('downloadUrl')">解压 Mac</div>
        <!-- <div @click="zipOpen('exeDownUrl')">解压 win</div> -->
        <div @click="zipOpen('exeDownUrlZip')">解压 winzip</div>
      </div>
      <div class="box info">
        <p>-----下载状态-----</p>
        <div v-show="appIsShow">APP 未安装</div>
        <div v-show="!appIsShow">APP 已安装</div>
        <div v-show="downIs">{{apiCon.downName}}开始下载</div>
        <div @click="restartApp">restartApp</div>
      </div>
    </div>
    <div v-show="filePath">文件下载地址：{{filePath}}</div>
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
      apiZip: {
        downloadUrl: {
          url: '/Timer.app.zip',
          name: 'Timer'
        },
        exeDownUrlZip: {
          url: '/ReworldLauncher.zip',
          name: '重启世界'
        }
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
    zipOpen (keys) {
      ipcRenderer.send('zip-open', this.apiZip[keys].url, this.apiZip[keys].name)
    },
    // 静默下载
    downloads (keys) {
      this.downIs = true
      ipcRenderer.send('downloads', this.apiCon[keys], '/Users/luuman/Downloads')
      ipcRenderer.on('download-reply', (event, arg) => {
        this.arg = arg
      })
      ipcRenderer.on('download-finish', (event, filePath) => {
          this.appIs()
      })
    },
    // 下载
    download (keys) {
      this.downIs = true
      ipcRenderer.send('download', this.apiCon[keys], '/Users/luuman/Downloads')
      ipcRenderer.on('download-reply', (event, arg) => {
        this.arg = arg
      })
      ipcRenderer.on('download-finish', (event, filePath) => {
        this.appIs()
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
  .disabled {
    pointer-events: none;
    cursor: default;
    opacity: 0.6;
  }
  .content{
    display: flex;
    padding: 20px;
    flex-wrap: wrap;
    justify-content: center;
    align-content: space-between;
    text-align: left;
    .box{
      width: 50%;
      div{
        color: #fff;
        background: #ffb238;
        text-transform: uppercase;
        font-size: 0.9rem;
        padding: 0.25rem 0.75rem;
        border-radius: 2.5px;
        margin: 5px;
        display: inline-block;
      }
    }
    .info{
      div{
        background: none;
      }
    }
  }
</style>
