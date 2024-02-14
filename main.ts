import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { archiveNote, makeCopyOfNote } from "functions";

interface ArchiverPluginSettings {
	archiveFolderName: string;
}

const DEFAULT_SETTINGS: Partial<ArchiverPluginSettings> = {
	archiveFolderName: "🟣 Archive",
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
						.setTitle("Make a copy")
						.setIcon("copy")
						.onClick(async () => {
							await makeCopyOfNote.bind(this)(file);
						})
				);

				menu.addItem((item) =>
					item
						.setTitle("Archive note")
						.setIcon("archive")
						.onClick(async () => {
							await archiveNote.bind(this)(file);
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
					.setValue(this.plugin.settings.archiveFolderName)
					.onChange(async (value) => {
						this.plugin.settings.archiveFolderName = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
