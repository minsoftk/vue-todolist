<template>
	<Modal>
		<template v-slot:title> Delete Todo! </template>
		<template v-slot:body> Are you sure want to delete this todo?</template>
		<template v-slot:footer>
			<button type="button" class="btn btn-secondary" @click="onClose">
				Close
			</button>
			<button type="button" class="btn btn-danger" @click="onDelete">
				Delete
			</button>
		</template>
	</Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';

export default {
	components: {
		Modal,
	},
	emits: ['close-modal', 'delete-todo'],
	setup(props, { emit }) {
		const onClose = () => {
			emit('close-modal');
		};

		const onDelete = () => {
			emit('delete-todo');
		};

		return {
			onClose,
			onDelete,
		};
	},
};
</script>

<style></style>
