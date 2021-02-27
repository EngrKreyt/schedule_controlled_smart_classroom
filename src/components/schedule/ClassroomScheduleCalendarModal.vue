<template>
	<v-dialog
		v-model="toggleClassroomScheduleCalendarModal"
		overlay-color="grey darken-3"
		width="1250"
	>
		<v-card 
			height="600"
			class="pt-4 pr-6 pb-5 pl-6"
		>
			<v-card-title class="font-weight-regular primary--text pa-0">
				<div v-if="$vuetify.breakpoint.smAndUp">
					{{ defaultRoomFilter }} Calendar
				</div>

				<v-spacer/>

				<v-col
					cols="4"
					md="1"
					class="pt-0 pr-0 pb-0"
				>
					<v-select
						v-model="defaultRoomFilter"
						:items="roomList"
						label="Room"
						single-line
						hide-details
						color="success"
						class="pt-0 mt-0 mb-1 font-weight-light"
					/>
				</v-col>

				<v-col
					cols="4"
					md="1"
					class="pt-0 pr-4 pb-0"
				>
					<v-select
						v-model="defaultRoomNumFilter"
						:items="roomNumList"
						label="Number"
						single-line
						hide-details
						color="success"
						class="pt-0 mt-0 mb-1 font-weight-light"
					/>
				</v-col>
				
				<v-btn
					fab
					small
					depressed
					color="transparent"
					@click="toggleClassroomScheduleCalendarModal = false"
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>

			<v-card-text class="pa-0">
				<v-row>
					<v-col>
						<v-sheet height="505">
							<v-calendar
								ref="calendar"
								v-model="today"
								:now="today"
								:type="defaultCalendarType"
								:weekdays="defaultCalendarWeekdays"
								:first-interval="defaultCalendarIntervals.first"
								:interval-minutes="defaultCalendarIntervals.minutes"
								:interval-count="defaultCalendarIntervals.count"
								:interval-height="defaultCalendarIntervals.height"
								:events="filteredEvents"
								:event-overlap-mode="mode"
								:event-overlap-threshold="45"
								color="success"
								event-color="success"
								@change="getEvents"
								@click:event="showEvent"
							/>

							<v-menu
								v-model="selectedOpen"
								:close-on-click="false"
								:close-on-content-click="false"
								:activator="selectedElement"
							>
								<v-card
									flat
									min-width="350px"
								>
									<v-toolbar
										flat
										dark
										color="success"
									>
										<v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
										
										<v-spacer/>
										
										<v-btn
											small
											icon
											class="mr-0"
											color="grey lighten-3"
											@click.stop="selectedOpen = false"
										>
											<v-icon>mdi-close</v-icon>
										</v-btn>
									</v-toolbar>

									<v-card-text>
										<span
											v-html="selectedEvent.details"
											color="primary"
										/>
									</v-card-text>
								</v-card>
							</v-menu>
						</v-sheet>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
	import moment from 'moment'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'ClassroomScheduleCalendarModal',
		props: {
			toggleClassroomScheduleCalendarModal: {
				type: Boolean,
				required: true
			}
		},
		data () {
			return {
				today: moment().format('YYYY-MM-DD'),
				monday: null,
				tuesday: null,
				wednesday: null,
				thursday: null,
				friday: null,
				saturday: null,
				selectedEvent: {},
				selectedElement: null,
				selectedOpen: false,
				events: [],
				mode: 'column',
				defaultCalendarType: 'week',
				typeSelectOption: [
					{ text: 'Day', value: 'day' },
					{ text: 'Week', value: 'week' }
				],
				defaultRoomFilter: 'CTH',
				roomSelectOption: [
					{ text: 'CTH', value: 'CTH' },
					{ text: 'MTH', value: 'MTH' },
					{ text: 'VBH', value: 'VBH' },
				],
				defaultRoomNumFilter: '101',
				roomNumSelectOption: ['101', '102', '103', '104', '105'],
				defaultCalendarWeekdays: [1, 2, 3, 4, 5, 6],
				defaultCalendarIntervals: {
					first: 7,
					minutes: 60,
					count: 15,
					height: 48,
				},
				shortIntervals: true,
			}
		},
		created () {
			this.fetchClassroomScheduleList()
		},
		watch: {
			toggleClassroomScheduleCalendarModal() {
				this.defaultRoomFilter = 'CTH'
				this.defaultRoomNumFilter = '101'

				if (this.toggleClassroomScheduleCalendarModal === false) {
					this.$emit('close-classroom-schedule-calendar-modal')
				}
			}
		},
		computed: {
			...mapState({
				mainClassScheduleList: state => state.mainClassScheduleList,
				mainRoomList: state => state.mainRoomList
			}),
			getEvents () {
				return this.events
			},
			filteredEvents () {
				this.setEvents()

				return this.events
			},
			roomList () {
				const list = this.mainRoomList
				const item = []

				for (let i = 0; i < list.length; i++) {
					item.push(list[i].building)
				}

				return [...new Set(item)].sort()
			},
			roomNumList () {
				const list = this.mainRoomList.filter(data => data.building === this.defaultRoomFilter)
				const item = []

				for (let i = 0; i < list.length; i++) {
					item.push(list[i].number)
				}
				return item.sort()
			}
		},
		methods: {
			...mapActions([
				'fetchClassroomScheduleList'
			]),
			setEvents () {
				this.events = []
				var classSchedule = []
				const dateToday = moment().format('YYYY-MM-DD')
				const weekDayName =  moment(dateToday).format('ddd');
				const tempSchedule = this.mainClassScheduleList

				if (weekDayName === 'Mon') {
					this.monday    = moment().format('YYYY-MM-DD')
					this.tuesday   = moment(dateToday, "YYYY-MM-DD").add(1, 'days')
					this.wednesday = moment(dateToday, "YYYY-MM-DD").add(2, 'days')
					this.thursday  = moment(dateToday, "YYYY-MM-DD").add(3, 'days')
					this.friday    = moment(dateToday, "YYYY-MM-DD").add(4, 'days')
					this.saturday  = moment(dateToday, "YYYY-MM-DD").add(5, 'days')
				} else if (weekDayName === 'Tue') {
					this.monday    = moment(dateToday, "YYYY-MM-DD").subtract(1, 'days')
					this.tueday    = moment().format('YYYY-MM-DD')
					this.wednesday = moment(dateToday, "YYYY-MM-DD").add(1, 'days')
					this.thursday  = moment(dateToday, "YYYY-MM-DD").add(2, 'days')
					this.friday    = moment(dateToday, "YYYY-MM-DD").add(3, 'days')
					this.saturday  = moment(dateToday, "YYYY-MM-DD").add(4, 'days')
				} else if (weekDayName === 'Wed') {
					this.monday    = moment(dateToday, "YYYY-MM-DD").subtract(2, 'days')
					this.tuesday   = moment(dateToday, "YYYY-MM-DD").subtract(1, 'days')
					this.wednesday = moment().format('YYYY-MM-DD')
					this.thursday  = moment(dateToday, "YYYY-MM-DD").add(1, 'days')
					this.friday    = moment(dateToday, "YYYY-MM-DD").add(2, 'days')
					this.saturday  = moment(dateToday, "YYYY-MM-DD").add(3, 'days')
				} else if (weekDayName === 'Thu') {
					this.monday    = moment(dateToday, "YYYY-MM-DD").subtract(3, 'days')
					this.tuesday   = moment(dateToday, "YYYY-MM-DD").subtract(2, 'days')
					this.wednesday = moment(dateToday, "YYYY-MM-DD").subtract(1, 'days')
					this.thursday  = moment().format('YYYY-MM-DD')
					this.friday    = moment(dateToday, "YYYY-MM-DD").add(1, 'days')
					this.saturday  = moment(dateToday, "YYYY-MM-DD").add(2, 'days')
				} else if (weekDayName === 'Fri') {
					this.monday    = moment(dateToday, "YYYY-MM-DD").subtract(4, 'days')
					this.tuesday   = moment(dateToday, "YYYY-MM-DD").subtract(3, 'days')
					this.wednesday = moment(dateToday, "YYYY-MM-DD").subtract(2, 'days')
					this.thursday  = moment(dateToday, "YYYY-MM-DD").subtract(1, 'days')
					this.friday    = moment().format('YYYY-MM-DD')
					this.saturday  = moment(dateToday, "YYYY-MM-DD").add(1, 'days')
				} else if (weekDayName === 'Sat') {
					this.monday    = moment(dateToday, "YYYY-MM-DD").subtract(5, 'days')
					this.tuesday   = moment(dateToday, "YYYY-MM-DD").subtract(4, 'days')
					this.wednesday = moment(dateToday, "YYYY-MM-DD").subtract(3, 'days')
					this.thursday  = moment(dateToday, "YYYY-MM-DD").subtract(2, 'days')
					this.friday    = moment(dateToday, "YYYY-MM-DD").subtract(1, 'days')
					this.saturday  = moment().format('YYYY-MM-DD')
				} else if (weekDayName === 'Sun') {
					this.monday    = moment(dateToday, "YYYY-MM-DD").subtract(6, 'days')
					this.tuesday   = moment(dateToday, "YYYY-MM-DD").subtract(5, 'days')
					this.wednesday = moment(dateToday, "YYYY-MM-DD").subtract(4, 'days')
					this.thursday  = moment(dateToday, "YYYY-MM-DD").subtract(3, 'days')
					this.friday    = moment(dateToday, "YYYY-MM-DD").subtract(2, 'days')
					this.saturday  = moment(dateToday, "YYYY-MM-DD").subtract(1, 'days')
				}

				for (let i = 0; i < tempSchedule.length; i++) {
					if (tempSchedule[i].day2 === 'None') {
						classSchedule.push({
							name: tempSchedule[i].title,
							day: tempSchedule[i].day1,
							start: tempSchedule[i].timeStart1,
							end: tempSchedule[i].timeEnd1,
							room: tempSchedule[i].room1,
							roomNumber: tempSchedule[i].roomNum1,
							section: tempSchedule[i].section,
							code: tempSchedule[i].code,
							prof: tempSchedule[i].prof
						})
					} else {
						classSchedule.push({
							name: tempSchedule[i].title,
							day: tempSchedule[i].day1,
							start: tempSchedule[i].timeStart1,
							end: tempSchedule[i].timeEnd1,
							room: tempSchedule[i].room1,
							roomNumber: tempSchedule[i].roomNum1,
							section: tempSchedule[i].section,
							code: tempSchedule[i].code,
							prof: tempSchedule[i].prof
						})

						classSchedule.push({
							name: tempSchedule[i].title,
							day: tempSchedule[i].day2,
							start: tempSchedule[i].timeStart2,
							end: tempSchedule[i].timeEnd2,
							room: tempSchedule[i].room2,
							roomNumber: tempSchedule[i].roomNum2,
							section: tempSchedule[i].section,
							code: tempSchedule[i].code,
							prof: tempSchedule[i].prof
						})
					}
				}

				classSchedule = classSchedule.filter(data => data.room === this.defaultRoomFilter)
				classSchedule = classSchedule.filter(data => data.roomNumber === this.defaultRoomNumFilter)

				for (let i = 0; i < classSchedule.length; i++) {
					if (classSchedule[i].day === 'Mon') {
						this.events.push({
							name: classSchedule[i].code,
							start: moment(this.monday).format('YYYY-MM-DD') + ' ' + classSchedule[i].start,
							end: moment(this.monday).format('YYYY-MM-DD') + ' ' + classSchedule[i].end,
							details: 'Title: ' + classSchedule[i].name + '<br>' + 'Code: ' + classSchedule[i].code + '<br>' + 'Section: ' + classSchedule[i].section + '<br>' + 'Schedule: ' + classSchedule[i].day + ' ' + classSchedule[i].start + ' - ' + classSchedule[i].end + '<br>' + 'Room: ' + classSchedule[i].room + classSchedule[i].roomNumber
						})
					} else if (classSchedule[i].day === 'Tue') {
						this.events.push({
							name: classSchedule[i].code,
							start: moment(this.tuesday).format('YYYY-MM-DD') + ' ' + classSchedule[i].start,
							end: moment(this.tuesday).format('YYYY-MM-DD') + ' ' + classSchedule[i].end,
							details: 'Title: ' + classSchedule[i].name + '<br>' + 'Code: ' + classSchedule[i].code + '<br>' + 'Section: ' + classSchedule[i].section + '<br>' + 'Schedule: ' + classSchedule[i].day + ' ' + classSchedule[i].start + ' - ' + classSchedule[i].end + '<br>' + 'Room: ' + classSchedule[i].room + classSchedule[i].roomNumber
						})
					} else if (classSchedule[i].day === 'Wed') {
						this.events.push({
							name: classSchedule[i].code,
							start: moment(this.wednesday).format('YYYY-MM-DD') + ' ' + classSchedule[i].start,
							end: moment(this.wednesday).format('YYYY-MM-DD') + ' ' + classSchedule[i].end,
							details: 'Title: ' + classSchedule[i].name + '<br>' + 'Code: ' + classSchedule[i].code + '<br>' + 'Section: ' + classSchedule[i].section + '<br>' + 'Schedule: ' + classSchedule[i].day + ' ' + classSchedule[i].start + ' - ' + classSchedule[i].end + '<br>' + 'Room: ' + classSchedule[i].room + classSchedule[i].roomNumber
						})
					} else if (classSchedule[i].day === 'Thu') {
						this.events.push({
							name: classSchedule[i].code,
							start: moment(this.thursday).format('YYYY-MM-DD') + ' ' + classSchedule[i].start,
							end: moment(this.thursday).format('YYYY-MM-DD') + ' ' + classSchedule[i].end,
							details: 'Title: ' + classSchedule[i].name + '<br>' + 'Code: ' + classSchedule[i].code + '<br>' + 'Section: ' + classSchedule[i].section + '<br>' + 'Schedule: ' + classSchedule[i].day + ' ' + classSchedule[i].start + ' - ' + classSchedule[i].end + '<br>' + 'Room: ' + classSchedule[i].room + classSchedule[i].roomNumber
						})
					} else if (classSchedule[i].day === 'Fri') {
						this.events.push({
							name: classSchedule[i].code,
							start: moment(this.friday).format('YYYY-MM-DD') + ' ' + classSchedule[i].start,
							end: moment(this.friday).format('YYYY-MM-DD') + ' ' + classSchedule[i].end,
							details: 'Title: ' + classSchedule[i].name + '<br>' + 'Code: ' + classSchedule[i].code + '<br>' + 'Section: ' + classSchedule[i].section + '<br>' + 'Schedule: ' + classSchedule[i].day + ' ' + classSchedule[i].start + ' - ' + classSchedule[i].end + '<br>' + 'Room: ' + classSchedule[i].room + classSchedule[i].roomNumber
						})
					} else if (classSchedule[i].day === 'Sat') {
						this.events.push({
							name: classSchedule[i].code,
							start: moment(this.saturday).format('YYYY-MM-DD') + ' ' + classSchedule[i].start,
							end: moment(this.saturday).format('YYYY-MM-DD') + ' ' + classSchedule[i].end,
							details: 'Title: ' + classSchedule[i].name + '<br>' + 'Code: ' + classSchedule[i].code + '<br>' + 'Section: ' + classSchedule[i].section + '<br>' + 'Schedule: ' + classSchedule[i].day + ' ' + classSchedule[i].start + ' - ' + classSchedule[i].end + '<br>' + 'Room: ' + classSchedule[i].room + classSchedule[i].roomNumber
						})
					}
				}
			},
			showEvent ({ nativeEvent, event }) {
				const open = () => {
					this.selectedEvent = event
					this.selectedElement = nativeEvent.target
					setTimeout(() => this.selectedOpen = true, 10)
				}

				if (this.selectedOpen) {
					this.selectedOpen = false
					setTimeout(open, 10)
				} else {
					open()
				}

				nativeEvent.stopPropagation()
			}
		}
	}
</script>
