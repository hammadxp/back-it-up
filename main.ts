import { App, Plugin, PluginSettingTab, Setting, TFile } from "obsidian";
import { makeCopyOfNote, makeSnapshotOfNote } from "helper/actions";

interface BackItUpPluginSettings {
	snapshotFolder: string;
	switchToNewNote: boolean;
}

const DEFAULT_SETTINGS: Partial<BackItUpPluginSettings> = {
	snapshotFolder: "🟣 Archive",
	switchToNewNote: false,
};

export default class BackItUpPlugin extends Plugin {
	settings: BackItUpPluginSettings;

	async onload() {
		await this.loadSettings();

		console.log("BackItUp: Loading plugin...");

		this.addSettingTab(new BackItUpSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (file instanceof TFile) {
					menu.addItem((item) =>
						item
							.setTitle("Make a copy")
							.setIcon("copy")
							.onClick(async () => {
								const filePathOfCopy =
									await makeCopyOfNote.bind(this)(file);

								const fileObjOfCopy =
									this.app.vault.getAbstractFileByPath(
										filePathOfCopy
									);

								// Setting: switch to new note
								if (this.settings.switchToNewNote) {
									const leaf =
										this.app.workspace.getLeaf(true);

									if (fileObjOfCopy instanceof TFile) {
										leaf.openFile(fileObjOfCopy);
									}
								}
							})
					);

					menu.addItem((item) =>
						item
							.setTitle("Take a snapshot")
							.setIcon("copy-plus")
							.onClick(async () => {
								const filePathOfCopy =
									await makeSnapshotOfNote.bind(this)(file);

								const fileObjOfCopy =
									this.app.vault.getAbstractFileByPath(
										filePathOfCopy
									);

								// Setting: switch to new note
								if (this.settings.switchToNewNote) {
									const leaf =
										this.app.workspace.getLeaf(true);

									if (fileObjOfCopy instanceof TFile) {
										leaf.openFile(fileObjOfCopy);
									}
								}
							})
					);
				}
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
					.setValue(this.plugin.settings.snapshotFolder)
					.onChange(async (value) => {
						this.plugin.settings.snapshotFolder = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Switch to new note")
			.setDesc(
				"If turned on, the editor will switch to the new note after creating it"
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.switchToNewNote)
					.onChange(async (value) => {
						this.plugin.settings.switchToNewNote = value;
						await this.plugin.saveSettings();
					});
			});
	}
}
