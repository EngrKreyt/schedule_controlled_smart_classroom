<template>
	<v-dialog
		v-model="toggleSubstituteFacultyRemoveModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Remove Substitute Faculty
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

				<p class="font-weight-light body-2 secondary--text pa-0 mt-4 mb-4">Are you sure you want to remove the assigned faculty?</p>
			</v-card-text>

			<v-card-actions class="pa-0 mt-8">
				<v-spacer/>

				<v-btn
					depressed
					color="transparent"
					class="font-weight-regular body-2 toggle-btn primary--text"
					@click="toggleSubstituteFacultyRemoveModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					color="error"
					class="font-weight-regular body-2 toggle-btn"
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
		name: 'SubstituteFacultyRemoveModal',
		props: {
			substituteFacultySchedule: {
				required: true
			},
			toggleSubstituteFacultyRemoveModal: {
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
			toggleSubstituteFacultyRemoveModal () {        
				if(this.toggleSubstituteFacultyRemoveModal === false) {
					this.$emit('close-substitute-faculty-remove-modal')
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL
			})
		},
		methods: {
			...mapActions({
				fetchUserAccountList: 'fetchUserAccountList',
				fetchFacultyScheduleList: 'fetchFacultyScheduleList',
				fetchClassroomScheduleList: 'fetchClassroomScheduleList'
			}),
			submit() {
				this.fetchClassroomScheduleList()
				this.fetchFacultyScheduleList()
				this.$loading(true)

				if (this.substituteFacultySchedule.day2 === 'None') {
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
						room_num_2: this.substituteFacultySchedule.roomNum2,
						type: this.substituteFacultySchedule.type,
						prof_id: this.substituteFacultySchedule.prof,
						sub_id: 'None'
					})
					.then(response => {
						this.fetchClassroomScheduleList()
						this.fetchFacultyScheduleList()
						this.$emit('close-substitute-faculty-remove-modal')
						this.$loading(false)
						this.$emit('show-substitute-faculty-remove-notification', response.data)
					})
					.catch(error => {
						this.$loading(false)
						this.formErrors.push(error)
						this.showFormErrors = true
					})
				} else {
					axios.patch(this.$store.state.axiosBaseURL + '/faculty/' + this.substituteFacultySchedule.id, {
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
						room_num_2: this.substituteFacultySchedule.roomNum2,
						type: this.substituteFacultySchedule.type,
						prof_id: this.substituteFacultySchedule.prof,
						sub_id: 'None'
					})
					.then(response => {
						this.fetchClassroomScheduleList()
						this.fetchFacultyScheduleList()
						this.$emit('close-substitute-faculty-remove-modal')
						this.$loading(false)
						this.$emit('show-substitute-faculty-remove-notification', response.data)
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
