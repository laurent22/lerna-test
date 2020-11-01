const gulp = require('gulp');
const utils = require('@joplin/tools/gulp/utils');

const tasks = {
	compileScripts: {
		fn: require('./tools/compileScripts'),
	},
	compilePackageInfo: {
		fn: require('./tools/compile-package-info.js'),
	},
	copyPluginAssets: {
		fn: require('./tools/copyPluginAssets.js'),
	},
	copyTinyMceLangs: {
		fn: require('./tools/copyTinyMceLangs.js'),
	},
	electronRebuild: {
		fn: require('./tools/electronRebuild.js'),
	},
	compileExtensions: {
		fn: require('@joplin/tools/gulp/tasks/compileExtensions.js'),
	},
	copyLib: require('@joplin/tools/gulp/tasks/copyLib'),
	tsc: require('@joplin/tools/gulp/tasks/tsc'),
	updateIgnoredTypeScriptBuild: require('@joplin/tools/gulp/tasks/updateIgnoredTypeScriptBuild'),
};

utils.registerGulpTasks(gulp, tasks);

const buildSeries = [
	'compileExtensions',
	'copyLib',
];

// On Windows also run tsc because `npm run watch` locks some folders
// which makes the copyPluginAssets command fail. For that reason,
// it's not possible to run watch on Windows while testing the desktop app.
if (require('os').platform() === 'win32') {
	// buildSeries.push('tsc');
}

const buildParallel = [
	gulp.series(...buildSeries),
	'compileScripts',
	'compilePackageInfo',
	'copyPluginAssets',
	'copyTinyMceLangs',
	'updateIgnoredTypeScriptBuild',
];

gulp.task('build', gulp.parallel(...buildParallel));
