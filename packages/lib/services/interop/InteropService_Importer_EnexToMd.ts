import { ImportExportResult } from './types';

const InteropService_Importer_Base = require('inner/lib/services/interop/InteropService_Importer_Base').default;
const Folder = require('inner/lib/models/Folder.js');
const { filename } = require('inner/lib/path-utils');

export default class InteropService_Importer_EnexToMd extends InteropService_Importer_Base {
	async exec(result:ImportExportResult) {
		const { importEnex } = require('inner/lib/import-enex');

		let folder = this.options_.destinationFolder;

		if (!folder) {
			const folderTitle = await Folder.findUniqueItemTitle(filename(this.sourcePath_));
			folder = await Folder.save({ title: folderTitle });
		}

		await importEnex(folder.id, this.sourcePath_, this.options_);

		return result;
	}
}
