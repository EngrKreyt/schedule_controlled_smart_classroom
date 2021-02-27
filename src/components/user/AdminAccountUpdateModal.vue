<template>
	<v-dialog
		v-model="toggleAdminAccountUpdateModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Update Account
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
					<v-row class="mt-8">
						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-text-field
								v-model="firstName"
								:error-messages="firstNameFormErrors"
								label="First Name"
								color="success"
								dense
								@input="$v.firstName.$touch()"
								@blur="$v.firstName.$touch()"
							/>
						</v-col>

						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-text-field
								v-model="lastName"
								label="Last Name"
								color="success"
								dense
								:error-messages="lastNameFormErrors"
								@input="$v.lastName.$touch()"
								@blur="$v.lastName.$touch()"
							/>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							sm="6"
							:class="contactNumber !== null || '' ? 'pt-1' : 'pt-0'"
						>
							<v-text-field
								v-model="contactNumber"
								label="Contact Number"
								maxLength="11"
								color="success"
								dense
								:error-messages="contactNumberFormErrors"
								@input="$v.contactNumber.$touch()"
								@blur="$v.contactNumber.$touch()"
							/>
						</v-col>

						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-select
								v-model="department"
								:error-messages="departmentFormErrors"
								:items="departmentSelectOption"
								label="Department"
								color="success"
								dense
								@input="$v.department.$touch()"
								@blur="$v.department.$touch()"
							/>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							sm="12"
							class="pt-0 pb-2"
						>
							<v-text-field
								v-model="email"
								label="Email"
								color="success"
								dense
								:error-messages="emailFormErrors"
								@input="$v.email.$touch()"
								@blur="$v.email.$touch()"
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
					@click="toggleAdminAccountUpdateModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					color="info"
					class="font-weight-regular body-2 toggle-btn"
					@click="submit()"
				>
					Update
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import axios from 'axios'
	import { validationMixin } from 'vuelidate'
	import { required, email, numeric, alpha, minLength, maxLength } from 'vuelidate/lib/validators'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'AdminAccountUpdateModal',
		props: {
			adminAccount: {
				required: true
			},
			toggleAdminAccountUpdateModal: {
				type: Boolean,
				required: true
			}
		},
		mixins: [
			validationMixin
		],
		data () {
			return {
				firstName: null,
				lastName: null,
				email: null,
				contactNumber: null,
				department: null,
				formErrors: [],
				showFormErrors: false,
				isEmailTaken: false,
				departmentSelectOption: [
					{ text: 'CBAA', value: 'CBAA' },
					{ text: 'CCJE', value: 'CCJE' },
					{ text: 'COED', value: 'COED' },
					{ text: 'CEAT', value: 'CEAT' },
					{ text: 'CLAC', value: 'CEAT' },
					{ text: 'CSCS', value: 'CSCS' },
					{ text: 'CTHM', value: 'CTHM' }
				]
			}
		},
		validations: {
			firstName: {
				required,
				alpha,
				minLength: minLength(3),
				maxLength: maxLength(16)
			},
			lastName: {
				required,
				alpha,
				minLength: minLength(2),
				maxLength: maxLength(16)
			},
			email: {
				required,
				email
			},
			contactNumber: {
				required,
				numeric,
				minLength: minLength(11)
			},
			department: {
				required
			}
		},
		watch: {
			adminAccount () {
				this.firstName = this.adminAccount.firstName
				this.lastName = this.adminAccount.lastName
				this.contactNumber = this.adminAccount.contactNumber
				this.department = this.adminAccount.department
				this.email = this.adminAccount.email
			},
			toggleAdminAccountUpdateModal () {
				this.$v.$reset()
				this.formErrors = []
				this.showFormErrors = false
				this.isEmailTaken = false
				
				if (this.toggleAdminAccountUpdateModal === false) {
					this.$emit('close-admin-account-update-modal')
					this.firstName = null
					this.lastName = null
					this.email = null
					this.contactNumber = null
					this.department = null
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL,
				mainUserAccountList: state => state.mainUserAccountList
			}),
			firstNameFormErrors () {
				const errors = []
				if (!this.$v.firstName.$dirty) return errors
				!this.$v.firstName.minLength && errors.push(`First name must be at least ${this.$v.firstName.$params.minLength.min} characters long!`)
				!this.$v.firstName.maxLength && errors.push(`First name must be at most ${this.$v.firstName.$params.maxLength.max} characters long!`)
				!this.$v.firstName.alpha && errors.push(`First name must only contain letters!`)
				!this.$v.firstName.required && errors.push(`First name is required!`)
				return errors
			},
			lastNameFormErrors () {
				const errors = []
				if (!this.$v.lastName.$dirty) return errors
				!this.$v.lastName.minLength && errors.push(`Last name must be at least ${this.$v.lastName.$params.minLength.min} characters long!`)
				!this.$v.lastName.maxLength && errors.push(`Last name must be at most ${this.$v.lastName.$params.maxLength.max} characters long!`)
				!this.$v.lastName.alpha && errors.push(`Last name must only contain letters!`)
				!this.$v.lastName.required && errors.push(`Last name is required!`)
				return errors
			},
			contactNumberFormErrors () {
				const errors = []
				if (!this.$v.contactNumber.$dirty) return errors
				!this.$v.contactNumber.numeric && errors.push(`Contact number must contain numbers only!`)
				!this.$v.contactNumber.minLength && errors.push(`Contact number must be ${this.$v.contactNumber.$params.minLength.min} digits!`)
				!this.$v.contactNumber.required && errors.push(`Contact number is required!`)
				return errors
			},
			departmentFormErrors () {
				const errors = []
				if (!this.$v.department.$dirty) return errors
				!this.$v.department.required && errors.push(`Department is required!`)
				return errors
			},
			emailFormErrors () {
				const errors = []
				if (!this.$v.email.$dirty) return errors
				!this.$v.email.email && errors.push(`Invalid email format!`)
				!this.$v.email.required && errors.push(`Email is required!`)
				this.isEmailTaken && errors.push('Check email!')
				return errors
			}
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
				this.isEmailTaken = false
				this.$v.$touch()

				const email = localStorage.getItem('email')
				const users = this.mainUserAccountList

				for (let i = 0; i < users.length; i++) {
					if (users[i].email === this.email && this.adminAccount.email !== this.email) {
						this.isEmailTaken = true
						this.formErrors.push('Email is already taken!')
					}
				}

				if (this.formErrors.length !== 0) {
					this.showFormErrors = true
				}

				if (!this.$v.$invalid && this.formErrors.length === 0) {
					const capitalizedString = (str) => str[0].toUpperCase() + str.slice(1).toLowerCase()
					const capitalizedFirstName = this.firstName.split(' ').map(capitalizedString).join(' ')
					const capitalizedLastName = this.lastName.split(' ').map(capitalizedString).join(' ')

					axios.patch(this.axiosBaseURL + '/facultylist/' + this.adminAccount.id, {
						first_name: capitalizedFirstName,
						last_name: capitalizedLastName,
						email: this.email,
						password: this.adminAccount.password,
						entity_type: this.adminAccount.entityType,
						contact_num: this.contactNumber,
						department: this.department,
						units: this.adminAccount.units,
						rfid: this.adminAccount.rfid
					})
					.then(response => {
						if (this.adminAccount.email === email) {
							localStorage.removeItem('email')
							localStorage.removeItem('userFullName')
							localStorage.removeItem('userLastName')
							localStorage.setItem('userFullName', this.firstName + ' ' + this.lastName)
							localStorage.setItem('userLastName', this.lastName)
							localStorage.setItem('email', this.email)
						}

						this.fetchUserAccountList()
						this.$emit('close-admin-account-update-modal')
						this.$loading(false)
						this.$emit('show-admin-account-update-notification', response.data)
					})
					.catch(error => {
						this.$loading(false)
						this.formErrors.push(error)
						this.showFormErrors = true
					})
				} else {
					setTimeout(() => this.$loading(false), 250)
				}
			}
		}
	}
</script>
