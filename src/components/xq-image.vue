<template>
	<view>
    hahaha
    <!-- <image :src="src" :mode="mode"/> -->
    <!-- <image :class="class" :src="src" mode="aspectFit"/> -->
	</view>
</template>

<script>
  import Image from '../image.js'
	export default {
    name: 'xq-image',
		props: {
      mode: String,
      
      url: String,
      key: String,
      
			width: Number,
      height: Number,
      style: String,
		},
		data() {
			return {
				src: null,
        baseUrl: null
			}
		},
		methods: {
			
		},
		mounted() {
      console.log('hhh')
			if (this.url) {
        this.src = this.url
      }
      if (this.key) {
        
      }
		}
	}
</script>

<style lang="less" scoped>
	.aa {
    background-color: white;
  }
</style>
