<template>
	<v-dialog
		v-model="toggleRoomDeleteModal"
		overlay-color="grey darken-3"
		width="400"
	>
		<v-card class="pa-5">
			<v-card-title class="font-weight-regular primary--text pa-0">
				Delete Room
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

				<p class="font-weight-light body-2 secondary--text pa-0 mt-4 mb-4">Are you sure you want to delete this room?</p>
			</v-card-text>

			<v-card-actions class="pa-0 mt-8">
				<v-spacer/>

				<v-btn
					depressed
					class="font-weight-regular body-2 toggle-btn primary--text"
					color="transparent"
					@click="toggleRoomDeleteModal = false"
				>
					Cancel
				</v-btn>

				<v-btn
					depressed
					class="font-weight-regular body-2 toggle-btn"
					color="error"
					@click="submit()"
				>
					Delete
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	import axios from 'axios'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'RoomManagementDeleteModal',
		props: {
			roomList: {
				required: true
			},
			toggleRoomDeleteModal: {
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
			toggleRoomDeleteModal () {
				this.formErrors = []
				this.showFormErrors = false

				if (this.toggleRoomDeleteModal === false) {
					this.$emit('close-room-delete-modal')
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
				fetchRoomList: 'fetchRoomList'
			}),
			submit () {
				this.fetchRoomList()
				this.$loading(true)
				axios.delete(this.axiosBaseURL + '/room/' + this.roomList.id)
				.then(response => {
					this.fetchRoomList()
					this.$emit('close-room-delete-modal')
					this.$loading(false)
					this.$emit('show-room-delete-notification', response.data)
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
