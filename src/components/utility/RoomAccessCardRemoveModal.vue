<template>
	<v-dialog
		v-model="toggleRoomAccessCardRemoveModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Remove Access Card
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

				<p class="font-weight-light body-2 secondary--text pa-0 mt-4 mb-4">Are you sure you want to remove the assigned access card?</p>
			</v-card-text>

			<v-card-actions class="pa-0 mt-8">
				<v-spacer/>

				<v-btn
					depressed
					class="font-weight-regular body-2 toggle-btn primary--text"
					color="transparent"
					@click="toggleRoomAccessCardRemoveModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					class="font-weight-regular body-2 toggle-btn"
					color="error"
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
		name: 'RoomAccessCardRemoveModal',
		props: {
			rfid: {
				required: true
			},
			toggleRoomAccessCardRemoveModal: {
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
			toggleRoomAccessCardRemoveModal () {
				this.formErrors = []
				this.showFormErrors = false

				if(this.toggleRoomAccessCardRemoveModal === false) {
					this.$emit('close-room-access-card-remove-modal')
				}
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL,
				mainUserAccountList: state => state.mainUserAccountList
			})
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


				axios.patch(this.$store.state.axiosBaseURL + '/facultylist/' + this.rfid.id, {
					first_name: this.rfid.firstName,
					last_name: this.rfid.lastName,
					email: this.rfid.email,
					password: this.rfid.password,
					entity_type: this.rfid.entityType,
					contact_num: this.rfid.contactNumber,
					department: this.rfid.department,
					units: this.rfid.units,
					rfid: '0'
				})
				.then(response => {
					this.fetchUserAccountList()
					this.$emit('close-room-access-card-remove-modal')
					this.$loading(false)
					this.$emit('show-room-access-card-remove-notification', response.data)
				})
				.catch(error => {
					this.$loading(false)
					this.formErrors.push(error)
					this.showFormErrors = true
				})
			}
		}
	}
</script>
