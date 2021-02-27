<template>
	<v-dialog
		v-model="toggleFacultyAccountDeleteModal"
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
					class="font-weight-regular body-2 toggle-btn"
					@click="toggleFacultyAccountDeleteModal = false"
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
		name: 'FacultyAccountDeleteModal',
		props: {
			facultyAccount: {
				required: true
			},
			toggleFacultyAccountDeleteModal: {
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
			toggleFacultyAccountDeleteModal () {
				this.formErrors = []
				this.showFormErrors = false

				if(this.toggleFacultyAccountDeleteModal === false) {
					this.$emit('close-faculty-account-delete-modal')
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

				axios.delete(this.axiosBaseURL + '/facultylist/' + this.facultyAccount.id)
				.then(response => {
					this.fetchUserAccountList()
					this.$emit('close-faculty-account-delete-modal')

					setTimeout(() => this.$loading(false), 250)

					this.$emit('show-faculty-account-delete-notification', response.data)
				})
				.catch(error => {
					this.$loading(false)
					this.formErrors.push(error)
					this.showFormErrors = true
				})
			}
		}
	}
</script>
