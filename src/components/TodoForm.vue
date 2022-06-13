<template>
	<div v-if="loading">Loading ...</div>
	<form v-else @submit.prevent="onSave">
		<div class="form-group">
			<div class="row">
				<div class="col-6">
					<div class="form-group">
						<label for="form-control">Subject</label>
						<input v-model="todo.subject" type="text" class="form-control" />
						<div v-if="subjectError" style="color: red">{{ subjectError }}</div>
					</div>
				</div>
				<div v-if="editing" class="col-6">
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
				<div class="col-12">
					<div class="form-group">
						<label>Body</label>
						<textarea v-model="todo.body" class="form-control"></textarea>
					</div>
				</div>
			</div>
		</div>
		<button type="submit" class="btn btn-primary" :disabled="todoUpdated">
			{{ editing ? 'Save' : 'Create' }}
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
</template>

<script>
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { ref, computed, watch, watchEffect } from 'vue';
import _ from 'lodash';
import Toast from '@/components/Toast.vue';
import { useToast } from '@/composables/toast';

export default {
	components: {
		Toast,
	},
	props: {
		editing: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const route = useRoute();
		const router = useRouter();

		const todo = ref({
			subject: '',
			completed: false,
			body: '',
		});
		const originalTodo = ref(null);
		const loading = ref(false);
		const todoId = route.params.id;

		const DANGER = 'danger';

		const subjectError = ref(false);

		// 컴포넌트가 unmount 됐을 때 settimeout함수가 계속 실행이 된다. 이때 언마운트 메소드에 clearTimeout을 해줘서 clean-up을 해준다.

		// watchEffect(() => {
		// 	console.log(todo.value.subject);
		// 	if (todo.value.subject.length !== 0) subjectError.value = '';
		// });

		watch(todo.value.subject, (todo, prev) => {
			console.log('test2', todo, prev);
		});

		const getTodo = async () => {
			loading.value = true;
			try {
				const res = await axios.get(`http://localhost:3000/todos/${todoId}`);
				todo.value = { ...res.data };
				originalTodo.value = { ...res.data };
				loading.value = false;
			} catch (err) {
				loading.value = false;
				console.log(err);
			}
		};
		if (props.editing) {
			getTodo();
		}

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
			subjectError.value = '';
			if (!todo.value.subject) {
				subjectError.value = 'Subject is required';
				return;
			}
			try {
				let res;
				const data = {
					subject: todo.value.subject,
					completed: todo.value.completed,
					body: todo.value.body,
				};
				const URL = `http://localhost:3000/todos/${todoId}`;
				if (props.editing) {
					res = await axios.put(`http://localhost:3000/todos/${todoId}`, data);
					originalTodo.value = { ...res.data };
				} else {
					res = await axios.post('http://localhost:3000/todos', data);
					todo.value.subject = '';
					todo.value.body = '';
				}

				const message = `successfully ${
					props.editing ? 'Updated!' : 'Created!'
				}`;
				triggerToast(message);
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

			subjectError,
		};
	},
};
</script>

<style></style>
