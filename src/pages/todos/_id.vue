<template>
	<h1>Todo page</h1>
	<div v-if="loading">Loading ...</div>
	<form v-else @submit.prevent="onSave">
		<div class="form-group">
			<div class="row">
				<div class="col-6">
					<div class="form-group">
						<label for="form-control">Subject</label>
						<input v-model="todo.subject" type="text" class="form-control" />
					</div>
				</div>
				<div class="col-6">
					<div class="form-group">
						<label for="form-control">Status</label>
						<div>
							<button
								type="button"
								class="btn"
								:class="todo.completed ? 'btn-success' : 'btn-danger'"
								@click="toggleTodoStatus"
							>
								{{ todo.completed ? 'Completed' : 'Incompleted' }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<button type="submit" class="btn btn-primary" :disabled="todoUpdated">
			Save
		</button>
		<button
			type="submit"
			class="btn btn-outline-dark ml-2"
			@click="moveToTodoList"
		>
			Cancel
		</button>
	</form>
</template>

<script>
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import _ from 'lodash';

export default {
	setup() {
		const route = useRoute();
		const router = useRouter();

		const todo = ref(null);
		const originalTodo = ref(null);
		const loading = ref(true);
		const todoId = route.params.id;

		const getTodo = async () => {
			const res = await axios.get(`http://localhost:3000/todos/${todoId}`);
			todo.value = { ...res.data };
			originalTodo.value = { ...res.data };
			loading.value = false;
		};
		getTodo();

		const toggleTodoStatus = () => {
			todo.value.completed = !todo.value.completed;
		};

		const moveToTodoList = () => {
			router.push({
				name: 'Todos',
			});
		};

		const onSave = async () => {
			await axios.put(`http://localhost:3000/todos/${todoId}`, {
				subject: todo.value.subject,
				completed: todo.value.completed,
			});
			moveToTodoList();
		};

		const todoUpdated = computed(() => {
			return _.isEqual(todo.value, originalTodo.value);
		});
		return {
			todo,
			loading,
			toggleTodoStatus,
			moveToTodoList,
			onSave,
			originalTodo,
			todoUpdated,
		};
	},
};
</script>

<style></style>
