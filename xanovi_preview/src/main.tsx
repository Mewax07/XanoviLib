import ReactDOM from "react-dom/client";
import App from ".";
import { Config, ConfigProvider } from "./context/Config";
import { PronoteProvider } from "./context/Pronote";

const config: Config = {
	ui: {
		theme: "dark",
		navbar: {
			position: "right",
		},
		sideBar: {
			lastTabsAlwaysOnBottom: false,
		},
	},
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<ConfigProvider config={config}>
		<PronoteProvider>
			<App />
		</PronoteProvider>
	</ConfigProvider>,
);
