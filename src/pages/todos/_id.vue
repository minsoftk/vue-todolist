<template>
	<h1>Todo page</h1>
	<TodoForm :editing="true" />
	<!-- <Toast /> -->
</template>

<script>
import TodoForm from '@/components/TodoForm.vue';

export default {
	components: {
		TodoForm,
	},
};
</script>

<style></style>
