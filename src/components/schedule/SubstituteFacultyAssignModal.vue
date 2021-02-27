<template>
	<v-dialog
		v-model="toggleSubstituteFacultyAssignModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Assign Substitute Faculty
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
					<v-row class="mt-6">
						<v-col
							cols="12"
							sm="12"
							class="pt-0"
						>
							<p
								v-if="substituteFacultySchedule.day2 == 'None'"
								class="font-weight-light body-1 primary--text"
							>
								Title: {{ substituteFacultySchedule.title }} ({{ substituteFacultySchedule.code }})
								<br>
								Schedule: {{ substituteFacultySchedule.day1 }} {{ substituteFacultySchedule.timeStart1 }} - {{ substituteFacultySchedule.timeEnd1 }}
								<br>
								Faculty: {{ substituteFacultySchedule.prof}}
							</p>

							<p
								v-else
								class="font-weight-light body-1 primary--text"
							>
								Title: {{ substituteFacultySchedule.title }} ({{ substituteFacultySchedule.code }})
								<br>
								Schedule: {{ substituteFacultySchedule.day1 }} {{ substituteFacultySchedule.timeStart1 }} - {{ substituteFacultySchedule.timeEnd1 }}
								<br>
								Schedule: {{ substituteFacultySchedule.day2 }} {{ substituteFacultySchedule.timeStart2 }} - {{ substituteFacultySchedule.timeEnd2 }}
								<br>
								Faculty: {{ substituteFacultySchedule.prof}}
							</p>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							sm="12"
							class="pt-0"
							:class="showAvailableSubstituteFaculty ? 'pb-0' : 'pb-2'"
						>
							<v-select
								v-model="substituteFaculty"
								:error-messages="substituteFacultyFormErrors"
								:items="substituteFacultySelectOption"
								label="Faculty"
								color="success"
								class="font-weight-light"
								dense
								@input="$v.substituteFaculty.$touch()"
								@blur="$v.substituteFaculty.$touch()"
							/>
						</v-col>
					</v-row>

					<v-row v-if="showAvailableSubstituteFaculty">
						<v-col
							cols="12"
							sm="12"
							class="pa-0"
						>
							<v-list dense>
								<v-list-item>
									<p class="font-weight-light body-1">
										Available Faculties:
									</p>
								</v-list-item>

								<v-list-item
									v-for="(faculty, index) in availableFaculty"
									:key="index"
								>
									<p class="font-weight-light body-1 pa-0">
										{{ index + 1 + '. ' + faculty }}
									</p>
								</v-list-item>
							</v-list>
						</v-col>
					</v-row>

					<!-- <v-row>
						<v-col
							cols="12"
							sm="12"
							class="pt-0 pb-4"
						>
							<v-btn
								block
								depressed
								color="success"
								class="font-weight-light body-2 toggle-btn"
								@click="checkAvailableFaculty()"
							>
								Check Available Faculty
							</v-btn>
						</v-col>
					</v-row> -->
				</form>
			</v-card-text>

			<v-card-actions class="pa-0 mt-4">
				<v-spacer/>

				<v-btn
					depressed
					color="transparent"
					class="font-weight-regular body-2 toggle-btn primary--text"
					@click="toggleSubstituteFacultyAssignModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					color="success"
					class="font-weight-regular body-2 toggle-btn"
					@click="submit()"
				>
					Assign
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import axios from 'axios'
	import { validationMixin } from 'vuelidate'
	import { required } from 'vuelidate/lib/validators'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'SubstituteFacultyAssignModal',
		props: {
			substituteFacultySchedule: {
				required: true
			},
			toggleSubstituteFacultyAssignModal: {
				type: Boolean,
				required: true
			}
		},
		mixins: [
			validationMixin
		],
		data () {
			return {
				substituteFaculty: null,
				availableFaculty: [],
				formErrors: [],
				showFormErrors: false,
				showAvailableSubstituteFaculty: false
			}
		},
		validations: {
			substituteFaculty: {
				required
			}
		},
		watch: {
			toggleSubstituteFacultyAssignModal () {
				this.$v.$reset()
				this.formErrors = []
				this.availableFaculty = []
				this.showAvailableSubstituteFaculty = false
				this.showFormErrors = false
				this.substituteFaculty = null
				
				if (this.toggleSubstituteFacultyAssignModal === false) {
					this.$emit('close-substitute-faculty-assign-modal')
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL,
				mainUserAccountList: state => state.mainUserAccountList,
				mainFacultyScheduleList: state => state.mainFacultyScheduleList
			}),
			substituteFacultyFormErrors () {
				const formErrors = []
				if (!this.$v.substituteFaculty.$dirty) return formErrors
				!this.$v.substituteFaculty.required && formErrors.push(`Substitute Faculty is required`)
				return formErrors
			},
			substituteFacultySelectOption () {
				const list = this.mainUserAccountList.filter(data => data.entityType === 'Faculty')
				const item = []

				for (let i = 0; i < list.length; i++) {
					item.push(list[i].firstName + ' ' + list[i].lastName)
				}

				return [...new Set(item)].sort()
			},
		},
		methods: {
			...mapActions([
				'fetchUserAccountList',
				'fetchFacultyScheduleList',
				'fetchClassroomScheduleList'
			]),
			checkAvailableFaculty () {
				this.$loading(true)
				this.availableFaculty = []
				this.showAvailableSubstituteFaculty = false

				const facultyList = this.mainUserAccountList.filter(data => data.entityType === 'Faculty' && data.firstName + ' ' + data.lastName !== this.substituteFacultySchedule.prof)
				const facultySchedule = this.mainFacultyScheduleList.filter(data => data.prof !== this.substituteFacultySchedule.prof)
				const classSchedule = []
				const temporarySubList = []
				const conflictSubList = []

				for (let j = 0; j < facultyList.length; j++) {
					temporarySubList.push({
						name: facultyList[j].firstName + ' ' + facultyList[j].lastName
					})
				}

				for (let i = 0; i < facultySchedule.length; i++) {
					if (facultySchedule[i].day2 === 'None') {
						classSchedule.push({
							name: facultySchedule[i].title,
							code: facultySchedule[i].code,
							section: facultySchedule[i].section,
							units: facultySchedule[i].units,
							day: facultySchedule[i].day1,
							start: facultySchedule[i].timeStart1,
							end: facultySchedule[i].timeEnd1,
							room: facultySchedule[i].room1,
							room_num: facultySchedule[i].roomNum1,
							prof: facultySchedule[i].prof
						})
					}
				}

				for (let i = 0; i < facultySchedule.length; i++) {
					if (facultySchedule[i].day2 !== 'None') {
						classSchedule.push({
							name: facultySchedule[i].title,
							code: facultySchedule[i].code,
							section: facultySchedule[i].section,
							units: facultySchedule[i].units,
							day: facultySchedule[i].day1,
							start: facultySchedule[i].timeStart1,
							end: facultySchedule[i].timeEnd1,
							room: facultySchedule[i].room1,
							room_num: facultySchedule[i].roomNum1,
							prof: facultySchedule[i].prof
						})

						classSchedule.push({
							name: facultySchedule[i].title,
							code: facultySchedule[i].code,
							section: facultySchedule[i].section,
							units: facultySchedule[i].units,
							day: facultySchedule[i].day2,
							start: facultySchedule[i].timeStart2,
							end: facultySchedule[i].timeEnd2,
							room: facultySchedule[i].room2,
							room_num: facultySchedule[i].roomNum2,
							prof: facultySchedule[i].prof
						})
					}
				}

				if (this.substituteFacultySchedule.day2 === 'None') {
					const filteredClassSchedule = classSchedule.filter(data => data.day === this.substituteFacultySchedule.day1)
					
					for (let i = 0; i < temporarySubList.length; i++) {
						const tempArray = filteredClassSchedule.filter(data => data.prof === temporarySubList[i].name)

						for (let x = 0; x < tempArray.length; x++) {
							if ((this.substituteFacultySchedule.timeStart1 < tempArray[x].end) && (tempArray[x].start < this.substituteFacultySchedule.timeEnd1)) {
								conflictSubList.push(temporarySubList[i].name)
							}
						}
					}
				} else {
					const filteredClassSchedule = classSchedule.filter(data => data.day === this.substituteFacultySchedule.day1)
					const filteredClassSchedule2 = classSchedule.filter(data => data.day === this.substituteFacultySchedule.day2)

					// First day schedule
					for (let i = 0; i < temporarySubList.length; i++) {
						const tempArray = filteredClassSchedule.filter(data => data.prof === temporarySubList[i].name)

						for (let x = 0; x < tempArray.length; x++) {
							if ((this.substituteFacultySchedule.timeStart1 < tempArray[x].end) && (tempArray[x].start < this.substituteFacultySchedule.timeEnd1)) {
								conflictSubList.push(temporarySubList[i].name)
							}
						}
					}

					// Second day schedule
					for (let i = 0; i < temporarySubList.length; i++) {
						const tempArray = filteredClassSchedule2.filter(data => data.prof === temporarySubList[i].name)

						for (let x = 0; x < tempArray.length; x++) {
							if ((this.substituteFacultySchedule.timeStart2 < tempArray[x].end) && (tempArray[x].start < this.substituteFacultySchedule.timeEnd2)) {
								conflictSubList.push(temporarySubList[i].name)
							}
						}
					}
				}

				for (let w = 0; w < temporarySubList.length; w++) {
					this.availableFaculty.push(temporarySubList[w].name)
				}

				for (let y = 0; y < conflictSubList.length; y++) {
					const index = this.availableFaculty.indexOf(conflictSubList[y])

					if (index > -1) {
						this.availableFaculty.splice(index, 1);
					}
				}

				this.availableFaculty = [...new Set(this.availableFaculty)].sort()
				this.showAvailableSubstituteFaculty = true

				setTimeout(() => {
					this.$loading(false)
				}, 250)
			},
			submit () {
				this.fetchFacultyScheduleList()
				this.$loading(true)
				this.formErrors = []
				this.showFormErrors = false
				this.$v.$touch()
				let isSameFaculty = false

				if (this.substituteFacultySchedule.prof == this.substituteFaculty) {
					this.formErrors.push("Subject faculty is cannot be assigned as substitute faculty!")
					isSameFaculty = true
				}

				if (this.substituteFacultySchedule.subProf != 'None') {
					if (this.substituteFacultySchedule.subProf == this.substituteFaculty) {
						this.formErrors.push("Current substitute faculty is cannot be assigned as substitute faculty!")
						isSameFaculty = true
					}
				}

				const tempArray = this.mainFacultyScheduleList.filter(data => data.prof == this.substituteFaculty)
				const tempSubArray = this.mainFacultyScheduleList.filter(data => data.subProf == this.substituteFaculty)
				const classSchedule = []
				const subClassSchedule = []
				let isFacultyAvailable = true

				for (let i = 0; i < tempArray.length; i++) {
					if (tempArray[i].day2 == 'None') {
						classSchedule.push({
							name: tempArray[i].title,
							code: tempArray[i].code,
							section: tempArray[i].section,
							units: tempArray[i].units,
							day: tempArray[i].day1,
							start: tempArray[i].timeStart1,
							end: tempArray[i].timeEnd1,
							room: tempArray[i].room1,
							roomNum: tempArray[i].roomNum1,
							prof: tempArray[i].prof
						})
					}
				}

				for (let i = 0; i < tempArray.length; i++) {
					if (tempArray[i].day2 != 'None') {
						classSchedule.push({
							name: tempArray[i].title,
							code: tempArray[i].code,
							section: tempArray[i].section,
							units: tempArray[i].units,
							day: tempArray[i].day1,
							start: tempArray[i].timeStart1,
							end: tempArray[i].timeEnd1,
							room: tempArray[i].room1,
							roomNum: tempArray[i].roomNum1,
							prof: tempArray[i].prof
						})

						classSchedule.push({
							name: tempArray[i].title,
							code: tempArray[i].code,
							section: tempArray[i].section,
							units: tempArray[i].units,
							day: tempArray[i].day2,
							start: tempArray[i].timeStart2,
							end: tempArray[i].timeEnd2,
							room: tempArray[i].room2,
							roomNum: tempArray[i].roomNum2,
							prof: tempArray[i].prof
						})
					}
				}

				if (this.substituteFacultySchedule.day2 == 'None' && isSameFaculty == false) {
					const checkSchedule = classSchedule.filter(data => data.prof == this.substituteFaculty && data.day == this.substituteFacultySchedule.day1)

					for (let w = 0; w < checkSchedule.length; w++) {
						if ((this.substituteFacultySchedule.timeStart1 < checkSchedule[w].end) && (checkSchedule[w].start < this.substituteFacultySchedule.timeEnd1)) {
							this.formErrors.push(`Schedule is conflict on ${checkSchedule[w].name} (${checkSchedule[w].section}) - ${checkSchedule[w].day} ${checkSchedule[w].start} - ${checkSchedule[w].end}`)
						}
					}
				}

				if (this.substituteFacultySchedule.day2 != 'None' && isSameFaculty == false) {
					const firstDay = classSchedule.filter(data => data.prof == this.substituteFaculty && data.day == this.substituteFacultySchedule.day1)
					const secondDay = classSchedule.filter(data => data.prof == this.substituteFaculty && data.day == this.substituteFacultySchedule.day2)

					for (let w = 0; w < firstDay.length; w++) {
						if ((this.substituteFacultySchedule.timeStart1 < firstDay[w].end) && (firstDay[w].start < this.substituteFacultySchedule.timeEnd1)) {
							this.formErrors.push(`Day 1 schedule is conflict on ${firstDay[w].name} (${firstDay[w].section}) - ${firstDay[w].day} ${firstDay[w].start} - ${firstDay[w].end}`)
						}
					}

					for (let w = 0; w < secondDay.length; w++) {
						if ((this.substituteFacultySchedule.timeStart1 < secondDay[w].end) && (secondDay[w].start < this.substituteFacultySchedule.timeEnd1)) {
							this.formErrors.push(`Day 2 schedule is conflict on ${secondDay[w].name} (${secondDay[w].section}) - ${secondDay[w].day} ${secondDay[w].start} - ${secondDay[w].end}`)
						}
					}
				}

				// Check for conflict substitute class
				for (let i = 0; i < tempSubArray.length; i++) {
					if (tempSubArray[i].day2 == 'None') {
						subClassSchedule.push({
							name: tempSubArray[i].title,
							code: tempSubArray[i].code,
							section: tempSubArray[i].section,
							units: tempSubArray[i].units,
							day: tempSubArray[i].day1,
							start: tempSubArray[i].timeStart1,
							end: tempSubArray[i].timeEnd1,
							room: tempSubArray[i].room1,
							roomNum: tempSubArray[i].roomNum1,
							prof: tempSubArray[i].prof
						})
					}
				}

				for (let i = 0; i < tempSubArray.length; i++) {
					if (tempSubArray[i].day2 != 'None') {
						subClassSchedule.push({
							name: tempSubArray[i].title,
							code: tempSubArray[i].code,
							section: tempSubArray[i].section,
							units: tempSubArray[i].units,
							day: tempSubArray[i].day1,
							start: tempSubArray[i].timeStart1,
							end: tempSubArray[i].timeEnd1,
							room: tempSubArray[i].room1,
							roomNum: tempSubArray[i].roomNum1,
							prof: tempSubArray[i].prof
						})

						subClassSchedule.push({
							name: tempSubArray[i].title,
							code: tempSubArray[i].code,
							section: tempSubArray[i].section,
							units: tempSubArray[i].units,
							day: tempSubArray[i].day2,
							start: tempSubArray[i].timeStart2,
							end: tempSubArray[i].timeEnd2,
							room: tempSubArray[i].room2,
							roomNum: tempSubArray[i].roomNum2,
							prof: tempSubArray[i].prof
						})
					}
				}

				if (this.substituteFacultySchedule.day2 == 'None' && isSameFaculty == false) {
					const checkSchedule = subClassSchedule.filter(data => data.day == this.substituteFacultySchedule.day1)

					for (let w = 0; w < checkSchedule.length; w++) {
						if ((this.substituteFacultySchedule.timeStart1 < checkSchedule[w].end) && (checkSchedule[w].start < this.substituteFacultySchedule.timeEnd1)) {
							this.formErrors.push(`Schedule is conflict on a substitute class, ${checkSchedule[w].name} (${checkSchedule[w].section}) - ${checkSchedule[w].day} ${checkSchedule[w].start} - ${checkSchedule[w].end}`)
						}
					}
				}

				if (this.substituteFacultySchedule.day2 != 'None' && isSameFaculty == false) {
					const firstDay = subClassSchedule.filter(data => data.day == this.substituteFacultySchedule.day1)
					const secondDay = subClassSchedule.filter(data => data.day == this.substituteFacultySchedule.day2)

					for (let w = 0; w < firstDay.length; w++) {
						if ((this.substituteFacultySchedule.timeStart1 < firstDay[w].end) && (firstDay[w].start < this.substituteFacultySchedule.timeEnd1)) {
							this.formErrors.push(`Day 1 schedule is conflict on a substitute class, ${firstDay[w].name} (${firstDay[w].section}) - ${firstDay[w].day} ${firstDay[w].start} - ${firstDay[w].end}`)
						}
					}

					for (let w = 0; w < secondDay.length; w++) {
						if ((this.substituteFacultySchedule.timeStart1 < secondDay[w].end) && (secondDay[w].start < this.substituteFacultySchedule.timeEnd1)) {
							this.formErrors.push(`Day 2 schedule is conflict on a substitute class, ${secondDay[w].name} (${secondDay[w].section}) - ${secondDay[w].day} ${secondDay[w].start} - ${secondDay[w].end}`)
						}
					}
				}

				if (this.formErrors.length != 0) {
					this.showFormErrors = true
				}

				if (!this.$v.$invalid && this.formErrors.length == 0 && isFacultyAvailable == true) {
					if (this.substituteFacultySchedule.day2 == 'None') {
						axios.patch(this.axiosBaseURL + '/faculty/' + this.substituteFacultySchedule.id, {
							name: this.substituteFacultySchedule.title,
							class_id: this.substituteFacultySchedule.classID,
							c_code: this.substituteFacultySchedule.code,
							s_code: this.substituteFacultySchedule.section,
							units: this.substituteFacultySchedule.units,
							day: this.substituteFacultySchedule.day1,
							time_start: this.substituteFacultySchedule.timeStart1,
							time_end: this.substituteFacultySchedule.timeEnd1,
							time_start_2: this.substituteFacultySchedule.timeStart2,
							time_end_2: this.substituteFacultySchedule.timeEnd2,
							room: this.substituteFacultySchedule.room1,
							room_num: this.substituteFacultySchedule.roomNum1,
							room_2: this.substituteFacultySchedule.room2,
							room_num_2: this.substituteFacultySchedule.roomNum1,
							type: this.substituteFacultySchedule.type,
							prof_id: this.substituteFacultySchedule.prof,
							sub_id: this.substituteFaculty
						})
						.then(response => {
							this.fetchClassroomScheduleList()
							this.fetchFacultyScheduleList()
							this.$emit('close-substitute-faculty-assign-modal')
							this.$loading(false)
							this.$emit('show-substitute-faculty-assign-notification', response.data)
						})
						.catch(error => {
							this.$loading(false)
							this.formErrors.push(error)
							this.showFormErrors = true
						})
					} else {
						axios.patch(this.axiosBaseURL + '/faculty/' + this.substituteFacultySchedule.id, {
							name: this.substituteFacultySchedule.title,
							class_id: this.substituteFacultySchedule.classID,
							c_code: this.substituteFacultySchedule.code,
							s_code: this.substituteFacultySchedule.section,
							units: this.substituteFacultySchedule.units,
							day: this.substituteFacultySchedule.day1 + ' / ' + this.substituteFacultySchedule.day2,
							time_start: this.substituteFacultySchedule.timeStart1,
							time_end: this.substituteFacultySchedule.timeEnd1,
							time_start_2: this.substituteFacultySchedule.timeStart2,
							time_end_2:  this.substituteFacultySchedule.timeEnd2,
							room: this.substituteFacultySchedule.room1,
							room_num: this.substituteFacultySchedule.roomNum1,
							room_2: this.substituteFacultySchedule.room2,
							room_num_2: this.substituteFacultySchedule.roomNum1,
							type: this.substituteFacultySchedule.type,
							prof_id: this.substituteFacultySchedule.prof,
							sub_id: this.substituteFaculty
						})
						.then(response => {
							this.fetchClassroomScheduleList()
							this.fetchFacultyScheduleList()
							this.$emit('close-substitute-faculty-assign-modal')
							this.$loading(false)
							this.$emit('show-substitute-faculty-assign-notification', response.data)
						})
						.catch(error => {
							this.$loading(false)
							this.formErrors.push(error)
							this.showFormErrors = true
						})
					}
				} else {
					setTimeout(() => this.$loading(false), 250)
				}
			}
		}
	}
</script>
