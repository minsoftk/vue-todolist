<template>
	<div class="container">
		<h2>To-Do List</h2>
		<input
			class="form-control"
			type="text"
			v-model="searchText"
			placeholder="Search"
		/>
		<TodoSimpleForm @add-todo="addTodo" />
		<div style="color: red">{{ error }}</div>
		<span v-if="!filteredTodos.length">추가된 Todo가 없습니다.</span>
	</div>
	<TodoList
		:todos="filteredTodos"
		@toggle-todo="toggleTodo"
		@delete-todo="deleteTodo"
	></TodoList>
	<hr />
	<nav aria-label="Page navigation example">
		<ul class="pagination">
			<li v-if="currentPage !== 1" class="page-item">
				<a class="page-link" href="#" @click="getTodos(currentPage - 1)">
					Previous
				</a>
			</li>
			<li
				v-for="page in numberOfPages"
				:key="page"
				class="page-item"
				:class="currentPage === page ? 'active' : ''"
			>
				<a class="page-link" href="#" @click="getTodos(page)">{{ page }}</a>
			</li>

			<li v-if="currentPage !== numberOfPages" class="page-item">
				<a class="page-link" href="#" @click="getTodos(currentPage + 1)"
					>Next</a
				>
			</li>
		</ul>
	</nav>
	{{ numberOfPages }}
	{{ numberOfTodos }}
</template>

<script>
import { ref, computed, watchEffect, watch } from 'vue';
import TodoSimpleForm from './components/TodoSimpleForm.vue';
import TodoList from './components/TodoList.vue';
import axios from 'axios';

export default {
	components: {
		TodoSimpleForm,
		TodoList,
	},
	setup() {
		const todos = ref([]);
		const error = ref('');

		const numberOfTodos = ref(0);
		const numberOfPages = computed(() => {
			return Math.ceil(numberOfTodos.value / limit);
		});
		const limit = 5;
		const currentPage = ref(1);

		const todoStyle = {
			textDecoration: 'line-through',
			color: 'gray',
		};

		// React의 useEffect와 유사하다. watchEffect안에 reactive 상태가 있다면
		// 계속 실행된다.
		watchEffect(() => {
			console.log(currentPage.value);
		});

		// watch 같은 경우 하나를 지켜보는 경우, 여러가지를 지켜보는 경우가 있다.
		// reactive인 경우에 ()=> val 형식을 첫번째 인자에 넣어준다.
		// 객체이기 때문에 1개 이상을 watch 할 경우 ()=> [a.b, a.c] 와 같이 써준다.
		// ref 상태의 경우도 [currentPage, numberOfTodos] 와 같이 넣어줄 수 있다.
		watch(currentPage, (currentPage, prev) => {
			console.log(currentPage, prev);
		});

		const getTodos = async (page = currentPage.value) => {
			currentPage.value = page;
			console.log(page);
			try {
				const res = await axios.get(
					`http://localhost:3000/todos?_page=${page}&_limit=${limit}`
				);
				numberOfTodos.value = res.headers['x-total-count'];
				todos.value = res.data;
			} catch (err) {
				console.log(err);
				error.value = 'something went wrong.';
			}
		};

		getTodos();

		const addTodo = async (todo) => {
			// 데이터베이스 투두를 저장
			error.value = '';
			try {
				const res = await axios.post('http://localhost:3000/todos', {
					subject: todo.subject,
					completed: todo.completed,
				});
				todos.value.push(res.data);
			} catch (err) {
				console.log(err);
				error.value = 'Something went wrong.';
			}
		};

		const toggleTodo = async (idx) => {
			const id = todos.value[idx].id;
			try {
				await axios.patch('http://localhost:3000/todos/' + id, {
					completed: !todos.value[idx].completed,
				});

				todos.value[idx].completed = !todos.value[idx].completed;
			} catch (err) {
				console.log(err);
				error.value = 'Something went wrongs.';
			}
		};

		const deleteTodo = async (idx) => {
			error.value = '';
			const id = todos.value[idx].id;
			try {
				await axios.delete('http://localhost:3000/todos/' + id);

				todos.value.splice(idx, 1);
			} catch (err) {
				console.log(err);
				error.value = 'Something went wrongs.';
			}
		};

		// computed에서 함수와 메소드의 차이는 무엇인가? computed는 reactive state가 있을 경우나 변경이 있을 경우에 실행이 된다. computed 같은 경우에는 2번 실행이 되도 값을 저장하고 있기 때문에 변하지 않지만 함수 같은 경우에 2번 실행이 되어버린다.
		const count = ref(1);
		const doubleCount = computed(() => {
			return count.value * 2;
		});

		const doubleCountMethod = () => {
			return count.value * 2;
		};

		// 검색 기능
		const searchText = ref('');
		const filteredTodos = computed(() => {
			if (searchText.value) {
				return todos.value.filter((todo) =>
					todo.subject.includes(searchText.value)
				);
			}
			return todos.value;
		});

		return {
			todos,
			todoStyle,
			addTodo,
			toggleTodo,
			deleteTodo,
			count,
			doubleCount,
			doubleCountMethod,

			searchText,
			filteredTodos,
			numberOfPages,
			currentPage,
			getTodos,
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
