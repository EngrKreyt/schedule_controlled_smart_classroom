<template>
	<v-dialog
		v-model="changeUserPasswordDialog"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Change Password
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

				<form
					class="font-weight-light body-2 secondary--text"
					:class="showFormErrors ? 'mt-2' : 'mt-4'"
				>
					<v-row :class="currentPassword === null ? 'mt-4' : 'mt-8'">
						<v-col
							cols="12"
							sm="12"
							class="pt-0"
						>
							<v-text-field
								v-model="currentPassword"
								label="Current Password"
								color="success"
								dense
								:error-messages="currentPasswordFormErrors"
								:type="showCurrentPassword ? 'text' : 'password'"
								:append-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
								@click:append="showCurrentPassword = !showCurrentPassword"
								@input="$v.currentPassword.$touch()"
								@blur="$v.currentPassword.$touch()"
							/>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							sm="12"
							class="pt-0"
						>
							<v-text-field
								v-model="password"
								label="Password"
								color="success"
								dense
								:error-messages="passwordFormErrors"
								:type="showPassword ? 'text' : 'password'"
								:append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
								@click:append="showPassword = !showPassword"
								@input="$v.password.$touch()"
								@blur="$v.password.$touch()"
							></v-text-field>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							sm="12"
							class="pt-0 pb-2"
						>
							<v-text-field
								v-model="repeatPassword"
								label="Repeat Password"
								color="success"
								dense
								:error-messages="repeatPasswordFormErrors"
								:type="showRepeatPassword ? 'text' : 'password'"
								:append-icon="showRepeatPassword ? 'mdi-eye-off' : 'mdi-eye'"
								@click:append="showRepeatPassword = !showRepeatPassword"
								@input="$v.repeatPassword.$touch()"
								@blur="$v.repeatPassword.$touch()"
							/>
						</v-col>
					</v-row>
				</form>
			</v-card-text>

			<v-card-actions class="pa-0 mt-4">
				<v-spacer/>

				<v-btn
					depressed
					color="transparent"
					class="font-weight-regular body-2 toggle-btn primary--text"
					@click="changeUserPasswordDialog = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					color="warning"
					class="font-weight-regular body-2 toggle-btn"
					@click="submit()"
				>
					Change
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import bcrypt from 'bcryptjs'
	import axios from 'axios'
	import { validationMixin } from 'vuelidate'
	import { required, sameAs, minLength, maxLength } from 'vuelidate/lib/validators'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'UserAccountChangePasswordModal',
		props: {
			account: {
				required: true
			},
			changeUserPasswordDialog: {
				type: Boolean,
				required: true
			}
		},
		mixins: [
			validationMixin
		],
		data() {
			return {
				formErrors: [],
				showFormErrors: false,
				currentPassword: null,
				validationCurrentPassword: false,
				validationNewPassword: false,
				password: null,
				repeatPassword: null,
				showCurrentPassword: false,
				showPassword: false,
				showRepeatPassword: false
			}
		},
		validations: {
			currentPassword: {
				required,
				minLength: minLength(8),
				maxLength: maxLength(16)
			},
			password: {
				required,
				minLength: minLength(8),
				maxLength: maxLength(16)
			},
			repeatPassword: {
				required,
				sameAsPassword: sameAs('password')
			},
		},
		watch: {
			changeUserPasswordDialog () {
				this.$v.$reset()
				this.errors = []
				this.showFormErrors = false
				
				if (this.changeUserPasswordDialog === false) {
					this.$emit('close-change-password-dialog')
					this.currentPassword = null
					this.password = null
					this.repeatPassword = null
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL
			}),
			currentPasswordFormErrors () {
				const errors = []
				if (!this.$v.currentPassword.$dirty) return errors
				!this.$v.currentPassword.minLength && errors.push(`Password must be at least ${this.$v.currentPassword.$params.minLength.min} characters long!`)
				!this.$v.currentPassword.maxLength && errors.push(`Password must be at most ${this.$v.currentPassword.$params.maxLength.max} characters long!`)
				this.validationCurrentPassword && errors.push('Check current password!')
				!this.$v.currentPassword.required && errors.push(`Password is required!`)
				return errors
			},
			passwordFormErrors () {
				const errors = []
				if (!this.$v.password.$dirty) return errors
				!this.$v.password.minLength && errors.push(`Password must be at least ${this.$v.password.$params.minLength.min} characters long!`)
				!this.$v.password.maxLength && errors.push(`Password must be at most ${this.$v.password.$params.maxLength.max} characters long!`)
				this.validationNewPassword && errors.push('Check new password!')
				!this.$v.password.required && errors.push(`Password is required!`)
				return errors
			},
			repeatPasswordFormErrors () {
				const errors = []
				if (!this.$v.repeatPassword.$dirty) return errors
				!this.$v.repeatPassword.sameAsPassword && errors.push(`Password do not match!`)
				!this.$v.repeatPassword.required && errors.push(`Password is required!`)
				return errors
			}
		},
		methods: {
			...mapActions([
				'fetchUserAccountList'
			]),
			compareHashedPassword (encrypted) {
				bcrypt.compare(encrypted, this.account.password, (err, res) => {
					console.log('Compared result', res, this.account.password) 
				})
			},
			submit () {
				this.$loading(true)
				this.validationCurrentPassword = false
				this.validationNewPassword = false
				this.formErrors = []
				this.showFormErrors = false
				this.$v.$touch()

				bcrypt.compare(this.currentPassword, this.account.password, (err, res) => {
					if (res === false) {
						this.formErrors.push('Incorrect current password!')
						this.showFormErrors = true
						this.validationCurrentPassword = true
					}
				})

				setTimeout(() => {
					if (this.validationCurrentPassword === false) {
						bcrypt.compare(this.password, this.account.password, (err, res) => {
							if (res === true) {
								this.formErrors.push('New password is cannot be the same as old password!')
								this.showFormErrors = true
								this.validationNewPassword = true
							}
						})
					}
				}, 250)

				setTimeout(() => {
					if (!this.$v.$invalid && this.formErrors.length === 0 && this.validationCurrentPassword === false && this.validationNewPassword === false) {
						axios.patch(this.axiosBaseURL + '/facultylist/' + this.account.id, {
							first_name: this.account.firstName,
							last_name: this.account.lastName,
							email: this.account.email,
							password: bcrypt.hashSync(this.password),
							entity_type: this.account.entityType,
							contact_num: this.account.contactNumber,
							department: this.account.department,
							units: this.account.units,
							rfid: this.account.rfid
						})
						.then(response => {
							this.$store.dispatch('fetchUserAccountList')
							this.$emit('close-change-password-dialog')
							this.$loading(false)
							this.$emit('show-change-password-notification', response.data)

							setTimeout(() => {
								localStorage.removeItem('email')
								localStorage.removeItem('userFullName')
								localStorage.removeItem('userAuthToken')
								localStorage.removeItem('entityType')
								location.reload()
							}, 1500)
						})
						.catch(error => {
							this.$loading(false)
							this.formErrors.push(error)
							this.showFormErrors = true
						})
					} else {
						setTimeout(() => this.$loading(false), 250)
					}
				}, 500)
			}
		}
	}
</script>
