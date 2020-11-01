const SyncTargetOneDrive = require('inner/lib/SyncTargetOneDrive.js');
const { _ } = require('inner/lib/locale');
const { parameters } = require('inner/lib/parameters.js');

class SyncTargetOneDriveDev extends SyncTargetOneDrive {
	static id() {
		return 4;
	}

	static targetName() {
		return 'onedrive_dev';
	}

	static label() {
		return _('OneDrive Dev (For testing only)');
	}

	syncTargetId() {
		return SyncTargetOneDriveDev.id();
	}

	oneDriveParameters() {
		return parameters('dev').oneDrive;
	}
}

module.exports = SyncTargetOneDriveDev;
