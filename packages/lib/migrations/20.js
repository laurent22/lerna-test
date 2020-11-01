const Resource = require('inner/lib/models/Resource');
const Setting = require('inner/lib/models/Setting').default;
const shim = require('inner/lib/shim').default;
const { reg } = require('inner/lib/registry.js');
const { fileExtension } = require('inner/lib/path-utils');

const script = {};

script.exec = async function() {
	const stats = await shim.fsDriver().readDirStats(Setting.value('resourceDir'));

	let queries = [];
	for (const stat of stats) {
		if (fileExtension(stat.path) === 'crypted') continue;
		const resourceId = Resource.pathToId(stat.path);
		if (!resourceId) continue;

		queries.push({ sql: 'UPDATE resources SET `size` = ? WHERE id = ?', params: [stat.size, resourceId] });

		if (queries.length >= 1000) {
			await reg.db().transactionExecBatch(queries);
			queries = [];
		}
	}

	await reg.db().transactionExecBatch(queries);
};

module.exports = script;
