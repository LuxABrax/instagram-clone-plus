import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { changePage, selectPage } from "../redux/navigationSlice";
import {
	toggleModal,
	selectModalActive,
	selectModalName,
	selectProfileSuggestions,
} from "../redux/modalSlice";
import { selectUser } from "../redux/authSlice";
import {
	getFollowedUsers,
	getFollowingUsers,
	getUserProfile,
	selectUserPosts,
	selectUserProfile,
	setUserPosts,
} from "../redux/usersSlice";
import axios from "../axios";
import useSortToRows from "../utils/useSortToRows";

import { Header, FeedMenu, NoPosts } from "../components/profile";
import Feed from "../components/feed/Feed";
import GridImage from "../components/GridImage";
import SuggestedUsers from "../components/feed/SuggestedUsers";
import {
	PostModal,
	AddPostModal,
	ChangeImgModal,
	FollowersModal,
	UnFollowModal,
} from "../components/profile/modals";

import "../styles/pages/profile.scss";

const Profile = () => {
	const [isFollowing, setIsFollowing] = useState(false);
	const [postRows, setPosts] = useSortToRows();
	const [imagesPosts, setImagesPosts] = useState([]);

	let location = useLocation();
	let { pName, pId } = useParams();
	const { push } = useHistory();
	const dispatch = useDispatch();

	const activePage = useSelector(selectPage);
	const status = useSelector(state => state.users.status);
	const user = useSelector(selectUser);
	const user2 = useSelector(selectUserProfile);
	const profileSuggestions = useSelector(selectProfileSuggestions);

	let userProfile = {};

	userProfile = user2;

	let modalActive = useSelector(selectModalActive);
	let modalName = useSelector(selectModalName);

	const userPosts = useSelector(selectUserPosts);

	function openModal(postId) {
		dispatch(toggleModal());
		push(`/profile/${pName}/p/${postId}`);
	}

	const showSaved = async () => {
		const res = await axios.get(`/posts/saved/${user._id}`);
		// console.log(await res.data);
		const arr = await [...res.data.data];
		arr.reverse();
		// dispatch(setUserSaved(arr));
		setImagesPosts(arr);
	};
	const showPosts = () => {
		setImagesPosts([...userPosts]);
	};
	function changeImg() {
		if (pName === user.name) dispatch(toggleModal("img"));
	}

	if (status === "get user success") {
		dispatch(getFollowedUsers(user2._id));
		dispatch(getFollowingUsers(user2._id));
	}

	useEffect(() => {
		dispatch(getUserProfile(pName));
	}, [dispatch, pName]);

	useEffect(() => {
		window.scrollTo(0, 0);
		if (activePage !== "profile" && modalName !== "addPost")
			dispatch(changePage("profile"));
		if (pId !== undefined && modalActive === false) dispatch(toggleModal());
	}, [activePage, dispatch, modalActive, modalName, pId, pName]);

	useEffect(() => {
		document.title = `${user2.fullName} (@${pName}) • Instagram Plus`;
		return () => {
			document.title = "Instagram Plus";
		};
	}, [user2, pName]);

	useEffect(() => {
		const checkIfFollowing = async (uid, fid) => {
			const response = await axios.get(`/follow/${uid}/isfollowing/${fid}`);
			const isF = await response.data.isfollowing;
			setIsFollowing(isF);
		};
		checkIfFollowing(user._id, user2._id);
	}, [user2._id, user._id, isFollowing, setIsFollowing]);

	useEffect(() => {
		const getPosts = async () => {
			const res = await axios.get(`/posts/profile/${user2._id}`);
			// console.log(await res.data);
			const arr = await [...res.data.data];
			arr.reverse();
			dispatch(setUserPosts(arr));
			setImagesPosts(arr);
		};
		const getSaved = async () => {
			const res = await axios.get(`/posts/saved/${user._id}`);
			const arr = await [...res.data.data];
			arr.reverse();
			// dispatch(setUserSaved(arr));
			setImagesPosts(arr);
		};
		if (location.pathname === `/profile/${user.name}/saved`) {
			getSaved();
		} else {
			getPosts();
		}
	}, [dispatch, user, user2, location.pathname]);

	useEffect(() => {
		if (imagesPosts.length > 0) setPosts(imagesPosts);
	}, [setPosts, imagesPosts]);

	const addImage = image => {
		const arr = [...imagesPosts];
		arr.unshift(image);
		setImagesPosts([...arr]);
	};

	return (
		<div className='profile'>
			{pId !== undefined && modalActive && (
				<PostModal
					pId={pId}
					accountName={userProfile.name}
					image={`http://localhost:5000/uploads/${userProfile.photo}`}
				/>
			)}
			{modalName === "addPost" && modalActive && (
				<AddPostModal id={user._id} addImage={addImage} />
			)}
			{modalName === "img" && modalActive && <ChangeImgModal id={user._id} />}
			{modalName === "unFollow" && modalActive && (
				<UnFollowModal
					uid={user._id}
					id={userProfile._id}
					photo={userProfile.photo}
					name={userProfile.name}
					setIsFollowing={setIsFollowing}
				/>
			)}
			{modalName === "followers" && modalActive && (
				<FollowersModal
					id={user._id}
					type='followers'
					btnType={user.name === pName ? "remove" : ""}
				/>
			)}
			{modalName === "following" && modalActive && (
				<FollowersModal
					id={user._id}
					type='following'
					btnType={user.name === pName ? "remove" : ""}
				/>
			)}
			<Header
				profile={userProfile}
				changeImg={changeImg}
				isFollowing={isFollowing}
				setIsFollowing={setIsFollowing}
			/>
			{profileSuggestions && user._id !== user2._id && <SuggestedUsers />}
			<FeedMenu
				showSaved={showSaved}
				showPosts={showPosts}
				isOwner={pName === user.name}
			/>
			<div className='posts'>
				{imagesPosts.length > 0 ? (
					location.pathname === `/profile/${user2.name}/feed` ? (
						<Feed onProfile uId={userProfile._id} />
					) : (
						postRows?.map((postRow, index) => {
							return (
								<div className='pRow' key={index}>
									{postRow.map(postI => {
										if (postI.photo === "empty") {
											return <div className='postContainer'></div>;
										} else {
											return <GridImage post={postI} openModal={openModal} />;
										}
									})}
								</div>
							);
						})
					)
				) : (
					<p>Loading...</p>
					// <NoPosts />
				)}
			</div>
		</div>
	);
};

export default Profile;
