<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
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
    console.log('linkList', this.token)
    const electron = window.electron
    const remote = window.remote
    console.log(electron)
    console.log(remote)

    // const { dialog } = window.remote
    // dialog.showErrorBox('title', 'content')
  },
  methods: {
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
</style>
