<template>
	<div class="modal-wrapper">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLabel">Delete Todo</h5>
					<button type="button" class="close" aria-label="Close">
						<span @click="onClose">&times;</span>
					</button>
				</div>
				<div class="modal-body">Are you sure want to delete the todo?</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" @click="onClose">
						Close
					</button>
					<button type="button" class="btn btn-danger" @click="onDelete">
						Delete
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
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

<style scoped>
.modal-wrapper {
	position: fixed;
	z-index: 100;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
}
</style>
