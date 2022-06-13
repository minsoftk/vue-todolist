<template>
	<router-view />
	<div class="container">
		<div class="d-flex justify-content-between mb-3">
			<h2>To-Do List</h2>
			<button class="btn btn-primary" @click="moveToCreatePage">
				create todo
			</button>
		</div>
		<input
			class="form-control mb-3"
			type="text"
			v-model="searchText"
			placeholder="Search"
			@keyup.enter="searchTodo"
		/>

		<div style="color: red">{{ error }}</div>
		<span v-if="!todos.length">추가된 Todo가 없습니다.</span>
	</div>
	<TodoList
		:todos="todos"
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
	<Toast v-if="showToast" :message="toastMessage" :type="toastAlertType" />
	{{ numberOfPages }}
	{{ numberOfTodos }}
</template>

<script>
import { ref, computed, watchEffect, watch } from 'vue';
import TodoList from '@/components/TodoList.vue';
import axios from 'axios';
import Toast from '@/components/Toast.vue';
import { useToast } from '@/composables/toast';
import { useRouter } from 'vue-router';

export default {
	components: {
		TodoList,
		Toast,
	},
	setup() {
		// 할일 목록 관리
		const todos = ref([]);
		const error = ref('');

		// 페이징
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

		// 검색
		const searchText = ref('');

		//Toast
		const SUCCESS = 'success';
		const DANGER = 'danger';

		// Modal control

		const router = useRouter();
		console.log('🚀 ~ file: index.vue ~ line 94 ~ setup ~ router', router);
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

		//Toast Box - useToast
		const { toastMessage, toastAlertType, showToast, triggerToast } =
			useToast();

		// Todo 메소드
		const getTodos = async (page = currentPage.value) => {
			currentPage.value = page;
			console.log(page);
			try {
				const res = await axios.get(
					`http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`
				);
				numberOfTodos.value = res.headers['x-total-count'];
				todos.value = res.data;
			} catch (err) {
				console.log(err);
				error.value = 'something went wrong.';
				triggerToast('something went wrong.', DANGER);
			}
		};

		getTodos();

		const addTodo = async (todo) => {
			// 데이터베이스 투두를 저장
			error.value = '';
			try {
				await axios.post('http://localhost:3000/todos', {
					subject: todo.subject,
					completed: todo.completed,
				});
				getTodos(1);
			} catch (err) {
				console.log(err);
				error.value = 'Something went wrong.';
			}
		};

		const toggleTodo = async (idx, checked) => {
			console.log(checked);

			const id = todos.value[idx].id;
			try {
				await axios.patch('http://localhost:3000/todos/' + id, {
					// completed: !todos.value[idx].completed,
					completed: checked,
				});

				getTodos(1);
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

				getTodos(1);
			} catch (err) {
				console.log(err);
				error.value = 'Something went wrongs.';
				triggerToast('Something went wrongs.', DANGER);
			}
		};

		// computed
		// computed에서 함수와 메소드의 차이는 무엇인가? computed는 reactive state가 있을 경우나 변경이 있을 경우에 실행이 된다. computed 같은 경우에는 2번 실행이 되도 값을 저장하고 있기 때문에 변하지 않지만 함수 같은 경우에 2번 실행이 되어버린다.
		const count = ref(1);
		const doubleCount = computed(() => {
			return count.value * 2;
		});

		const doubleCountMethod = () => {
			return count.value * 2;
		};

		// 검색 기능
		// const filteredTodos = computed(() => {
		// 	if (searchText.value) {
		// 		return todos.value.filter((todo) =>
		// 			todo.subject.includes(searchText.value)
		// 		);
		// 	}
		// 	return todos.value;
		// });

		// 스로틀, 디바운스?
		// new 텍스트를 치게 되는 경우에
		// 2초가 되기 전에 타이핑이 되는 경우에 이벤트를 clear하게 된다.
		let timeout = null;
		watch(searchText, () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				getTodos(1);
			}, 2000);
			getTodos(1);
		});

		//엔터를 클릭했을 때는 바로 요청을 하게 만든다.
		const searchTodo = () => {
			clearTimeout(timeout);
			getTodos(1);
		};

		//새로운 add page 생성
		//moveToCreatePage
		const moveToCreatePage = () => {
			router.push({
				name: 'TodoCreate',
			});
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

			searchText,
			// filteredTodos,
			numberOfPages,
			currentPage,
			getTodos,
			searchTodo,

			//Toast
			showToast,
			toastMessage,
			toastAlertType,
			SUCCESS,
			DANGER,
			triggerToast,

			// 새로운 add page 생성
			moveToCreatePage,
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
