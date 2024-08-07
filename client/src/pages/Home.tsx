import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Like {
    id: number;
    PostId: number;
    UserId: number;
}

// Define the type for a post
interface Post {
    id: number;
    title: string;
    postText: string;
    username: string;
    Likes: Like[];
}

function Home() {
    // Type the state with Post array
    const [listOfPosts, setListOfPosts] = useState<Post[]>([]);
    let navigate = useNavigate();

    useEffect(() => {
        axios.get<Post[]>("http://localhost:3001/posts")
            .then((response) => {
                setListOfPosts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
            });
    }, []);

    const likeAPost = (postId: number) => {
        const token = localStorage.getItem("accessToken");
        console.log("Access token:", token);
    
        axios
            .post(
                "http://localhost:3001/likes",
                { PostId: postId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((response) => {
                if (response.data.liked) {
                    setListOfPosts(
                        listOfPosts.map((post) => {
                            if (post.id === postId) {
                                return { ...post, Likes: [...post.Likes, { id: response.data.likeId, PostId: postId, UserId: response.data.userId }] };
                            } else {
                                return post;
                            }
                        })
                    );
                } else {
                    setListOfPosts(
                        listOfPosts.map((post) => {
                            if (post.id === postId) {
                                return { ...post, Likes: post.Likes.filter((like) => like.id !== response.data.likeId) };
                            } else {
                                return post;
                            }
                        })
                    );
                }
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
                        {value.username}{" "}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent navigating to post page when clicking the like button
                                likeAPost(value.id);
                            }}
                        >
                            {" "}
                            Like
                        </button>
                        <label> {value.Likes.length} </label>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Home;
