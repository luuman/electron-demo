<template>
  <div class="home">
    <div @click="download">下载资源</div>
    <div>{{ arg }}</div>
    <div id="svgContainer" style=""></div>
    <lottie :options="defaultOptions" :height="400" :width="400" v-on:animCreated="handleAnimation"/>
    <!-- <div>
      <p>Speed: x{{ animationSpeed }}</p>
      <input type="range" value="1" min="0" max="3" step="0.5" v-on:change="onSpeedChange" v-model="animationSpeed">
    </div> -->
    <button v-on:click="stop">stop</button>
    <button v-on:click="pause">pause</button>
    <button v-on:click="play">play</button>
		<!-- <div>dsljfdlfj</div> -->
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { ipcRenderer } from 'electron'
import * as animationData from '../../static/planets-spinning.json'
// import bodymovin from 'bodymovin'
// const animationData = require('../../static/planets-spinning.json')
import Lottie from '@/components/anim/lottie'
import animationDatas from '../../static/planets.json'
export default {
  name: 'Home',
  components: {
    Lottie
  },
  data() {
    return {
      arg: 0,
      defaultOptions: {
        animationData: animationDatas
      },
      animationSpeed: 1
    }
  },
  mounted () {
    this.setTime()
  },
  methods: {
    download () {
      ipcRenderer.send('download', 'https://github.com/agalwood/Motrix/releases/download/v1.5.15/Motrix-1.5.15-mac.zip')
      ipcRenderer.on('download-reply', (event, arg) => {
        console.time()
        this.arg = arg
        console.log(arg)
        console.timeEnd()
      })
    },
    handleAnimation: function (anim) {
      this.anim = anim
    },
    stop: function () {
      this.anim.stop()
    },
    play: function () {
      this.anim.play()
    },
    pause: function () {
      this.anim.pause()
    },
    onSpeedChange: function () {
      this.anim.setSpeed(this.animationSpeed)
    },
    setTime (time) {
      /* Shapes */
      console.log(animationData)
      // animationData = ''
      var svgContainer = document.getElementById('svgContainer')
      var animItem = window.bodymovin.loadAnimation({
        wrapper: svgContainer,
        animType: 'svg',
        loop: true,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        },
        animationData: animationData.default
      })
      console.log(animItem)
    }
  }
}
</script>
<style lang="scss" scoped>
	#svgContainer {
    width: 80%;
    height: 80%;
    background-color: #000;
    // position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
	}
</style>
