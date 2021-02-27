<template>
	<v-dialog
		v-model="toggleUserAccountLogoutModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Logout
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

				<p class="font-weight-light body-2 secondary--text pa-0 mt-4 mb-4">Are you sure you want to logout?</p>
			</v-card-text>

			<v-card-actions class="pa-0 mt-8">
				<v-spacer/>

				<v-btn
					depressed
					class="font-weight-regular body-2 toggle-btn primary--text"
					color="transparent"
					@click="toggleUserAccountLogoutModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					class="font-weight-regular body-2 toggle-btn"
					color="success"
					@click="logout()"
				>
					Logout
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		name: 'UserLogoutModal',
		props: {
			toggleUserAccountLogoutModal: {
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
			toggleUserAccountLogoutModal () {
				this.formErrors = []
				this.showFormErrors = false

				if(this.toggleUserAccountLogoutModal === false) {
					this.$emit('close-user-account-logout-modal')
				}
			}
		},
		methods: {
			logout () {
				this.$loading(true)

				localStorage.removeItem('email')
				localStorage.removeItem('userFullName')
				localStorage.removeItem('userAuthToken')
				localStorage.removeItem('entityType')

				this.$emit('close-user-account-logout-modal')
				
				setTimeout(() => {
					this.$loading(false)
					location.reload()
				}, 500)
			}
		}
	}
</script>
