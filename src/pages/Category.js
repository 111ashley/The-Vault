import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import PostItem from "../components/PostItem";


const Category = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);


  const params = useParams();

  useEffect(() => {
    const getPosts = async () => {
      try {
        // Get reference
        const postsRef = collection(db, "posts");

        // Create a query
        const q = query(
          postsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        // Execute query
        const querySnap = await getDocs(q);

        let posts = [];

        querySnap.forEach((doc) => {
          console.log(doc.data());
          return posts.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setPosts(posts);
        setLoading(false);
      } catch (error) {
        toast.error("Could not get posts");
      }
    };

    getPosts();
  }, [params.categoryName]);
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "original"
            ? "Outfits"
            : "Inspiration" } 
            {/* come back to this code. Hot is showing up as suggested*/}
        </p>
        {/* <p className="pageHeader">
          {params.categoryName === "hot"
            ? "Hot right now"
            : "Suggested for you"}
        </p> */}
      </header>
      {loading ? (
        <Spinner />
      ) : posts && posts.length > 0 ? (
        <>
          <main>
            <ul className="categoryPosts">
              {posts.map((post) => (
                <PostItem
                  post={post.data}
                  id={post.id}
                  key={post.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p className="p1">No posts for {params.categoryName}</p>
      )}
    </div>
  );
};
export default Category
