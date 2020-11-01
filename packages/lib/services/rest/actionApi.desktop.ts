import ResourceEditWatcher from 'inner/lib/services/ResourceEditWatcher/index';
const ExternalEditWatcher = require('inner/lib/services/ExternalEditWatcher');

export default {

	externalEditWatcher: () => ExternalEditWatcher.instance().externalApi(),
	resourceEditWatcher: () => ResourceEditWatcher.instance().externalApi(),

};
