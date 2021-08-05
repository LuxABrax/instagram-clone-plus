import "../styles/pages/profile.scss";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { changePage, selectPage } from "../features/navigation/navigationSlice";
import { toggleModal, selectModalActive } from "../features/modalSlice";

import PostModal from "../components/profile/PostModal";
import Header from "../components/profile/Header";
import FeedMenu from "../components/profile/FeedMenu";
import comments from "../data/comments.js";
import imagesPosts from "../data/posts";
import luka from "../icons/luka.jpg";

const Profile = () => {
	const [arrSorted, setArrSorted] = useState(false);
	const [sortedPosts, setSortedPosts] = useState([]);

	let { pName, pId } = useParams();
	const { push } = useHistory();
	const dispatch = useDispatch();

	const activePage = useSelector(selectPage);
	let modalActive = useSelector(selectModalActive);

	const sPosts = [];
	const sortPosts = () => {
		let len = imagesPosts.length;
		let rowNum = Math.ceil(len / 3);
		let emptyNum = rowNum * 3 - len;
		let totalNum = len + emptyNum;

		let arr = [];
		let j = 0;
		for (let i = 0; i < totalNum; i++) {
			if (i < len) {
				arr.push(imagesPosts[i]);
			} else {
				arr.push({ id: `${i}empty`, image: "empty" });
			}
			j++;

			if (j === 3) {
				sPosts.push(arr);
				arr = [];
				j = 0;
			}
			if (i === totalNum) sPosts.push(arr);
		}
		setSortedPosts(sPosts);
		setArrSorted(true);
	};

	function openModal(postId) {
		dispatch(toggleModal());
		push(`/profile/${pName}/p/${postId}`);
	}

	useEffect(() => {
		if (activePage !== "profile") dispatch(changePage("profile"));
		if (pId !== undefined && modalActive === false) dispatch(toggleModal());
		sortPosts();
	}, []);

	return (
		<div className='profile'>
			{pId !== undefined && modalActive && (
				<PostModal
					accountName='luxabrax'
					storyBorder={true}
					image='https://picsum.photos/600'
					comments={comments[0].comments}
					likedByText='breskvica'
					likedByNumber={1929}
					hours={2}
				/>
			)}
			<div className='profFeed'>
				<Header
					image={luka}
					accountName={"lux_abrax"}
					fullName='Luka'
					description='Self-taught programmer wannabe, stuck with making the most complex clone a beginner can do. Crazy man'
					postNumber={27}
					followers={79}
					following={79}
				/>
				<FeedMenu />

				{arrSorted ? (
					<div className='posts'>
						{sortedPosts.map((postRow, index) => {
							console.log("mapping row");
							console.log(postRow);
							return (
								<div className='row' key={index}>
									{postRow.map((postI, idx) => {
										if (postI.image === "empty") {
											return (
												<div className='postContainer' key={idx}>
													<img src='' alt='empty' />
												</div>
											);
										} else {
											return (
												<div
													className='postContainer'
													key={idx}
													onClick={() => openModal(postI.id)}
												>
													<img src={postI.image} alt='' />
												</div>
											);
										}
									})}
								</div>
							);
						})}
					</div>
				) : (
					<div>No posts</div>
				)}
			</div>
		</div>
	);
};

export default Profile;
