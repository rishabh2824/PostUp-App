import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { useNavigate } from "react-router-dom";

interface Post {
    id: number
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
    let navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            console.error("Post ID is undefined");
            return;
        }

        const token = localStorage.getItem("accessToken");

        axios.get(`http://localhost:3001/posts/byId/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            setPostObject(response.data);
        }).catch((error) => {
            console.error("Error fetching post data:", error);
        });

        fetchComments();
    }, [id]);

    const fetchComments = () => {
        const token = localStorage.getItem("accessToken");

        axios.get(`http://localhost:3001/comments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            setComments(response.data);
        }).catch((error) => {
            console.error("Error fetching comments:", error);
        });
    };

    const addComment = () => {
        if (newComment.trim() === "" || !id) return;

        const token = localStorage.getItem("accessToken");

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
                    fetchComments(); // Fetch all comments after adding a new one
                    setNewComment("");
                }
            })
            .catch((error) => {
                console.error("There was an error adding the comment!", error);
            });
    };

    const deleteComment = (commentId: number) => {
        if (!commentId) {
            console.error("Comment ID is undefined");
            return;
        }

        const token = localStorage.getItem("accessToken");

        axios
            .delete(`http://localhost:3001/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                fetchComments(); // Fetch all comments after deletion
            })
            .catch((error) => {
                console.error("Error deleting comment:", error);
            });
    };

    if (!postObject) {
        return <div>Loading...</div>;
    }

    const deletePost = (id: number) => {
        const token = localStorage.getItem("accessToken");
        axios
            .delete(`http://localhost:3001/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                navigate("/")
            });
    };

    const editPost = (option: string) => {
        const token = localStorage.getItem("accessToken");
        if (option === "title") {
            let newTitle = prompt("Enter New Title:");
            if (newTitle !== null && newTitle.trim() !== "") {
                axios.put(
                    "http://localhost:3001/posts/title",
                    {
                        newTitle: newTitle,
                        id: id,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
    
                setPostObject({ ...postObject, title: newTitle });
            }

        } else {
            let newPostText = prompt("Enter New Text:");
            if (newPostText !== null && newPostText.trim() !== "") {
                axios.put(
                    "http://localhost:3001/posts/postText",
                    {
                        newText: newPostText,
                        id: id,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
    
                setPostObject({ ...postObject, postText: newPostText });
            }
        }
    };

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div
                        className="title"
                        onClick={() => {
                            if (authState.username === postObject.username) {
                                editPost("title");
                            }
                        }}
                    >
                        {postObject.title}
                    </div>
                    <div
                        className="body"
                        onClick={() => {
                            if (authState.username === postObject.username) {
                                editPost("body");
                            }
                        }}
                    >
                        {postObject.postText}
                    </div>
                    <div className="footer">
                        {postObject.username}
                        {authState.username === postObject.username && (
                            <button onClick={() => { deletePost(postObject.id); }}>
                                Delete Post </button>
                        )}
                    </div>
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
                                    onClick={() => deleteComment(comment.id)}
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