import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { archiveNote, makeCopyOfNote } from "actions";

interface BackItUpPluginSettings {
	archiveFolderName: string;
}

const DEFAULT_SETTINGS: Partial<BackItUpPluginSettings> = {
	archiveFolderName: "🟣 Archive",
};

export default class BackItUpPlugin extends Plugin {
	settings: BackItUpPluginSettings;

	async onload() {
		await this.loadSettings();

		console.log("BackItUp: Loading plugin...");

		this.addSettingTab(new BackItUpSettingTab(this.app, this));

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
		console.log("BackItUp: Unloading plugin...");
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

class BackItUpSettingTab extends PluginSettingTab {
	plugin: BackItUpPlugin;

	constructor(app: App, plugin: BackItUpPlugin) {
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
