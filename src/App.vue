<template>
  <div class="main" id="app">
    <!-- <div class="top-titlebar"></div> -->
    <div class="con">
      <div class="menu" style="-webkit-app-region: drag">{{ $t('userManagement')}}</div>
      <div class="boxs">
        <div class="header" style="-webkit-app-region: drag">header</div>
        <router-view class="app"/>
      </div>
    </div>
    <div class="footer" style="-webkit-app-region: drag">footer</div>
  </div>
</template>

<script>
// import { inject } from 'vue'

import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  data() {
    return {
    }
  },
  mounted () {
    console.log('linkList', this.$t)
    const electron = window.electron
    const remote = window.remote
    console.log(electron)
    console.log(remote)
    window.onbeforeunload = function() {
      var n = window.event.screenX - window.screenLeft
      var b = n > document.documentElement.scrollWidth - 20
      if ((b && window.event.clientY < 0) || window.event.altKey) {
        alert('这是一个关闭操作而非刷新')
        window.event.returnValue = ''
      } else {
        alert('这是一个刷新操作而非关闭')
      }
  }
    // const { dialog } = window.remote
    // dialog.showErrorBox('title', 'con')
  },
  methods: {
  }
}
</script>
<style lang="scss">
  .top-titlebar {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 32px;
    background-color: #7a7c7c;
    -webkit-user-select: none;
    -webkit-app-region: drag;
  }
  html, body, #app{
    margin: 0;
    padding: 0;
    height: 100%;
    color: #fff;
    user-select: none;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
  #nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
  .main{
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to bottom, #101a2a 0%,#01060b 100%);
  }
  .con{
    flex: 1;
    height: 100%;
    display: flex;
  }
  .menu{
    width: 70px;
    height: 100%;
    border-right: 1px solid #ffffff3b;
  }
  .boxs{
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header{
    height: 70px;
    width: 100%;
    border-bottom: 1px solid #ffffff3b;
  }
  .app{
    flex: 1;
  }
  .footer{
    height: 70px;
    width: 100%;
    border-top: 1px solid #ffffff3b;
  }
</style>
