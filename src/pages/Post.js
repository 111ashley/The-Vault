import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import userEvent from "@testing-library/user-event";
import { getAdditionalUserInfo } from "firebase/auth";

// SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
const Post = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const getPost = async () => {
      const docRef = doc(db, "posts", params.postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setPost(docSnap.data());
        setLoading(false);
      }
    };

    getPost();
  }, [navigate, params.postId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
      </div>

      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
      <div className="postDetails">
        <p className="postName">{post.name}</p>
        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          navigation={true}
          scrollbar={{ draggable: true }}
        >
          {/* loop through images and output swiper slide component for each one*/}
          {post.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: `url(${post.imageUrls[index]}) center no-repeat`,
                  backgroundSize: "contain",
                  minHeight: "40rem",
                  borderRadius: "3rem",
                }}
                className="swiperSlideDiv"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <img src={post.imageUrls[0]} alt={post.name} className="postImg" /> */}
        <p className="postCaption">
          {post.caption}
          {/* {post.name}: {post.caption} */}
        </p>
      </div>
    </main>
  );
};

export default Post;
