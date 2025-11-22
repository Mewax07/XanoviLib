import { getCurrentWindow } from "@tauri-apps/api/window";
import { useConfig } from "../Config";

const applyPositionClass = (position: "right" | "left", baseClass: string, rightClass?: string, leftClass?: string) => {
	if (position === "right" && rightClass) return `${baseClass} ${rightClass}`;
	if (position === "left" && leftClass) return `${baseClass} ${leftClass}`;
	return baseClass;
};

export const Navbar = () => {
	const config = useConfig();
	const appWindow = getCurrentWindow();

	const containerClass = applyPositionClass(config.ui.navbar.position, "container", "end", "");
	const logoClass = applyPositionClass(config.ui.navbar.position, "logo", "", "end");

	return (
		<section data-tauri-drag-region className="navbar">
			<div className={containerClass}>
				<div className="control">
					<button className="close" onClick={() => appWindow.close()}>
						<i className="fa-solid fa-xmark"></i>
					</button>
					<button className="maximize" onClick={() => appWindow.toggleMaximize()}>
						<i className="fa-solid fa-arrow-up-right-and-arrow-down-left-from-center"></i>
					</button>
					<button className="minimize" onClick={() => appWindow.minimize()}>
						<i className="fa-solid fa-minus"></i>
					</button>
				</div>
			</div>
			<i className={`fa-brands fa-bluesky ${logoClass}`}></i>
			<span className="title">Xanovi App - MewaxCorp</span>
		</section>
	);
};

export default Navbar;
