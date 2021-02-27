<template>
	<v-dialog
		v-model="toggleRoomUpdateModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Update Room
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
					<v-row class="mt-8">
						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-text-field
								v-model="roomBuilding"
								:error-messages="roomBuildingFormErrors"
								maxlength="3"
								label="Room Building"
								color="success"
								dense
								@input="$v.roomBuilding.$touch()"
								@blur="$v.roomBuilding.$touch()"
							/>
						</v-col>

						<v-col
							cols="12"
							sm="6"
							class="pt-0"
						>
							<v-text-field
								v-model="roomNumber"
								:error-messages="roomNumberFormErrors"
								maxlength="3"
								label="Room number"
								color="success"
								dense
								@input="$v.roomNumber.$touch()"
								@blur="$v.roomNumber.$touch()"
							/>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							sm="12"
							class="pt-0 pb-2"
						>
							<v-select
								v-model="roomType"
								:error-messages="roomTypeFormErrors"
								:items="roomTypeSelectOption"
								label="Room Type"
								color="success"
								dense
								@input="$v.roomType.$touch()"
								@blur="$v.roomType.$touch()"
							/>
						</v-col>
					</v-row>
				</form>
			</v-card-text>

			<v-card-actions class="pa-0 mt-4">
				<v-spacer/>

				<v-btn
					depressed
					class="font-weight-regular body-2 toggle-btn primary--text"
					color="transparent"
					@click="toggleRoomUpdateModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					class="font-weight-regular body-2 toggle-btn"
					color="info"
					@click="submit()"
				>
					Update
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import axios from 'axios'
	import { validationMixin } from 'vuelidate'
	import { required, alpha, numeric } from 'vuelidate/lib/validators'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'RoomManagementUpdateModal',
		props: {
			roomList: {
				required: true
			},
			toggleRoomUpdateModal: {
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
				roomBuilding: null,
				roomNumber: null,
				roomType: null,
				roomTypeSelectOption: [
					{ text: 'Lecture',   value: 'Lec' },
					{ text: 'Laboratory', value: 'Lab' }
				],
				roomBuildingValidation: false,
				roomNumberValidation: false
			}
		},
		validations: {
			roomBuilding: {
				required,
				alpha
			},
			roomNumber: {
				required,
				numeric
			},
			roomType: {
				required
			}
		},
		watch: {
			roomBuilding () {
				if (this.toggleRoomUpdateModal === true) {
					this.roomBuilding = this.roomBuilding.toUpperCase();
				}
			},
			roomList () {
				this.roomBuilding = this.roomList.building
				this.roomNumber = this.roomList.number
				this.roomType = this.roomList.type
			},
			toggleRoomUpdateModal () {
				this.$v.$reset()
				this.formErrors = []
				this.showFormErrors = false
				
				if (this.toggleRoomUpdateModal === false) {
					this.$emit('close-room-update-modal')
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL,
				mainRoomList: state => state.mainRoomList
			}),
			roomBuildingFormErrors () {
				const errors = []
				if (!this.$v.roomBuilding.$dirty) return errors
				!this.$v.roomBuilding.alpha && errors.push(`Room building must contain letters only!`)
				!this.$v.roomBuilding.required && errors.push(`Room building is required!`)
				this.roomBuildingValidation && errors.push(`Check room building!`)
				return errors
			},
			roomNumberFormErrors () {
				const errors = []
				if (!this.$v.roomNumber.$dirty) return errors
				!this.$v.roomNumber.numeric && errors.push(`Room number must contain numbers only!`)
				!this.$v.roomNumber.required && errors.push(`Room number is required!`)
				this.roomNumberValidation && errors.push(`Check room number!`)
				return errors
			},
			roomTypeFormErrors () {
				const errors = []
				if (!this.$v.roomType.$dirty) return errors
				!this.$v.roomType.required && errors.push(`Room type is required!`)
				return errors
			}
		},
		methods: {
			...mapActions([
				'fetchRoomList'
			]),
			submit () {
				this.fetchRoomList()
				this.$loading(true)
				this.formErrors = []
				this.showFormErrors = false
				this.roomBuildingValidation = false
				this.roomNumberValidation = false
				this.$v.$touch()

				const list = this.mainRoomList

				if (this.roomBuilding !== this.roomList.building || this.roomNumber !== this.roomList.number) {
					for (let w = 0; w < list.length; w++) {	
						if (this.roomBuilding === list[w].building && this.roomNumber === list[w].number) {
							this.roomBuildingValidation = true
							this.roomNumberValidation = true
							this.formErrors.push('Room ' + list[w].building + list[w].number + ' already exist!')
						}
					}
				}

				if (this.formErrors.length !== 0) {
					this.showFormErrors = true
				}

				if (!this.$v.$invalid && this.formErrors.length === 0) {
					axios.patch(this.axiosBaseURL + '/room/' + this.roomList.id, {
						room: this.roomBuilding,
						room_num: this.roomNumber,
						type: this.roomType
					})
					.then(response => {
						this.fetchRoomList()
						this.$emit('close-room-update-modal')
						this.$loading(false)
						this.$emit('show-room-update-notification', response.data)
					})
					.catch(error => {
						this.$loading(false)
						this.formErrors.push(error)
						this.showFormErrors = true
					})
				} else {
					setTimeout(() => this.$loading(false), 250)
				}
			}
		}
	}
</script>
