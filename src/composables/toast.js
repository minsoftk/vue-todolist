import { onUnmounted, ref } from 'vue';

export const useToast = () => {
	// Toast Box
	const showToast = ref(false);
	const toastMessage = ref('');
	const toastAlertType = ref('');

	const toastTimeout = ref(null);
	const triggerToast = (message, type = 'success') => {
		showToast.value = true;
		toastMessage.value = message;
		toastAlertType.value = type;

		toastTimeout.value = setTimeout(() => {
			showToast.value = false;
			toastAlertType.value = '';
			toastMessage.value = '';
		}, 7000);

		onUnmounted(() => {
			clearTimeout(toastTimeout.value);
		});
	};
	return {
		toastMessage,
		toastAlertType,
		showToast,
		triggerToast,
	};
};
