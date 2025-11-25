import { ReactNode } from "react";
import Home from "./pages/Home";
import Work from "./pages/Homework";
import Schedule from "./pages/Schedule";

export const ONE_HOUR = 60 * 60 * 100;

export type PageName = "home" | "schedule" | "work" | "notes";

interface ContentProps {
	page: PageName;
	children?: ReactNode;
}

export const Content = ({ page, children }: ContentProps) => {
	const renderPage = () => {
		switch (page) {
			case "home":
				return <Home />;
			case "schedule":
				return <Schedule />;
			case "work":
				return <Work />;
			// case "notes":
			// 	return <Notes />;
			default:
				return <div>Page non trouvée</div>;
		}
	};

	return (
		<>
			{renderPage()}
			{children}
		</>
	);
};

export default Content;
