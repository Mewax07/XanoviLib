import { usePronote } from "../../context/Pronote";

import Xanovi from "./../../lib/xanovi_lib";
const pawnote = Xanovi.pronote;

export const AvatarIcon = ({ url }: { url: string }) => {
	return (
		<div className="icon">
			<img className="profile" src={url}></img>
		</div>
	);
};

export const Avatar = () => {
	const { user } = usePronote();

	const fullName = user ? `${user.name}` : "Nom Prénom";
	const profileUrl = (user as InstanceType<typeof pawnote.Student>).profilePicture.url;

	return (
		<div className="profile-info">
			<AvatarIcon url={profileUrl}></AvatarIcon>
			<div className="text">
				<p className="name">{fullName}</p>
				<p className="type">Pronote</p>
			</div>
		</div>
	);
};

export default Avatar;
