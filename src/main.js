import Vue from 'vue';
import App from './App.vue';
import Chakra, {
	CThemeProvider,
	CColorModeProvider,
	CBox,
	CReset
} from '@chakra-ui/vue';
import customTheme from './theme.js';
import store from './store';

Vue.prototype.$theme = {
	dark: {
		bg: customTheme.colors.mono[600],
		mapBg: customTheme.colors.mono[900],
		color: customTheme.colors.mono[50]
	},
	light: {
		bg: customTheme.colors.mono[200],
		mapBg: customTheme.colors.mono[50],
		color: customTheme.colors.mono[800]
	},
	gas: {
		lo: '#8bac6d',
		ok: '#dca73e',
		hi: '#BF616A'
	}
};

Vue.use(Chakra, {
	extendTheme: customTheme,
	initialColorMode: 'light',
	useSystemColorMode: false
});

Vue.config.productionTip = false;

new Vue({
	store,
	render: (h) =>
		h(CThemeProvider, [
			h(CColorModeProvider, [h(CBox, [h(CReset), h(App)])])
		])
}).$mount('#app');
