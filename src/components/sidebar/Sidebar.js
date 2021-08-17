import useWindowDimensions from "../../utils/windowHook";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";

import ProfileComp from "../ProfileComp";
import Suggestions from "./Suggestions";
import Footer from "./Footer";
import "../../styles/sidebar/sidebar.scss";

const Sidebar = () => {
	const { width } = useWindowDimensions();
	let leftOffset = Math.floor((width - 935) / 2 + 604 + 28);

	const { push } = useHistory();
	const user = useSelector(selectUser);

	if (width >= 1024) {
		return (
			<div className='sidebar' style={{ left: leftOffset + "px" }}>
				<ProfileComp
					username={user.name}
					caption={user.fullName}
					urlText='Switch'
					iconSize='big'
					image={`http://localhost:5000/uploads/${user.photo}`}
					onClick={() => push(`/profile/${user.name}`)}
				/>
				<Suggestions />
				<Footer />
			</div>
		);
	} else {
		return null;
	}
};

export default Sidebar;
