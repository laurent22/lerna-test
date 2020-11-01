const utils = require('../utils');
const glob = require('glob');
const rootDir = utils.rootDir();

module.exports = {
	src: '',
	fn: async function() {
		const tsFiles = glob.sync(`${rootDir}{/**/*.ts,/**/*.tsx}`, {
			ignore: [
				'**/node_modules/**',
				'**/.git/**',
				'**/app-desktop/lib/**',
				'**/api-cli/build/**',
				'**/api-cli/tests-build/**',
				'**/app-desktop/dist/**',
				'**/Modules/TinyMCE/JoplinLists/**',
				'**/Modules/TinyMCE/IconPack/**',
				'**/api-cli/tests/support/plugins/**',
				'**/plugin_types/**',
				'**/app-mobile/android/**',
				'**/app-mobile/ios/**',
			],
		}).map(f => f.substr(rootDir.length + 1));

		const ignoredJsFiles = tsFiles.map(f => {
			const s = f.split('.');
			s.pop();
			return `${s.join('.')}.js`;
		});

		const ignoredMapFiles = tsFiles.map(f => {
			const s = f.split('.');
			s.pop();
			return `${s.join('.')}.js.map`;
		});

		const ignoredDefFiles = tsFiles.map(f => {
			const s = f.split('.');
			s.pop();
			return `${s.join('.')}.d.ts`;
		});

		const ignoredFiles = ignoredJsFiles.concat(ignoredMapFiles).concat(ignoredDefFiles);
		ignoredFiles.sort();

		const regex = /(# AUTO-GENERATED - EXCLUDED TYPESCRIPT BUILD)[\s\S]*(# AUTO-GENERATED - EXCLUDED TYPESCRIPT BUILD)/;
		const replacement = `$1\n${ignoredFiles.join('\n')}\n$2`;

		await Promise.all([
			utils.replaceFileText(`${rootDir}/.gitignore`, regex, replacement),
			// utils.replaceFileText(`${rootDir}/.eslintignore`, regex, replacement),
			// utils.replaceFileText(`${rootDir}/.ignore`, regex, replacement),
		]);
	},
};
