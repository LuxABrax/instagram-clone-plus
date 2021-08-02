import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { goHome } from "../../features/navigation/navigationSlice";

import "../../styles/navigation.scss";
import Menu from "./Menu";

const Navigation = () => {
	const dispatch = useDispatch();
	const { push } = useHistory();

	return (
		<div className='navigation'>
			<div className='container'>
				<div
					className='logoContainer'
					onClick={() => {
						push("/home");
						dispatch(goHome());
					}}
				>
					<img
						className='logo'
						src='/images/instagram-logo.png'
						alt='instagram logo'
					/>
				</div>
				<div className='search'>
					<img
						className='searchIcon'
						src='/images/search.png'
						alt='search icon'
					/>
					<span className='searchText'>Search</span>
				</div>
				<div className='menuContainer'>
					<Menu />
				</div>
			</div>
		</div>
	);
};

export default Navigation;