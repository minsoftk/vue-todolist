<template>
	<div class="container">
		<h2>To-Do List</h2>
		<h4>{{ count }}</h4>
		<h4>{{ doubleCount }}</h4>
		<h4>{{ doubleCountMethod() }}</h4>
		<button @click="count++">Add</button>
		<TodoSimpleForm @add-todo="addTodo" />

		<span v-if="!todos.length">추가된 Todo가 없습니다.</span>
	</div>
	<TodoList
		:todos="todos"
		@toggle-todo="toggleTodo"
		@delete-todo="deleteTodo"
	></TodoList>
</template>

<script>
import { ref, computed } from 'vue';
import TodoSimpleForm from './components/TodoSimpleForm.vue';
import TodoList from './components/TodoList.vue';

export default {
	components: {
		TodoSimpleForm,
		TodoList,
	},
	setup() {
		const todos = ref([]);
		const todoStyle = {
			textDecoration: 'line-through',
			color: 'gray',
		};

		const addTodo = (todo) => {
			todos.value.push(todo);
			console.log(todos.value);
		};
		const toggleTodo = (idx) => {
			todos.value[idx].completed = !todos.value[idx].completed;
		};

		const deleteTodo = (idx) => {
			todos.value.splice(idx, 1);
		};

		const count = ref(1);
		const doubleCount = computed(() => {
			return count.value * 2;
		});

		const doubleCountMethod = () => {
			return count.value * 2;
		};

		return {
			todos,
			todoStyle,
			addTodo,
			toggleTodo,
			deleteTodo,
			count,
			doubleCount,
			doubleCountMethod,
		};
	},
};
</script>

<style>
.name {
	color: red;
}
.todo {
	text-decoration: line-through;
	color: gray;
}
</style>
