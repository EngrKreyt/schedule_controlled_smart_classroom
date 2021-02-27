import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '../assets/style/vuetify-custom.css'

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		dark: false,
		themes: {
			light: {
				primary: '#212121',
				secondary: '#424242',
				accent: '#297A4A',
				error: '#8F250C',
				info: '#002D62',
				success: '#093A1D',
				warning: '#E36414'
			}
		}
	}
});
