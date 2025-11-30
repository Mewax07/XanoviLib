import { getCurrentWebview } from "@tauri-apps/api/webview";
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

await getCurrentWebview().clearAllBrowsingData();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ConfigProvider config={config}>
		<PronoteProvider>
			<App />
		</PronoteProvider>
	</ConfigProvider>,
);
