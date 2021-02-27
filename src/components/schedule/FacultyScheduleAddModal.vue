<template>
	<v-dialog
		v-model="toggleFacultyScheduleAddModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Add Schedule
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

				<p class="font-weight-light body-2 secondary--text pa-0 mt-4 mb-4">Are you sure you want to add this schedule?</p>
			</v-card-text>

			<v-card-actions class="pa-0 mt-8">
				<v-spacer/>

				<v-btn
					depressed
					color="transparent"
					class="font-weight-regular body-2 toggle-btn primary--text"
					@click="toggleFacultyScheduleAddModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					color="success"
					class="font-weight-regular body-2 toggle-btn"
					@click="submit()"
				>
					Add
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import axios from 'axios'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'FacultyScheduleAddModal',
		props: {
			schedulePayload: {
				required: true
			},
			selectedFaculty: {
				required: true
			},
			toggleFacultyScheduleAddModal: {
				type: Boolean,
				required: true
			}
		},
		data () {
			return {
				formErrors: [],
				showFormErrors: false,
				scheduleErrors: '',
				showScheduleErrors: false,
				maxUnits: 21
			}
		},
		watch: {
			toggleFacultyScheduleAddModal () {        
				if(this.toggleFacultyScheduleAddModal === false) {
					this.$emit('close-faculty-schedule-add-modal')
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
				this.scheduleErrors = ''
				this.showScheduleErrors = false

				const selectedFacultySchedule = this.mainFacultyScheduleList.filter(data => data.prof === this.selectedFaculty)
				const selectedFacultyAccount = this.mainUserAccountList.filter(data => data.fullName === this.selectedFaculty)

				var tempSchedule = []
				var selectedFacultyUnits = []
				var selectedFacultyUnitsTotal = 0
				var isScheduleExist = false
				var isScheduleConflict = false
				var isUnitsOverload = false

				// Check for exisiting schedules
				for (let i = 0; i < selectedFacultySchedule.length; i++) {
					if (selectedFacultySchedule[i].name === this.schedulePayload.name && selectedFacultySchedule[i].classID === this.schedulePayload.id) {
						isScheduleExist = true
						this.scheduleErrors = 'Schedule already exist!'
						setTimeout(() => this.$loading(false), 250)
						this.$emit('show-faculty-schedule-add-notification-error', this.scheduleErrors)
					}
				}

				// Total faculty units
				for (let i = 0; i < selectedFacultySchedule.length; i++) {
					selectedFacultyUnits.push(selectedFacultySchedule[i].units)
				}

				selectedFacultyUnitsTotal = selectedFacultyUnits.reduce((a, b) => a + b, 0)

				// Check insufficient units
				if ((selectedFacultyUnitsTotal + this.schedulePayload.units) > this.maxUnits) {
					isUnitsOverload = true
					this.scheduleErrors = 'Insufficient units!'
					setTimeout(() => this.$loading(false), 250)
					this.$emit('show-faculty-schedule-add-notification-error', this.scheduleErrors)
				} else {
					selectedFacultyUnitsTotal += this.schedulePayload.units
				}

				for (let i = 0; i < selectedFacultySchedule.length; i++) {
					if (selectedFacultySchedule[i].day2 === 'None') {
						tempSchedule.push({
							name: selectedFacultySchedule[i].title,
							classID: selectedFacultySchedule[i].classID,
							code: selectedFacultySchedule[i].code,
							section: selectedFacultySchedule[i].section,
							units: selectedFacultySchedule[i].units,
							day: selectedFacultySchedule[i].day1,
							timeStart: selectedFacultySchedule[i].timeStart1,
							timeEnd: selectedFacultySchedule[i].timeEnd1,
							room: selectedFacultySchedule[i].room1,
							roomNum: selectedFacultySchedule[i].roomNum1,
							type: selectedFacultySchedule[i].type,
						})
					}

					if (selectedFacultySchedule[i].day2 !== 'None') {
						tempSchedule.push({
							name: selectedFacultySchedule[i].title,
							classID: selectedFacultySchedule[i].classID,
							code: selectedFacultySchedule[i].code,
							section: selectedFacultySchedule[i].section,
							units: selectedFacultySchedule[i].units,
							day: selectedFacultySchedule[i].day1,
							timeStart: selectedFacultySchedule[i].timeStart1,
							timeEnd: selectedFacultySchedule[i].timeEnd1,
							room: selectedFacultySchedule[i].room1,
							roomNum: selectedFacultySchedule[i].roomNum1,
							type: selectedFacultySchedule[i].type,
						})

						tempSchedule.push({
							name: selectedFacultySchedule[i].title,
							classID: selectedFacultySchedule[i].classID,
							code: selectedFacultySchedule[i].code,
							section: selectedFacultySchedule[i].section,
							units: selectedFacultySchedule[i].units,
							day: selectedFacultySchedule[i].day2,
							timeStart: selectedFacultySchedule[i].timeStart2,
							timeEnd: selectedFacultySchedule[i].timeEnd2,
							room: selectedFacultySchedule[i].room2,
							roomNum: selectedFacultySchedule[i].roomNum2,
							type: selectedFacultySchedule[i].type,
						})
					}
				}

				// Check for conflict schedules
				if (this.schedulePayload.day2 == 'None' && isScheduleExist == false) {
					const checkSchedule = tempSchedule.filter(data => data.day == this.schedulePayload.day1)

					for (let w = 0; w < checkSchedule.length; w++) {
						if ((this.schedulePayload.timeStart1 < checkSchedule[w].timeEnd) && (checkSchedule[w].timeStart < this.schedulePayload.timeEnd1)) {
							isScheduleConflict = true
							this.scheduleErrors = `Schedule is conflict on ${checkSchedule[w].name} (${checkSchedule[w].section}) - ${checkSchedule[w].day} ${checkSchedule[w].timeStart} - ${checkSchedule[w].timeEnd}`
							setTimeout(() => this.$loading(false), 250)
							this.$emit('show-faculty-schedule-add-notification-error', this.scheduleErrors)
						}
					}
				}

				if (this.schedulePayload.day2 != 'None' && isScheduleExist == false) {
					const checkSchedule = tempSchedule.filter(data => data.day == this.schedulePayload.day1)
					const checkSchedule2 = tempSchedule.filter(data => data.day == this.schedulePayload.day2)

					// First day
					for (let w = 0; w < checkSchedule.length; w++) {
						if ((this.schedulePayload.timeStart1 < checkSchedule[w].timeEnd) && (checkSchedule[w].timeStart < this.schedulePayload.timeEnd1)) {
							isScheduleConflict = true
							this.scheduleErrors = `Schedule is conflict on ${checkSchedule[w].name} (${checkSchedule[w].section}) - ${checkSchedule[w].day} ${checkSchedule[w].timeStart} - ${checkSchedule[w].timeEnd}`
							setTimeout(() => this.$loading(false), 250)
							this.$emit('show-faculty-schedule-add-notification-error', this.scheduleErrors)
						}
					}

					// Second day
					for (let w = 0; w < checkSchedule2.length; w++) {
						if ((this.schedulePayload.timeStart2 < checkSchedule2[w].timeEnd) && (checkSchedule2[w].timeStart < this.schedulePayload.timeEnd2)) {
							isScheduleConflict = true
							this.scheduleErrors = `Schedule is conflict on ${checkSchedule2[w].name} (${checkSchedule2[w].section}) - ${checkSchedule2[w].day} ${checkSchedule2[w].timeStart} - ${checkSchedule2[w].timeEnd}`
							setTimeout(() => this.$loading(false), 250)
							this.$emit('show-faculty-schedule-add-notification-error', this.scheduleErrors)
						}
					}
				}

				/* eslint-disable no-unused-vars */
				if (isScheduleExist === false && isScheduleConflict === false && isUnitsOverload === false) {
					if (this.schedulePayload.day2 === 'None') {
						// Store schedule on faculty account
						axios.post(this.axiosBaseURL + '/faculty', {
							name: this.schedulePayload.title,
							class_id: this.schedulePayload.id,
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
							prof_id: this.selectedFaculty,
							sub_id: 'None'
						})
						.then(response => {
							this.fetchFacultyScheduleList()
						})
						.catch(error => {
							this.$loading(false)
							this.formErrors.push(error)
							this.showFormErrors = true
						})

						// Update faculty name on classroom database
						axios.patch(this.axiosBaseURL + '/schedule/' + this.schedulePayload.id, {
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
							prof_id: this.selectedFaculty
						})
						.then(response => {
							this.fetchClassroomScheduleList()
						})
						.catch(error => {
							this.$loading(false)
							this.formErrors.push(error)
							this.showFormErrors = true
						})

						// Update faculty load units on database
						axios.patch(this.$store.state.axiosBaseURL + '/facultyuser/' + selectedFacultyAccount[0].id, {
							first_name: selectedFacultyAccount[0].firstName,
							last_name: selectedFacultyAccount[0].lastName,
							email: selectedFacultyAccount[0].email,
							password: selectedFacultyAccount[0].password,
							entity_type: selectedFacultyAccount[0].entityType,
							contact_num: selectedFacultyAccount[0].contactNumber,
							department: selectedFacultyAccount[0].department,
							units: selectedFacultyUnitsTotal,
							rfid: selectedFacultyAccount[0].rfid
						})
						.then(response => {
							this.fetchUserAccountList()
						})
						.catch(error => {
							this.$loading(false)
							this.formErrors.push(error)
							this.showFormErrors = true
						})

						setTimeout(() => {
							this.$loading(false)
							this.$emit('close-faculty-schedule-add-modal')
						}, 250)
					} else if (this.schedulePayload.day2 !== 'None') {
						// Store schedule on faculty account
						axios.post(this.axiosBaseURL + '/faculty', {
							name: this.schedulePayload.title,
							class_id: this.schedulePayload.id,
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
							prof_id: this.selectedFaculty,
							sub_id: 'None'
						})
						.then(response => {
							this.fetchFacultyScheduleList()
						})
						.catch(error => {
							this.$loading(false)
							this.formErrors.push(error)
							this.showFormErrors = true
						})

						// Update faculty name on classroom database
						axios.patch(this.$store.state.axiosBaseURL + '/schedule/' + this.schedulePayload.id, {
							name: this.schedulePayload.title,
							c_code: this.schedulePayload.code,
							s_code: this.schedulePayload.section,
							units: this.schedulePayload.units,
							day: this.schedulePayload.day1 + ' / ' + this.schedulePayload.day2,
							time_start: this.schedulePayload.timeStart1,
							time_end: this.schedulePayload.timeEnd1,
							time_start_2: this.schedulePayload.timeStart2,
							time_end_2:  this.schedulePayload.timeEnd2,
							room: this.schedulePayload.room1,
							room_num: this.schedulePayload.roomNum1,
							room_2: this.schedulePayload.room2,
							room_num_2: this.schedulePayload.roomNum2,
							type: this.schedulePayload.type,
							prof_id: this.selectedFaculty
						})
						.then(response => {
							this.fetchClassroomScheduleList()
						})
						.catch(error => {
							this.$loading(false)
							this.formErrors.push(error)
							this.showFormErrors = true
						})

						// Update faculty load units on database
						axios.patch(this.$store.state.axiosBaseURL + '/facultyuser/' + selectedFacultyAccount[0].id, {
							first_name: selectedFacultyAccount[0].firstName,
							last_name: selectedFacultyAccount[0].lastName,
							email: selectedFacultyAccount[0].email,
							password: selectedFacultyAccount[0].password,
							entity_type: selectedFacultyAccount[0].entityType,
							contact_num: selectedFacultyAccount[0].contactNumber,
							department: selectedFacultyAccount[0].department,
							units: selectedFacultyUnitsTotal,
							rfid: selectedFacultyAccount[0].rfid
						})
						.then(response => {
							this.fetchUserAccountList()
						})
						.catch(error => {
							this.$loading(false)
							this.formErrors.push(error)
							this.showFormErrors = true
						})

						setTimeout(() => {
							this.$loading(false)
							this.$emit('close-faculty-schedule-add-modal')
						}, 250)
					} else {
						setTimeout(() => this.$loading(false), 250)
					}

					setTimeout(() => {
						this.$loading(false)
						this.$emit('show-faculty-schedule-add-notification')
					}, 250)
				} else {
					setTimeout(() => this.$loading(false), 250)
				}
			}
		}
	}
</script>
