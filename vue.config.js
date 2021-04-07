const { ChakraLoaderPlugin } = require('chakra-loader');

module.exports = {
	chainWebpack: (config) => {
		config.plugin('html').tap((args) => {
			args[0].title = 'ROTehc Web App';
			return args;
		});
	},
	configureWebpack: {
		plugins: [new ChakraLoaderPlugin()],
		devServer: {
			headers: { 'Access-Control-Allow-Origin': '*' }
		}
	}
};
