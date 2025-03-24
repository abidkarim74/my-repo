import React, {useState, useEffect} from "react"
import {getData} from "../../api/apiRequests.tsx";
import { Comment } from "../../interfaces/userInterface";
import { BASE_URL } from "../../constants.tsx";


interface PostCommentsProps {
  postID: string;
}

const PostComments: React.FC<PostCommentsProps> = ({ postID, comments }) => {
  //const [comments, setComments] = useState<Comment[]>([]);
  // const [error, setError] = useState<null | string>(null);
  // const [loading, setLoading] = useState<boolean>(false);

  // const URL = `pins/${postID}/comments/`;

  // useEffect(() => {
  //   const fetchComments = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await getData(URL, setError, setLoading);
  //       //setComments(data);

        
  //     } catch (fetchError: any) {
  //       setError(fetchError.message || "An error occurred while fetching comments.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (postID) {
  //     fetchComments();
  //   }
  // }, [postID, URL]);

  return (
    <section className="comments-section">
      <h3>Comments</h3>
      {/* {loading && <p>Loading comments...</p>}
      {error && <p className="error">{error}</p>} */}
      
      {
        comments.map((comment:Comment) => (
          <div className="comment">
            <p>@{comment.user.username} {comment.content}</p>

          </div>
      ))}
    </section>
  );
};

export default PostComments;