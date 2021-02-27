<template>
	<v-container
		fluid
		grid-list-lg
		class="pt-2 pb-8 mt-8 mb-8 "
		:class="$vuetify.breakpoint.mdAndDown ? 'px-5' : 'px-8'"
	>
		<v-layout
			row
			justify-center
		>
			<v-flex
				xs12
				md12
				lg12
				class="py-0"
			>
				<v-card
					flat
					class="py-6 px-6 ma-0"
				>
					<v-card-title 
						class="font-weight-regular primary--text pa-0"
						:class="toggleDataTableSearch ? 'mb-3' : 'mb-4'"
					>
						Administrator Account

						<v-spacer/>

						<v-btn
							small
							depressed
							class="font-weight-regular body-2 toggle-btn mr-2"
							:class="toggleDataTableSearch ? 'white--text' : 'primary--text'"
							:color="toggleDataTableSearch ? 'success' :'grey lighten-3'"
							@click="toggleDataTableSearch = !toggleDataTableSearch"
						>
							Search
						</v-btn>

						<v-btn
							small
							depressed
							color="grey lighten-3"
							class="font-weight-regular body-2 toggle-btn primary--text"
							@click="toggleAdminAccountCreateModal = true"
						>
							Add
						</v-btn>
					</v-card-title>

					<v-card-text class="pa-0">
						<v-data-table
							:headers="dataTableHeader"
							:items="dataTableContent"
							:search="dataTableSearch"
							:items-per-page="10"
							:mobile-breakpoint="0"
							class="font-weight-light secondary--text"
						>
							<template
								v-slot:top
								v-if="toggleDataTableSearch"
							>
								<v-row class="mb-3">
									<v-spacer/>

									<v-col
										cols="12"
										sm="6"
									>
										<v-text-field
											v-model="dataTableSearch"
											label="Search"
											clearable
											single-line
											hide-details
											append-icon="mdi-magnify"
											color="success"
											class="pt-0 mt-0 font-weight-light"
										/>
									</v-col>

									<v-spacer/>
								</v-row>
							</template>

							<template #item.actions="{item}">
								<v-menu
									:close-on-content-click="true"
									offset-y
									class="pa-0"
								>
									<template v-slot:activator="{ on }">
										<v-btn 
											v-on="on"
											fab
											dark
											x-small
											depressed
											color="transparent"
											class="toggle-btn"
										>
											<v-icon color="primary">mdi-chevron-down</v-icon>
										</v-btn>
									</template>

									<v-card>
										<v-list
											dense
											class="pa-0"
										>
											<v-list-item @click="adminAccountUpdate(item)">
												<v-list-item-title class="font-weight-light primary--text">Update</v-list-item-title>
											</v-list-item>

											<v-list-item @click="adminAccountDelete(item)">
												<v-list-item-title class="font-weight-light primary--text">Delete</v-list-item-title>
											</v-list-item>

											<v-list-item @click="adminAccountResetPassword(item)">
												<v-list-item-title class="font-weight-light primary--text">Reset Password</v-list-item-title>
											</v-list-item>
										</v-list>
									</v-card>
								</v-menu>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>

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

				<AdminAccountCreateModal
					:toggle-admin-account-create-modal="toggleAdminAccountCreateModal"
					@close-admin-account-create-modal="closeAdminAccountCreateModal"
					@show-admin-account-create-notification="showAdminAccountCreateNotification"
				/>

				<AdminAccountUpdateModal
					:admin-account="adminAccountPayload"
					:toggle-admin-account-update-modal="toggleAdminAccountUpdateModal"
					@close-admin-account-update-modal="closeAdminAccountUpdateModal"
					@show-admin-account-update-notification="showAdminAccountUpdateNotification"
				/>

				<AdminAccountDeleteModal
					:admin-account="adminAccountPayload"
					:toggle-admin-account-delete-modal="toggleAdminAccountDeleteModal"
					@close-admin-account-delete-modal="closeAdminAccountDeleteModal"
					@close-admin-account-delete-modal-error="closeAdminAccountDeleteModalError"
					@show-admin-account-delete-notification="showAdminAccountDeleteNotification"
				/>

				<AdminAccountResetPasswordModal
					:admin-account="adminAccountPayload"
					:toggle-reset-admin-password-modal="toggleResetAdminPasswordModal"
					@close-reset-admin-password-modal="closeResetAdminPasswordModal"
					@show-reset-admin-password-notification="showResetAdminPasswordNotification"
				/>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'AdminAccount',
		components: {
			AdminAccountCreateModal: () => import('@/components/user/AdminAccountCreateModal'),
			AdminAccountUpdateModal: () => import('@/components/user/AdminAccountUpdateModal'),
			AdminAccountDeleteModal: () => import('@/components/user/AdminAccountDeleteModal'),
			AdminAccountResetPasswordModal: () => import('@/components/user/AdminAccountResetPasswordModal')
		},
		beforeMount () {
			if (this.userAccountEntityType === 'Faculty') {
				this.$router.push('/view/user/dashboard')
			}
		},
		created () {
			this.fetchUserAccountList()
			this.fetchClassroomScheduleList()
			this.fetchFacultyScheduleList()
			this.fetchRoomList()
		},
		data () {
			return {
				snackbarNotification: false,
				snackbarNotificationContent: null,
				snackbarNotificationColor: null,
				adminAccountPayload: [],
				toggleAdminAccountCreateModal: false,
				toggleAdminAccountUpdateModal: false,
				toggleAdminAccountDeleteModal: false,
				toggleResetAdminPasswordModal: false,
				toggleDataTableSearch: false,
				dataTableSearch: '',
				dataTableHeader: [
					{
						text: 'ID',
						value: 'id',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '65',
						sortable: true
					},
					{
						text: 'First Name',
						value: 'firstName',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '120',
						sortable: true
					},
					{
						text: 'Last Name',
						value: 'lastName',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '120',
						sortable: true
					},
					{
						text: 'Email',
						value: 'email',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '180',
						sortable: true
					},
					{
						text: 'Contact Number',
						value: 'contactNumber',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '155',
						sortable: true
					},
					{
						text: 'Department',
						value: 'department',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '130',
						sortable: true
					},
					{
						text: 'Created At',
						value: 'createdAt',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '170',
						sortable: true
					},
					{
						text: 'Updated At',
						value: 'updatedAt',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '170',
						sortable: true
					},
					{
						text: '',
						value: 'actions',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '60',
						sortable: false
					}
				]
			}
		},
		watch: {
			toggleDataTableSearch () {
				this.dataTableSearch = ''
			}
		},
		computed: {
			...mapState({
				userAccountEntityType: state => state.userAccountEntityType,
				mainUserAccountList: state => state.mainUserAccountList
			}),
			dataTableContent () {
				return this.mainUserAccountList.filter(data => data.entityType === 'Admin')
			},
		},
		methods: {
			...mapActions([
				'fetchUserAccountList',
				'fetchClassroomScheduleList',
				'fetchFacultyScheduleList',
				'fetchRoomList'
			]),
			adminAccountCreate (item) {
				this.toggleAdminAccountCreateModal = true
				this.adminAccountPayload = item
			},
			adminAccountUpdate (item) {
				this.toggleAdminAccountUpdateModal = true
				this.adminAccountPayload = item
			},
			adminAccountDelete (item) {
				this.toggleAdminAccountDeleteModal = true
				this.adminAccountPayload = item
			},
			adminAccountResetPassword (item) {
				this.toggleResetAdminPasswordModal = true
				this.adminAccountPayload = item
			},
			closeAdminAccountCreateModal () {
				this.toggleAdminAccountCreateModal = false
			},
			closeAdminAccountUpdateModal () {
				this.toggleAdminAccountUpdateModal = false
				this.adminAccountPayload = []
			},
			closeAdminAccountDeleteModal () {
				this.toggleAdminAccountDeleteModal = false
				this.adminAccountPayload = []
			},
			closeAdminAccountDeleteModalError () {
				this.toggleAdminAccountDeleteModal = false
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'error'
				this.snackbarNotificationContent = 'Unable to delete logged user!'
			},
			closeResetAdminPasswordModal () {
				this.toggleResetAdminPasswordModal = false
				this.adminAccountPayload = []
			},
			showAdminAccountCreateNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'success'
				this.snackbarNotificationContent = 'Admin account has been created!'
			},
			showAdminAccountUpdateNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'info'
				this.snackbarNotificationContent = 'Admin account has been updated!'
			},
			showAdminAccountDeleteNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'error'
				this.snackbarNotificationContent = 'Admin account has been deleted!'
			},
			showResetAdminPasswordNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'warning'
				this.snackbarNotificationContent = 'Admin account password has been changed!'
			},
		}
	}
</script>
