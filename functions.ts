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

		new Notice("Note duplicated.");

		console.log(
			`Archiver: Note duplicated as "${file.name} (${timestamp})"`
		);
	} catch (err) {
		console.error("Error:", err.message);
	}
}

export async function archiveNote(file: TAbstractFile) {
	const fileObj = file as any;
	const vaultPath = (this.app.vault.adapter as any).basePath;
	const timestamp = getTimestamp();

	const archiveFolderName = this.settings.archiveFolderName;
	const archiveFolderPath = path.join(vaultPath, archiveFolderName);
	const archiveFileName = `${fileObj.basename} (${timestamp}).${fileObj.extension}`;

	const srcFilePath = path.join(vaultPath, file.path);
	const destFilePath = path.join(archiveFolderPath, archiveFileName);

	console.log(srcFilePath, destFilePath);

	try {
		// create archive folder first
		await fsPromises.mkdir(archiveFolderPath, {
			recursive: true,
		});

		// copy note to archive folder
		await fsPromises.copyFile(srcFilePath, destFilePath);

		new Notice("Note archived.");

		console.log(`Archiver: Note archived to "${archiveFolderName}"`);
	} catch (err) {
		console.error("Error:", err.message);
	}
}
