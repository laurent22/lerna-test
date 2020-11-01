#!/usr/bin/env node

// Use njstrace to find out what Node.js might be spending time on
// var njstrace = require('njstrace').inject();

// Make it possible to require("/lib/...") without specifying full path
require('app-module-path').addPath(__dirname);

const compareVersion = require('compare-version');
const nodeVersion = process && process.versions && process.versions.node ? process.versions.node : '0.0.0';
if (compareVersion(nodeVersion, '10.0.0') < 0) {
	console.error(`Joplin requires Node 10+. Detected version ${nodeVersion}`);
	process.exit(1);
}

const { app } = require('./app.js');
const Folder = require('@joplin/lib/models/Folder.js');
const Resource = require('@joplin/lib/models/Resource.js');
const BaseItem = require('@joplin/lib/models/BaseItem.js');
const Note = require('@joplin/lib/models/Note.js');
const Tag = require('@joplin/lib/models/Tag.js');
const NoteTag = require('@joplin/lib/models/NoteTag.js');
const MasterKey = require('@joplin/lib/models/MasterKey');
const Setting = require('@joplin/lib/models/Setting').default;
const Revision = require('@joplin/lib/models/Revision.js');
const Logger = require('@joplin/lib/Logger').default;
const FsDriverNode = require('@joplin/lib/fs-driver-node').default;
const { shimInit } = require('@joplin/lib/shim-init-node.js');
const { _ } = require('@joplin/lib/locale');
const { FileApiDriverLocal } = require('@joplin/lib/file-api-driver-local.js');
const EncryptionService = require('@joplin/lib/services/EncryptionService');
const envFromArgs = require('@joplin/lib/envFromArgs');

const env = envFromArgs(process.argv);

const fsDriver = new FsDriverNode();
Logger.fsDriver_ = fsDriver;
Resource.fsDriver_ = fsDriver;
EncryptionService.fsDriver_ = fsDriver;
FileApiDriverLocal.fsDriver_ = fsDriver;

// That's not good, but it's to avoid circular dependency issues
// in the BaseItem class.
BaseItem.loadClass('Note', Note);
BaseItem.loadClass('Folder', Folder);
BaseItem.loadClass('Resource', Resource);
BaseItem.loadClass('Tag', Tag);
BaseItem.loadClass('NoteTag', NoteTag);
BaseItem.loadClass('MasterKey', MasterKey);
BaseItem.loadClass('Revision', Revision);

Setting.setConstant('appId', `net.cozic.joplin${env === 'dev' ? 'dev' : ''}-cli`);
Setting.setConstant('appType', 'cli');

shimInit();

const application = app();

if (process.platform === 'win32') {
	const rl = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.on('SIGINT', function() {
		process.emit('SIGINT');
	});
}

process.stdout.on('error', function(err) {
	// https://stackoverflow.com/questions/12329816/error-write-epipe-when-piping-node-output-to-head#15884508
	if (err.code == 'EPIPE') {
		process.exit(0);
	}
});

application.start(process.argv).catch(error => {
	if (error.code == 'flagError') {
		console.error(error.message);
		console.error(_('Type `joplin help` for usage information.'));
	} else {
		console.error(_('Fatal error:'));
		console.error(error);
	}

	process.exit(1);
});
