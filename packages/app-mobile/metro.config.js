/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { resolve } = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

const watchFolders = [
	resolve(__dirname + '/..'),
];

module.exports = {
	transformer: {
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: false,
				inlineRequires: false,
			},
		}),
	},
	watchFolders,
	resolver: {
		blacklistRE: blacklist([/..\/app-cli\/.*/])
	}
};
