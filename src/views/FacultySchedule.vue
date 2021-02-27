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
					<v-card-title class="font-weight-regular primary--text pa-0 mb-3">
						Faculty Schedule

						<v-spacer/>

						<v-col
							cols="12"
							sm="3"
							class="pt-0 pr-0 pb-0 pl-10"
						>
							<v-select
								v-model="selectedFaculty"
								:items="facultyList"
								label="Faculty"	
								single-line
								hide-details
								color="success"
								class="mt-0 pt-0 pb-1 font-weight-light"
							/>
						</v-col>
					</v-card-title>

					<v-card-text class="pa-0">
						<v-data-table
							:headers="facultyScheduleDataTableHeader"
							:items="facultyScheduleDataTableContent"
							:items-per-page="15"
							:sort-desc="[false, true]"
							:hide-default-footer="true"
							class="font-weight-light secondary--text"
						>
							<template #item.time="{item}">
								<div v-if="item.day2 !== 'None'">
									{{ item.timeStart1 }} - {{ item.timeEnd1 }}
									<br>
									{{ item.timeStart2 }} - {{ item.timeEnd2 }}
								</div>

								<div v-else style="width: 115px;">
									{{ item.timeStart1 }} - {{ item.timeEnd1 }}
								</div>
							</template>

							<template #item.day="{item}">
								<div v-if="item.day2 !== 'None'">
									{{ item.day1 }}
									<br>
									{{ item.day2 }}
								</div>

								<div v-else>
									{{ item.day1 }}
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
								<v-btn
									small
									depressed
									class="font-weight-regular body-2 toggle-btn mr-2 error--text"
									color="grey lighten-3"
									@click="facultySubjectRemove(item)"
								>
									Remove
								</v-btn>
							</template>
						</v-data-table>

						<v-row
							v-if="selectedFaculty !== null"
							class="mt-10"
						>
							<v-btn
								small
								depressed
								color="grey lighten-3"
								class="font-weight-regular body-2 toggle-btn primary--text mr-2 mb-2 ml-3"
								@click="toggleFacultyScheduleCalendarModal = true"
							>
								Calendar
							</v-btn>

							<v-btn
								small
								depressed
								color="grey lighten-3"
								class="font-weight-regular body-2 toggle-btn primary--text mr-2 mb-2"
								@click="generateReport()"
							>
								COR
							</v-btn>

							<v-spacer/>

							<p
								v-if="showScheduleErrors === true"
								class="font-weight-regular body-2 error--text mt-2"
							>
								{{ scheduleErrors }}
							</p>

							<v-spacer/>

							<p class="font-weight-regular body-2 primary--text mt-2 mr-3">Max Units: {{ maxUnits }}</p>

							<p class="font-weight-regular body-2 primary--text mt-2 mr-3">Total Units: {{ currentUnits }}</p>
						</v-row>

						<v-divider
							v-if="selectedFaculty !== null"
							class="mb-2 mt-2"
						/>

						<v-row
							v-if="selectedFaculty !== null"
							class="pa-0 mt-6"
							:class="toggleClassroomScheduleDataTableSearch || toggleMultiFilterSearch ? 'mb-3' : 'mb-4'"
						>
							<v-spacer/>

							<v-btn
								small
								depressed
								class="font-weight-regular body-2 toggle-btn mr-2"
								:class="toggleClassroomScheduleDataTableSearch ? 'white--text' : 'primary--text'"
								:color="toggleClassroomScheduleDataTableSearch ? 'success' :'grey lighten-3'"
								@click="toggleDataTableSearch()"
							>
								Search
							</v-btn>

							<v-btn
								small
								depressed
								class="font-weight-regular body-2 toggle-btn mr-3"
								:class="toggleMultiFilterSearch ? 'white--text' : 'primary--text'"
								:color="toggleMultiFilterSearch ? 'success' :'grey lighten-3'"
								@click="toggleDataTableMultiFilterSearch()"
							>
								Filter
							</v-btn>
						</v-row>

						<v-data-table
							v-if="selectedFaculty !== null"
							:headers="classroomScheduleDataTableHeader"
							:items="toggleMultiFilterSearch ? multiFilteredSchedule : classroomScheduleDataTableContent"
							:search="classroomScheduleDataTableSearch"
							:items-per-page="10"
							:sort-desc="[false, true]"
							:mobile-breakpoint="0"
							class="font-weight-light secondary--text"
						>
							<template v-slot:top>
								<v-row
									v-if="toggleClassroomScheduleDataTableSearch"
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
									v-if="toggleMultiFilterSearch"
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
											class="font-weight-light body-2 pt-0 pb-0 mt-0 mb-0"
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
											@click="toggleMultiFilterSearchBar = true"
										>
											Search
										</v-btn>
									</v-col>

									<v-spacer/>
								</v-row>
							</template>

							<template #item.id="{item}">
								<div :class="item.prof !== 'N/A' ? 'grey--text' : ''">
									{{ item.id }}
								</div>
							</template>

							<template #item.title="{item}">
								<div :class="item.prof !== 'N/A' ? 'grey--text' : ''">
									{{ item.title }}
								</div>
							</template>

							<template #item.code="{item}">
								<div :class="item.prof !== 'N/A' ? 'grey--text' : ''">
									{{ item.code }}
								</div>
							</template>

							<template #item.section="{item}">
								<div :class="item.prof !== 'N/A' ? 'grey--text' : ''">
									{{ item.section }}
								</div>
							</template>

							<template #item.units="{item}">
								<div :class="item.prof !== 'N/A' ? 'grey--text' : ''">
									{{ item.units }}
								</div>
							</template>

							<template #item.time="{item}">
								<div
									v-if="item.day2 !== 'None'"
									:class="item.prof !== 'N/A' ? 'grey--text' : ''"
								>
									{{ item.timeStart1 }} - {{ item.timeEnd1 }}
									<br>
									{{ item.timeStart2 }} - {{ item.timeEnd2 }}
								</div>

								<div
									v-else
									:class="item.prof !== 'N/A' ? 'grey--text' : ''"
									style="width: 115px;"
								>
									{{ item.timeStart1 }} - {{ item.timeEnd1 }}
								</div>
							</template>

							<template #item.day1="{item}">
								<div
									v-if="item.day2 !== 'None'"
									:class="item.prof !== 'N/A' ? 'grey--text' : ''"
								>
									{{ item.day1 }}
									<br>
									{{ item.day2 }}
								</div>

								<div
									v-else
									:class="item.prof !== 'N/A' ? 'grey--text' : ''"
								>
									{{ item.day1 }}
								</div>
							</template>

							<template #item.room1="{item}">
								<div
									v-if="item.day2 !== 'None'"
									:class="item.prof !== 'N/A' ? 'grey--text' : ''"
								>
									{{ item.room1 }}{{ item.roomNum1 }}
									<br>
									{{ item.room2 }}{{ item.roomNum2 }}
								</div>

								<div
									v-else
									:class="item.prof !== 'N/A' ? 'grey--text' : ''"
								>
									{{ item.room1 }}{{ item.roomNum1 }}
								</div>
							</template>

							<template #item.updatedAt="{item}">
								<div :class="item.prof !== 'N/A' ? 'grey--text' : ''">
									{{ item.updatedAt }}
								</div>
							</template>

							<template #item.actions="{item}">
								<v-btn
									v-if="item.prof === 'N/A'"
									small
									depressed
									class="font-weight-regular body-2 toggle-btn mr-2 success--text"
									color="grey lighten-3"
									@click="facultySubjectAdd(item)"
								>
									Add
								</v-btn>
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

				<FacultyScheduleAddModal
					:schedule-payload="schedulePayload"
					:selected-faculty="selectedFaculty"
					:toggle-faculty-schedule-add-modal="toggleFacultyScheduleAddModal"
					@close-faculty-schedule-add-modal="closeFacultyScheduleAddModal"
					@show-faculty-schedule-add-notification="showFacultyScheduleAddNotification"
					@show-faculty-schedule-add-notification-error="showFacultyScheduleAddNotificationError"
				/>

				<FacultyScheduleRemoveModal
					:schedule-payload="schedulePayload"
					:selected-faculty="selectedFaculty"
					:toggle-faculty-schedule-remove-modal="toggleFacultyScheduleRemoveModal"
					@close-faculty-schedule-remove-modal="closeFacultyScheduleRemoveModal"
					@show-faculty-schedule-remove-notification="showFacultyScheduleRemoveNotification"
				/>

				<FacultyScheduleCalendarModal
					:schedule-payload="facultyScheduleDataTableContent"
					:toggle-faculty-schedule-calendar-modal="toggleFacultyScheduleCalendarModal"
					@close-faculty-schedule-calendar-modal="closeFacultyScheduleCalendarModal"
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
		name: 'FacultySchedule',
		components: {
			FacultyScheduleAddModal: () => import('@/components/schedule/FacultyScheduleAddModal'),
			FacultyScheduleRemoveModal: () => import('@/components/schedule/FacultyScheduleRemoveModal'),
			FacultyScheduleCalendarModal: () => import('@/components/schedule/FacultyScheduleCalendarModal')
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
				maxUnits: 21,
				currentUnits: 0,
				selectedFaculty: null,
				scheduleErrors: null,
				showScheduleErrors: false,
				snackbarNotification: false,
				snackbarNotificationContent: null,
				snackbarNotificationColor: null,
				toggleFacultyScheduleAddModal: false,
				toggleFacultyScheduleRemoveModal: false,
				toggleFacultyScheduleCalendarModal: false,
				toggleClassroomScheduleDataTableSearch: false,
				toggleMultiFilterSearch: false,
				multiFilterCourseExactTime: false,
				multiFilterCourseTimeStart: null,
				multiFilterCourseTimeEnd: null,
				multiFilterCourseDay: null,
				multiFilterCourseRoom: null,
				toggleMultiFilterSearchBar: false,
				multiFilteredScheduleArray: [],
				menuMultiFilterTimeStart: false,
				menuMultiFilterTimeEnd: false,
				schedulePayload: [],
				classroomScheduleDataTableSearch: '',
				search: '',
				filter: 'ALL',
				schedule: [],
				schedule_id: null,
				schedule_delete: null,
				deleteScheduleArray: [],
				addScheduleDialog: false,
				editScheduleDialog: false,
				deleteScheduleDialog: false,
				facultyScheduleDataTableHeader: [
					{
						text: 'ID',
						value: 'classID',
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
						width: '170',
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
						width: '90',
						sortable: true
					},
					{
						text: 'Time',
						value: 'time',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '140',
						sortable: false
					},
					{
						text: 'Day',
						value: 'day',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '90',
						sortable: true
					},
					{
						text: 'Room',
						value: 'room',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '90',
						sortable: true
					},
					{
						text: 'Added At',
						value: 'createdAt',
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
						width: '80',
						sortable: false
					}
				],
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
						width: '170',
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
						width: '90',
						sortable: true
					},
					{
						text: 'Time',
						value: 'time',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '140',
						sortable: false
					},
					{
						text: 'Day',
						value: 'day1',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '90',
						sortable: true
					},
					{
						text: 'Room',
						value: 'room1',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '90',
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
						width: '80',
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
			selectedFaculty () {
				this.scheduleErrors = ''
				this.showScheduleErrors = false
			},
			toggleClassroomScheduleDataTableSearch () {
				this.classroomScheduleDataTableSearch = ''
			},
			toggleMultiFilterSearch () {
				if (this.toggleMultiFilterSearch === false) {
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
			roomList () {
				const list = this.mainRoomList
				const item = []

				item.push('All')

				for (let i = 0; i < list.length; i++) {
					item.push(list[i].building)
				}

				return [...new Set(item)].sort()
			},
			facultyList () {
				const list = this.mainUserAccountList.filter(data => data.entityType === 'Faculty')
				const item = []

				for (let i = 0; i < list.length; i++) {
					item.push(list[i].fullName)
				}

				return [...new Set(item)].sort()
			},
			facultyScheduleDataTableContent () {
				const list = this.mainFacultyScheduleList.filter(data => data.prof === this.selectedFaculty)

				if (this.selectedFaculty !== null) {
					const facultyAccount = this.mainUserAccountList.filter(data => data.fullName === this.selectedFaculty)

					/* eslint-disable */
					this.currentUnits = facultyAccount[0].units
				}

				return list
			},
			classroomScheduleDataTableContent () {
				return this.mainClassScheduleList
			},
			multiFilteredSchedule () {
				this.setDataTableMultiFilter()

				return this.multiFilteredScheduleArray
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
			toggleDataTableSearch () {
				this.toggleMultiFilterSearch = false
				this.toggleClassroomScheduleDataTableSearch = !this.toggleClassroomScheduleDataTableSearch
			},
			toggleDataTableMultiFilterSearch () {
				this.toggleClassroomScheduleDataTableSearch = false
				this.toggleMultiFilterSearch = !this.toggleMultiFilterSearch
			},
			setDataTableMultiFilter () {
				if (this.toggleMultiFilterSearchBar == true) {
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
								return (((data.timeStart1 >= this.multiFilterCourseTimeStart && data.timeStart1 <= this.multiFilterCourseTimeEnd) && (data.timeEnd1 >= this.multiFilterCourseTimeStart && data.timeEnd1 <= this.multiFilterCourseTimeEnd)) || ((data.timeStart2 >= this.multiFilterCourseTimeStart && data.timeStart2 <= this.multiFilterCourseTimeEnd) && (data.timeEnd2 >= this.multiFilterCourseTimeStart && data.timeEnd2 <= this.multiFilterCourseTimeEnd)))
							})
						}

						this.multiFilteredScheduleArray = temp
					}
				}

				this.toggleMultiFilterSearchBar = false
			},
			generateReport () {
				this.$loading(true)
				const doc = new jsPDF()
				var facultyAccountDetails = this.mainUserAccountList.filter(data => data.fullName === this.selectedFaculty)
				var facultyScheduleList = this.mainFacultyScheduleList.filter(data => data.prof === this.selectedFaculty)
				var classroomSubject = []


				for (let i = 0; i < facultyScheduleList.length; i++) {
					if (facultyScheduleList[i].day2 === 'None') {
						classroomSubject.push([
							facultyScheduleList[i].classID,
							facultyScheduleList[i].title,
							facultyScheduleList[i].code,
							facultyScheduleList[i].section,
							facultyScheduleList[i].units,
							facultyScheduleList[i].day1,
							facultyScheduleList[i].timeStart1 + ' - ' + facultyScheduleList[i].timeEnd1,
							facultyScheduleList[i].room1 + facultyScheduleList[i].roomNum1
						])
					} else {
						classroomSubject.push([
							facultyScheduleList[i].classID,
							facultyScheduleList[i].title,
							facultyScheduleList[i].code,
							facultyScheduleList[i].section,
							facultyScheduleList[i].units,
							facultyScheduleList[i].day1,
							facultyScheduleList[i].timeStart1 + ' - ' + facultyScheduleList[i].timeEnd1,
							facultyScheduleList[i].room1 + facultyScheduleList[i].roomNum1
						])

						classroomSubject.push([
							'',
							'',
							'',
							'',
							'',
							facultyScheduleList[i].day2,
							facultyScheduleList[i].timeStart2 + ' - ' + facultyScheduleList[i].timeEnd2,
							facultyScheduleList[i].room2 + facultyScheduleList[i].roomNum2
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
						1: {cellWidth: 'auto'},
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
						doc.text('De La Salle University - Dasmariñas', data.settings.margin.left + 36, 18)
						
						doc.setFontSize(13)
						doc.setTextColor(66, 66, 66)
						doc.text('Faculty Schedule as of ' + moment().format('MMM-DD-YYYY h:mm:A'), data.settings.margin.left + 44, 26)

						doc.setFontSize(10)
						doc.text('Name: ' + facultyAccountDetails[0].fullName, data.settings.margin.left + 0, 40)
						doc.text('Department: ' + facultyAccountDetails[0].department, data.settings.margin.left + 0, 45)
						doc.text('ID: ' + facultyAccountDetails[0].id, data.settings.margin.left + 171, 40)
						doc.text('Units: ' + facultyAccountDetails[0].units, data.settings.margin.left + 170, 45)
					},
					margin: { top: 50 },
				})

				doc.save('Faculty_Schedule_' + moment().format('MMM-DD-YYYY' + '_' + 'h:mm:A') + '.pdf')
				setTimeout(() => this.$loading(false), 250)
			},
			closeFacultyScheduleCalendarModal () {
				this.toggleFacultyScheduleCalendarModal = false
			},
			facultySubjectRemove (item) {
				this.scheduleErrors = ''
				this.showScheduleErrors = false
				this.schedulePayload = item
				this.toggleFacultyScheduleRemoveModal = true
			},
			facultySubjectAdd (item) {
				this.scheduleErrors = ''
				this.showScheduleErrors = false
				this.schedulePayload = item
				this.toggleFacultyScheduleAddModal = true
			},
			closeFacultyScheduleRemoveModal () {
				this.schedulePayload = []
				this.toggleFacultyScheduleRemoveModal = false
			},
			closeFacultyScheduleAddModal () {
				this.schedulePayload = []
				this.toggleFacultyScheduleAddModal = false
			},
			showFacultyScheduleRemoveNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'error'
				this.snackbarNotificationContent = 'Faculty schedule has been removed!'

				if (this.toggleMultiFilterSearch == true) {
					setTimeout(() => this.toggleMultiFilterSearchBar = true, 250)
				}
			},
			showFacultyScheduleAddNotification () {
				this.snackbarNotification = true
				this.snackbarNotificationColor = 'success'
				this.snackbarNotificationContent = 'Faculty schedule has been added!'

				if (this.toggleMultiFilterSearch == true) {
					setTimeout(() => this.toggleMultiFilterSearchBar = true, 250)
				}
			},
			showFacultyScheduleAddNotificationError (item) {
				this.toggleFacultyScheduleAddModal = false
				this.schedulePayload = []
				this.scheduleErrors = item
				this.showScheduleErrors = true
			}
		}
	}
</script>
