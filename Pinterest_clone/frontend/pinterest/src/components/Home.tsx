import React, { useEffect, useState } from "react";
import { BASE_URL } from "../constants.tsx";
import { getData } from "../api/apiRequests.tsx";
import { Post } from "../interfaces/userInterface.tsx";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]); // Corrected type for posts as an array

  const url = `posts/`;

  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount
    
    const fetchData = async () => {
      setLoading(true);
      const data = await getData(url, setError, setLoading);
      if (isMounted && data) setPosts(data);
      setLoading(false);
    };
  
    fetchData();
  
    return () => { isMounted = false; }; // Cleanup
  }, []);
  

  return (
    <section className="home">
      {loading && <p>Loading...</p>} {/* Display loading indicator */}
      {error && <p className="error">{error}</p>} {/* Display error if present */}
      <div className="posts">
        {posts.map((post: Post) => (
          <Link to={`/pins/${post.id}`} key={post.id} className="post">
            <img src={`${BASE_URL}${post.image}`} alt="Post Image" />
          </Link>
      ))}
    </div>
    </section>
  );
};

export default Home;
