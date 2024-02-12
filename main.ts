import { App, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import * as path from "path";
import { promises as fsPromises } from "fs";
import { getTimestamp } from "utils";

interface ArchiverPluginSettings {
	archiveFolder: string;
}

const DEFAULT_SETTINGS: Partial<ArchiverPluginSettings> = {
	archiveFolder: "🟣 Archive",
};

export default class ArchiverPlugin extends Plugin {
	settings: ArchiverPluginSettings;

	async onload() {
		await this.loadSettings();

		console.log("Archiver: Loading plugin...");

		this.addSettingTab(new ArchiverSettingTab(this.app, this));

		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) =>
					item
						.setTitle("Archive note")
						.setIcon("archive")
						.onClick(async () => {
							const fileObj = file as any;
							const vaultPath = (this.app.vault.adapter as any)
								.basePath;
							const timestamp = getTimestamp();

							const archiveFileName = `${fileObj.basename} (${timestamp}).${fileObj.extension}`;
							const archiveFolderName =
								this.settings.archiveFolder;
							const archiveFolderPath = path.join(
								vaultPath,
								archiveFolderName
							);

							const srcFilePath = path.join(vaultPath, file.name);
							const destFilePath = path.join(
								archiveFolderPath,
								archiveFileName
							);

							try {
								// create archive folder first
								await fsPromises.mkdir(archiveFolderPath, {
									recursive: true,
								});

								// copy note to archive folder
								await fsPromises.copyFile(
									srcFilePath,
									destFilePath
								);

								new Notice("Note archived.");

								console.log(
									`Archiver: Note archived to "${archiveFolderName}"`
								);
							} catch (err) {
								console.error("Error:", err.message);
							}
						})
				);
			})
		);
	}

	onunload() {
		console.log("Archiver: Unloading plugin...");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ArchiverSettingTab extends PluginSettingTab {
	plugin: ArchiverPlugin;

	constructor(app: App, plugin: ArchiverPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Archive folder")
			.setDesc(
				'Archived notes will be moved to this folder. Example: "folder\\subfolder"'
			)
			.addText((text) =>
				text
					.setPlaceholder("Enter folder name")
					.setValue(this.plugin.settings.archiveFolder)
					.onChange(async (value) => {
						this.plugin.settings.archiveFolder = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
