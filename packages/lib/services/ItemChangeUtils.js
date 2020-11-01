const Setting = require('inner/lib/models/Setting').default;
const ItemChange = require('inner/lib/models/ItemChange');

class ItemChangeUtils {
	static async deleteProcessedChanges() {
		const lastProcessedChangeIds = [Setting.value('resourceService.lastProcessedChangeId'), Setting.value('searchEngine.lastProcessedChangeId'), Setting.value('revisionService.lastProcessedChangeId')];

		const lowestChangeId = Math.min(...lastProcessedChangeIds);
		await ItemChange.deleteOldChanges(lowestChangeId);
	}
}

module.exports = ItemChangeUtils;
