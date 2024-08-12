import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [listOfPosts, setListOfPosts] = useState<any[]>([]);
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        // Fetch user basic info
        axios.get(`http://localhost:3001/auth/basicinfo/${id}`)
            .then((response) => {
                setUsername(response.data.username);
            })
            .catch((error) => {
                console.error("Error fetching user info:", error);
            });

        // Fetch user's posts
        axios.get(`http://localhost:3001/posts/byuserId/${id}`)
            .then((response) => {
                setListOfPosts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching user posts:", error);
            });
    }, [id]);

    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                <h1> Username: {username} </h1>
                {authState.username === username && (
          <button
            onClick={() => {
              navigate("/changepassword");
            }}
          >
            {" "}
            Change My Password
          </button>
        )}
            </div>
            <div className="listOfPosts">
                {listOfPosts.map((post, index) => (
                    <div key={index} className="post">
                        <div className="title"> {post.title} </div>
                        <div
                            className="body"
                            onClick={() => {
                                navigate(`/post/${post.id}`);
                            }}
                        >
                            {post.postText}
                        </div>
                        <div className="footer">
                            <div className="username">{post.username}</div>
                            <div className="buttons">
                                <label> {post.Likes?.length || 0}</label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;