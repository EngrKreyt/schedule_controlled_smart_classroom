<template>
	<v-app-bar
		app
		flat
		clipped-left
		height="50"
		color="success"
		class="pl-1"
	>
		<v-app-bar-nav-icon
			v-if="$vuetify.breakpoint.lgAndUp"
			:color="$vuetify.theme.dark ? 'grey darken-2' : 'white'"
			@click="toggleSidebarDrawerMini = !toggleSidebarDrawerMini"
		/>

		<v-app-bar-nav-icon
			v-else
			:color="$vuetify.theme.dark ? 'grey darken-2' : 'white'"
			@click="toggleSidebarDrawer = !toggleSidebarDrawer"
		/>

		<v-toolbar-title class="text-uppercase">
			<span
				class="font-weight-regular"
				:class="$vuetify.theme.dark ? 'success--text' : 'white--text'"
			>
				De La Salle University
			</span>

			<span
				v-if="$vuetify.breakpoint.mdAndUp"
				class="font-weight-light"
				:class="$vuetify.theme.dark ? 'success--text' : 'white--text'"
			>
				&nbsp; Dasmariñas
			</span>
		</v-toolbar-title>

		<v-spacer/>

		<v-app-bar-nav-icon
			color="error"
			@click="$vuetify.theme.dark = !$vuetify.theme.dark"
		/>
	</v-app-bar>
</template>

<script>
	export default {
		name: 'DashboardContainerAppBar'
	};
</script>
