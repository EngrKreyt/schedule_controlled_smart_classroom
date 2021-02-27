<template>
	<v-dialog
		v-model="toggleRoomAccessCardAssignModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Assign Access Card
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
					<v-img
						src="@/assets/img/rfid.png"
						class="mt-6 ml-6"
						style="filter: hue-rotate(300deg); height: 300px; width: 300px;"
					/>

					<v-row class="mt-4">
						<v-col
							cols="12"
							sm="12"
							class="pt-0 pb-0"
						>
							<v-text-field
								dark
								dense
								readonly
							/>
						</v-col>
					</v-row>

					<v-row>
						<v-col
							cols="12"
							sm="12"
							class="pt-0 pb-2"
						>
							<v-text-field
								v-model="rfidTag"
								:error-messages="rfidFormErrors"
								maxlength="10"
								label="RFID"
								color="success"
								class="font-weight-light"
								dense
								clearable
								@input="$v.rfidTag.$touch()"
								@blur="$v.rfidTag.$touch()"
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
					@click="toggleRoomAccessCardAssignModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					class="font-weight-regular body-2 toggle-btn"
					color="success"
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
	import { required, minLength } from 'vuelidate/lib/validators'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'RoomAccessCardAssignModal',
		props: {
			rfid: {
				required: true
			},
			toggleRoomAccessCardAssignModal: {
				type: Boolean,
				required: true
			}
		},
		mixins: [
			validationMixin
		],
		data() {
			return {
				formErrors: [],
				rfidTag: null,
				rfidTagValidation: null,
				showFormErrors: false
			}
		},
		validations: {
			rfidTag: {
				required,
				minLength: minLength(10)
			}
		},
		watch: {
			rfid () {	
				if (this.rfid.rfid !== '0') {
					this.rfidTag = this.rfid.rfid
				} else {
					this.rfidTag = null
				}
			},
			toggleRoomAccessCardAssignModal () {
				this.$v.$reset()
				this.formErrors = []
				this.showFormErrors = false
				
				if (this.toggleRoomAccessCardAssignModal === false) {
					this.$emit('close-room-access-card-assign-modal')
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL,
				mainUserAccountList: state => state.mainUserAccountList
			}),
			rfidFormErrors () {
				const errors = []
				if (!this.$v.rfidTag.$dirty) return errors
				!this.$v.rfidTag.required && errors.push(`RFID tag is required!`)
				!this.$v.rfidTag.minLength && errors.push(`RFID tag length must be ${this.$v.rfidTag.$params.minLength.min} characters!`)
				this.rfidTagValidation && errors.push(`RFID tag already exist!`)
				return errors
			}
		},
		methods: {
			...mapActions([
				'fetchUserAccountList'
			]),
			submit () {
				this.fetchUserAccountList()
				this.$loading(true)
				this.formErrors = []
				this.showFormErrors = false
				this.rfidTagValidation = false
				this.$v.$touch()

				// Convert decimal to binary
				const binString = (this.rfidTag >>> 0).toString(2)

				// Convert binary to hexadecimal
				const hexString = parseInt(binString, 2).toString(16).toUpperCase()

				const hex1 = hexString.slice(6, 8)
				const hex2 = hexString.slice(4, 6)
				const hex3 = hexString.slice(2, 4)
				const hex4 = hexString.slice(0, 2)
				const rfidTag = hex1 + hex2 + hex3 + hex4

				const list = this.mainUserAccountList
				var isTagExist = false

				for (let i = 0; i < list.length; i++) {
					if (list[i].rfid === rfidTag) {
						isTagExist = true
						this.rfidTagValidation = true
					}
				}

				if (this.formErrors.length !== 0) {
					this.showFormErrors = true
				}

				if (!this.$v.$invalid && this.formErrors.length === 0 && isTagExist === false) {
					axios.patch(this.$store.state.axiosBaseURL + '/facultylist/' + this.rfid.id, {
						first_name: this.rfid.firstName,
						last_name: this.rfid.lastName,
						email: this.rfid.email,
						password: this.rfid.password,
						entity_type: this.rfid.entityType,
						contact_num: this.rfid.contactNumber,
						department: this.rfid.department,
						units: this.rfid.units,
						rfid: rfidTag
					})
					.then(response => {
						this.fetchUserAccountList()
						this.$emit('close-room-access-card-assign-modal')
						this.$loading(false)
						this.$emit('show-room-access-card-assign-notification', response.data)
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
