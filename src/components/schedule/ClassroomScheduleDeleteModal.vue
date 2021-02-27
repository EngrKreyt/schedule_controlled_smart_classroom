<template>
	<v-dialog
		v-model="toggleClassroomScheduleDeleteModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Delete Schedule
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

				<p class="font-weight-light body-2 secondary--text pa-0 mt-4 mb-4">Are you sure you want to delete this schedule?</p>
			</v-card-text>

			<v-card-actions class="pa-0 mt-8">
				<v-spacer/>

				<v-btn
					depressed
					color="transparent"
					class="font-weight-regular body-2 toggle-btn primary--text"
					@click="toggleClassroomScheduleDeleteModal = false"
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
		name: 'ClassroomScheduleDeleteModal',
		props: {
			classSchedule: {
				required: true
			},
			toggleClassroomScheduleDeleteModal: {
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
			toggleClassroomScheduleDeleteModal () {
				this.formErrors = []
				this.showFormErrors = false

				if(this.toggleClassroomScheduleDeleteModal === false) {
					this.$emit('close-classroom-schedule-delete-modal')
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL,
				mainUserAccountList: state => state.mainUserAccountList,
				mainFacultyScheduleList: state => state.mainFacultyScheduleList
			})
		},
		methods: {
			...mapActions([
				'fetchUserAccountList',
				'fetchClassroomScheduleList',
				'fetchFacultyScheduleList'
			]),
			submit () {
				this.$loading(true)
				this.formErrors = []
				this.showFormErrors = false

				axios.delete(this.axiosBaseURL + '/schedule/' + this.classSchedule.id)
				/*eslint-disable*/	
				.then(response => {
					if (this.classSchedule.prof !== 'N/A') {
						const facultyAccount = this.mainUserAccountList.filter(data => data.entityType === 'Faculty' && data.fullName === this.classSchedule.prof)
						const facultySchedule = this.mainFacultyScheduleList.filter(data => data.prof === this.classSchedule.prof && data.classID == this.classSchedule.id)

						// Delete schedule from faculty database
						axios.delete(this.$store.state.axiosBaseURL + '/faculty/' + facultySchedule[0].id)

						// Update faculty units on user account database
						axios.patch(this.$store.state.axiosBaseURL + '/facultyuser/' + facultyAccount[0].id, {
							first_name: facultyAccount[0].firstName,
							last_name: facultyAccount[0].lastName,
							email: facultyAccount[0].email,
							password: facultyAccount[0].password,
							entity_type: facultyAccount[0].entityType,
							contact_num: facultyAccount[0].contactNumber,
							department: facultyAccount[0].department,
							units: facultyAccount[0].units - facultySchedule[0].units,
							rfid: facultyAccount[0].rfid
						})
						.then(response => {
							this.fetchUserAccountList()
							this.fetchClassroomScheduleList()
							this.fetchFacultyScheduleList()
							
							this.$emit('close-classroom-schedule-delete-modal')
							this.$loading(false)
							this.$emit('show-classroom-schedule-delete-notification', response.data)
						})
						.catch(error => {
							this.$loading(false)
							this.formErrors.push(error)
							this.showFormErrors = true
						})
					} else {
						setTimeout(() => {
							this.fetchUserAccountList()
							this.fetchClassroomScheduleList()
							this.fetchFacultyScheduleList()

							this.$emit('close-classroom-schedule-delete-modal')
							this.$loading(false)
							this.$emit('show-classroom-schedule-delete-notification', response.data)
						}, 250)
					}
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
