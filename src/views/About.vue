<template>
  <div class="login">
		<div class="startUp">
			<div class="startBg">
				<div class="box"></div>
			</div>
			<div @click="login" class="startImg"></div>
		</div>
		<div id="bodymovin"></div>
    <h1 @click="login">login</h1>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
  },
  methods: {
		...mapActions([
			'Login'
		]),
		login () {
			this.Login({ name: 'li', time: 'dfd' }).then(() => {
				this.$router.push({ path: '/' })
			})
		}
  }
}
</script>

<style lang="scss" scoped>
	.startUp{
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		background: #241f44;
		overflow: hidden;
		.startBg{
			width: 80vh;
			height: 80vh;
			border-radius: 50%;
			position: absolute;
			right: -40vh;
			bottom: -20vh;
			background-image: radial-gradient(at 80px 80px, #8cccff, #07080c);
		}
		.startImg{
			background-image: url(../assets/image/fuly.png);
			background-size: 100%;
			background-repeat: no-repeat;
			width: 40vh;
			height: 60vh;
			position: absolute;
			bottom: -4%;
			right: 0;
			// bottom: -100%;
			transition: all 4s;
			z-index: 100;
			animation: movingIsland 4s ease-in-out 0s infinite alternate;
		}
	}
	@keyframes movingIsland {
		0% {
			transform: translate(0, -7%);
		}
		100%{
			transform: translate(0, -3%);
		}
	}
</style>
