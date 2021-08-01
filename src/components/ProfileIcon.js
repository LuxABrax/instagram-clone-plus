import React from "react";
import "../styles/profileIcon.scss";

const ProfileIcon = props => {
	const { image, iconSize, storyBorder, profileActive } = props;

	const getRandomInt = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	let randomId = getRandomInt(1, 70);

	let profileImage = image
		? image
		: `https://i.pravatar.cc/150?img=${randomId}`;

	return (
		<div className='iconContainer'>
			<img
				className={`profileIcon ${iconSize}`}
				src={profileImage}
				alt='profile'
			/>
			{storyBorder && <div className='storyBorder'></div>}
			{profileActive && <div className='profileActive'></div>}
		</div>
	);
};

export default ProfileIcon;
