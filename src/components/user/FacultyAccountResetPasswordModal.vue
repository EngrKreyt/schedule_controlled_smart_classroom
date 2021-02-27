<template>
	<v-dialog
		v-model="toggleResetFacultyPasswordModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Reset Password
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

				<v-alert
					dense
					color="warning"
					v-model="showFormRegistration"
					class="pt-0 pb-0 pl-0 mt-4 mb-4"
				>
					<v-list
						dense
						color="warning"
					>
						<v-list-item
							v-for="(register, index) in formRegistration"
							:key="index"
						>
							<p class="white--text body-2 mb-0">{{ register }}</p>
						</v-list-item>
					</v-list>
				</v-alert>

				<p
					v-if="!isRegistrationSuccess"
					class="font-weight-light body-2 secondary--text pa-0 mt-4 mb-4"
				>
					Are you sure you want to reset password of this account?
				</p>
			</v-card-text>

			<v-card-actions class="pa-0 mt-4">
				<v-spacer/>

				<v-btn
					v-if="isRegistrationSuccess"
					depressed
					color="transparent"
					class="font-weight-regular body-2 toggle-btn"
					@click="toggleResetFacultyPasswordModal = false"
				>
					Close
				</v-btn>

				<v-btn
					v-if="!isRegistrationSuccess"
					depressed
					color="transparent"
					class="font-weight-regular body-2 toggle-btn"
					@click="toggleResetFacultyPasswordModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					v-if="!isRegistrationSuccess"
					depressed
					color="warning"
					class="font-weight-regular body-2 toggle-btn"
					@click="submit()"
				>
					Reset
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import bcrypt from 'bcryptjs'
	import axios from 'axios'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'ResetFacultyPasswordModal',
		props: {
			facultyAccount: {
				required: true
			},
			toggleResetFacultyPasswordModal: {
				type: Boolean,
				required: true
			}
		},
		data () {
			return {
				formErrors: [],
				formRegistration: [],
				showFormErrors: false,
				showFormRegistration: false,
				password: null,
				repeatPassword: null,
				showPassword: false,
				showRepeatPassword: false,
				isRegistrationSuccess: false
			}
		},
		watch: {
			toggleResetFacultyPasswordModal () {
				this.formErrors = []
				this.formRegistration = []
				this.showFormErrors = false
				this.showFormRegistration = false
				this.isRegistrationSuccess = false
				
				if (this.toggleResetFacultyPasswordModal === false) {
					this.$emit('close-reset-faculty-password-modal')
					this.password = null
					this.repeatPassword = null
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
			compareHashedPassword (encrypted) {
				bcrypt.compare('admin', encrypted, (err, res) => {
					console.log('Compared result', res, encrypted) 
				})
			},
			submit () {
				this.fetchUserAccountList()
				this.$loading(true)
				this.formErrors = []
				this.formRegistration = []
				this.showFormErrors = false
				this.showFormRegistration = false

				const tempPassword = Math.random().toString(36).replace(/[^a-z1-9]+/g, '').substr(0, 8)
				let newPassword = bcrypt.hashSync(tempPassword)

				axios.patch(this.axiosBaseURL + '/facultylist/' + this.facultyAccount.id, {
					first_name: this.facultyAccount.firstName,
					last_name: this.facultyAccount.lastName,
					email: this.facultyAccount.email,
					password: newPassword,
					entity_type: this.facultyAccount.entityType,
					contact_num: this.facultyAccount.contactNumber,
					department: this.facultyAccount.department,
					units: this.facultyAccount.units,
					rfid: this.facultyAccount.rfid
				})
				/* eslint-disable */
				.then(response => {
					this.fetchUserAccountList()
					this.$loading(false)
					this.isRegistrationSuccess = true
					this.formRegistration.push(`Name: ${this.facultyAccount.firstName} ${this.facultyAccount.lastName}`)
					this.formRegistration.push(`Temporary password: ${tempPassword}`)
					this.showFormRegistration = true
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
