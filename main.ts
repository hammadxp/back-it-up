import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { makeCopyOfNote, makeSnapshotOfNote } from "actions";

interface BackItUpPluginSettings {
	snapshotFolderName: string;
}

const DEFAULT_SETTINGS: Partial<BackItUpPluginSettings> = {
	snapshotFolderName: "🟣 Archive",
};

export default class BackItUpPlugin extends Plugin {
	settings: BackItUpPluginSettings;

	async onload() {
		await this.loadSettings();

		console.log("BackItUp: Loading plugin...");

		this.addSettingTab(new BackItUpSettingTab(this.app, this));

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
						.setTitle("Take a snapshot")
						.setIcon("copy-plus")
						.onClick(async () => {
							await makeSnapshotOfNote.bind(this)(file);
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
			.setName("Snapshot folder")
			.setDesc(
				'Snapshot notes will be copied to this folder. Example: "Archive\\My snapshots"'
			)
			.addText((text) =>
				text
					.setPlaceholder("Enter folder name")
					.setValue(this.plugin.settings.snapshotFolderName)
					.onChange(async (value) => {
						this.plugin.settings.snapshotFolderName = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
