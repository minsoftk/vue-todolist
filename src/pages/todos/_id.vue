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
		<Toast v-if="showToast" :message="toastMessage" :type="toastAlertType" />
	</form>

	<!-- <Toast /> -->
</template>

<script>
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import _ from 'lodash';
import Toast from '@/components/Toast.vue';
import { useToast } from '@/composables/toast';

export default {
	components: {
		Toast,
	},
	setup() {
		const route = useRoute();
		const router = useRouter();

		const todo = ref(null);
		const originalTodo = ref(null);
		const loading = ref(true);
		const todoId = route.params.id;

		const SUCCESS = 'success';
		const DANGER = 'danger';

		// 컴포넌트가 unmount 됐을 때 settimeout함수가 계속 실행이 된다. 이때 언마운트 메소드에 clearTimeout을 해줘서 clean-up을 해준다.

		const getTodo = async () => {
			try {
				const res = await axios.get(`http://localhost:3000/todos/${todoId}`);
				todo.value = { ...res.data };
				originalTodo.value = { ...res.data };
				loading.value = false;
			} catch (err) {
				console.log(err);
			}
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

		const { toastMessage, toastAlertType, showToast, triggerToast } =
			useToast();

		const onSave = async () => {
			try {
				const res = await axios.put(`http://localhost:3000/todos/${todoId}`, {
					subject: todo.value.subject,
					completed: todo.value.completed,
				});

				originalTodo.value = { ...res.data };
				triggerToast('successfully saved!', SUCCESS);
			} catch (err) {
				console.log(err);
				triggerToast('somthing went wrong!', DANGER);
			}
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
			showToast,
			toastMessage,
			toastAlertType,
		};
	},
};
</script>

<style></style>
