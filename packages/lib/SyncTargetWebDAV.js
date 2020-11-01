const BaseSyncTarget = require('inner/lib/BaseSyncTarget.js');
const { _ } = require('inner/lib/locale');
const Setting = require('inner/lib/models/Setting').default;
const { FileApi } = require('inner/lib/file-api.js');
const Synchronizer = require('inner/lib/Synchronizer').default;
const WebDavApi = require('inner/lib/WebDavApi');
const { FileApiDriverWebDav } = require('inner/lib/file-api-driver-webdav');

class SyncTargetWebDAV extends BaseSyncTarget {
	static id() {
		return 6;
	}

	static supportsConfigCheck() {
		return true;
	}

	static targetName() {
		return 'webdav';
	}

	static label() {
		return _('WebDAV');
	}

	async isAuthenticated() {
		return true;
	}

	static async newFileApi_(syncTargetId, options) {
		const apiOptions = {
			baseUrl: () => options.path(),
			username: () => options.username(),
			password: () => options.password(),
		};

		const api = new WebDavApi(apiOptions);
		const driver = new FileApiDriverWebDav(api);
		const fileApi = new FileApi('', driver);
		fileApi.setSyncTargetId(syncTargetId);
		return fileApi;
	}

	static async checkConfig(options) {
		const fileApi = await SyncTargetWebDAV.newFileApi_(SyncTargetWebDAV.id(), options);
		fileApi.requestRepeatCount_ = 0;

		const output = {
			ok: false,
			errorMessage: '',
		};

		try {
			const result = await fileApi.stat('');
			if (!result) throw new Error(`WebDAV directory not found: ${options.path()}`);
			output.ok = true;
		} catch (error) {
			output.errorMessage = error.message;
			if (error.code) output.errorMessage += ` (Code ${error.code})`;
		}

		return output;
	}

	async initFileApi() {
		const fileApi = await SyncTargetWebDAV.newFileApi_(SyncTargetWebDAV.id(), {
			path: () => Setting.value('sync.6.path'),
			username: () => Setting.value('sync.6.username'),
			password: () => Setting.value('sync.6.password'),
		});

		fileApi.setLogger(this.logger());

		return fileApi;
	}

	async initSynchronizer() {
		return new Synchronizer(this.db(), await this.fileApi(), Setting.value('appType'));
	}
}

module.exports = SyncTargetWebDAV;
