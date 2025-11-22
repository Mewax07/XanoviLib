import { usePronote } from "../../context/Pronote";

export const AvatarIcon = () => {
	return (
		<div className="icon">
			<img className="profile" src=""></img>
		</div>
	);
};

export const Avatar = () => {
	const { user } = usePronote();

	const fullName = user ? `${user.name}` : "Nom Prénom";

	return (
		<div className="profile-info">
			<AvatarIcon></AvatarIcon>
			<div className="text">
				<p className="name">{fullName}</p>
				<p className="type">Pronote</p>
			</div>
		</div>
	);
};

export default Avatar;
