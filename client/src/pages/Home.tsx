import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { AuthContext } from "../helpers/AuthContext";

interface Like {
    id: number;
    postId: number;
    userId: number;
}

interface Post {
    id: number;
    title: string;
    postText: string;
    username: string;
    Likes: Like[];
    isLiked: boolean;
}

function Home() {
    const [listOfPosts, setListOfPosts] = useState<Post[]>([]);
    const { authState } = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(() => {
        if (!authState.status) {
            navigate("/login");
        } else {
            axios.get<{ listOfPosts: Post[]; userId: number }>("http://localhost:3001/posts", {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            })
                .then((response) => {
                    setListOfPosts(response.data.listOfPosts);
                })
                .catch((error) => {
                    console.error("Error fetching posts:", error);
                });
        }
    }, [authState.status, navigate]);

    const likeAPost = (postId: number) => {
        const token = localStorage.getItem("accessToken");

        axios
            .post(
                "http://localhost:3001/likes",
                { postId: postId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                const { liked, likes } = response.data;
                setListOfPosts(
                    listOfPosts.map((post) => {
                        if (post.id === postId) {
                            return {
                                ...post,
                                Likes: likes,
                                isLiked: liked,
                            };
                        } else {
                            return post;
                        }
                    })
                );
            })
            .catch((error) => {
                console.error("Error liking post:", error);
            });
    };

    return (
        <div>
            {listOfPosts.map((value, key) => (
                <div className="post" key={key}>
                    <div className="title">{value.title}</div>
                    <div className="body" onClick={() => navigate(`/post/${value.id}`)}>{value.postText}</div>
                    <div className="footer">
                        <div className="username">{value.username}</div>
                        <div className="buttons">
                            <ThumbUpAltIcon
                                onClick={() => {
                                    likeAPost(value.id);
                                }}
                                className={value.isLiked ? "unlikeBttn" : "likeBttn"}
                            />
                            <label> {value.Likes.length} </label>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Home;