import { useState } from "react";
import Avatar from "../Avatar";
import Content, { PageName } from "../Content";
import Tabs, { Tab } from "../Tabs";

export const Workspace = () => {
	const [currentPage, setCurrentPage] = useState<PageName>("schedule");

	return (
		<div className="workspace">
			<div className="side-panel">
				<Avatar></Avatar>
				<Tabs>
					<Tab title="Accueil" id="home" iconClass="fa-regular fa-home" onClick={setCurrentPage} active={currentPage === "home"} />
					<Tab title="Cours" id="schedule" iconClass="fa-regular fa-calendar-days" onClick={setCurrentPage} active={currentPage === "schedule"} />
					<Tab title="Devoirs" id="work" iconClass="fa-regular fa-book" onClick={setCurrentPage} active={currentPage === "work"} />
					<Tab title="Notes" id="notes" iconClass="fa-regular fa-chart-mixed" onClick={setCurrentPage} active={currentPage === "notes"} />
					<Tab title="Actualités" id="news" iconClass="fa-regular fa-newspaper"></Tab>
				</Tabs>
				<Tabs>
					<Tab title="Vie scolaire" id="school-life" iconClass="fa-regular fa-circle-check"></Tab>
					<Tab title="Discussions" id="chat" iconClass="fa-regular fa-message-dots"></Tab>
					<Tab title="Cantine" id="cafeteria" iconClass="fa-regular fa-pizza-slice"></Tab>
					<Tab title="Compétences" id="skills" iconClass="fa-regular fa-award"></Tab>
				</Tabs>
				<Tabs>
					<Tab title="Moodle (🚧)" id="moodle" iconClass="fa-solid fa-m"></Tab>
				</Tabs>
			</div>
			<div className="main-panel">
				<div className="container">
					<Content page={currentPage}></Content>
				</div>
			</div>
		</div>
	);
};

export default Workspace;
