import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

interface Post {
    title: string;
    postText: string;
    username: string;
}

interface Comment {
    id: number;
    postId: number;
    commentBody: string;
    username: string;
}

const Post: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [postObject, setPostObject] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        console.log("Fetching post and comments data...");
        
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        }).catch((error) => {
            console.error("Error fetching post data:", error);
        });

        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            console.log("Fetched comments data:", response.data);
            setComments(response.data);
        }).catch((error) => {
            console.error("Error fetching comments:", error);
        });
    }, [id]);

    const addComment = () => {
        if (newComment.trim() === "") return;

        const token = localStorage.getItem("accessToken");

        if (!id) {
            console.error("Post ID is undefined");
            return;
        }

        axios.post("http://localhost:3001/comments", {
            commentBody: newComment,
            postId: parseInt(id, 10),
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.error);
                } else {
                    const commentToAdd = {
                        id: response.data.id,
                        postId: parseInt(id, 10),
                        commentBody: newComment,
                        username: response.data.username,
                    };
                    console.log("Added comment:", commentToAdd);
                    setComments([...comments, commentToAdd]);
                    setNewComment("");
                }
            })
            .catch((error) => {
                console.error("There was an error adding the comment!", error);
            });
    };

    const deleteComment = (commentId: number) => {
        if (commentId === undefined) {
            console.error("Comment ID is undefined");
            return;
        }
        console.log(`Deleting comment with ID: ${commentId}`);
        axios
          .delete(`http://localhost:3001/comments/${commentId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          })
          .then(() => {
            setComments(
              comments.filter((comment) => comment.id !== commentId)
            );
          })
          .catch((error) => {
            console.error("Error deleting comment:", error);
          });
      };

    if (!postObject) {
        return <div>Loading...</div>;
    }

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div className="title"> {postObject.title} </div>
                    <div className="body">{postObject.postText}</div>
                    <div className="footer">{postObject.username}</div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input
                        type="text"
                        placeholder="Comment..."
                        autoComplete="off"
                        value={newComment}
                        onChange={(event) => setNewComment(event.target.value)}
                    />
                    <button onClick={addComment}> Add Comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            {comment.commentBody}
                            <label> Username: {comment.username}</label>
                            {authState.username === comment.username && (
                                <button
                                    onClick={() => {
                                        console.log(`Comment ID in button: ${comment.id}`);
                                        deleteComment(comment.id);
                                    }}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Post;