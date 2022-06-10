<template>
	<div v-for="(todo, index) in todos" :key="todo.id" class="card mt-2">
		<div
			@click="moveToPage(todo.id)"
			class="card-body p-2 d-flex align-items-center"
		>
			<div class="form-check flex-grow-1">
				<!-- 자식에서 부모 데이터를 변경시켜서는 안된다. v-model을 쓰게 되면 props 데이터를 변경시키게 된다. -->
				<input
					class="form-check-input"
					type="checkbox"
					:value="todo.completed"
					@change="toggleTodo(index)"
				/>
				<label
					:style="todo.completed ? todoStyle : ''"
					:class="{
						todo: todo.completed,
					}"
					class="form-check-label"
				>
					{{ todo.subject }}
				</label>
			</div>
			<div>
				<button @click="deleteTodo(index)" class="btn btn-danger btn-sm">
					Delete
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
	// props:['todos']
	props: {
		todos: {
			type: Array,
			required: true,
		},
	},
	emits: ['toggle-todo', 'delete-todo'],
	setup(props, { emit }) {
		const router = useRouter();
		const toggleTodo = (index) => {
			emit('toggle-todo', index);
		};

		const deleteTodo = (index) => {
			emit('delete-todo', index);
		};

		const moveToPage = (todoId) => {
			console.log(todoId);
			router.push({
				name: 'Todo',
				params: {
					id: todoId,
				},
			});
		};

		return { toggleTodo, deleteTodo, moveToPage };
	},
};
</script>

<style></style>
