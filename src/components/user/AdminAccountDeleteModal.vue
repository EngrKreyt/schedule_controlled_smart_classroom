<template>
	<v-dialog
		v-model="toggleAdminAccountDeleteModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Delete Account
			</v-card-title>

			<v-card-text class="pa-0">
				<v-alert
					dense
					dismissible
					color="error"
					v-model="showFormErrors"
					class="pt-0 pb-0 pl-0 mt-4 mb-4"
				>
					<v-list
						dense
						color="error"
					>
						<v-list-item
							v-for="(error, index) in formErrors"
							:key="index"
						>
							<p class="white--text body-2 mb-0">{{ error }}</p>
						</v-list-item>
					</v-list>
				</v-alert>

				<p class="font-weight-light body-2 secondary--text pa-0 mt-4 mb-4">Are you sure you want to delete this account?</p>
			</v-card-text>

			<v-card-actions class="pa-0 mt-8">
				<v-spacer/>

				<v-btn
					depressed
					color="transparent"
					class="font-weight-regular body-2 toggle-btn primary--text"
					@click="toggleAdminAccountDeleteModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					color="error"
					class="font-weight-regular body-2 toggle-btn"
					@click="submit()"
				>
					Delete
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import axios from 'axios'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'AdminAccountDeleteModal',
		props: {
			adminAccount: {
				required: true
			},
			toggleAdminAccountDeleteModal: {
				type: Boolean,
				required: true
			}
		},
		data () {
			return {
				formErrors: [],
				showFormErrors: false
			}
		},
		watch: {
			toggleAdminAccountDeleteModal () {
				this.formErrors = []
				this.showFormErrors = false

				if(this.toggleAdminAccountDeleteModal === false) {
					this.$emit('close-admin-account-delete-modal')
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL
			})
		},
		methods: {
			...mapActions([
				'fetchUserAccountList'
			]),
			submit () {
				this.fetchUserAccountList()
				this.$loading(true)
				this.formErrors = []
				this.showFormErrors = false
				
				const email = localStorage.getItem('email')

				if (this.adminAccount.email === email) {
					setTimeout(() => this.$loading(false), 250)

					this.$emit('close-admin-account-delete-modal')
					this.$emit('close-admin-account-delete-modal-error')
				} else {
					axios.delete(this.axiosBaseURL + '/facultylist/' + this.adminAccount.id)
					.then(response => {
						this.fetchUserAccountList()
						this.$emit('close-admin-account-delete-modal',)
						this.$loading(false)
						this.$emit('show-admin-account-delete-notification', response.data)
					})
					.catch(error => {
						this.$loading(false)
						this.formErrors.push(error)
						this.showFormErrors = true
					})
				}
			}
		}
	}
</script>
