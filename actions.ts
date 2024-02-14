import { Notice } from "obsidian";
import * as path from "path";
import { promises as fsPromises } from "fs";
import { getTimestamp } from "utils";
import { TAbstractFile } from "obsidian";

export async function makeCopyOfNote(file: TAbstractFile) {
	const fileObj = file as any; // some "file" properties are note declared in TAbstractFile for some reason, so this workaround will work
	const vaultPath = (this.app.vault.adapter as any).basePath;
	const timestamp = getTimestamp();

	const srcFilePath = path.join(vaultPath, file.path);
	const destFilePath = path.join(
		vaultPath,
		file.parent?.path as string,
		`${fileObj.basename} (${timestamp}).${fileObj.extension}`
	);

	try {
		await fsPromises.copyFile(srcFilePath, destFilePath);

		new Notice("Copy created.");

		console.log(`BackItUp: Copy created as "${file.name} (${timestamp})"`);
	} catch (err) {
		console.error("Error:", err.message);
	}
}

export async function makeSnapshotOfNote(file: TAbstractFile) {
	const fileObj = file as any;
	const vaultPath = (this.app.vault.adapter as any).basePath;
	const timestamp = getTimestamp();

	const snapshotFolderName = this.settings.snapshotFolderName;
	const snapshotFolderPath = path.join(vaultPath, snapshotFolderName);
	const snapshotFileName = `${fileObj.basename} (${timestamp}).${fileObj.extension}`;

	const srcFilePath = path.join(vaultPath, file.path);
	const destFilePath = path.join(snapshotFolderPath, snapshotFileName);

	console.log(srcFilePath, destFilePath);

	try {
		// create snapshot folder first
		await fsPromises.mkdir(snapshotFolderPath, {
			recursive: true,
		});

		// copy note to snapshot folder
		await fsPromises.copyFile(srcFilePath, destFilePath);

		new Notice("Snapshot created.");

		console.log(`BackItUp: Snapshot created to "${snapshotFolderName}"`);
	} catch (err) {
		console.error("Error:", err.message);
	}
}
