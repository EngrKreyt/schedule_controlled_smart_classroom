<template>
	<v-app>
		<v-app-bar
			app
			flat
			height="56"
			color="white"
			class="px-4"
		>
			<v-app-bar-nav-icon
				v-if="$vuetify.breakpoint.mdAndDown"
				color="grey darken-2"
				@click="toggleSidebarDrawer = !toggleSidebarDrawer"
			/>

			<v-toolbar-title>
				<span
					v-if="$vuetify.breakpoint.smAndDown"
					class="font-weight-medium success--text"
				>
					De La Salle University - Dasmariñas
				</span>

				<span
					v-if="$vuetify.breakpoint.mdAndUp"
					class="font-weight-medium success--text"
				>
					DLSUD
				</span>

				<span
					v-if="$vuetify.breakpoint.mdAndUp"
					class="font-weight-light secondary--text"
				>
					Classroom Management System
				</span>
			</v-toolbar-title>

			<v-spacer/>

			<v-menu
				offset-y
				origin="center center"
     			transition="scale-transition"
     			max-width="250px"
			>
				<template v-slot:activator="{ on, attrs }">
					<v-icon
						v-bind="attrs"
						v-on="on"
						color="grey darken-3"
						style="font-size: 30px;"
					>
						mdi-account-circle
					</v-icon>
				</template>

				<v-card
					flat
					class="py-5 px-5 ma-0"
				>
					<v-card-title class="font-weight-regular text-center primary--text pa-0">
						<v-col
							cols="12"
							class="pa-0"
						>
							{{ $store.state.userAccountFullName }}
						</v-col>

						<v-col
							cols="12"
							class="pa-0"
							style="font-size: 18px;"
						>
							<h5 class="font-weight-light grey--text text--darken-1">{{ $store.state.userAccountEmail }}</h5>

							<h5 class="font-weight-light grey--text text--darken-1">{{ $store.state.userAccountEntityType }}</h5>
						</v-col>
					</v-card-title>

					<v-card-text class="pa-0 mt-6 text-center">
						<v-col
							cols="12"
							class="pa-0 body-1"
						>
							<v-btn
								v-if="$store.state.userAccountEntityType != 'Faculty'"
								small
								block
								depressed
								outlined
								class="font-weight-regular body-2 toggle-btn primary--text mr-2 mb-2"
								color="info"
								@click="$router.push('/view/user/profile')"
							>
								Profile
							</v-btn>
						</v-col>

						<v-col
							cols="12"
							class="pa-0 body-1"
						>
							<v-btn
								small
								block
								depressed
								outlined
								class="font-weight-regular body-2 toggle-btn primary--text mr-2"
								color="grey lighten-3"
								@click="userAccountLogout()"
							>
								Logout
							</v-btn>
						</v-col>
					</v-card-text>
				</v-card>
			</v-menu>
		</v-app-bar>

		<v-navigation-drawer
			app
			v-model="toggleSidebarDrawer"
			:mini-variant="$vuetify.breakpoint.smAndDown ? !toggleSidebarDrawerMini : toggleSidebarDrawerMini"
			:disable-route-watcher="false"
			:width="255"
			:floating="true"
			:bottom="false"
			class="success"
		>
			<v-list
				dense
				class="py-0"
			>
				<v-list-item
					class="py-0 px-2"
					:class="toggleSidebarDrawerMini ? 'ml-1' : 'ml-6'"
				>
					<v-spacer v-if="!toggleSidebarDrawerMini"/>

					<v-list-item-content>
						<v-list-item-title>
							<v-img
								src="@/assets/img/star.png"
								class="my-1"
								style="filter: brightness(20);"
								:style="toggleSidebarDrawerMini ? 'height: 32px; width: 32px;' : 'height: 36px; width: 36px;'"
							/>
						</v-list-item-title>
					</v-list-item-content>

					<v-spacer v-if="!toggleSidebarDrawerMini"/>
				</v-list-item>
			</v-list>

			<v-list
				nav
				dense
				class="pb-3 px-2"
				:class="toggleSidebarDrawerMini ? 'pt-6' : 'pt-5'"
			>
				<v-list-item
					dark
					router
					v-for="item in sidebarDrawerNavigation"
					:key="item.title"
					:to="item.route"
					color="white"
				>
					<v-tooltip
						right
						open-delay="2"
						nudge-right="12"
						color="grey darken-4"
					>
						<template v-slot:activator="{ on, attrs }">
							<v-list-item-icon v-on="on">
								<v-icon color="white">{{ item.icon }}</v-icon>
							</v-list-item-icon>
						</template>
						
						<span v-if="toggleSidebarDrawerMini">{{item.title}}</span>
					</v-tooltip>

					<v-list-item-content>
						<v-list-item-title
							to="item.route"
							class="font-weight-regular subtitle-2 white--text"
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
					<v-tooltip
						right
						open-delay="2"
						nudge-right="12"
						color="grey darken-4"
					>
						<template v-slot:activator="{ on, attrs }">
							<v-list-item-icon v-on="on">
								<v-icon
									color="white"
									@click="userAccountLogout()"
								>
									mdi-exit-to-app
								</v-icon>
							</v-list-item-icon>
						</template>
						
						<span v-if="toggleSidebarDrawerMini">Logout</span>
					</v-tooltip>

					<v-list-item-content>
						<v-list-item-title
							class="font-weight-regular subtitle-2 white--text"
							@click="userAccountLogout()"
						>
							Logout
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>

			<template v-slot:append>
				<v-list
					nav
					dense
					class="pt-6 pb-3 px-2"
				>
					<v-list-item
						dark
						link
						color="grey"
					>
						<v-tooltip
							right
							open-delay="2"
							nudge-right="22"
							color="grey darken-4"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-list-item-icon
									v-on="on"
									class="mr-7"
								>
									<v-icon
										v-if="toggleSidebarDrawerMini"
										color="white"
										@click="toggleSidebarDrawerMini = false"
									>
										mdi-chevron-right
									</v-icon>

									<v-icon
										v-else
										color="white"
										@click="toggleSidebarDrawerMini = true"
									>
										mdi-chevron-left
									</v-icon>
								</v-list-item-icon>
							</template>
							
							<span v-if="toggleSidebarDrawerMini">Expand</span>
						</v-tooltip>

						<v-list-item-content>
							<v-list-item-title
								v-if="!toggleSidebarDrawerMini"
								class="font-weight-regular subtitle-2 white--text"
								@click="toggleSidebarDrawerMini = true"
							>
								Collapse
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</template>
		</v-navigation-drawer>

		<v-content class="mb-12">
			<transition name="fade-transition">
				<router-view/>
			</transition>
		</v-content>

		<v-footer
			app
			inset
			dense
			absolute
			color="white"
			width="auto"
			class="py-4"
		>
			<v-col
				cols="12"
				class="text-center pa-0"
			>
				<span class="font-weight-light secondary--text">Juson — Madlangbayan — Pereyra</span>
				<span left class="font-weight-light secondary--text">&nbsp; &copy; 2020</span>
			</v-col>
		</v-footer>

		<v-snackbar
			v-model="snackbarNotification"
			top
			right
			:color="snackbarNotificationColor"
			:timeout="3000"
		>
			{{ snackbarNotificationContent }}

			<v-btn
				fab
				dark
				text
				@click="snackbarNotification = false"
			>
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-snackbar>

		<UserLogoutModal
			:toggle-user-account-logout-modal="toggleUserLogoutModal"
			@close-user-account-logout-modal="closeUserLogoutModal"
		/>
	</v-app>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		name: 'DashboardContainer',
		components : {
			UserLogoutModal: () => import('@/components/utility/UserLogoutModal')
		},
		data () {
			return {
				snackbarNotification: false,
				snackbarNotificationContent: null,
				snackbarNotificationColor: null,
				toggleSidebarDrawer: null,
				toggleSidebarDrawerMini: true,
				toggleUserLogoutModal: false,
				sidebarDrawerNavigationSuperadminItem: [
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
						icon: 'mdi-account-multiple',
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
				sidebarDrawerNavigationAdminItem: [
					{
						title: 'Home',
						icon: 'mdi-home',
						route: '/view/admin/dashboard' 
					},
					{
						title: 'Faculty Account',
						icon: 'mdi-account-multiple',
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
			...mapState({
				userAccountEntityType: state => state.userAccountEntityType,
				userAccountEmail: state => state.userAccountEmail,
				mainUserAccountList: state => state.mainUserAccountList
			}),
			sidebarDrawerNavigation () {
				if (this.$store.state.userAccountEntityType == 'Superadmin') {
					return this.sidebarDrawerNavigationSuperadminItem
				} else if (this.$store.state.userAccountEntityType == 'Admin') {
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
			},
			profile () {
				return this.mainUserAccountList.filter(data => data.email == this.userAccountEmail)
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
	}
</script>

<style scoped>
	.theme--light.v-application {
		background: #F5F5F5;
	}

	.theme--light.v-list {
		border: none !important;
	}

	.v-application--is-ltr .v-input--selection-controls__input {
		margin-right: 0px !important;
	}

	.v-btn:not(.v-btn--text):not(.v-btn--outlined).v-btn--active:before {
		opacity: 0;
	}
</style>
