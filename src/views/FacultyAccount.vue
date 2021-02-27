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
						Faculty Account

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
							@click="toggleFacultyAccountCreateModal = true"
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
											<v-list-item @click="facultyAccountUpdate(item)">
												<v-list-item-title class="font-weight-light primary--text">Update</v-list-item-title>
											</v-list-item>

											<v-list-item @click="facultyAccountDelete(item)">
												<v-list-item-title class="font-weight-light primary--text">Delete</v-list-item-title>
											</v-list-item>

											<v-list-item @click="facultyAccountResetPassword(item)">
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

				<FacultyAccountCreateModal
					:toggle-faculty-account-create-modal="toggleFacultyAccountCreateModal"
					@close-faculty-account-create-modal="closeFacultyAccountCreateModal"
					@show-faculty-account-create-notification="showFacultyAccountCreateNotification"
				/>

				<FacultyAccountUpdateModal
					:faculty-account="facultyAccountPayload"
					:toggle-faculty-account-update-modal="toggleFacultyAccountUpdateModal"
					@close-faculty-account-update-modal="closeFacultyAccountUpdateModal"
					@show-faculty-account-update-notification="showFacultyAccountUpdateNotification"
				/>

				<FacultyAccountDeleteModal
					:faculty-account="facultyAccountPayload"
					:toggle-faculty-account-delete-modal="toggleFacultyAccountDeleteModal"
					@close-faculty-account-delete-modal="closeFacultyAccountDeleteModal"
					@show-delete-faculty-notification="showFacultyAccountDeleteNotification"
				/>

				<FacultyAccountResetPasswordModal
					:faculty-account="facultyAccountPayload"
					:toggle-reset-faculty-password-modal="toggleResetFacultyPasswordModal"
					@close-reset-faculty-password-modal="closeResetFacultyPasswordModal"
					@show-reset-faculty-password-notification="showResetFacultyPasswordNotification"
				/>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'FacultyAccount',
		components: {
			FacultyAccountCreateModal: () => import('@/components/user/FacultyAccountCreateModal'),
			FacultyAccountUpdateModal: () => import('@/components/user/FacultyAccountUpdateModal'),
			FacultyAccountDeleteModal: () => import('@/components/user/FacultyAccountDeleteModal'),
			FacultyAccountResetPasswordModal: () => import('@/components/user/FacultyAccountResetPasswordModal')
		},
		beforeMount() {
			if (this.userAccountEntityType === 'Faculty') {
				this.$router.push('/view/user/schedule')
			}
		},
		created() {
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
				facultyAccountPayload: [],
				toggleFacultyAccountCreateModal: false,
				toggleFacultyAccountUpdateModal: false,
				toggleFacultyAccountDeleteModal: false,
				toggleResetFacultyPasswordModal: false,
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
				return this.mainUserAccountList.filter(data => data.entityType === 'Faculty')
			},
		},
		methods: {
			...mapActions([
				'fetchUserAccountList',
				'fetchClassroomScheduleList',
				'fetchFacultyScheduleList',
				'fetchRoomList'
			]),
			facultyAccountCreate (item) {
				this.toggleFacultyAccountCreateModal = true
				this.facultyAccountPayload = item
			},
			facultyAccountUpdate (item) {
				this.toggleFacultyAccountUpdateModal = true
				this.facultyAccountPayload = item
			},
			facultyAccountDelete (item) {
				this.toggleFacultyAccountDeleteModal = true
				this.facultyAccountPayload = item
			},
			facultyAccountResetPassword (item) {
				this.toggleResetFacultyPasswordModal = true
				this.facultyAccountPayload = item
			},
			closeFacultyAccountCreateModal () {
				this.toggleFacultyAccountCreateModal = false
			},
			closeFacultyAccountUpdateModal () {
				this.toggleFacultyAccountUpdateModal = false
				this.facultyAccountPayload = []
			},
			closeFacultyAccountDeleteModal () {
				this.toggleFacultyAccountDeleteModal = false
				this.facultyAccountPayload = []
			},
			closeResetFacultyPasswordModal () {
				this.toggleResetFacultyPasswordModal = false
				this.facultyAccountPayload = []
			},
			showFacultyAccountCreateNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'success'
				this.snackbarNotificationContent = 'Faculty account has been created!'
			},
			showFacultyAccountUpdateNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'info'
				this.snackbarNotificationContent = 'Faculty account has been updated!'
			},
			showFacultyAccountDeleteNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'error'
				this.snackbarNotificationContent = 'Faculty account has been deleted!'
			},
			showResetFacultyPasswordNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'warning'
				this.snackbarNotificationContent = 'Faculty account password has been changed!'
			}
		}
	}
</script>
