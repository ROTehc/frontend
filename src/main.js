import Vue from 'vue';
import App from './App.vue';
import Chakra, {
	CThemeProvider,
	CColorModeProvider,
	CBox,
	CReset
} from '@chakra-ui/vue';
import customTheme from './theme.js';

Vue.prototype.$theme = {
	dark: {
		bg: customTheme.colors.mono[900],
		mapBg: customTheme.colors.mono[800],
		color: customTheme.colors.mono[200]
	},
	light: {
		bg: customTheme.colors.mono[100],
		mapBg: customTheme.colors.mono[50],
		color: customTheme.colors.mono[700]
	},
	gas: {
		lo: '#2ed573',
		ok: '#ffa502',
		hi: '#ff4757'
	}
};

Vue.use(Chakra, {
	extendTheme: customTheme,
	initialColorMode: 'light',
	useSystemColorMode: false
});

Vue.config.productionTip = false;

new Vue({
	render: (h) =>
		h(CThemeProvider, [
			h(CColorModeProvider, [h(CBox, [h(CReset), h(App)])])
		])
}).$mount('#app');
