<template>
	<v-navigation-drawer
		app
		clipped
		v-model="toggleSidebarDrawer"
		:expand-on-hover="$vuetify.breakpoint.smAndDown ? !toggleSidebarDrawerMini : toggleSidebarDrawerMini"
		:mini-variant="$vuetify.breakpoint.smAndDown ? !toggleSidebarDrawerMini : toggleSidebarDrawerMini"
		:disable-route-watcher="false"
		:width="255"
		:floating="true"
		:bottom="false"
	>
		<v-list
			nav
			dense
			class="pt-2 pb-3"
			:class="toggleSidebarDrawerMini ? '' : 'px-3'"
		>
			<v-list-item
				dark
				link
				disabled
				class="mb-4"
			>
				<v-list-item-icon>
					<v-icon color="grey darken-2">mdi-account-circle</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title
						class="font-weight-regular subtitle-2"
						:class="$vuetify.theme.dark ? 'grey--text text--lighten-1' : 'primary--text'"
					>
						{{ $store.state.userAccountFullName }}
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>

			<v-list-item
				dark
				router
				v-for="item in sidebarDrawerNavigation"
				:key="item.title"
				:to="item.route"
				color="grey"
			>
				<v-list-item-icon>
					<v-icon color="grey darken-2">{{ item.icon }}</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title
						to="item.route"
						class="font-weight-regular subtitle-2"
						:class="$vuetify.theme.dark ? 'grey--text text--lighten-1' : 'primary--text'"
					>
						{{ item.title }}
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>

			<v-list-item
				dark
				link
				color="grey"
			>
				<v-list-item-icon>
					<v-icon color="grey darken-2">mdi-logout-variant</v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title
						class="font-weight-regular subtitle-2"
						:class="$vuetify.theme.dark ? 'grey--text text--lighten-1' : 'primary--text'"
						@click="userAccountLogout()"
					>
						Logout
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
	export default {
		name: 'DashboardContainerNavigationDrawer',
		data () {
			return {
				toggleSidebarDrawer: null,
				toggleSidebarDrawerMini: false,
				toggleUserLogoutModal: false,
				sidebarDrawerNavigationAdminItem: [
					{
						title: 'Home',
						icon: 'mdi-home',
						route: '/view/admin/dashboard' 
					},
					{
						title: 'Admin Account',
						icon: 'mdi-account',
						route: '/view/admin/account/administrator' 
					},
					{
						title: 'Faculty Account',
						icon: 'mdi-account',
						route: '/view/admin/account/faculty'
					},
					{
						title: 'Classroom Schedule',
						icon: 'mdi-calendar',
						route: '/view/admin/schedule/classroom' 
					},
					{
						title: 'Faculty Schedule',
						icon: 'mdi-calendar-account',
						route: '/view/admin/schedule/faculty'
					},
					{
						title: 'Substitute Faculty',
						icon: 'mdi-calendar-clock',
						route: '/view/admin/schedule/subfaculty'
					},
					{
						title: 'Room Management',
						icon: 'mdi-warehouse',
						route: '/view/admin/utility/room' 
					},
					{
						title: 'Room Access Card',
						icon: 'mdi-credit-card',
						route: '/view/admin/utility/rfid'
					}
				],
				sidebarDrawerNavigationUserItem: [
					{
						title: 'Profile',
						icon: 'mdi-account',
						route: '/view/user/profile' 
					},
					{
						title: 'Schedule',
						icon: 'mdi-calendar-account',
						route: '/view/user/schedule'
					}
				]
			}
		},
		computed: {
			sidebarDrawerNavigation () {
				if (this.$store.state.userAccountEntityType === 'Admin') {
					return this.sidebarDrawerNavigationAdminItem
				} else {
					return this.sidebarDrawerNavigationUserItem
				}
			},
			sidebarMobile () {
				if (this.$vuetify.breakpoint.mdAndDown) {
					return !this.toggleSidebarDrawer
				} else {
					return this.toggleSidebarDrawer
				}
			},
			sidebarMini () {
				switch (this.$vuetify.breakpoint.name) {
					case 'xs':
						return true
					case 'sm':
						return true
					case 'md':
						return true
					case 'lg':
						return false
					case 'xl':
						return false
				}

				return this.$vuetify.breakpoint.name
			}
		},
		methods: {
			userAccountLogout () {
				this.toggleUserLogoutModal = true
			},
			closeUserLogoutModal () {
				this.toggleUserLogoutModal = false
			}
		}
	};
</script>
