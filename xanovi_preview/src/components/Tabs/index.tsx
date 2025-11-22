import { ReactNode } from "react";
import { PageName } from "../Content";

export interface TabProps {
	title: string;
	id: string;
	iconClass: string;
	onClick?: (page: PageName) => void;
	active?: boolean;
}

export const Tab = ({ title, id, iconClass, onClick, active }: TabProps) => {
	return (
		<div className={`tab ${id} ${active ? "actived" : ""}`} onClick={() => onClick?.(id as any)}>
			<i className={iconClass}></i>
			<p className="title">{title}</p>
		</div>
	);
};

export const Tabs = ({ children }: { children: ReactNode }) => {
	return <div className="tabs">{children}</div>;
};

export default Tabs;
