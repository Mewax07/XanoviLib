import { getCurrentWindow } from "@tauri-apps/api/window";
import { BaseDirectory, readTextFile } from "@tauri-apps/plugin-fs";
import ReactDOM from "react-dom/client";
import { Config, ConfigProvider } from "./context/Config";
import { PronoteProvider } from "./context/Pronote";
import App from "./index";

const config: Config = {
	ui: {
		theme: "dark",
		navbar: {
			position: "right",
		},
		sideBar: {
			lastTabsAlwaysOnBottom: false,
		},
		effects: {
			squircle: false,
		},
	},
};

export interface StateData {
	width: number;
	height: number;
	x: number;
	y: number;
	isMaximized: boolean;
}

async function loadWindowState() {
	try {
		const appWindow = getCurrentWindow();

		const data = await readTextFile("window-state.json", {
			baseDir: BaseDirectory.AppLocalData,
		});
		const state = JSON.parse(data) as StateData;

		await appWindow.setSize({
			type: "Logical",
			width: state.width,
			height: state.height,
		} as any);

		await appWindow.setPosition({
			type: "Logical",
			x: state.x,
			y: state.y,
		} as any);

		if (state.isMaximized) {
			await appWindow.maximize();
		}
	} catch (error) {
		console.log("State load error:", error);
	}
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ConfigProvider config={config}>
		<PronoteProvider>
			<App />
		</PronoteProvider>
	</ConfigProvider>,
);

await loadWindowState();
