<template>
	<div class="name">{{ name }}</div>
	<input type="text" v-bind:value="name" />
	<button class="btn btn-primary" v-on:click="updateName">Click</button>
</template>

<script>
import { ref } from 'vue';

export default {
	setup() {
		const name = ref('minsoftk');

		const updateName = () => {
			name.value = 'minHard!!';
		};

		return {
			name,
			updateName,
		};
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
