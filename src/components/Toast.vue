<template>
	<div class="alert toast-box" :class="`alert-${type}`" role="alert">
		{{ message }}
	</div>
</template>

<script>
export default {
	props: {
		message: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			default: 'success',
		},
	},
};
</script>

<style>
.toast-box {
	position: fixed;
	top: 10px;
	right: 10px;
	transition: all 3s ease;
	animation: toast 3s ease;
}

@keyframes toast {
	0% {
		opacity: 0;
		transform: translateY(-30px);
	}
	50% {
		opacity: 1;
		transform: translateY(0px);
	}
	100% {
		opacity: 0;
		transform: translateY(-30px);
	}
}
.toast-box {
}
</style>
