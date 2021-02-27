<template>
	<v-app>
		<router-view/>
	</v-app>
</template>

<script>
	export default {
		name: 'App',
		data: () => ({
		})
	};
</script>

<style>
	.loading-circle {
		border-left-color: #093A1D !important;
	}

	.toggle-btn:focus::before {
		opacity: 0 !important;
	}
</style>
