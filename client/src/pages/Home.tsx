import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the type for a post
interface Post {
    id: number;
  title: string;
  postText: string;
  username: string;
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

  return (
    <div>
      {listOfPosts.map((value, key) => (
        <div className="post" key={key} onClick={() => navigate(`/post/${value.id}`)}>
          <div className="title">{value.title}</div>
          <div className="body">{value.postText}</div>
          <div className="footer">{value.username}</div>
        </div>
      ))}
    </div>
  );
}

export default Home;
