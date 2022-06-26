<template>
	<div id="app">
		<Header></Header>
		<Carousel></Carousel>
		<router-view></router-view>


		<div class="scroll-button" :class="isScrollBottom? 'scroll-button' : 'scroll-button-top'" @click="scrollTopDown">
			<!-- <font-awesome-icon icon="caret-down"></font-awesome-icon> -->
		</div>
		
		<Footer></Footer>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
  
	import Header from '@/components/Header.vue';
	import Footer from '@/components/Footer.vue';
	import Carousel from '@/components/Carousel.vue';

	@Component({
		components:{
			Header,
			Footer,
			Carousel,			
		}
	})

	export default class App extends Vue {
		// props
		
		// data
		isScrollBottom = true;
		
		
		// methods
		scrollTopDown():void{
        let top = document.documentElement.scrollTop < document.documentElement.scrollHeight - window.innerHeight? document.documentElement.scrollHeight - window.innerHeight : 0;
        this.isScrollBottom = document.documentElement.scrollTop < document.documentElement.scrollHeight - window.innerHeight;

        window.scrollTo({
            top: top,
            left:0,
            behavior: 'smooth'
        });                
      }
	}
</script>

<style lang="scss">
	#app {
		font-family: Arial, Helvetica, sans-serif;
	//   -webkit-font-smoothing: antialiased;
	//   -moz-osx-font-smoothing: grayscale;
	//   text-align: center;
	//   color: #2c3e50;
	}
</style>
