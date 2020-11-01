const glob = require('glob');
const fs = require('fs-extra');
const dirname = require('path').dirname;
const relative = require('relative');

const libDir = dirname(__dirname) + '/lib';

// function getBasename(p) {
// 	const pieces = p.split('/');
// 	pieces.pop();
// 	return pieces.join('/');
// }

function toLinuxPath(p) {
	return p.replace(/\\/g, '/');
}

function getRelativePath(from, to) {
	let p = relative(from, to)
	if (p.indexOf('.') !== 0) p = './' + p;
	return toLinuxPath(p);
}

async function main() {
	const files = glob.sync(`${libDir}{/**/*.ts,/**/*.tsx,/**/*.js}`, {
		ignore: [
			'**/node_modules/**',
			'**/*.d.ts',
		],
	}).map(f => f.substr(libDir.length + 1));

	for (const file of files) {
		const content = await fs.readFile(libDir + '/' + file, 'utf8');

		const newContent = content.replace(/('|")(inner\/lib\/.*)('|")/g, (_matched, p1, p2, p3) => {
			const absoluteRequirePath = p2.substr(10);
			// const absoluteRequireBasename = getBasename(absoluteRequirePath);

			// const fileBasename = getBasename(file);


			console.info(file, absoluteRequirePath, getRelativePath(file, absoluteRequirePath));
		});
	}

	// const ignoredFiles = ignoredJsFiles.concat(ignoredMapFiles).concat(ignoredDefFiles);
	// ignoredFiles.sort();

	// const regex = /(# AUTO-GENERATED - EXCLUDED TYPESCRIPT BUILD)[\s\S]*(# AUTO-GENERATED - EXCLUDED TYPESCRIPT BUILD)/;
	// const replacement = `$1\n${ignoredFiles.join('\n')}\n$2`;

	// await Promise.all([
	// 	utils.replaceFileText(`${rootDir}/.gitignore`, regex, replacement),
	// 	// utils.replaceFileText(`${rootDir}/.eslintignore`, regex, replacement),
	// 	// utils.replaceFileText(`${rootDir}/.ignore`, regex, replacement),
	// ]);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});