import { Notice } from "obsidian";
import { getTimestamp } from "utils";
import { TAbstractFile } from "obsidian";

export async function makeCopyOfNote(file: TAbstractFile) {
	const timestamp = getTimestamp();
	const filePathOfCopy = `${file.parent?.path}/${
		(file as any).basename
	} (${timestamp}).${(file as any).extension}`;

	try {
		// create a copy of file
		await this.app.vault.copy(file, filePathOfCopy);

		new Notice("Copy created.");
		console.log(`BackItUp: Copy created to "${filePathOfCopy}"`);
	} catch (err) {
		console.error("Error:", err.message);
	}
}

export async function makeSnapshotOfNote(file: TAbstractFile) {
	const timestamp = getTimestamp();
	const filePathOfCopy = `${this.settings.snapshotFolderName}/${
		(file as any).basename
	} (${timestamp}).${(file as any).extension}`;

	try {
		const doesFolderExist = await this.app.vault.adapter.exists(
			this.settings.snapshotFolderName
		);

		if (!doesFolderExist) {
			// create snapshot folder
			await this.app.vault.createFolder(this.settings.snapshotFolderName);
		}

		// copy note to snapshot folder
		await this.app.vault.copy(file, filePathOfCopy);

		new Notice("Snapshot created.");
		console.log(`BackItUp: Snapshot created to "${filePathOfCopy}"`);
	} catch (err) {
		console.error("Error:", err.message);
	}
}
