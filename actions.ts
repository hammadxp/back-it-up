import { Notice, TFile } from "obsidian";
import { getTimestamp } from "utils";

export async function makeCopyOfNote(file: TFile) {
	const timestamp = getTimestamp();
	const filePathOfCopy = `${file.parent?.path}/${file.basename} (${timestamp}).${file.extension}`;

	try {
		// create a copy of file
		await this.app.vault.copy(file, filePathOfCopy);

		new Notice("Copy created.");
		console.log(`BackItUp: Copy created to "${filePathOfCopy}"`);

		return filePathOfCopy;
	} catch (err) {
		console.error("Error:", err.message);
	}
}

export async function makeSnapshotOfNote(file: TFile) {
	const timestamp = getTimestamp();
	const filePathOfCopy = `${this.settings.snapshotFolder}/${file.basename} (${timestamp}).${file.extension}`;

	try {
		const doesFolderExist = await this.app.vault.adapter.exists(
			this.settings.snapshotFolder
		);

		// create snapshot folder
		if (!doesFolderExist) {
			await this.app.vault.createFolder(this.settings.snapshotFolder);
		}

		// copy note to snapshot folder
		await this.app.vault.copy(file, filePathOfCopy);

		new Notice("Snapshot created.");
		console.log(`BackItUp: Snapshot created to "${filePathOfCopy}"`);

		return filePathOfCopy;
	} catch (err) {
		console.error("Error:", err.message);
	}
}
