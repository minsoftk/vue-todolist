<template>
	<List :items="todos">
		<template v-slot:default="{ item, index }">
			<div
				style="cursor: pointer"
				@click="moveToPage(item.id)"
				class="card-body p-2 d-flex align-items-center"
			>
				<div class="form-check flex-grow-1">
					<!-- 자식에서 부모 데이터를 변경시켜서는 안된다. v-model을 쓰게 되면 props 데이터를 변경시키게 된다. -->
					<input
						class="form-check-input"
						type="checkbox"
						:checked="item.completed"
						@change="toggleTodo(index, $event)"
						@click.stop
					/>
					<label
						:style="item.completed ? todoStyle : ''"
						:class="{
							todo: item.completed,
						}"
						class="form-check-label"
					>
						{{ item.subject }}
					</label>
				</div>
				<div>
					<button
						@click.stop="openModal(item.id)"
						class="btn btn-danger btn-sm"
					>
						Delete
					</button>
				</div>
			</div>
		</template>
	</List>
	<teleport to="#modal">
		<Modal v-if="showModal" @close-modal="closeModal" @delete-todo="deleteTodo">
		</Modal>
	</teleport>
</template>

<script>
import { useRouter } from 'vue-router';
import Modal from '@/components/DeleteModal.vue';
import List from '@/components/List.vue';
import { ref } from 'vue';

export default {
	// props:['todos']
	components: {
		Modal,
		List,
	},
	props: {
		todos: {
			type: Array,
			required: true,
		},
	},
	emits: ['toggle-todo', 'delete-todo'],
	setup(props, { emit }) {
		const router = useRouter();

		const showModal = ref(false);
		const todoDeletedId = ref(null);

		const toggleTodo = (index, e) => {
			emit('toggle-todo', index, e.target.checked);
		};

		const openModal = (id) => {
			todoDeletedId.value = id;
			showModal.value = true;
		};

		const deleteTodo = () => {
			emit('delete-todo', todoDeletedId.value);
			todoDeletedId.value = null;
			showModal.value = false;
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

		const closeModal = () => {
			todoDeletedId.value = null;
			showModal.value = false;
		};

		return {
			toggleTodo,
			deleteTodo,
			moveToPage,
			showModal,
			openModal,
			closeModal,
		};
	},
};
</script>

<style></style>
