import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		colorMode: 'light'
	},
	mutations: {
		changeColor(state, colorMode) {
			state.colorMode = colorMode;
		}
	},
	getters: {
		colorMode: (state) => state.colorMode
	},
	modules: {}
});
