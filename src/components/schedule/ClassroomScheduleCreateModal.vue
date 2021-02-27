<template>
	<v-dialog
		v-model="toggleClassroomScheduleCreateModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Create Schedule
			</v-card-title>

			<v-card-text class="pa-0">
				<v-alert
					dense
					dismissible
					color="error"
					v-model="showFormErrors"
					class="pt-2 pb-2 pl-0 mt-4 mb-4"
				>
					<v-list
						dense
						color="error"
					>
						<v-list-item
							v-for="(error, index) in formErrorsComputed"
							:key="index"
						>
							<p class="white--text body-2 mb-0">{{ error }}</p>
						</v-list-item>
					</v-list>
				</v-alert>

				<form
					class="font-weight-light body-2 secondary--text"
					:class="showFormErrors ? 'mt-6' : 'mt-4'"
				>
					<v-row :class="courseTitle === null ? 'mt-4' : 'mt-8'">
						<v-col
							cols="12"
							sm="12"
							class="pt-0"
						>
							<v-text-field
								v-model="courseTitle"
								:error-messages="courseTitleFormErrors"
								:counter="$v.courseTitle.$params.maxLength.max"
								label="Course Title"
								color="success"
								dense
								@input="$v.courseTitle.$touch()"
								@blur="$v.courseTitle.$touch()"
							/>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							sm="6"
							:class="courseCode !== null || '' ? 'pt-1' : 'pt-0'"
						>
							<v-text-field
								v-model="courseCode"
								:error-messages="courseCodeFormErrors"
								:maxlength="courseType === 'Lab' ? 8 : 7"
								label="Course Code"
								color="success"
								dense
								@input="$v.courseCode.$touch()"
								@blur="$v.courseCode.$touch()"
							/>
						</v-col>

						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-select
								v-model="courseSection"
								:error-messages="courseSectionFormErrors"
								:items="selectOptionCourseSection"
								label="Course Section"
								color="success"
								dense
								@input="$v.courseSection.$touch()"
								@blur="$v.courseSection.$touch()"
							/>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-select
								v-model="courseUnits"
								:error-messages="courseUnitsFormErrors"
								:items="selectOptionCourseUnits"
								label="Course Units"
								color="success"
								dense
								@input="$v.courseUnits.$touch()"
								@blur="$v.courseUnits.$touch()"
							/>
						</v-col>

						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-select
								v-model="courseType"
								:error-messages="courseTypeErrors"
								:items="selectOptionCourseType"
								label="Course Type"
								color="success"
								dense
								@input="$v.courseType.$touch()"
								@blur="$v.courseType.$touch()"
							/>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							sm="12"
							:class="courseDuration !== null || '' ? 'pt-0 pb-0' : 'pt-0 pb-2'"
						>
							<v-select
								v-model="courseDuration"
								:error-messages="courseDurationFormErrors"
								:items="selectOptionCourseDuration"
								label="Course Duration"
								color="success"
								dense
								@input="$v.courseDuration.$touch()"
								@blur="$v.courseDuration.$touch()"
							/>
						</v-col>
					</v-row>

					<p
						class="font-weight-light secondary--text subtitle-1 text-center pt-1 mb-0"
						v-if ="courseDuration === 'single' || courseDuration === 'split'"
					>
						Day 1 Schedule
					</p>

					<v-row 
						v-if ="courseDuration === 'single' || courseDuration === 'split'"
						:class="courseDuration === 'single' ? 'pt-0' : ''"
					>
						<v-col
							cols="12"
							sm="12"
							class="pt-0"
						>
							<v-select
								v-model="courseDay1"
								:error-messages="courseDay1FormErrors"
								:items="selectOptionCourseDay"
								label="Course Day"
								color="success"
								dense
								@input="$v.courseDay1.$touch()"
								@blur="$v.courseDay1.$touch()"
							/>
						</v-col>
					</v-row>

					<v-row  v-if ="courseDuration === 'single' || courseDuration === 'split'">
						<v-col
							cols="12"
							sm="6"
							:class="courseTimeStart1 !== null || '' ? 'pt-1' : 'pt-0'"
						>
							<v-menu
								ref="menuTimeStart1"
								v-model="menuCourseTimeStart1"
								:close-on-content-click="false"
								:nudge-right="40"
								:return-value.sync="courseTimeStart1"
								transition="scale-transition"
								offset-y
								max-width="290px"
								min-width="290px"
							>
								<template v-slot:activator="{ on }">
									<v-text-field
										v-model="courseTimeStart1"
										:error-messages="courseTimeStart1FormErrors"
										color="success"
										dense
										label="Starting Time"
										readonly
										v-on="on"
										@input="$v.courseTimeStart1.$touch()"
										@blur="$v.courseTimeStart1.$touch()"
									/>
								</template>
								
								<v-time-picker
									v-if ="menuCourseTimeStart1"
									v-model="courseTimeStart1"
									format="24hr"
									scrollable
									color="success"
									min="7:00"
									max="21:00"
									full-width
									:allowed-minutes="m => m % 15 === 0"
									@click:minute="$refs.menuTimeStart1.save(courseTimeStart1)"
								/>
							</v-menu>
						</v-col>

						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-select
								v-model="courseRoom1"
								:error-messages="courseRoom1FormErrors"
								:items="roomList"
								label="Room Building"
								color="success"
								dense
								@input="$v.courseRoom1.$touch()"
								@blur="$v.courseRoom1.$touch()"
							></v-select>
						</v-col>
					</v-row>

					<v-row v-if ="courseDuration === 'single' || courseDuration === 'split'">
						<v-col
							cols="12"
							sm="6"
							:class="courseTimeEnd1 !== null || '' ? 'pt-1' : 'pt-0'"
						>
							<v-menu
								ref="menuTimeEnd1"
								v-model="menuCourseTimeEnd1"
								:close-on-content-click="false"
								:nudge-right="40"
								:return-value.sync="courseTimeEnd1"
								transition="scale-transition"
								offset-y
								max-width="290px"
								min-width="290px"
							>
								<template v-slot:activator="{ on }">
									<v-text-field
										v-model="courseTimeEnd1"
										:error-messages="courseTimeEnd1FormErrors"
										color="success"
										dense
										label="Ending Time"
										readonly
										v-on="on"
										@input="$v.courseTimeEnd1.$touch()"
										@blur="$v.courseTimeEnd1.$touch()"
									/>
								</template>
								
								<v-time-picker
									v-if ="menuCourseTimeEnd1"
									v-model="courseTimeEnd1"
									format="24hr"
									scrollable
									color="success"
									min="7:00"
									max="21:00"
									full-width
									:allowed-minutes="m => m % 15 === 0"
									@click:minute="$refs.menuTimeEnd1.save(courseTimeEnd1)"
								/>
							</v-menu>
						</v-col>

						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-select
								v-model="courseRoomNum1"
								:error-messages="courseRoomNum1FormErrors"
								:items="roomNumList"
								label="Room Number"
								color="success"
								dense
								@input="$v.courseRoomNum1.$touch()"
								@blur="$v.courseRoomNum1.$touch()"
							/>
						</v-col>
					</v-row>

					<p
						class="font-weight-light secondary--text subtitle-1 text-center pt-1 mb-0"
						v-if ="courseDuration === 'split'"
					>
						Day 2 Schedule
					</p>

					<v-row  v-if ="courseDuration === 'split'">
						<v-col
							cols="12"
							sm="12"
							class="pt-0"
						>
							<v-select
								v-model="courseDay2"
								:error-messages="courseDay2FormErrors"
								:items="selectOptionCourseDay"
								label="Course Day"
								color="success"
								dense
								@input="$v.courseDay2.$touch()"
								@blur="$v.courseDay2.$touch()"
							/>
						</v-col>
					</v-row>

					<v-row  v-if ="courseDuration === 'split'">
						<v-col
							cols="12"
							sm="6"
							:class="courseTimeStart2 !== null || '' ? 'pt-1' : 'pt-0'"
						>
							<v-menu
								ref="menuTimeStart2"
								v-model="menuCourseTimeStart2"
								:close-on-content-click="false"
								:nudge-right="40"
								:return-value.sync="courseTimeStart2"
								transition="scale-transition"
								offset-y
								max-width="290px"
								min-width="290px"
							>
								<template v-slot:activator="{ on }">
									<v-text-field
										v-model="courseTimeStart2"
										:error-messages="courseTimeStart2FormErrors"
										color="success"
										dense
										label="Starting Time"
										readonly
										v-on="on"
										@input="$v.courseTimeStart2.$touch()"
										@blur="$v.courseTimeStart2.$touch()"
									/>
								</template>

								<v-time-picker
									v-if ="menuCourseTimeStart2"
									v-model="courseTimeStart2"
									format="24hr"
									scrollable
									color="success"
									min="7:00"
									max="21:00"
									full-width
									:allowed-minutes="m => m % 15 === 0"
									@click:minute="$refs.menuTimeStart2.save(courseTimeStart2)"
								/>
							</v-menu>
						</v-col>

						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-select
								v-model="courseRoom2"
								:error-messages="courseRoom2FormErrors"
								:items="roomList"
								label="Room Building"
								color="success"
								dense
								@input="$v.courseRoom2.$touch()"
								@blur="$v.courseRoom2.$touch()"
							/>
						</v-col>
					</v-row>

					<v-row v-if ="courseDuration === 'split'">
						<v-col
							cols="12"
							sm="6"
							:class="courseTimeStart2 !== null || '' ? 'pt-1 pb-2' : 'pt-0 pb-2'"
						>
							<v-menu
								ref="menuTimeEnd2"
								v-model="menuCourseTimeEnd2"
								:close-on-content-click="false"
								:nudge-right="40"
								:return-value.sync="courseTimeEnd2"
								transition="scale-transition"
								offset-y
								max-width="290px"
								min-width="290px"
							>
								<template v-slot:activator="{ on }">
									<v-text-field
										v-model="courseTimeEnd2"
										:error-messages="courseTimeEnd2FormErrors"
										color="success"
										dense
										label="Ending Time"
										readonly
										v-on="on"
										@input="$v.courseTimeEnd2.$touch()"
										@blur="$v.courseTimeEnd2.$touch()"
									/>
								</template>
								
								<v-time-picker
									v-if ="menuCourseTimeEnd2"
									v-model="courseTimeEnd2"
									format="24hr"
									scrollable
									color="success"
									min="7:00"
									max="21:00"
									full-width
									:allowed-minutes="m => m % 15 === 0"
									@click:minute="$refs.menuTimeEnd2.save(courseTimeEnd2)"
								/>
							</v-menu>
						</v-col>

						<v-col
							cols="12"
							sm="6"
							class="pt-0 pb-2"
						>
							<v-select
								v-model="courseRoomNum2"
								:error-messages="courseRoomNum2FormErrors"
								:items="roomNumList2"
								label="Room Number"
								color="success"
								dense
								@input="$v.courseRoomNum2.$touch()"
								@blur="$v.courseRoomNum2.$touch()"
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
					@click="toggleClassroomScheduleCreateModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					color="success"
					class="font-weight-regular body-2 toggle-btn"
					@click="submit()"
				>
					Create
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import moment from 'moment'
	import axios from 'axios'
	import { validationMixin } from 'vuelidate'
	import { required, minLength, maxLength, alphaNum } from 'vuelidate/lib/validators'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'ClassroomScheduleCreateModal',
		props: {
			toggleClassroomScheduleCreateModal: {
				type: Boolean,
				required: true
			}
		},
		mixins: [
			validationMixin
		],
		data () {
			return {
				formErrors: [],
				showFormErrors: false,
				courseTitle: null,
				courseCode: null,
				courseSection: null,
				courseUnits: null,
				courseDuration: null,
				courseDay1: null,
				courseDay2: null,
				courseTimeStart1: null,
				courseTimeStart2: null,
				courseTimeEnd1: null,
				courseTimeEnd2: null,
				courseRoom1: null,
				courseRoom2: null,
				courseRoomNum1: null,
				courseRoomNum2: null,
				courseType: null,
				validationCourseTitle: false,
				validationCourseCode: false,
				validationCourseSection: false,
				validationCourseTimeStart1: false,
				validationCourseTimeStart2: false,
				validationCourseTimeEnd1: false,
				validationCourseTimeEnd2: false,
				validationCourseDay1: false,
				validationCourseDay2: false,
				validationCourseRoom1: false,
				validationCourseRoom2: false,
				validationCourseRoomNum1: false,
				validationCourseRoomNum2: false,
				validationCourseUnits: false,
				validationCourseType: false,
				menuCourseTimeStart1: false,
				menuCourseTimeStart2: false,
				menuCourseTimeEnd1: false,
				menuCourseTimeEnd2: false,
				selectOptionCourseSection: [
					'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09'
				],
				selectOptionCourseDuration: [
					{ text: '1-Day Schedule', value: 'single' },
					{ text: '2-Day Schedule', value: 'split' }
				],
				selectOptionCourseDay: [
					{ text: 'Monday', value: 'Mon' },
					{ text: 'Tuesday', value: 'Tue' },
					{ text: 'Wednesday', value: 'Wed' },
					{ text: 'Thursday', value: 'Thu' },
					{ text: 'Friday', value: 'Fri' },
					{ text: 'Saturday', value: 'Sat' }
				],
				selectOptionCourseType: [
					{ text: 'Lecture', value: 'Lec' },
					{ text: 'Laboratory', value: 'Lab' }
				],
				selectOptionCourseUnits: [
					{ text: '1 unit', value: 1 },
					{ text: '2 unit', value: 2 },
					{ text: '3 unit', value: 3 }
				]
			}
		},
		validations () {
			if (this.courseDuration === 'split') {
				if (this.courseType === 'Lab') {
					return {
						courseTitle: {
							required,
							minLength: minLength(6),
							maxLength: maxLength(50)
						},
						courseCode: {
							required,
							alphaNum,
							minLength: minLength(8),
						},
						courseSection: {
							required
						},
						courseUnits: {
							required
						},
						courseType: {
							required
						},
						courseDuration: {
							required
						},
						courseTimeStart1: {
							required
						},
						courseTimeEnd1: {
							required
						},
						courseDay1: {
							required
						},
						courseRoom1: {
							required
						},
						courseRoomNum1: {
							required
						},
						courseTimeStart2: {
						required
						},
						courseTimeEnd2: {
							required
						},
						courseDay2: {
							required
						},
						courseRoom2: {
							required
						},
						courseRoomNum2: {
							required
						}
					}
				} else {
					return {
						courseTitle: {
							required,
							minLength: minLength(6),
							maxLength: maxLength(50)
						},
						courseCode: {
							required,
							alphaNum,
							minLength: minLength(7),
						},
						courseSection: {
							required
						},
						courseUnits: {
							required
						},
						courseType: {
							required
						},
						courseDuration: {
							required
						},
						courseTimeStart1: {
							required
						},
						courseTimeEnd1: {
							required
						},
						courseDay1: {
							required
						},
						courseRoom1: {
							required
						},
						courseRoomNum1: {
							required
						},
						courseTimeStart2: {
						required
						},
						courseTimeEnd2: {
							required
						},
						courseDay2: {
							required
						},
						courseRoom2: {
							required
						},
						courseRoomNum2: {
							required
						}
					}
				}
			} else {
				if (this.courseType === 'Lab') {
					return {
						courseTitle: {
							required,
							minLength: minLength(6),
							maxLength: maxLength(50)
						},
						courseCode: {
							required,
							alphaNum,
							minLength: minLength(8),
						},
						courseSection: {
							required
						},
						courseUnits: {
							required
						},
						courseType: {
							required
						},
						courseDuration: {
							required
						},
						courseTimeStart1: {
							required
						},
						courseTimeEnd1: {
							required
						},
						courseDay1: {
							required
						},
						courseRoom1: {
							required
						},
						courseRoomNum1: {
							required
						}
					}
				} else {
					return {
						courseTitle: {
							required,
							minLength: minLength(6),
							maxLength: maxLength(50)
						},
						courseCode: {
							required,
							alphaNum,
							minLength: minLength(7),
						},
						courseSection: {
							required
						},
						courseUnits: {
							required
						},
						courseType: {
							required
						},
						courseDuration: {
							required
						},
						courseTimeStart1: {
							required
						},
						courseTimeEnd1: {
							required
						},
						courseDay1: {
							required
						},
						courseRoom1: {
							required
						},
						courseRoomNum1: {
							required
						}
					}
				}
			}
		},
		watch: {
			courseTitle () {
				if (this.toggleClassroomScheduleCreateModal === true) {
					this.courseTitle = this.courseTitle.toUpperCase()
				}
			},
			courseCode () {
				if (this.toggleClassroomScheduleCreateModal === true) {
					this.courseCode = this.courseCode.toUpperCase()
				}
			},
			toggleClassroomScheduleCreateModal () {
				this.$v.$reset()
				this.formErrors = []
				this.showFormErrors = false

				this.courseTitle = null
				this.courseCode = null
				this.courseSection = null
				this.courseUnits = null
				this.courseType = null
				this.courseDuration = null
				this.courseTimeStart1 = null
				this.courseTimeEnd1 = null
				this.courseDay1 = null
				this.courseRoom1 = null
				this.courseRoomNum1 = null
				this.courseTimeStart2 = null
				this.courseTimeEnd2 = null
				this.courseDay2 = null
				this.courseRoom2 = null
				this.courseRoomNum2 = null

				this.validationCourseTitle = false
				this.validationCourseCode = false
				this.validationCourseSection = false
				this.validationCourseTimeStart1 = false
				this.validationCourseTimeEnd1 = false
				this.validationCourseRoom1 =false
				this.validationCourseRoomNum1 = false
				this.validationCourseDay1 = false
				this.validationCourseTimeStart2 = false
				this.validationCourseTimeEnd2 = false
				this.validationCourseRoom2 = false
				this.validationCourseRoomNum2 = false
				this.validationCourseDay2 = false
				this.validationCourseUnits = false
				this.validationCourseType = false

				if (this.toggleClassroomScheduleCreateModal === false) {
					this.$emit('close-classroom-schedule-create-modal')
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL,
				mainClassScheduleList: state => state.mainClassScheduleList,
				mainRoomList: state => state.mainRoomList
			}),
			formErrorsComputed () {
				return [...new Set(this.formErrors)]
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
				const list = this.mainRoomList.filter(data => data.type === this.courseType && data.building === this.courseRoom1)
				const item = []

				for (let i = 0; i < list.length; i++) {
					item.push(list[i].number)
				}
				
				return item.sort()
			},
			roomNumList2 () {
				const list = this.mainRoomList.filter(data => data.type === this.courseType && data.building === this.courseRoom2)
				const item = []

				for (let i = 0; i < list.length; i++) {
					item.push(list[i].number)
				}

				return item.sort()
			},
			courseTitleFormErrors () {
				const errors = []
				if (!this.$v.courseTitle.$dirty) return errors
				!this.$v.courseTitle.required && errors.push(`Course title is required!`)
				!this.$v.courseTitle.minLength && errors.push(`Course title must be at least ${this.$v.courseTitle.$params.minLength.min} characters long!`)
				!this.$v.courseTitle.maxLength && errors.push(`Course title must be at most ${this.$v.courseTitle.$params.maxLength.max} characters long!`)
				this.validationCourseTitle && errors.push(`Check course title!`)
				return errors
			},
			courseCodeFormErrors () {
				const errors = []
				if (!this.$v.courseCode.$dirty) return errors
				!this.$v.courseCode.required && errors.push(`Course code is required!`)
				!this.$v.courseCode.alphaNum && errors.push(`Course code must not contain special characters!`)
				!this.$v.courseCode.minLength && errors.push(`Course code must be ${this.$v.courseCode.$params.minLength.min} characters long!`)
				this.validationCourseCode && errors.push(`Check course code!`)
				return errors
			},
			courseSectionFormErrors () {
				const errors = []
				if (!this.$v.courseSection.$dirty) return errors
				!this.$v.courseSection.required && errors.push(`Course section is required!`)
				this.validationCourseSection && errors.push(`Check course section!`)
				return errors
			},
			courseUnitsFormErrors () {
				const errors = []
				if (!this.$v.courseUnits.$dirty) return errors
				!this.$v.courseUnits.required && errors.push(`Course units is required!`)
				this.validationCourseUnits && errors.push(`Check course units!`)
				return errors
			},
			courseTypeErrors () {
				const errors = []
				if (!this.$v.courseType.$dirty) return errors
				!this.$v.courseType.required && errors.push(`Course type is required!`)
				this.validationCourseType && errors.push(`Check course type!`)
				return errors
			},
			courseDurationFormErrors () {
				const errors = []
				if (!this.$v.courseDuration.$dirty) return errors
				!this.$v.courseDuration.required && errors.push(`Course duration is required!`)
				return errors
			},
			courseDay1FormErrors () {
				const errors = []
				if (!this.$v.courseDay1.$dirty) return errors
				!this.$v.courseDay1.required && errors.push(`Course day is required!`)
				this.validationCourseDay1 && errors.push(`Check course day!`)
				return errors
			},
			courseDay2FormErrors () {
				const errors = []
				if (!this.$v.courseDay2.$dirty) return errors
				!this.$v.courseDay2.required && errors.push(`Course day is required!`)
				this.validationCourseDay2 && errors.push(`Check course day!`)
				return errors
			},
			courseTimeStart1FormErrors () {
				const errors = []
				if (!this.$v.courseTimeStart1.$dirty) return errors
				!this.$v.courseTimeStart1.required && errors.push(`Starting time is required!`)
				this.validationCourseTimeStart1 && errors.push(`Check starting time!`)
				return errors
			},
			courseTimeStart2FormErrors () {
				const errors = []
				if (!this.$v.courseTimeStart2.$dirty) return errors
				!this.$v.courseTimeStart2.required && errors.push(`Starting time is required!`)
				this.validationCourseTimeStart2 && errors.push(`Check starting time!`)
				return errors
			},
			courseTimeEnd1FormErrors () {
				const errors = []
				if (!this.$v.courseTimeEnd1.$dirty) return errors
				!this.$v.courseTimeEnd1.required && errors.push(`Ending time is required!`)
				this.validationCourseTimeEnd1 && errors.push(`Check ending time!`)
				return errors
			},
			courseTimeEnd2FormErrors () {
				const errors = []
				if (!this.$v.courseTimeEnd2.$dirty) return errors
				!this.$v.courseTimeEnd2.required && errors.push(`Ending time is required!`)
				this.validationCourseTimeEnd2 && errors.push(`Check ending time!`)
				return errors
			},
			courseRoom1FormErrors () {
				const errors = []
				if (!this.$v.courseRoom1.$dirty) return errors
				!this.$v.courseRoom1.required && errors.push(`Room building is required!`)
				this.validationCourseRoom1 && errors.push(`Check room building!`)
				return errors
			},
			courseRoom2FormErrors () {
				const errors = []
				if (!this.$v.courseRoom2.$dirty) return errors
				!this.$v.courseRoom2.required && errors.push(`Room building is required!`)
				this.validationCourseRoom2 && errors.push(`Check room building!`)
				return errors
			},
			courseRoomNum1FormErrors () {
				const errors = []
				if (!this.$v.courseRoomNum1.$dirty) return errors
				!this.$v.courseRoomNum1.required && errors.push(`Room number is required!`)
				this.validationCourseRoomNum1 && errors.push(`Check room number!`)
				return errors
			},
			courseRoomNum2FormErrors () {
				const errors = []
				if (!this.$v.courseRoomNum2.$dirty) return errors
				!this.$v.courseRoomNum2.required && errors.push(`Room number is required!`)
				this.validationCourseRoomNum2 && errors.push(`Check room number!`)
				return errors
			}
		},
		methods: {
			...mapActions([
				'fetchClassroomScheduleList'
			]),
			submit() {
				this.$loading(true)
				this.formErrors = []
				this.showFormErrors = false
				this.validationCourseTitle = false
				this.validationCourseCode = false
				this.validationCourseSection = false
				this.validationCourseTimeStart1 = false
				this.validationCourseTimeEnd1 = false
				this.validationCourseRoom1 = false
				this.validationCourseRoomNum1 = false
				this.validationCourseDay1 = false
				this.validationCourseTimeStart2 = false
				this.validationCourseTimeEnd2 = false
				this.validationCourseRoom2 = false
				this.validationCourseRoomNum2 = false
				this.validationCourseDay2 = false
				this.validationCourseUnits = false
				this.validationCourseType = false
				this.$v.$touch()

				const timeDifference = moment(this.courseTimeEnd1,"HH:mm").diff(moment(this.courseTimeStart1,"HH:mm"))
				const timeDifference2 = moment(this.courseTimeEnd2,"HH:mm").diff(moment(this.courseTimeStart2,"HH:mm"))
				const duration = moment.duration(timeDifference)
				const duration2 = moment.duration(timeDifference2)
				const timeEndCheck = moment(this.courseTimeEnd1,"HH:mm")
				const timeEndCheck2 = moment(this.courseTimeEnd2,"HH:mm")

				if (timeEndCheck.isAfter(moment('21:01',"HH:mm"))) {
					this.validationCourseTimeEnd1 = true
					this.formErrors.push('Class schedule is until 9pm only!')
				}

				if (timeEndCheck2.isAfter(moment('21:01',"HH:mm"))) {
					this.validationCourseTimeEnd1 = true
					this.formErrors.push('Class schedule is until 9pm only!')
				}

				if (duration < 0) {
					this.validationCourseTimeStart1 = true
					this.validationCourseTimeEnd1 = true
					this.formErrors.push('Ending time must be greater than the starting time!')
				}

				if (this.courseCode !== null && this.courseType !== null && this.courseCode.length == 7 && this.courseType === 'Lab') {
					this.formErrors.push('Invalid course code for laboratory class!')
				}

				if (this.courseCode !== null && this.courseType !== null && this.courseCode.length == 8 && this.courseType === 'Lec') {
					this.formErrors.push('Invalid course code for lecture class!')
				}

				if (this.courseDuration === 'split') {
					if (duration2 == 0 && this.courseType !== 'Lab') {
						this.validationCourseTimeStart2 = true
						this.validationCourseTimeEnd2 = true
						this.formErrors.push('Subject time must be atleast 1 hour!')
					}

					if (duration2 < 0 && this.courseType !== 'Lab') {
						this.validationCourseTimeStart2 = true
						this.validationCourseTimeEnd2 = true
						this.formErrors.push('Ending time must be greater than the starting time!')
					}
				}

				if (this.courseType === 'Lab') {
					if (this.courseDuration === 'split') {
						this.validationCourseDay1 = true
						this.formErrors.push('Split day schedule is not available for laboratory class!')
					}

					if (this.courseTimeStart1 !== null && this.courseTimeEnd1 !== null && (duration.asHours() != 3)) {
						this.validationCourseTimeStart1 = true
						this.validationCourseTimeEnd1 = true
						this.formErrors.push('Laboratory class must be 3 hours!')
					}

					if (this.courseUnits !== null && this.courseUnits != 1) {
						this.validationCourseUnits = true
						this.validationCourseType = true
						this.formErrors.push('Laboratory class is 1 unit only!')
					}
				}

				if (this.courseType === 'Lec') {
					if (this.courseDuration === 'single') {
						if (this.courseUnits == 3) {
							if ((duration.asHours() > 3) || (duration.asHours() < 3)) {
								this.validationCourseTimeStart1 = true
								this.validationCourseTimeEnd1 = true
								this.formErrors.push('Subject time must be 3 hours for 3 unit lecture class!')
							}
						}

						if (this.courseUnits == 2) {
							if ((duration.asHours() > 2) || (duration.asHours() < 2)) {
								this.validationCourseTimeStart1 = true
								this.validationCourseTimeEnd1 = true
								this.formErrors.push('Subject time must be 2 hours for 2 unit lecture class!')
							}
						}

						if (this.courseUnits == 1) {
							if ((duration.asHours() > 1) || (duration.asHours() < 1)) {
								this.validationCourseTimeStart1 = true
								this.validationCourseTimeEnd1 = true
								this.formErrors.push('Subject time must be 1 hour for 1 unit lecture class!')
							}
						}
					}

					if (this.courseDuration === 'split') {
						if (this.courseUnits == 3) {
							if ((duration.asHours() > 1.5) || (duration.asHours() < 1.5)) {
								this.validationCourseTimeStart1 = true
								this.validationCourseTimeEnd1 = true
								this.formErrors.push('Subject time must be 1.5 hours for a split day 3 unit lecture class!')
							}
						}

						if (this.courseUnits == 3) {
							if ((duration2.asHours() > 1.5) || (duration2.asHours() < 1.5)) {
								this.validationCourseTimeStart2 = true
								this.validationCourseTimeEnd2 = true
								this.formErrors.push('Subject time must be 1.5 hours for a split day 3 unit lecture class!')
							}
						}

						if (this.courseUnits == 2) {
							if ((duration.asHours() > 1) || (duration.asHours() < 1)) {
								this.validationCourseTimeStart1 = true
								this.validationCourseTimeEnd1 = true
								this.formErrors.push('Subject time must be 1 hour for a split day 2 unit lecture class!')
							}
						}

						if (this.courseUnits == 2) {
							if ((duration2.asHours() > 1) || (duration2.asHours() < 1)) {
								this.validationCourseTimeStart2 = true
								this.validationCourseTimeEnd2 = true
								this.formErrors.push('Subject time must be 1 hour for a split day 2 unit lecture class!')
							}
						} 

						if (this.courseUnits == 1) {
							this.formErrors.push('Split day schedule is not available for 1 units class!')
						}
					}
				}

				if (this.courseDuration === 'single' && this.courseDay1 !== null && this.courseTimeStart1 !== null && this.courseTimeEnd1 !== null && this.courseRoom1 !== null && this.courseRoomNum1 !== null) {
					const temp = this.mainClassScheduleList
					const classSchedule = []

					for (let i = 0; i < temp.length; i++) {
						if (temp[i].day2 === 'None') {
							classSchedule.push({
								name: temp[i].title,
								code: temp[i].code,
								section: temp[i].section,
								units: temp[i].units,
								day: temp[i].day1,
								start: temp[i].timeStart1,
								end: temp[i].timeEnd1,
								room: temp[i].room1,
								roomNum: temp[i].roomNum1
							})
						}
					}

					for (let i = 0; i < temp.length; i++) {
						if (temp[i].day2 !== 'None') {
							classSchedule.push({
								name: temp[i].title,
								code: temp[i].code,
								section: temp[i].section,
								units: temp[i].units,
								day: temp[i].day1,
								start: temp[i].timeStart1,
								end: temp[i].timeEnd1,
								room: temp[i].room1,
								roomNum: temp[i].roomNum1
							})

							classSchedule.push({
								name: temp[i].title,
								code: temp[i].code,
								section: temp[i].section,
								units: temp[i].units,
								day: temp[i].day2,
								start: temp[i].timeStart2,
								end: temp[i].timeEnd2,
								room: temp[i].room2,
								roomNum: temp[i].roomNum2
							})
						}
					}

					var isScheduleExist = false

					for (let w = 0; w < classSchedule.length; w++) {
						if (this.courseTitle === classSchedule[w].name && this.courseCode === classSchedule[w].code && this.courseSection === classSchedule[w].section && this.courseUnits === classSchedule[w].units) {
							this.formErrors.push(`${classSchedule[w].name} - ${classSchedule[w].code} (${classSchedule[w].section}) already exist!`)
							isScheduleExist = true
							this.validationCourseTitle = true
							this.validationCourseCode = true
							this.validationCourseSection = true
						}
					}

					if (isScheduleExist === false) {
						const checkSchedule = classSchedule.filter(data => data.day == this.courseDay1)

						for (let w = 0; w < checkSchedule.length; w++) {
							if ((this.courseTimeStart1 < checkSchedule[w].end) && (checkSchedule[w].start < this.courseTimeEnd1)) {
								if (this.courseRoom1 === checkSchedule[w].room && this.courseRoomNum1 === checkSchedule[w].roomNum) {
									this.validationCourseTimeStart1 = true
									this.validationCourseTimeEnd1 = true
									this.validationCourseRoom1 = true
									this.validationCourseRoomNum1 = true
									this.formErrors.push(`Schedule is conflict on ${checkSchedule[w].name} (${checkSchedule[w].section}) - ${checkSchedule[w].day} ${checkSchedule[w].start} - ${checkSchedule[w].end} on ${checkSchedule[w].room}${checkSchedule[w].roomNum}`)
								}
							}
						}
					}
				}

				if (this.courseDuration === 'split' && this.courseDay1 !== null && this.courseDay2 !== null && this.courseTimeStart1 !== null && this.courseTimeEnd1 !== null && this.courseTimeStart2 !== null && this.courseTimeEnd2 !== null && this.courseRoom1 !== null && this.courseRoomNum1 !== null && this.courseRoom2 !== null && this.courseRoomNum2 !== null) {
					const temp = this.$store.state.mainClassScheduleList
					const classSchedule = []

					for (let i = 0; i < temp.length; i++) {
						if (temp[i].day2 === 'None') {
							classSchedule.push({
								name: temp[i].title,
								code: temp[i].code,
								section: temp[i].section,
								units: temp[i].units,
								day: temp[i].day1,
								start: temp[i].timeStart1,
								end: temp[i].timeEnd1,
								room: temp[i].room1,
								roomNum: temp[i].roomNum1
							})
						}
					}

					for (let i = 0; i < temp.length; i++) {
						if (temp[i].day2 !== 'None') {
							classSchedule.push({
								name: temp[i].title,
								code: temp[i].code,
								section: temp[i].section,
								units: temp[i].units,
								day: temp[i].day1,
								start: temp[i].timeStart1,
								end: temp[i].timeEnd1,
								room: temp[i].room1,
								roomNum: temp[i].roomNum1
							})

							classSchedule.push({
								name: temp[i].title,
								code: temp[i].code,
								section: temp[i].section,
								units: temp[i].units,
								day: temp[i].day2,
								start: temp[i].timeStart2,
								end: temp[i].timeEnd2,
								room: temp[i].room2,
								roomNum: temp[i].roomNum2
							})
						}
					}

					var isScheduleExist2 = false

					for (let w = 0; w < classSchedule.length; w++) {
						if (this.courseTitle === classSchedule[w].name && this.courseCode === classSchedule[w].code && this.courseSection === classSchedule[w].section && this.courseUnits === classSchedule[w].units) {
							this.formErrors.push(`${classSchedule[w].name} - ${classSchedule[w].code} (${classSchedule[w].section}) already exist!`)
							isScheduleExist2 = true
							this.validationCourseTitle = true
							this.validationCourseCode = true
							this.validationCourseSection = true
						}
					}

					if (isScheduleExist2 === false) {
						const checkSchedule = classSchedule.filter(data => data.day === this.courseDay1)
						const checkSchedule2 = classSchedule.filter(data => data.day === this.courseDay2)

						// First day
						for (let w = 0; w < checkSchedule.length; w++) {
							if ((this.courseTimeStart1 < checkSchedule[w].end) && (checkSchedule[w].start < this.courseTimeEnd1)) {
								if (this.courseRoom1 === checkSchedule[w].room && this.courseRoomNum1 === checkSchedule[w].roomNum) {
									this.validationCourseTimeStart1 = true
									this.validationCourseTimeEnd1 = true
									this.validationCourseRoom1 = true
									this.validationCourseRoomNum1 = true
									this.formErrors.push(`Day 1 schedule is conflict on ${checkSchedule[w].name} (${checkSchedule[w].section}) - ${checkSchedule[w].day} ${checkSchedule[w].start} - ${checkSchedule[w].end} on ${checkSchedule[w].room}${checkSchedule[w].roomNum}`)
								}
							}
						}

						// Second day
						for (let w = 0; w < checkSchedule2.length; w++) {
							if ((this.courseTimeStart2 < checkSchedule2[w].end) && (checkSchedule2[w].start < this.courseTimeEnd2)) {
								if (this.courseRoom2 === checkSchedule2[w].room && this.courseRoomNum2 === checkSchedule2[w].roomNum) {
									this.validationCourseTimeStart2 = true
									this.validationCourseTimeEnd2 = true
									this.validationCourseRoom2 = true
									this.validationCourseRoomNum2 = true
									this.formErrors.push(`Day 2 schedule is conflict on ${checkSchedule[w].name} (${checkSchedule[w].section}) - ${checkSchedule[w].day} ${checkSchedule[w].start} - ${checkSchedule[w].end} on ${checkSchedule[w].room}${checkSchedule[w].roomNum}`)
								}
							}
						}
					}
				}

				if (this.formErrors.length !== 0) {
					this.showFormErrors = true
				}

				if (!this.$v.$invalid && this.formErrors.length === 0) {
					if (this.courseDuration === 'single') {
						axios.post(this.axiosBaseURL + '/schedule', {
							name: this.courseTitle,
							c_code: this.courseCode,
							s_code: this.courseSection,
							units: this.courseUnits,
							day: this.courseDay1,
							time_start: this.courseTimeStart1,
							time_end: this.courseTimeEnd1,
							time_start_2: '00:00',
							time_end_2: '00:00',
							room: this.courseRoom1,
							room_num: this.courseRoomNum1,
							room_2: 'None',
							room_num_2: 'None',
							type: this.courseType,
							prof_id: 'N/A'
						})
						.then(response => {
							this.fetchClassroomScheduleList()
							this.$emit('close-classroom-schedule-create-modal')
							this.$loading(false)
							this.$emit('show-classroom-schedule-create-notification', response.data)
						})
						.catch(error => {
							this.$loading(false)
							this.formErrors.push(error)
							this.showFormErrors = true
						})
					} else if (this.courseDuration === 'split') {
						const timeDifference = moment(this.courseDay1,"ddd").diff(moment(this.courseDay2,"ddd"))

						if (timeDifference < 0) {
							axios.post(this.axiosBaseURL + '/schedule', {
								name: this.courseTitle,
								c_code: this.courseCode,
								s_code: this.courseSection,
								units: this.courseUnits,
								day: this.courseDay1 + ' / ' + this.courseDay2,
								time_start: this.courseTimeStart1,
								time_end: this.courseTimeEnd1,
								time_start_2: this.courseTimeStart2,
								time_end_2: this.courseTimeEnd2,
								room: this.courseRoom1,
								room_num: this.courseRoomNum1,
								room_2: this.courseRoom2,
								room_num_2: this.courseRoomNum2,
								type: this.courseType,
								prof_id: 'N/A'
							})
							.then(response => {
								this.fetchClassroomScheduleList()
								this.$emit('close-classroom-schedule-create-modal')
								this.$loading(false)
								this.$emit('show-classroom-schedule-create-notification', response.data)
							})
							.catch(error => {
								this.$loading(false)
								this.formErrors.push(error)
								this.showFormErrors = true
							})
						} else {
							axios.post(this.$store.state.axiosBaseURL + '/schedule', {
								name: this.courseTitle,
								c_code: this.courseCode,
								s_code: this.courseSection,
								units: this.courseUnits,
								day: this.courseDay2 + ' / ' + this.courseDay1,
								time_start: this.courseTimeStart2,
								time_end: this.courseTimeEnd2,
								time_start_2: this.courseTimeStart1,
								time_end_2: this.courseTimeEnd1,
								room: this.courseRoom2,
								room_num: this.courseRoomNum2,
								room_2: this.courseRoom1,
								room_num_2: this.courseRoomNum1,
								type: this.courseType,
								prof_id: 'N/A'
							})
							.then(response => {
								this.fetchClassroomScheduleList()
								this.$emit('close-classroom-schedule-create-modal')
								this.$loading(false)
								this.$emit('show-classroom-schedule-create-notification', response.data)
							})
							.catch(error => {
								this.$loading(false)
								this.formErrors.push(error)
								this.showFormErrors = true
							})
						}
					}
				} else {
					setTimeout(() => this.$loading(false), 250)
				}
			}
		}
	}
</script>
