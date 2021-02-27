<template>
	<v-container
		fluid
		grid-list-lg
		class="pt-2 pb-8 mt-8 mb-8 "
		:class="$vuetify.breakpoint.mdAndDown ? 'px-5' : 'px-8'"
	>
		<v-layout
			row
			justify-center
		>
			<v-flex
				xs12
				md12
				lg12
				class="py-0"
			>
				<v-card
					flat
					class="py-6 px-6 ma-0"
				>
					<v-card-title 
						class="font-weight-regular primary--text pa-0"
						:class="toggleDataTableSearch || toggleDataTableMultiFilterSearch ? 'mb-3' : 'mb-4'"
					>
						Classroom Schedule

						<v-spacer/>

						<v-btn
							small
							depressed
							class="font-weight-regular body-2 toggle-btn mr-2"
							:class="toggleDataTableSearch ? 'white--text' : 'primary--text'"
							:color="toggleDataTableSearch ? 'success' :'grey lighten-3'"
							@click="toggleDataTableSearchButton()"
						>
							Search
						</v-btn>

						<v-btn
							small
							depressed
							class="font-weight-regular body-2 toggle-btn mr-2"
							:class="toggleDataTableMultiFilterSearch ? 'white--text' : 'primary--text'"
							:color="toggleDataTableMultiFilterSearch ? 'success' :'grey lighten-3'"
							@click="toggleDataTableMultiFilterSearchButton()"
						>
							Filter
						</v-btn>

						<v-btn
							small
							depressed
							class="font-weight-regular body-2 toggle-btn mr-2 primary--text"
							color="grey lighten-3"
							@click="generateReport()"
						>
							Download
						</v-btn>

						<v-btn
							small
							depressed
							class="font-weight-regular body-2 toggle-btn mr-2 primary--text"
							color="grey lighten-3"
							@click="toggleClassroomScheduleCalendarModal = true"
						>
							Calendar
						</v-btn>

						<v-btn
							small
							depressed
							class="font-weight-regular body-2 toggle-btn primary--text"
							color="grey lighten-3"
							@click="toggleClassroomScheduleCreateModal = true"
						>
							Add
						</v-btn>
					</v-card-title>

					<v-card-text class="pa-0">
						<v-data-table
							:headers="classroomScheduleDataTableHeader"
							:items="toggleDataTableMultiFilterSearch ? classroomScheduleDataTableMultiFilteredContent : classroomScheduleDataTableContent"
							:search="classroomScheduleDataTableSearch"
							:items-per-page="10"
							:sort-desc="[false, true]"
							:mobile-breakpoint="0"
							class="font-weight-light secondary--text"
							@current-items="classroomScheduleDataTableCurrentItems"
						>
							<template v-slot:top>
								<v-row
									v-if="toggleDataTableSearch"
									class="mb-2"
								>
									<v-spacer/>

									<v-col
										cols="12"
										sm="6"
									>
										<v-text-field
											v-model="classroomScheduleDataTableSearch"
											label="Search"
											clearable
											single-line
											hide-details
											append-icon="mdi-magnify"
											color="success"
											class="pt-0 mt-0 font-weight-light"
										/>
									</v-col>

									<v-spacer/>
								</v-row>

								<v-row
									v-if="toggleDataTableMultiFilterSearch"
									class="mb-2"
								>
									<v-spacer/>

									<v-col
										cols="12"
										sm="2"
										class="pr-0 pl-0"
									>
										<v-select
											v-model="multiFilterCourseDay"
											:error-messages="multiFilterCourseDayFormErrors"
											:items="courseDaySelectOption"
											label="Day"
											clearable
											single-line
											hide-details="auto"
											color="success"
											class="pt-0 mt-0 mr-3 font-weight-light"
											@input="$v.multiFilterCourseDay.$touch()"
											@blur="$v.multiFilterCourseDay.$touch()"
										/>
									</v-col>

									<v-col
										cols="12"
										sm="2"
										class="pr-0 pl-0"
									>
										<v-select
											v-model="multiFilterCourseRoom"
											:error-messages="multiFilterCourseRoomFormErrors"
											:items="roomList"
											label="Room"
											clearable
											single-line
											hide-details="auto"
											color="success"
											class="pt-0 mt-0 mr-3 font-weight-light"
											@input="$v.multiFilterCourseRoom.$touch()"
											@blur="$v.multiFilterCourseRoom.$touch()"
										/>
									</v-col>

									<v-col
										cols="12"
										sm="2"
										class="pr-0 pl-0"
									>
										<v-menu
											ref="menu1"
											v-model="menuMultiFilterTimeStart"
											:close-on-content-click="false"
											:nudge-right="40"
											:return-value.sync="multiFilterCourseTimeStart"
											transition="scale-transition"
											offset-y
											max-width="290px"
											min-width="290px"
										>
											<template v-slot:activator="{ on }">
												<v-text-field
													v-model="multiFilterCourseTimeStart"
													:error-messages="multiFilterCourseTimeStartFormErrors"
													label="Time start"
													v-on="on"
													readonly
													clearable
													single-line
													hide-details="auto"
													color="success"
													class="pt-0 mt-0 mr-3 font-weight-light"
													@input="$v.multiFilterCourseTimeStart.$touch()"
													@blur="$v.multiFilterCourseTimeStart.$touch()"
												/>
											</template>
											
											<v-time-picker
												v-if ="menuMultiFilterTimeStart"
												v-model="multiFilterCourseTimeStart"
												format="24hr"
												scrollable
												color="success"
												min="7:00"
												max="21:00"
												full-width
												:allowed-minutes="m => m % 15 === 0"
												@click:minute="$refs.menu1.save(multiFilterCourseTimeStart)"
											/>
										</v-menu>
									</v-col>

									<v-col
										cols="12"
										sm="2"
										class="pr-0 pl-0"
									>
										<v-menu
											ref="menu2"
											v-model="menuMultiFilterTimeEnd"
											:close-on-content-click="false"
											:nudge-right="40"
											:return-value.sync="multiFilterCourseTimeEnd"
											transition="scale-transition"
											offset-y
											max-width="290px"
											min-width="290px"
										>
											<template v-slot:activator="{ on }">
												<v-text-field
													v-model="multiFilterCourseTimeEnd"
													:error-messages="multiFilterCourseTimeEndFormErrors"
													label="Time end"
													v-on="on"
													readonly
													clearable
													single-line
													hide-details="auto"
													color="success"
													class="pt-0 mt-0 mr-3 font-weight-light"
													@input="$v.multiFilterCourseTimeEnd.$touch()"
													@blur="$v.multiFilterCourseTimeEnd.$touch()"
												/>
											</template>
											
											<v-time-picker
												v-if ="menuMultiFilterTimeEnd"
												v-model="multiFilterCourseTimeEnd"
												format="24hr"
												scrollable
												color="success"
												min="7:00"
												max="21:00"
												full-width
												:allowed-minutes="m => m % 15 === 0"
												@click:minute="$refs.menu2.save(multiFilterCourseTimeEnd)"
											/>
										</v-menu>
									</v-col>

									<v-col
										cols="12"
										sm="1"
										class="pr-0 pl-0"
										style="padding-top: 24px; padding-bottom: 0px; min-width: 110px;"
									>
										<v-checkbox
											v-model="multiFilterCourseExactTime"
											dense
											label="Exact time"
											class="font-weight-light primary--text body-2 pt-0 pb-0 mt-0 mb-0"
										/>
									</v-col>

									<v-col
										cols="12"
										sm="1"
									>
										<v-btn
											small
											depressed
											color="success"
											class="font-weight-regular body-2 toggle-btn"
											@click="multiFilterCourseSetSearch = true"
										>
											Search
										</v-btn>
									</v-col>

									<v-spacer/>
								</v-row>
							</template>

							<template #item.name="{item}">
								<div>
									{{ item.name }}
								</div>
							</template>
							
							<template #item.time="{item}">
								<div v-if="item.day2 !== 'None'">
									{{ item.day1 }} {{ item.timeStart1 }} - {{ item.timeEnd1 }}
									<br>
									{{ item.day2 }} {{ item.timeStart2 }} - {{ item.timeEnd2 }}
								</div>

								<div v-else>
									{{ item.day1 }} {{ item.timeStart1 }} - {{ item.timeEnd1 }}
								</div>
							</template>

							<template #item.room="{item}">
								<div v-if="item.day2 !== 'None'">
									{{ item.room1 }}{{ item.roomNum1 }}
									<br>
									{{ item.room2 }}{{ item.roomNum2 }}
								</div>

								<div v-else>
									{{ item.room1 }}{{ item.roomNum1 }}
								</div>
							</template>

							<template #item.actions="{item}">
								<v-menu
									:close-on-content-click="true"
									offset-y
									class="pa-0"
								>
									<template v-slot:activator="{ on }">
										<v-btn 
											v-on="on"
											fab
											dark
											x-small
											depressed
											color="transparent"
											class="toggle-btn"
										>
											<v-icon color="primary">mdi-chevron-down</v-icon>
										</v-btn>
									</template>

									<v-card>
										<v-list
											dense
											class="pa-0"
										>
											<v-list-item @click="classroomScheduleUpdate(item)">
												<v-list-item-title class="font-weight-light primary--text">Update</v-list-item-title>
											</v-list-item>

											<v-list-item @click="classroomScheduleDelete(item)">
												<v-list-item-title class="font-weight-light primary--text">Delete</v-list-item-title>
											</v-list-item>
										</v-list>
									</v-card>
								</v-menu>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>

				<v-snackbar
					v-model="snackbarNotification"
					top
					right
					:color="snackbarNotificationColor"
					:timeout="3000"
				>
					{{ snackbarNotificationContent }}

					<v-btn
						fab
						dark
						text
						@click="snackbarNotification = false"
					>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-snackbar>

				<ClassroomScheduleCreateModal
					:toggle-classroom-schedule-create-modal="toggleClassroomScheduleCreateModal"
					@close-classroom-schedule-create-modal="closeClassroomScheduleCreateModal"
					@show-classroom-schedule-create-notification="showClassroomScheduleCreateNotification"
				/>

				<ClassroomScheduleUpdateModal
					:class-schedule="schedulePayload"
					:toggle-classroom-schedule-update-modal="toggleClassroomScheduleUpdateModal"
					@close-classroom-schedule-update-modal="closeClassroomScheduleUpdateModal"
					@show-classroom-schedule-update-notification="showEditNotification"
				/>

				<ClassroomScheduleDeleteModal
					:class-schedule="schedulePayload"
					:toggle-classroom-schedule-delete-modal="toggleClassroomScheduleDeleteModal"
					@close-classroom-schedule-delete-modal="closeClassroomScheduleDeleteModal"
					@show-classroom-schedule-delete-notification="showDeleteNotification"
				/>

				<ClassroomScheduleCalendarModal
					:toggleClassroomScheduleCalendarModal="toggleClassroomScheduleCalendarModal"
					@close-classroom-schedule-calendar-modal="closeClassroomScheduleCalendarModal"
				/>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	import 'jspdf-autotable'
	import jsPDF from 'jspdf'
	import moment from 'moment'
	import { validationMixin } from 'vuelidate'
	import { required } from 'vuelidate/lib/validators'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'ClassroomSchedule',
		components: {
			ClassroomScheduleCreateModal: () => import('@/components/schedule/ClassroomScheduleCreateModal'),
			ClassroomScheduleUpdateModal: () => import('@/components/schedule/ClassroomScheduleUpdateModal'),
			ClassroomScheduleDeleteModal: () => import('@/components/schedule/ClassroomScheduleDeleteModal'),
			ClassroomScheduleCalendarModal: () => import('@/components/schedule/ClassroomScheduleCalendarModal')
		},
		beforeMount() {
			if (this.userAccountEntityType === 'Faculty') {
				this.$router.push('/view/user/schedule')
			}
		},
		created() {
			this.fetchUserAccountList()
			this.fetchClassroomScheduleList()
			this.fetchFacultyScheduleList()
			this.fetchRoomList()
		},
		mixins: [
			validationMixin
		],
		data () {
			return {
				snackbarNotification: false,
				snackbarNotificationColor: null,
				snackbarNotificationContent: null,
				toggleClassroomScheduleCreateModal: false,
				toggleClassroomScheduleCalendarModal: false,
				toggleDataTableSearch: false,
				toggleDataTableMultiFilterSearch: false,
				multiFilterCourseSetSearch: false,
				multiFilterCourseExactTime: false,
				multiFilterCourseTimeStart: null,
				multiFilterCourseTimeEnd: null,
				multiFilterCourseDay: null,
				multiFilterCourseRoom: null,
				menuMultiFilterTimeStart: false,
				menuMultiFilterTimeEnd: false,
				schedulePayload: [],
				multiFilteredScheduleArray: [],
				toggleClassroomScheduleUpdateModal: false,
				toggleClassroomScheduleDeleteModal: false,
				classroomScheduleDataTableContentFiltered: [],
				classroomScheduleDataTableSearch: '',
				classroomScheduleDataTableFilter: 'ALL',
				classroomScheduleDataTableHeader: [
					{
						text: 'ID',
						value: 'id',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '65',
						sortable: true
					},
					{
						text: 'Title',
						value: 'title',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '150',
						sortable: true
					},
					{
						text: 'Code',
						value: 'code',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '90',
						sortable: true
					},
					{
						text: 'Section',
						value: 'section',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '100',
						sortable: true
					},
					{
						text: 'Units',
						value: 'units',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '85',
						sortable: true
					},
					{ 
						text: 'Time',
						value: 'time',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '160',
						sortable: false
					},
					{
						text: 'Room',
						value: 'room',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '90',
						sortable: false
					},
					{
						text: 'Created At',
						value: 'createdAt',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '170',
						sortable: true
					},
					{
						text: 'Updated At',
						value: 'updatedAt',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '170',
						sortable: true
					},
					{
						text: '',
						value: 'actions',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '60',
						sortable: false
					}
				],
				courseDaySelectOption: [
					{ text: 'All', value: 'All' },
					{ text: 'Monday', value: 'Mon' },
					{ text: 'Tuesday', value: 'Tue' },
					{ text: 'Wednesday', value: 'Wed' },
					{ text: 'Thursday', value: 'Thu' },
					{ text: 'Friday', value: 'Fri' },
					{ text: 'Saturday', value: 'Sat' }
				]
			}
		},
		validations () {
			return {
				multiFilterCourseDay: {
					required
				},
				multiFilterCourseRoom: {
					required
				},
				multiFilterCourseTimeStart: {
					required
				},
				multiFilterCourseTimeEnd: {
					required
				}
			}
		},
		watch: {
			toggleDataTableSearch () {
				this.classroomScheduleDataTableSearch = ''
			},
			toggleDataTableMultiFilterSearch () {
				if (this.toggleDataTableMultiFilterSearch === false) {
					this.$v.$reset()
					this.multiFilteredScheduleArray = []
					this.multiFilterCourseTimeStart = null
					this.multiFilterCourseTimeEnd = null
					this.multiFilterCourseDay = null
					this.multiFilterCourseRoom = null
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL,
				userAccountEntityType: state => state.userAccountEntityType,
				mainUserAccountList: state => state.mainUserAccountList,
				mainClassScheduleList: state => state.mainClassScheduleList,
				mainFacultyScheduleList: state => state.mainFacultyScheduleList,
				mainRoomList: state => state.mainRoomList
			}),
			classroomScheduleDataTableContent () {
				return this.mainClassScheduleList
			},
			classroomScheduleDataTableMultiFilteredContent () {
				this.setDataTableMultiFilter()

				return this.multiFilteredScheduleArray
			},
			roomList () {
				const list = this.mainRoomList
				const item = []

				item.push('All')

				for (let i = 0; i < list.length; i++) {
					item.push(list[i].building)
				}

				return [...new Set(item)].sort()
			},
			multiFilterCourseDayFormErrors () {
				const errors = []
				if (!this.$v.multiFilterCourseDay.$dirty) return errors
				!this.$v.multiFilterCourseDay.required && errors.push(`Required!`)
				return errors
			},
			multiFilterCourseRoomFormErrors () {
				const errors = []
				if (!this.$v.multiFilterCourseRoom.$dirty) return errors
				!this.$v.multiFilterCourseRoom.required && errors.push(`Required!`)
				return errors
			},
			multiFilterCourseTimeStartFormErrors () {
				const errors = []
				if (!this.$v.multiFilterCourseTimeStart.$dirty) return errors
				!this.$v.multiFilterCourseTimeStart.required && errors.push(`Required!`)
				return errors
			},
			multiFilterCourseTimeEndFormErrors () {
				const errors = []
				if (!this.$v.multiFilterCourseTimeEnd.$dirty) return errors
				!this.$v.multiFilterCourseTimeEnd.required && errors.push(`Required!`)
				return errors
			}
		},
		methods: {
			...mapActions([
				'fetchUserAccountList',
				'fetchClassroomScheduleList',
				'fetchFacultyScheduleList',
				'fetchRoomList'
			]),
			toggleDataTableSearchButton () {
				this.toggleDataTableMultiFilterSearch = false
				this.toggleDataTableSearch = !this.toggleDataTableSearch
			},
			toggleDataTableMultiFilterSearchButton () {
				this.toggleDataTableSearch = false
				this.toggleDataTableMultiFilterSearch = !this.toggleDataTableMultiFilterSearch
			},
			classroomScheduleDataTableCurrentItems (e) {
				this.classroomScheduleDataTableContentFiltered = e
			},
			setDataTableMultiFilter () {
				if (this.multiFilterCourseSetSearch === true) {
					this.$v.$touch()
					
					if (!this.$v.$invalid) {
						var temp = this.mainClassScheduleList

						if (this.multiFilterCourseDay !== 'All' && this.multiFilterCourseRoom === 'All') {
							temp = temp.filter(data => data.day1 === this.multiFilterCourseDay || data.day2 === this.multiFilterCourseDay)
						} else if (this.multiFilterCourseRoom !== 'All' && this.multiFilterCourseDay === 'All') {
							temp = temp.filter(data => data.room1 === this.multiFilterCourseRoom || data.room2 === this.multiFilterCourseRoom)
						} else if (this.multiFilterCourseRoom !== 'All' && this.multiFilterCourseDay !== 'All') {
							temp = temp.filter(data => {
								return (data.room1 === this.multiFilterCourseRoom || data.room2 === this.multiFilterCourseRoom) && (data.day1 === this.multiFilterCourseDay || data.day2 === this.multiFilterCourseDay)
							})
						}

						if (this.multiFilterCourseExactTime) {
							temp = temp.filter(data => {
								return  (data.timeStart1 === this.multiFilterCourseTimeStart || data.timeStart2 === this.multiFilterCourseTimeStart)
									&& (data.timeEnd1 === this.multiFilterCourseTimeEnd || data.timeEnd2 === this.multiFilterCourseTimeEnd)
							})
						} else {
							temp = temp.filter(data => {
								// x >= min && x <= max
								return (((data.timeStart1 >= this.multiFilterCourseTimeStart && data.timeStart1 <= this.multiFilterCourseTimeEnd) && (data.timeEnd1 >= this.multiFilterCourseTimeStart && data.timeEnd1 <= this.multiFilterCourseTimeEnd)) || ((data.timeStart2 >= this.multiFilterCourseTimeStart && data.timeStart2 <= this.multiFilterCourseTimeEnd) && (data.timeEnd2 >= this.multiFilterCourseTimeStart && data.timeEnd2 <= this.multiFilterCourseTimeEnd)))
							})
						}

						this.multiFilteredScheduleArray = temp
					}
				}

				this.multiFilterCourseSetSearch = false
			},
			generateReport () {
				this.$loading(true)
				const doc = new jsPDF()
				var classroomSubject = []

				for (let i = 0; i < this.classroomScheduleDataTableContentFiltered.length; i++) {
					if (this.classroomScheduleDataTableContentFiltered[i].day2 === 'None') {
						classroomSubject.push([
							this.classroomScheduleDataTableContentFiltered[i].id,
							this.classroomScheduleDataTableContentFiltered[i].title,
							this.classroomScheduleDataTableContentFiltered[i].code,
							this.classroomScheduleDataTableContentFiltered[i].section,
							this.classroomScheduleDataTableContentFiltered[i].units,
							this.classroomScheduleDataTableContentFiltered[i].day1,
							this.classroomScheduleDataTableContentFiltered[i].timeStart1 + ' - ' + this.classroomScheduleDataTableContentFiltered[i].timeEnd1,
							this.classroomScheduleDataTableContentFiltered[i].room1 + this.classroomScheduleDataTableContentFiltered[i].roomNum1
						])
					} else {
						classroomSubject.push([
							this.classroomScheduleDataTableContentFiltered[i].id,
							this.classroomScheduleDataTableContentFiltered[i].title,
							this.classroomScheduleDataTableContentFiltered[i].code,
							this.classroomScheduleDataTableContentFiltered[i].section,
							this.classroomScheduleDataTableContentFiltered[i].units,
							this.classroomScheduleDataTableContentFiltered[i].day1,
							this.classroomScheduleDataTableContentFiltered[i].timeStart1 + ' - ' + this.classroomScheduleDataTableContentFiltered[i].timeEnd1,
							this.classroomScheduleDataTableContentFiltered[i].room1 + this.classroomScheduleDataTableContentFiltered[i].roomNum1
						])

						classroomSubject.push([
							'',
							'',
							'',
							'',
							'',
							this.classroomScheduleDataTableContentFiltered[i].day2,
							this.classroomScheduleDataTableContentFiltered[i].timeStart2 + ' - ' + this.classroomScheduleDataTableContentFiltered[i].timeEnd2,
							this.classroomScheduleDataTableContentFiltered[i].room2 + this.classroomScheduleDataTableContentFiltered[i].roomNum2
						])
					}
				}

				doc.autoTable({
					theme: 'grid',
					styles: { 
						font: 'helvetica',
						fontSize: 9,
						cellWidth: 'auto',
						halign: 'left'
					},
					headStyles: {
						fillColor: [9, 58, 29]
					},
					head: [
						['ID', 'Title', 'Course', 'Section', 'Units', 'Day', 'Time', 'Room']
					],
					columnStyles: {
						0: {cellWidth: 11},
						1: {cellWidth: 65},
						2: {cellWidth: 18},
						3: {cellWidth: 16},
						4: {cellWidth: 12},
						5: {cellWidth: 18},
						6: {cellWidth: 24},
						7: {cellWidth: 18},
					},
					body: classroomSubject,
					didDrawPage: function (data) {
						doc.setFontSize(20)
						doc.setTextColor(9, 58 , 29)
						doc.setFontStyle('normal')
						doc.text('De La Salle University - Dasmariñas', data.settings.margin.left + 36, 22)
						
						doc.setFontSize(12)
						doc.setTextColor(66, 66, 66)
						doc.text('Classroom Schedules as of ' + moment().format('MMM-DD-YYYY h:mm:A'), data.settings.margin.left + 45, 30)
					},
					margin: { top: 50 },
				})

				doc.save('Class_Schedule_' + moment().format('MMM-DD-YYYY' + '_' + 'h:mm:A') + '.pdf')
				setTimeout(() => this.$loading(false), 250)
			},
			classroomScheduleUpdate (item) {
				this.toggleClassroomScheduleUpdateModal = true
				this.schedulePayload = item
			},
			classroomScheduleDelete (item) {
				this.toggleClassroomScheduleDeleteModal = true
				this.schedulePayload = item
			},
			closeClassroomScheduleCreateModal () {
				this.toggleClassroomScheduleCreateModal = false
			},
			closeClassroomScheduleUpdateModal () {
				this.schedulePayload = []
				this.toggleClassroomScheduleUpdateModal = false
			},
			closeClassroomScheduleDeleteModal () {
				this.schedulePayload = []
				this.toggleClassroomScheduleDeleteModal = false
			},
			closeClassroomScheduleCalendarModal () {
				this.toggleClassroomScheduleCalendarModal = false
			},
			showClassroomScheduleCreateNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'success'
				this.snackbarNotificationContent = 'Classroom schedule has been added!'

				if (this.toggleDataTableMultiFilterSearch == true) {
					setTimeout(() => this.multiFilterCourseSetSearch = true, 500)
				}
			},
			showEditNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'info'
				this.snackbarNotificationContent = 'Classroom schedule has been updated!'

				if (this.toggleDataTableMultiFilterSearch == true) {
					setTimeout(() => this.multiFilterCourseSetSearch = true, 500)
				}
			},
			showDeleteNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'error'
				this.snackbarNotificationContent = 'Classroom schedule has been deleted!'

				if (this.toggleDataTableMultiFilterSearch == true) {
					setTimeout(() => this.multiFilterCourseSetSearch = true, 500)
				}
			}
		}
	}
</script>
