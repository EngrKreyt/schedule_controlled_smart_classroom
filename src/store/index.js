import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

axios.defaults.baseURL = 'http://127.0.0.1:8000'

export default new Vuex.Store({
	state: {
		axiosBaseURL: 'http://127.0.0.1:8000/api',
		userAccountToken: localStorage.getItem('userAuthToken') || null,
		userAccountFullName: localStorage.getItem('userFullName') || null,
		userAccountEmail: localStorage.getItem('email') || null,
		userAccountEntityType: localStorage.getItem('entityType') || null,
		mainUserAccountList: [],
		mainClassScheduleList: [],
		mainFacultyScheduleList: [],
		mainRoomList: [],
		mainRoomLog: []
	},
	getters: {
		isUserLoggedIn: state => {
			return state.userAccountToken !== null
		}
	},
	mutations: {
		RETRIEVE_LOGIN_TOKEN(state, token) {
			state.userAccountToken = token
		},
		RETRIEVE_USER_INFO(state, response) {
			state.userAccountFullName = response.data.name
			state.userAccountEmail = response.data.email
			state.userAccountEntityType = response.data.entity_type
		},
		FETCH_SCHEDULES(state, data) {
			state.mainClassScheduleList = data
		},
		FETCH_ROOM_LISTS(state, data) {
			state.mainRoomList = data
		},
		FETCH_ROOM_LOGS(state, data) {
			state.mainRoomLog = data
		},
		FETCH_USER_ACCOUNT_LISTS(state, data) {
			state.mainUserAccountList = data
		},
		FETCH_FACULTY_SCHEDULE_LISTS(state, data) {
			state.mainFacultyScheduleList = data
		}
	},
	actions: {
		retrieveLoginToken(context, credentials) {
			return new Promise((resolve, reject) => {
				axios.post('/oauth/token', {
					username: credentials.username,
					password: credentials.password,
					grant_type: 'password',
					client_id: 2,
					client_secret: 'GTHCQHr6bxEAKrnrXJ9ymsBSO8SUKooS01bbjW9L'
				})
				.then(response => {
					const token = response.data.access_token
					const AuthStr = 'Bearer '.concat(token)
					localStorage.setItem('userAuthToken', token)

					axios.get('/api/user', { headers: { Authorization: AuthStr } })
					.then(response => {
						localStorage.setItem('userFullName', response.data.first_name + ' ' + response.data.last_name)
						localStorage.setItem('email', response.data.email)
						localStorage.setItem('entityType', response.data.entity_type)
						context.commit('RETRIEVE_USER_INFO', response)
						resolve(response)
					})
					context.commit('RETRIEVE_LOGIN_TOKEN', token)
				})
				.catch(error => {
					reject(error)
				})
			})
		},
		fetchClassroomScheduleList(context) {
			axios.get('/api/schedule')
			.then(response => {
				const data = response.data
				const classSchedule = []

				for (let i = 0; i < data.length; i++) {
					if (data[i].day.length === 3) {
						classSchedule.push({
							id: data[i].id,
							title: data[i].name,
							code: data[i].c_code,
							section: data[i].s_code,
							units: data[i].units,
							day1: data[i].day,
							day2: 'None',
							timeStart1: data[i].time_start.slice(0, 5),
							timeEnd1: data[i].time_end.slice(0, 5),
							timeStart2: data[i].time_start_2.slice(0, 5),
							timeEnd2: data[i].time_end_2.slice(0, 5),
							room1: data[i].room,
							room2: 'None',
							roomNum1: data[i].room_num,
							roomNum2: 'None',
							type: data[i].type,
							prof: data[i].prof_id,
							createdAt: data[i].created_at,
							updatedAt: data[i].updated_at
						})
					}

					if (data[i].day.length !== 3) {
						const firstDay = data[i].day.slice(0, 3)
						const secondDay = data[i].day.slice(6, 9)

						classSchedule.push({
							id: data[i].id,
							title: data[i].name,
							code: data[i].c_code,
							section: data[i].s_code,
							units: data[i].units,
							day1: firstDay,
							day2: secondDay,
							timeStart1: data[i].time_start.slice(0, 5),
							timeEnd1: data[i].time_end.slice(0, 5),
							timeStart2: data[i].time_start_2.slice(0, 5),
							timeEnd2: data[i].time_end_2.slice(0, 5),
							room1: data[i].room,
							room2: data[i].room_2,
							roomNum1: data[i].room_num,
							roomNum2: data[i].room_num_2,
							type: data[i].type,
							prof: data[i].prof_id,
							createdAt: data[i].created_at,
							updatedAt: data[i].updated_at
						})
					}
				}

				context.commit('FETCH_SCHEDULES', classSchedule)
			})
			.catch(error => {
				console.log(error)
			})
		},
		fetchRoomList(context) {
			axios.get('/api/room')
			.then(response => {
				const data = response.data
				const room = []

				for (let i = 0; i < data.length; i++) {
					room.push({
						id: data[i].id,
						building: data[i].room,
						number: data[i].room_num,
						type: data[i].type,
						createdAt: data[i].created_at,
						updatedAt: data[i].updated_at
					})
				}

				context.commit('FETCH_ROOM_LISTS', room)
			})
			.catch(error => {
				console.log(error)
			})
		},
		fetchRoomLog(context) {
			axios.get('/api/roomlog')
			.then(response => {
				const data = response.data
				const roomLog = []

				for (let i = 0; i < data.length; i++) {
					roomLog.push({
						id: data[i].id,
						name: data[i].name,
						rfid: data[i].rfid,
						type: data[i].type,
						room: data[i].room,
						date: data[i].date,
						time: data[i].time,
						mode: data[i].mode,
						result: data[i].result
					})
				}

				context.commit('FETCH_ROOM_LOGS', roomLog)
			})
			.catch(error => {
				console.log(error)
			})
		},
		fetchUserAccountList(context) {
			axios.get('/api/facultylist')
			.then(response => {
				const data = response.data
				const facultyAccount = []

				for (let i = 0; i < data.length; i++) {
					facultyAccount.push({
						id: data[i].id,
						fullName: data[i].first_name + ' ' + data[i].last_name,
						firstName: data[i].first_name,
						lastName: data[i].last_name,
						email: data[i].email,
						password: data[i].password,
						entityType: data[i].entity_type,
						contactNumber: data[i].contact_num,
						department: data[i].department,
						units: data[i].units,
						rfid: data[i].rfid,
						createdAt: data[i].created_at,
						updatedAt: data[i].updated_at
					})
				}

				context.commit('FETCH_USER_ACCOUNT_LISTS', facultyAccount)
			})
			.catch(error => {
				console.log(error)
			})
		},
		fetchFacultyScheduleList(context) {
			axios.get('/api/faculty')
			.then(response => {
				const data = response.data
				const facultySchedule = []

				for (let i = 0; i < data.length; i++) {
					if (data[i].day.length === 3) {
						facultySchedule.push({
							id: data[i].id,
							title: data[i].name,
							classID: data[i].class_id,
							code: data[i].c_code,
							section: data[i].s_code,
							units: data[i].units,
							day1: data[i].day,
							day2: 'None',
							timeStart1: data[i].time_start.slice(0, 5),
							timeEnd1: data[i].time_end.slice(0, 5),
							timeStart2: data[i].time_start_2.slice(0, 5),
							timeEnd2: data[i].time_end_2.slice(0, 5),
							room1: data[i].room,
							room2: 'None',
							roomNum1: data[i].room_num,
							roomNum2: 'None',
							type: data[i].type,
							prof: data[i].prof_id,
							subProf: data[i].sub_id,
							createdAt: data[i].created_at,
							updatedAt: data[i].updated_at
						})
					}

					if (data[i].day.length !== 3) {
						const firstDay = data[i].day.slice(0, 3)
						const secondDay = data[i].day.slice(6, 9)

						facultySchedule.push({
							id: data[i].id,
							title: data[i].name,
							classID: data[i].class_id,
							code: data[i].c_code,
							section: data[i].s_code,
							units: data[i].units,
							day1: firstDay,
							day2: secondDay,
							timeStart1: data[i].time_start.slice(0, 5),
							timeEnd1: data[i].time_end.slice(0, 5),
							timeStart2: data[i].time_start_2.slice(0, 5),
							timeEnd2: data[i].time_end_2.slice(0, 5),
							room1: data[i].room,
							room2: data[i].room_2,
							roomNum1: data[i].room_num,
							roomNum2: data[i].room_num_2,
							type: data[i].type,
							prof: data[i].prof_id,
							subProf: data[i].sub_id,
							createdAt: data[i].created_at,
							updatedAt: data[i].updated_at
						})
					}
				}

				context.commit('FETCH_FACULTY_SCHEDULE_LISTS', facultySchedule)
			})
			.catch(error => {
				console.log(error)
			})
		}
	}
})
