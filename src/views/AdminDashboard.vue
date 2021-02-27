<template>
	<v-container
		fluid
		grid-list-lg
		class="pt-0 pb-8 mt-8 mb-8 "
		:class="$vuetify.breakpoint.mdAndDown ? 'px-5' : 'px-8'"
	>
		<v-layout
			row
			justify-center
		>
			<v-flex
				xs6
				md3
				lg3
				class="py-0"
			>
				<v-card
					flat
					class="py-6 px-6 ma-0 header-1"
				>
					<v-card-title class="font-weight-light primary--text pa-0">
						<v-col
							cols="12"
							sm="12"
							md="7"
							lg="7"
							class="pa-0"
						>
							Admin
						</v-col>

						<v-spacer/>

						<v-col
							cols="12"
							sm="12"
							md="2"
							lg="2"
							class="font-weight-light headline pa-0"
						>
							{{ userAdminStatistics }}
						</v-col>
					</v-card-title>
				</v-card>
			</v-flex>

			<v-flex
				xs6
				md3
				lg3
				class="py-0"
			>
				<v-card
					flat
					class="py-6 px-6 mt-0 header-2"
				>
					<v-card-title class="font-weight-light primary--text pa-0">
						<v-col
							cols="12"
							sm="12"
							md="7"
							lg="7"
							class="pa-0"
						>
							Faculty
						</v-col>

						<v-spacer/>

						<v-col
							cols="12"
							sm="12"
							md="2"
							lg="2"
							class="font-weight-light headline pa-0"
						>
							{{ userFacultyStatistics }}
						</v-col>
					</v-card-title>
				</v-card>
			</v-flex>

			<v-flex
				xs6
				md3
				lg3
				class="py-0"
			>
				<v-card
					flat
					class="py-6 px-6 mt-0 header-3"
				>
					<v-card-title class="font-weight-light primary--text pa-0">
						<v-col
							cols="12"
							sm="12"
							md="7"
							lg="7"
							class="pa-0"
						>
							Schedule
						</v-col>

						<v-spacer/>

						<v-col
							cols="12"
							sm="12"
							md="2"
							lg="2"
							class="font-weight-light headline pa-0"
						>
							{{ scheduleStatistics }}
						</v-col>
					</v-card-title>
				</v-card>
			</v-flex>

			<v-flex
				xs6
				md3
				lg3
				class="py-0"
			>
				<v-card
					flat
					class="py-6 px-6 mt-0 header-4"
				>
					<v-card-title class="font-weight-light primary--text pa-0">
						<v-col
							cols="12"
							sm="12"
							md="7"
							lg="7"
							class="pa-0"
						>
							Room
						</v-col>

						<v-spacer/>

						<v-col
							cols="12"
							sm="12"
							md="2"
							lg="2"
							class="font-weight-light headline pa-0"
						>
							{{ roomStatistics }}
						</v-col>
					</v-card-title>
				</v-card>
			</v-flex>
		</v-layout>

		<v-layout
			row
			justify-center
		>
			<v-flex
				xs12
				md12
				lg12
			>
				<v-card
					flat
					class="py-6 px-6 mt-6 mb-0 mx-0"
				>
					<v-card-title
						class="font-weight-regular primary--text pa-0"
						:class="toggleDataTableSearch || toggleDataTableMultiFilterSearch ? 'mb-3' : 'mb-4'"
					>
						Room Access Log

						<v-spacer/>

						<v-btn
							small
							depressed
							class="font-weight-regular body-2 toggle-btn mr-2"
							:class="toggleDataTableSearch ? 'white--text' : 'primary--text'"
							:color="toggleDataTableSearch ? 'success' : 'grey lighten-3'"
							@click="toggleDataTableSearchButton()"
						>
							Search
						</v-btn>

						<v-btn
							small
							depressed
							class="font-weight-regular body-2 toggle-btn"
							:class="toggleDataTableMultiFilterSearch ? 'white--text' : 'primary--text'"
							:color="toggleDataTableMultiFilterSearch ? 'success' : 'grey lighten-3'"
							@click="toggleDataTableMultiFilterSearchButton()"
						>
							Filter
						</v-btn>
					</v-card-title>

					<v-card-text class="pa-0">
						<v-data-table
							:headers="dataTableHeader"
							:items="toggleDataTableMultiFilterSearch ? dataTableMultiFilteredContent : dataTableContent"
							:search="dataTableSearch"
							:items-per-page="10"
							:sort-desc="[false, true]"
							:mobile-breakpoint="0"
							class="font-weight-light secondary--text"
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
											v-model="dataTableSearch"
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
											v-model="multiFilterRoomBuilding"
											:error-messages="multiFilterRoomBuildingFormErrors"
											:items="multiFilterRoomSelectList"
											label="Room"
											clearable
											single-line
											hide-details="auto"
											color="success"
											class="pt-0 mt-0 mr-3 font-weight-light"
											@input="$v.multiFilterRoomBuilding.$touch()"
											@blur="$v.multiFilterRoomBuilding.$touch()"
										/>
									</v-col>

									<v-col
										cols="12"
										sm="2"
										class="pr-0 pl-0"
									>
										<v-menu
											v-model="menuMultiFilterDate"
											:close-on-content-click="false"
											:nudge-right="40"
											transition="scale-transition"
											offset-y
											max-width="290px"
											min-width="290px"
										>
											<template v-slot:activator="{ on }">
												<v-text-field
													v-model="multiFilterDate"
													:error-messages="multiFilterDateFormErrors"
													:value="multiFilterDateValue"
													label="Date"
													v-on="on"
													readonly
													clearable
													single-line
													hide-details="auto"
													color="success"
													class="pt-0 mt-0 mr-3 font-weight-light"
													@input="$v.multiFilterDate.$touch()"
													@blur="$v.multiFilterDate.$touch()"
												/>
											</template>
											
											<v-date-picker
												locale="en-in"
												v-model="multiFilterDate"
												color="success"
												class="pt-0 mt-0 mr-3 font-weight-light"
												@input="menuMultiFilterDate = false"
											/>
										</v-menu>
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
											:return-value.sync="multiFilterTimeStart"
											transition="scale-transition"
											offset-y
											max-width="290px"
											min-width="290px"
										>
											<template v-slot:activator="{ on }">
												<v-text-field
													v-model="multiFilterTimeStart"
													:error-messages="multiFilterTimeStartFormErrors"
													label="Time start"
													v-on="on"
													readonly
													clearable
													single-line
													hide-details="auto"
													color="success"
													class="pt-0 mt-0 mr-3 font-weight-light"
													@input="$v.multiFilterTimeStart.$touch()"
													@blur="$v.multiFilterTimeStart.$touch()"
												/>
											</template>
											
											<v-time-picker
												v-if ="menuMultiFilterTimeStart"
												v-model="multiFilterTimeStart"
												format="24hr"
												scrollable
												color="success"
												min="7:00"
												max="21:00"
												full-width
												:allowed-minutes="m => m % 15 === 0"
												@click:minute="$refs.menu1.save(multiFilterTimeStart)"
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
											:return-value.sync="multiFilterTimeEnd"
											transition="scale-transition"
											offset-y
											max-width="290px"
											min-width="290px"
										>
											<template v-slot:activator="{ on }">
												<v-text-field
													v-model="multiFilterTimeEnd"
													:error-messages="multiFilterTimeEndFormErrors"
													label="Time end"
													v-on="on"
													readonly
													clearable
													single-line
													hide-details="auto"
													color="success"
													class="pt-0 mt-0 mr-3 font-weight-light"
													@input="$v.multiFilterTimeEnd.$touch()"
													@blur="$v.multiFilterTimeEnd.$touch()"
												/>
											</template>
											
											<v-time-picker
												v-if ="menuMultiFilterTimeEnd"
												v-model="multiFilterTimeEnd"
												format="24hr"
												scrollable
												color="success"
												min="7:00"
												max="21:00"
												full-width
												:allowed-minutes="m => m % 15 === 0"
												@click:minute="$refs.menu2.save(multiFilterTimeEnd)"
											/>
										</v-menu>
									</v-col>

									<v-col
										cols="12"
										sm="1"
									>
										<v-btn 
											small
											depressed
											class="font-weight-regular body-2 toggle-btn"
											color="success"
											@click="multiFilterSetSearch = true"
										>
											Search
										</v-btn>
									</v-col>

									<v-spacer/>
								</v-row>
							</template>
						</v-data-table>
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>

		<h2 class="font-weight-regular primary--text text-center mt-4 mb-2">Dashboard</h2>

		<v-layout
			row
			justify-center
		>
			<v-flex
				v-if="$store.state.userAccountEntityType == 'Superadmin'" 
				xs12
				md3
				lg3
			>
				<v-card
					flat
					class="mt-2"
				>
					<v-card-title class="font-weight-regular primary--text pt-5 pr-5 pb-5 pl-5">
						<v-icon
							left
							large
							color="grey darken-3"
							class="mr-4"
						>
							mdi-account
						</v-icon>

						Admin account
					</v-card-title> 

					<v-card-text class="font-weight-light secondary--text pr-6 pl-6">
						Manage basic info such as name, contact number, and email.
					</v-card-text>

					<v-divider/>

					<v-card-actions class="pt-3 pr-5 pb-3 pl-5">
						<v-btn
							tile
							depressed
							class="font-weight-regular body-2 toggle-btn transparent success--text"
							@click="$router.push('/view/admin/account/administrator')"
						>
							Manage
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>

			<v-flex
				xs12
				md3
				lg3
			>
				<v-card
					flat
					class="mt-2"
				>
					<v-card-title class="font-weight-regular primary--text pt-5 pr-5 pb-5 pl-5">
						<v-icon
							left
							large
							color="grey darken-3"
							class="mr-4"
						>
							mdi-account-multiple
						</v-icon>

						Faculty account
					</v-card-title>

					<v-card-text class="font-weight-light secondary--text pr-6 pl-6">
						Manage basic info such as name, contact number, and email.
					</v-card-text>

					<v-divider/>

					<v-card-actions class="pt-3 pr-5 pb-3 pl-5">
						<v-btn
							tile
							depressed
							class="font-weight-regular body-2 toggle-btn transparent success--text"
							@click="$router.push('/view/admin/account/faculty')"
						>
							Manage
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>

			<v-flex
				xs12
				md3
				lg3
			>
				<v-card
					flat
					class="mt-2"
				>
					<v-card-title class="font-weight-regular primary--text pt-5 pr-5 pb-5 pl-5">
						<v-icon
							left
							large
							color="grey darken-3"
							class="mr-4"
						>
							mdi-warehouse
						</v-icon>

						Room
					</v-card-title>

					<v-card-text class="font-weight-light secondary--text pr-6 pl-6">
						Manage basic details such as building, room number, and type.
					</v-card-text>

					<v-divider/>

					<v-card-actions class="pt-3 pr-5 pb-3 pl-5">
						<v-btn
							tile
							depressed
							class="font-weight-regular body-2 toggle-btn transparent success--text"
							@click="$router.push('/view/admin/utility/room')"
						>
							Manage
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>

			<v-flex
				xs12
				md3
				lg3
			>
				<v-card
					flat
					class="mt-2"
				>
					<v-card-title class="font-weight-regular primary--text pt-5 pr-5 pb-5 pl-5">
						<v-icon
							left
							large
							color="grey darken-3"
							class="mr-4"
						>
							mdi-credit-card
						</v-icon>

						Access card
					</v-card-title>

					<v-card-text class="font-weight-light secondary--text pr-6 pl-6">
						Manage by assigning/removing card used for accessing rooms.
					</v-card-text>

					<v-divider/>

					<v-card-actions class="pt-3 pr-5 pb-3 pl-5">
						<v-btn
							tile
							depressed
							class="font-weight-regular body-2 toggle-btn transparent success--text"
							@click="$router.push('/view/admin/utility/rfid')"
						>
							Manage
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>

		<v-layout
			row
			justify-center
		>
			<v-flex
				xs12
				md4
				lg4
			>
				<v-card
					flat
					class="mt-2"
				>
					<v-card-title class="font-weight-regular primary--text pt-5 pr-5 pb-5 pl-5">
						<v-icon
							left
							large
							color="grey darken-3"
							class="mr-4"
						>
							mdi-calendar
						</v-icon>

						Classroom schedule
					</v-card-title>

					<v-card-text class="font-weight-light secondary--text pr-6 pl-6">
						Manage classroom schedules details. Create/update information, or delete schedules.
					</v-card-text>

					<v-divider/>

					<v-card-actions class="pt-3 pr-5 pb-3 pl-5">
						<v-btn
							tile
							depressed
							class="font-weight-regular body-2 toggle-btn transparent success--text"
							@click="$router.push('/view/admin/schedule/classroom')"
						>
							Manage
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>

			<v-flex
				xs12
				md4
				lg4
			>
				<v-card
					flat
					class="mt-2"
				>
					<v-card-title class="font-weight-regular primary--text pt-5 pr-5 pb-5 pl-5">
						<v-icon
							left
							large
							color="grey darken-3"
							class="mr-4"
						>
							mdi-calendar-account
						</v-icon>

						Faculty schedules
					</v-card-title>

					<v-card-text class="font-weight-light secondary--text pr-6 pl-6">
						Manage faculty schedules. Add/remove schedules, download schedule, or view calendar.
					</v-card-text>

					<v-divider/>

					<v-card-actions class="pt-3 pr-5 pb-3 pl-5">
						<v-btn
							tile
							depressed
							class="font-weight-regular body-2 toggle-btn transparent success--text"
							@click="$router.push('/view/admin/schedule/faculty')"
						>
							Manage
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>

			<v-flex
				xs12
				md4
				lg4
			>
				<v-card
					flat
					class="mt-2"
				>
					<v-card-title class="font-weight-regular primary--text pt-5 pr-5 pb-5 pl-5">
						<v-icon
							left
							large
							color="grey darken-3"
							class="mr-4"
						>
							mdi-calendar-clock
						</v-icon>

						Substitute faculty
					</v-card-title>

					<v-card-text class="font-weight-light secondary--text pr-6 pl-6">
						Manage substitute faculty. Assign available faculty and give room access for the schedule.
					</v-card-text>

					<v-divider/>

					<v-card-actions class="pt-3 pr-5 pb-3 pl-5">
						<v-btn
							tile
							depressed
							class="font-weight-regular body-2 toggle-btn transparent success--text"
							@click="$router.push('/view/admin/schedule/subfaculty')"
						>
							Manage
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import { validationMixin } from 'vuelidate'
	import { required } from 'vuelidate/lib/validators'

	export default {
		name: 'AdminDashboard',
		beforeMount () {
			if (this.userAccountEntityType === 'Faculty') {
				this.$router.push('/view/user/schedule')
			}
		},
		beforeDestroy () {
			clearInterval(this.log)
		},
		created () {
			this.fetchUserAccountList()
			this.fetchClassroomScheduleList()
			this.fetchFacultyScheduleList()
			this.fetchRoomList()
			this.fetchRoomLog()
			this.logData()
		},
		mixins: [
			validationMixin
		],
		data () {
			return {
				log: null,
				logMultiFilteredList: [],
				toggleDataTableSearch: false,
				toggleDataTableMultiFilterSearch: false,
				menuMultiFilterDate: false,
				menuMultiFilterTimeStart: false,
				menuMultiFilterTimeEnd: false,
				multiFilterSetSearch: false,
				multiFilterRoomBuilding: null,
				multiFilterDate: null,
				multiFilterTimeStart: null,
				multiFilterTimeEnd: null,
				dataTableSearch: '',
				dataTableHeader: [
					{
						text: 'ID',
						value: 'id',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '65',
						sortable: true
					},
					{
						text: 'Name',
						value: 'name',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '180',
						sortable: true
					},
					{
						text: 'Type',
						value: 'type',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '120',
						sortable: true
					},
					{
						text: 'Room',
						value: 'room',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '120',
						sortable: true
					},
					{
						text: 'Date',
						value: 'date',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '150',
						sortable: true
					},
					{
						text: 'Time',
						value: 'time',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '150',
						sortable: true
					},
					{
						text: 'Mode',
						value: 'mode',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '120',
						sortable: true
					},
					{
						text: 'Result',
						value: 'result',
						align: 'left',
						class: 'font-weight-regular primary--text',
						width: '120',
						sortable: true
					}
				]
			}
		},
		validations () {
			return {
				multiFilterRoomBuilding: {
					required
				},
				multiFilterDate: {
					required
				},
				multiFilterTimeStart: {
					required
				},
				multiFilterTimeEnd: {
					required
				}
			}
		},
		watch: {
			toggleDataTableSearch () {
				this.dataTableSearch = ''
			},
			toggleDataTableMultiFilterSearch () {
				this.$v.$reset()
				this.menuMultiFilterDate = false
				this.multiFilterRoomBuilding = null
				this.multiFilterDate = null
				this.multiFilterTimeStart = null
				this.multiFilterTimeEnd = null
				this.multiFilterSetSearch = false
				this.logMultiFilteredList = []
			},
		},
		computed: {
			...mapState({
				userAccountEntityType: state => state.userAccountEntityType,
				mainUserAccountList: state => state.mainUserAccountList,
				mainClassScheduleList: state => state.mainClassScheduleList,
				mainRoomList: state => state.mainRoomList,
				mainRoomLog: state => state.mainRoomLog,
			}),
			dataTableContent () {
				return this.mainRoomLog
			},
			dataTableMultiFilteredContent () {
				this.dataTableMultiFilterSetContent()

				return this.roomMultiFilteredList
			},
			userAdminStatistics () {
				return this.mainUserAccountList.filter(data => data.entityType === 'Admin').length
			},
			userFacultyStatistics () {
				return this.mainUserAccountList.filter(data => data.entityType === 'Faculty').length
			},
			scheduleStatistics () {
				return this.mainClassScheduleList.length
			},
			roomStatistics () {
				return this.mainRoomList.length
			},
			multiFilterDateValue () {
				return this.multiFilterDate
			},
			multiFilterRoomSelectList () {
				let room = this.mainRoomList.map(data => data.building)

				room.push('All')

				return [...new Set(room)].sort()
			},
			multiFilterRoomBuildingFormErrors () {
				const errors = []
				if (!this.$v.multiFilterRoomBuilding.$dirty) return errors
				!this.$v.multiFilterRoomBuilding.required && errors.push(`Required!`)
				return errors
			},
			multiFilterDateFormErrors () {
				const errors = []
				if (!this.$v.multiFilterDate.$dirty) return errors
				!this.$v.multiFilterDate.required && errors.push(`Required!`)
				return errors
			},
			multiFilterTimeStartFormErrors () {
				const errors = []
				if (!this.$v.multiFilterTimeStart.$dirty) return errors
				!this.$v.multiFilterTimeStart.required && errors.push(`Required!`)
				return errors
			},
			multiFilterTimeEndFormErrors () {
				const errors = []
				if (!this.$v.multiFilterTimeEnd.$dirty) return errors
				!this.$v.multiFilterTimeEnd.required && errors.push(`Required!`)
				return errors
			}
		},
		methods: {
			...mapActions([
				'fetchUserAccountList',
				'fetchClassroomScheduleList',
				'fetchFacultyScheduleList',
				'fetchRoomList',
				'fetchRoomLog'
			]),
			logData () {
				this.log = setInterval(() => {
					this.fetchRoomLog()
				}, 1500)
			},
			toggleDataTableSearchButton () {
				this.toggleDataTableMultiFilterSearch = false
				this.toggleDataTableSearch = !this.toggleDataTableSearch
			},
			toggleDataTableMultiFilterSearchButton () {
				this.toggleDataTableSearch = false
				this.toggleDataTableMultiFilterSearch = !this.toggleDataTableMultiFilterSearch
			},
			dataTableMultiFilterSetContent () {
				if (this.multiFilterSetSearch === true) {
					this.$v.$touch()
					
					if (!this.$v.$invalid) {
						let temp = this.mainRoomLog.filter(data => data.date == this.multiFilterDate)

						if (this.multiFilterRoomBuilding != 'All') {
							temp = temp.filter(data => data.room.slice(0, 3) == this.multiFilterRoomBuilding)
						}

						temp = temp.filter(data => this.multiFilterTimeStart < data.time.slice(0, 5) && this.multiFilterTimeEnd > data.time.slice(0, 5))

						this.roomMultiFilteredList = temp
					}
				}

				this.multiFilterSetSearch = false
			}
		}
	}
</script>

<style scoped>
	.header-1 {
		border-left: 2.25px solid #093A1D !important;
	}

	.header-2 {
		border-left: 2.25px solid #002D62 !important;
	}

	.header-3 {
		border-left: 2.25px solid #E36414 !important;
	}

	.header-4 {
		border-left: 2.25px solid #8F250C !important;
	}
</style>
