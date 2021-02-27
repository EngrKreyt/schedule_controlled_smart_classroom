<template>
	<v-dialog
		v-model="toggleUserAccountUpdateModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Edit Account
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
							v-for="(error, index) in errors"
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
								:error-messages="lastNameFormErrors"
								label="Last Name"
								color="success"
								dense
								@input="$v.lastName.$touch()"
								@blur="$v.lastName.$touch()"
						/>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-text-field
								v-model="contactNumber"
								:error-messages="contactNumberFormErrors"
								label="Contact Number"
								maxLength="11"
								color="success"
								dense
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
					@click="toggleUserAccountUpdateModal = false"
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
		name: 'UserAccountUpdateModal',
		props: {
			account: {
				required: true
			},
			toggleUserAccountUpdateModal: {
				type: Boolean,
				required: true
			}
		},
		mixins: [
			validationMixin
		],
		data() {
			return {
				firstName: null,
				lastName: null,
				password: null,
				repeatPassword: null,
				email: null,
				contactNumber: null,
				department: null,
				errors: [],
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
				],
				defaultFirstName: null,
				defaultLastName: null
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
				required,
				minLength: minLength(4)
			}
		},
		watch: {
			account () {
				this.firstName = this.account.firstName
				this.lastName = this.account.lastName
				this.contactNumber = this.account.contactNumber
				this.department = this.account.department
				this.email = this.account.email
				this.password = this.account.password
				this.repeatPassword = this.account.password
				this.defaultFirstName = this.account.firstName
				this.defaultLastName = this.account.lastName
			},
			toggleUserAccountUpdateModal () {
				this.$v.$reset()
				this.errors = []
				this.showFormErrors = false
				this.isEmailTaken = false
				
				if (this.toggleUserAccountUpdateModal === false) {
					this.$emit('close-user-account-update-modal')
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL,
				mainUserAccountList: state => state.mainUserAccountList,
				mainClassScheduleList: state => state.mainClassScheduleList,
				mainFacultyScheduleList: state => state.mainFacultyScheduleList
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
				this.$loading(true)
				this.errors = []
				this.showFormErrors = false
				this.isEmailTaken = false
				this.$v.$touch()

				if (!this.$v.$invalid && this.errors.length == 0) {
					axios.patch(this.axiosBaseURL + '/facultylist/' + this.account.id, {
						first_name: this.firstName,
						last_name: this.lastName,
						email: this.email,
						password: this.password,
						entity_type: this.account.entityType,
						contact_num: this.contactNumber,
						department: this.department,
						units: this.account.units,
						rfid: this.account.rfid
					})
					.then(response => {
						if (this.account.entityType == 'Faculty') {
							const classSchedule = this.mainClassScheduleList.filter(data => data.prof == this.account.fullName)
							const facultySchedule = this.mainFacultyScheduleList.filter(data => data.prof == this.account.fullName)
							const subSchedule = this.mainFacultyScheduleList.filter(data => data.subProf == this.account.fullName)

							if (this.defaultFirstName != this.firstName || this.defaultLastName != this.lastName) {
								if (classSchedule.length != 0) {
									for (let i = 0; i < classSchedule.length; i++) {
										if (classSchedule[i].day2 == 'None') {
											axios.patch(this.axiosBaseURL + '/schedule/' + classSchedule[i].id, {
												name: classSchedule[i].title,
												c_code: classSchedule[i].code,
												s_code: classSchedule[i].section,
												units: classSchedule[i].units,
												day: classSchedule[i].day1,
												time_start: classSchedule[i].timeStart1,
												time_end: classSchedule[i].timeEnd1,
												time_start_2: classSchedule[i].timeStart2,
												time_end_2: classSchedule[i].timeEnd2,
												room: classSchedule[i].room1,
												room_num: classSchedule[i].roomNum1,
												room_2: classSchedule[i].room2,
												room_num_2: classSchedule[i].roomNum2,
												type: classSchedule[i].type,
												prof_id: this.firstName + ' ' + this.lastName
											})
											.catch(error => {
												this.$loading(false)
												this.formErrors.push(error)
												this.showFormErrors = true
											})
										} else {
											axios.patch(this.axiosBaseURL + '/schedule/' + classSchedule[i].id, {
												name: classSchedule[i].title,
												c_code: classSchedule[i].code,
												s_code: classSchedule[i].section,
												units: classSchedule[i].units,
												day: classSchedule[i].day1 + ' / ' + classSchedule[i].day2,
												time_start: classSchedule[i].timeStart1,
												time_end: classSchedule[i].timeEnd1,
												time_start_2: classSchedule[i].timeStart2,
												time_end_2: classSchedule[i].timeEnd2,
												room: classSchedule[i].room1,
												room_num: classSchedule[i].roomNum1,
												room_2: classSchedule[i].room2,
												room_num_2: classSchedule[i].roomNum2,
												type: classSchedule[i].type,
												prof_id: this.firstName + ' ' + this.lastName
											})
											.catch(error => {
												this.$loading(false)
												this.formErrors.push(error)
												this.showFormErrors = true
											})
										}
									}
								}

								if (facultySchedule.length != 0) {
									for (let i = 0; i < facultySchedule.length; i++) {
										if (facultySchedule[i].day2 == 'None') {
											axios.patch(this.axiosBaseURL + '/faculty/' + facultySchedule[i].id, {
												name: facultySchedule[i].title,
												class_id: facultySchedule[i].classID,
												c_code: facultySchedule[i].code,
												s_code: facultySchedule[i].section,
												units: facultySchedule[i].units,
												day: facultySchedule[i].day1,
												time_start: facultySchedule[i].timeStart1,
												time_end: facultySchedule[i].timeEnd1,
												time_start_2: facultySchedule[i].timeStart2,
												time_end_2: facultySchedule[i].timeEnd2,
												room: facultySchedule[i].room1,
												room_num: facultySchedule[i].roomNum1,
												room_2: facultySchedule[i].room2,
												room_num_2: facultySchedule[i].roomNum2,
												type: facultySchedule[i].type,
												prof_id: this.firstName + ' ' + this.lastName,
												sub_id: facultySchedule[i].subProf
											})
											.catch(error => {
												this.$loading(false)
												this.formErrors.push(error)
												this.showFormErrors = true
											})
										} else {
											axios.patch(this.axiosBaseURL + '/faculty/' + facultySchedule[i].id, {
												name: facultySchedule[i].title,
												class_id: facultySchedule[i].classID,
												c_code: facultySchedule[i].code,
												s_code: facultySchedule[i].section,
												units: facultySchedule[i].units,
												day: facultySchedule[i].day1 + ' / ' + facultySchedule[i].day2,
												time_start: facultySchedule[i].timeStart1,
												time_end: facultySchedule[i].timeEnd1,
												time_start_2: facultySchedule[i].timeStart2,
												time_end_2: facultySchedule[i].timeEnd2,
												room: facultySchedule[i].room1,
												room_num: facultySchedule[i].roomNum1,
												room_2: facultySchedule[i].room2,
												room_num_2: facultySchedule[i].roomNum2,
												type: facultySchedule[i].type,
												prof_id: this.firstName + ' ' + this.lastName,
												sub_id: facultySchedule[i].subProf
											})
											.catch(error => {
												this.$loading(false)
												this.formErrors.push(error)
												this.showFormErrors = true
											})
										}
									}
								}

								if (subSchedule.length != 0) {
									for (let i = 0; i < subSchedule.length; i++) {
										if (subSchedule[i].day2 == 'None') {
											axios.patch(this.axiosBaseURL + '/faculty/' + subSchedule[i].id, {
												name: subSchedule[i].title,
												class_id: subSchedule[i].classID,
												c_code: subSchedule[i].code,
												s_code: subSchedule[i].section,
												units: subSchedule[i].units,
												day: subSchedule[i].day1,
												time_start: subSchedule[i].timeStart1,
												time_end: subSchedule[i].timeEnd1,
												time_start_2: subSchedule[i].timeStart2,
												time_end_2: subSchedule[i].timeEnd2,
												room: subSchedule[i].room1,
												room_num: subSchedule[i].roomNum1,
												room_2: subSchedule[i].room2,
												room_num_2: subSchedule[i].roomNum2,
												type: subSchedule[i].type,
												prof_id: subSchedule[i].prof,
												sub_id: this.firstName + ' ' + this.lastName
											})
											.catch(error => {
												this.$loading(false)
												this.formErrors.push(error)
												this.showFormErrors = true
											})
										} else {
											axios.patch(this.axiosBaseURL + '/faculty/' + subSchedule[i].id, {
												name: subSchedule[i].title,
												class_id: subSchedule[i].classID,
												c_code: subSchedule[i].code,
												s_code: subSchedule[i].section,
												units: subSchedule[i].units,
												day: subSchedule[i].day1 + ' / ' + subSchedule[i].day2,
												time_start: subSchedule[i].timeStart1,
												time_end: subSchedule[i].timeEnd1,
												time_start_2: subSchedule[i].timeStart2,
												time_end_2: subSchedule[i].timeEnd2,
												room: subSchedule[i].room1,
												room_num: subSchedule[i].roomNum1,
												room_2: subSchedule[i].room2,
												room_num_2: subSchedule[i].roomNum2,
												type: subSchedule[i].type,
												prof_id: subSchedule[i].prof,
												sub_id: this.firstName + ' ' + this.lastName
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
						}

						this.$store.dispatch('fetchUserAccountList')
						this.$store.dispatch('fetchFacultyScheduleList')
						this.$store.dispatch('fetchClassroomScheduleList')
						this.$emit('close-user-account-update-modal')
						this.$loading(false)
						this.$emit('show-user-account-update-notification', response.data)

						localStorage.removeItem('email')
						localStorage.removeItem('userFullName')
						localStorage.setItem('userFullName', this.firstName + ' ' + this.lastName)
						localStorage.setItem('email', this.email)

						setTimeout(() => location.reload(), 1000)
					})
					.catch(error => {
						this.$loading(false)
						this.errors.push(error)
						this.showFormErrors = true
					})
				} else {
					setTimeout(() => this.$loading(false), 250)
				}
			}
		}
	}
</script>
