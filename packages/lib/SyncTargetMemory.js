const BaseSyncTarget = require('inner/lib/BaseSyncTarget.js');
const Setting = require('inner/lib/models/Setting').default;
const { FileApi } = require('inner/lib/file-api.js');
const { FileApiDriverMemory } = require('inner/lib/file-api-driver-memory.js');
const Synchronizer = require('inner/lib/Synchronizer').default;

class SyncTargetMemory extends BaseSyncTarget {
	static id() {
		return 1;
	}

	static targetName() {
		return 'memory';
	}

	static label() {
		return 'Memory';
	}

	async isAuthenticated() {
		return true;
	}

	initFileApi() {
		const fileApi = new FileApi('/root', new FileApiDriverMemory());
		fileApi.setLogger(this.logger());
		fileApi.setSyncTargetId(SyncTargetMemory.id());
		return fileApi;
	}

	async initSynchronizer() {
		return new Synchronizer(this.db(), await this.fileApi(), Setting.value('appType'));
	}
}

module.exports = SyncTargetMemory;
