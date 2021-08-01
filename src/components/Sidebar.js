import React from "react";
import "../styles/sidebar.scss";
import ProfileComp from "./ProfileComp";
import Suggestions from "./Suggestions";
import Footer from "./Footer";
import luka from "../icons/luka.jpg";
import useWindowDimensions from "../utils/windowHook";

const Sidebar = () => {
	const { height, width } = useWindowDimensions();
	console.log(width);
	let leftOffset = (width - 935) / 2 + 614 + 28;
	console.log(leftOffset);
	return (
		<div className='sidebar' style={{ left: leftOffset + "px" }}>
			<ProfileComp
				username='luxabrax'
				caption='Lux Abrax'
				urlText='Switch'
				iconSize='big'
				image={luka}
			/>
			<Suggestions />
			<Footer />
		</div>
	);
};

export default Sidebar;
