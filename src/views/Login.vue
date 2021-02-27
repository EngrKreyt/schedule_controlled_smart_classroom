<template>
	<v-app>
		<v-container fluid>
			<v-row>
				<v-col cols="12">
					<v-row
						align="center"
						justify="center"
						style="height: 600px;"
					>
						<v-col
							cols="12"
							sm="12"
							md="4"
							lg="4"
						>
							<v-card
								flat
								class="py-5 px-6 mt-6"
							>
								<v-card-title class="pa-0">
									<v-col
										cols="12"
										sm="12"
										md="8"
										lg="8"
										class="pt-0 px-0"
									>
										<h1
											class="font-weight-light headline primary--text"
											:class="$vuetify.breakpoint.smAndDown ? 'text-center' : ''"
										>
											my.DLSU-D
										</h1>

										<h1
											class="font-weight-regular display-1 success--text"
											:class="$vuetify.breakpoint.smAndDown ? 'text-center' : ''"
										>
											Classroom
										</h1>
									</v-col>

									<v-spacer/>

									<v-col
										cols="12" sm="12" md="3" lg="3"
										class="pa-0"
									>
										<img
											width="90"
											height="90"
											class="ml-2"
											v-show="$vuetify.breakpoint.mdAndUp"
											src="@/assets/img/dlsud.png"
										>	
									</v-col>

									<h6 class="font-weight-light secondary--text subtitle-1 mt-2 mb-12 pa-0">Enter your username and password to log in:</h6>
								</v-card-title>

								<v-card-text class="pa-0">
									<form class="font-weight-light secondary--text body-2 mt-2">
										<v-row>
											<v-col
												cols="12"
												sm="12"
												class="pt-0"
											>
												<v-text-field
													v-model="email"
													:error-messages="emailFormErrors"
													label="Email"
													color="success"
													dense
													@input="$v.email.$touch()"
													@blur="$v.email.$touch()"
													@keyup.enter="submit()"
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
													v-model="password"
													:type="showPassword ? 'text' : 'password'"
													:error-messages="passwordFormErrors"
													label="Password"
													color="success"
													dense
													:append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
													@click:append="showPassword = !showPassword"
													@input="$v.password.$touch()"
													@blur="$v.password.$touch()"
													@keyup.enter="submit()"
												/>
											</v-col>
										</v-row>
									</form>
								</v-card-text>

								<v-card-actions class="pa-0 mt-8">
									<v-btn
										block
										depressed
										color="success"
										class="font-weight-regular toggle-btn mb-2"
										@click="submit()"
										style="font-size: 14px;"
									>
										Login
									</v-btn>
								</v-card-actions>
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
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
	</v-app>
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required } from 'vuelidate/lib/validators'
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'Login',
		mixins: [
			validationMixin
		],
		data () {
			return {
				showPassword: false,
				password: null,
				email: null,
				snackbarNotification: false,
				snackbarNotificationContent: null,
				snackbarNotificationColor: null
			}
		},
		validations: {
			password: {
				required
			},
			email: {
				required
			}
		},
		computed: {
			...mapState({
				axiosBaseURL: state => state.axiosBaseURL,
			}),
			emailFormErrors () {
				const errors = []
				if (!this.$v.email.$dirty) return errors
				!this.$v.email.required && errors.push('Email is required!')
				return errors
			},
			passwordFormErrors () {
				const errors = []
				if (!this.$v.password.$dirty) return errors
				!this.$v.password.required && errors.push('Password is required!')
				return errors
			},
		},
		methods: {
			...mapActions([
				'fetchUserAccountList'
			]),
			submit () {
				this.$loading(true)
				this.$v.$touch()

				if (!this.$v.$invalid) {
					this.$store.dispatch('retrieveLoginToken', {
						username: this.email,
						password: this.password
					})
					/* eslint-disable */
					.then(response => {
						this.$loading(false)
						location.reload()
					})
					.catch(error => {
						this.$loading(false)
						this.snackbarNotification = false
						this.snackbarNotification = true
						this.snackbarNotificationColor = 'error'
						this.snackbarNotificationContent = 'Invalid credentials!'
					})
				} else {
					setTimeout(() => {
						this.$loading(false)
						this.snackbarNotification = false
						this.snackbarNotification = true
						this.snackbarNotificationColor = 'error'
						this.snackbarNotificationContent = 'All fields are required!'
					}, 250)
				}
			}
		}
	}
</script>

<style scoped>
	.theme--light.v-application {
		background: #F0F0F0;
	}
</style>
