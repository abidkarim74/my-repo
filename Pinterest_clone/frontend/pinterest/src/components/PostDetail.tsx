import { getData } from "../api/apiRequests.tsx";
import { Post } from "../interfaces/userInterface.tsx";
import { BASE_URL } from "../constants.tsx";
import { likeIcon } from "../icons/icons.tsx";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PostComments from "./subcomponents/PostComments.tsx";
import api from "../api/apiRequests.tsx";



const PostDetail: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState<string>("");

  const params = useParams<string>();
  const url = `pins/${params.id}/`;
  const POST_URL = `pins/${params.id}/comments/`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const post = await getData(url, setError, setLoading);
        if (post) {
          setPost(post);
        }
      } catch (err) {
        setError("Error fetching post data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  const [comments, setComments] = useState<Comment[]>([]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  
  
    try {
      const response = await api.post(POST_URL, { content });
      if (response.statusText === "OK") {
        const newComment = response.data;
  
        setPost((prevPost) => {
          if (prevPost) {
            // Prepend the new comment to ensure the latest appears first
            const updatedComments = prevPost.comments
              ? [newComment, ...prevPost.comments] 
              : [newComment];
        
            setComments(updatedComments); // Ensure `setComments` reflects the ordered list
        
            return {
              ...prevPost,
              comments: updatedComments,
              total_comments: prevPost.total_comments + 1,
            };
          }
          return prevPost; // Handle null/undefined post case
        });
        
  
        setContent(""); // Clear input field after success
      } else {
        setError("Failed to post comment.");
      }
    } catch (err) {
      setError("An error occurred while adding the comment.");
    }
  };
  

  return (
    <section className="post-detail">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {post && (
        <div className="subCon">
          <div className="post-container">
            <div className="post-image">
              <img src={`${BASE_URL}${post.image}`} alt="Post Image" />
            </div>
            <div className="post-info">
              <div className="post-interactions">
                <div className="like-info">
                  <img src={likeIcon} alt="Like Icon" className="like-icon" />
                  <small>{post.total_likes} Likes</small>
                </div>
                <div className="action-buttons">
                  <button className="share-button">Share</button>
                  <button className="settings-button">...</button>
                  <button className="save-button">Save</button>
                </div>
              </div>
              <div className="post-description">
                <h3>{post.description}</h3>
                <Link to={`/${post.user.username}`}>By {post.user.username}</Link>
              </div>
              <div className="comments-section">
                <p>{post.total_comments} Comments</p>
                <button className="toggle-comments">Show Comments</button>
                <div className="comments">
                  <PostComments postID={post.id} comments={post.comments}></PostComments>
                </div>
                <form className="comment-form" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={content}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setContent(e.target.value)
                    }
                  />
                  <button type="submit">Add</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="related-posts">
        <h3>Other Posts Like This</h3>
        <div className="related-grid">
          {/* Replace with dynamic related posts */}
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
