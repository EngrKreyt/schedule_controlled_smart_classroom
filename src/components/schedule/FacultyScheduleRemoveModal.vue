<template>
	<v-dialog
		v-model="toggleFacultyScheduleRemoveModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-medium primary--text pa-0">
				Remove Schedule
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

				<p class="font-weight-regular body-2 secondary--text pa-0 mt-4 mb-4">Are you sure you want to remove this schedule?</p>
			</v-card-text>

			<v-card-actions class="pa-0 mt-8">
				<v-spacer/>

				<v-btn
					depressed
					color="transparent"
					class="font-weight-medium body-2 toggle-btn primary--text"
					@click="toggleFacultyScheduleRemoveModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					color="error"
					class="font-weight-medium body-2 toggle-btn"
					@click="submit()"
				>
					Remove
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import axios from 'axios'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'FacultyScheduleRemoveModal',
		props: {
			schedulePayload: {
				required: true
			},
			selectedFaculty: {
				required: true
			},
			toggleFacultyScheduleRemoveModal: {
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
			toggleFacultyScheduleRemoveModal () {        
				if(this.toggleFacultyScheduleRemoveModal === false) {
					this.$emit('close-faculty-schedule-remove-modal')
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
				'fetchFacultyScheduleList',
				'fetchClassroomScheduleList'
			]),
			submit () {
				this.$loading(true)
				this.formErrors = []
				this.showFormErrors = false

				// Delete schedule from faculty account
				axios.delete(this.axiosBaseURL + '/faculty/' + this.schedulePayload.id)
				.catch(error => {
					this.$loading(false)
					this.formErrors.push(error)
					this.showFormErrors = true
				})

				const selectedFacultySchedule = this.mainFacultyScheduleList.filter(data => data.prof === this.selectedFaculty)
				const selectedFacultyAccount = this.mainUserAccountList.filter(data => data.fullName === this.selectedFaculty)
				
				var selectedFacultyUnits = []
				var selectedFacultyUnitsTotal = 0

				for (let i = 0; i < selectedFacultySchedule.length; i++) {
					selectedFacultyUnits.push(selectedFacultySchedule[i].units)
				}

				selectedFacultyUnitsTotal = selectedFacultyUnits.reduce((a, b) => a + b, 0)

				// Update faculty units on database
				axios.patch(this.axiosBaseURL + '/facultyuser/' + selectedFacultyAccount[0].id, {
					first_name: selectedFacultyAccount[0].firstName,
					last_name: selectedFacultyAccount[0].lastName,
					email: selectedFacultyAccount[0].email,
					password: selectedFacultyAccount[0].password,
					entity_type: selectedFacultyAccount[0].entityType,
					contact_num: selectedFacultyAccount[0].contactNumber,
					department: selectedFacultyAccount[0].department,
					units: selectedFacultyUnitsTotal - this.schedulePayload.units,
					rfid: selectedFacultyAccount[0].rfid
				})
				.catch(error => {
					this.$loading(false)
					this.formErrors.push(error)
					this.showFormErrors = true
				})

				// Update classroom database
				if (this.schedulePayload.day2 === 'None') {
					axios.patch(this.axiosBaseURL + '/schedule/' + this.schedulePayload.classID, {
						name: this.schedulePayload.title,
						c_code: this.schedulePayload.code,
						s_code: this.schedulePayload.section,
						units: this.schedulePayload.units,
						day: this.schedulePayload.day1,
						time_start: this.schedulePayload.timeStart1,
						time_end: this.schedulePayload.timeEnd1,
						time_start_2: '00:00',
						time_end_2: '00:00',
						room: this.schedulePayload.room1,
						room_num: this.schedulePayload.roomNum1,
						room_2: 'None',
						room_num_2: 'None',
						type: this.schedulePayload.type,
						prof_id: 'N/A'
					})
					.then(response => {
						this.fetchUserAccountList()
						this.fetchClassroomScheduleList()
						this.fetchFacultyScheduleList()

						this.$emit('close-faculty-schedule-remove-modal')
						this.$loading(false)
						this.$emit('show-faculty-schedule-remove-notification', response.data)
					})
					.catch(error => {
						this.$loading(false)
						this.formErrors.push(error)
						this.showFormErrors = true
					})
				} else {
					axios.patch(this.$store.state.axiosBaseURL + '/schedule/' + this.schedulePayload.classID, {
						name: this.schedulePayload.title,
						c_code: this.schedulePayload.code,
						s_code: this.schedulePayload.section,
						units: this.schedulePayload.units,
						day: this.schedulePayload.day1 + ' / ' + this.schedulePayload.day2,
						time_start: this.schedulePayload.timeStart1,
						time_end: this.schedulePayload.timeEnd1,
						time_start_2: this.schedulePayload.timeStart2,
						time_end_2: this.schedulePayload.timeEnd2,
						room: this.schedulePayload.room1,
						room_num: this.schedulePayload.roomNum1,
						room_2: this.schedulePayload.room2,
						room_num_2: this.schedulePayload.roomNum2,
						type: this.schedulePayload.type,
						prof_id: 'N/A'
					})
					.then(response => {
						this.fetchUserAccountList()
						this.fetchClassroomScheduleList()
						this.fetchFacultyScheduleList()

						this.$emit('close-faculty-schedule-remove-modal')
						this.$loading(false)
						this.$emit('show-faculty-schedule-remove-notification', response.data)
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
