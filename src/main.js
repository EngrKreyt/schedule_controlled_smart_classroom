import Vue from 'vue'
import App from './App.vue'
import Router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueLoading from 'vuejs-loading-plugin'

Vue.config.productionTip = false

Vue.use(VueLoading, {
	dark: false,
	text: null,
	background: 'rgba(66, 66, 66, 0.46)'
})

Router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (!store.getters.isUserLoggedIn) {
			next({
				name: 'Login'
			})
		} else {
			next()
		}
	} else if (to.matched.some(record => record.meta.requiresVisitor)) {
		if (store.getters.isUserLoggedIn && store.state.userAccountEntityType === 'Admin' || store.state.userAccountEntityType === 'Superadmin') {
			next({
				name: 'Admin Dashboard'
			})
		} else if (store.getters.isUserLoggedIn && store.state.userAccountEntityType === 'Faculty') {
			next({
				name: 'User Schedule'
			})
		} else {
			next()
		}
	} else {
		next()
	}
})

new Vue({
	router: Router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
