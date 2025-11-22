import { createContext, ReactNode, useContext } from "react";

export interface Config {
	ui: {
		theme: "dark" | "ligth";
		navbar: {
			position: "right" | "left";
		};
		sideBar: {
			lastTabsAlwaysOnBottom: boolean;
		};
	};
	api?: {
		apiUrl: URL;
	};
}

const ConfigContext = createContext<Config | null>(null);

interface ConfigProviderProps {
	config: Config;
	children: ReactNode;
}

export const ConfigProvider = ({ config, children }: ConfigProviderProps) => {
	return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => {
	const context = useContext(ConfigContext);
	if (!context) {
		throw new Error("useConfig must be used inside <ConfigProvider>");
	}
	return context;
};
