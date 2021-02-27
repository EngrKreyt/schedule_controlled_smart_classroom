import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/Login'
import AppContainer from '@/views/AppContainer'
import UserProfile from '@/views/UserProfile'
import UserSchedule from '@/views/UserSchedule'
import AdminDashboard from '@/views/AdminDashboard'
import AdminAccount from '@/views/AdminAccount'
import FacultyAccount from '@/views/FacultyAccount'
import ClassroomSchedule from '@/views/ClassroomSchedule'
import FacultySchedule from '@/views/FacultySchedule'
import SubstituteFacultySchedule from '@/views/SubstituteFacultySchedule'
import RoomAccessCard from '@/views/RoomAccessCard'
import RoomManagement from '@/views/RoomManagement'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Login',
		component: Login,
		meta: {
			requiresVisitor: true
		}
	},
	{
		path: '/view',
		name: 'Dashboard Container',
		component: AppContainer,
		meta: {
			breadcrumb: 'Home',
			requiresAuth: true
		},
		children: [
			{
				path: '/view/user/profile',
				name: 'User Profile',
				component: UserProfile,
				meta: {
					breadcrumb: 'User Profile',
					requiresAuth: true
				}
			},
			{
				path: '/view/user/schedule',
				name: 'User Schedule',
				component: UserSchedule,
				meta: {
					breadcrumb: 'User Schedule',
					requiresAuth: true
				}
			},
			{
				path: '/view/admin/dashboard',
				name: 'Admin Dashboard',
				component: AdminDashboard,
				meta: {
					breadcrumb: 'Dashboard',
					requiresAuth: true
				}
			},
			{
				path: '/view/admin/account/administrator',
				name: 'Admin Account',
				component: AdminAccount,
				meta: {
					breadcrumb: 'Admin Account',
					requiresAuth: true
				}
			},
			{
				path: '/view/admin/account/faculty',
				name: 'Faculty Account',
				component: FacultyAccount,
				meta: {
					breadcrumb: 'Faculty Account',
					requiresAuth: true
				}
			},
			{
				path: '/view/admin/schedule/classroom',
				name: 'Classroom Schedule',
				component: ClassroomSchedule,
				meta: {
					breadcrumb: 'Classroom Schedule',
					requiresAuth: true
				}
			},
			{
				path: '/view/admin/schedule/faculty',
				name: 'Faculty Schedule',
				component: FacultySchedule,
				meta: {
					breadcrumb: 'Faculty Schedule',
					requiresAuth: true
				}
			},
			{
				path: '/view/admin/schedule/subfaculty',
				name: 'Substitute Faculty Schedule',
				component: SubstituteFacultySchedule,
				meta: {
					breadcrumb: 'Substitute Faculty Schedule',
					requiresAuth: true
				}
			},
			{
				path: '/view/admin/utility/rfid',
				name: 'Room Access Card',
				component: RoomAccessCard,
				meta: {
					breadcrumb: 'Room Access Card',
					requiresAuth: true
				}
			},
			{
				path: '/view/admin/utility/room',
				name: 'Room Management',
				component: RoomManagement,
				meta: {
					breadcrumb: 'Room Management',
					requiresAuth: true
				}
			}
		]
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
