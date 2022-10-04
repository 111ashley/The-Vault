import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import PostItem from "../components/PostItem";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import uploadIcon from "../assets/svg/uploadIcon.svg";

const Profile = () => {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  // showing the user's name in the profile page
  // useEffect (() => {
  //   setUser(auth.currentUser)
  // }, [])
  const navigate = useNavigate();
  useEffect(() => {
    const getUserPosts = async () => {
      const postsRef = collection(db, "posts");
      const q = query(
        postsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      let posts = [];
      querySnap.forEach((doc) => {
        return posts.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setPosts(posts);
      setLoading(false);
    };
    getUserPosts();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate("/sign-in");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // Update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Could not update profile details");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "posts", postId));
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      toast.success("Post deleted!");
    }
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to="/create-post" className="createPost">
          {/* change home icon to a camera icon */}
          <img src={uploadIcon} alt="home" />
          <p> Post an original outfit or inspiration </p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && posts?.length > 0 && (
          <>
            <p className="postText">Your Posts</p>
            <ul className="postsList"></ul>
            {posts.map((post) => (
              <PostItem
                key={post.id}
                post={post.data}
                id={post.id}
                onDelete={() => onDelete(post.id)}
              />
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
