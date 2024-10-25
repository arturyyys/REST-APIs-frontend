import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";

const SinglePost = (props) => {
  const { postId } = useParams(); // Extract postId from the URL
  const [post, setPost] = useState({
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  });
  const [error, setError] = useState(null); // State for handling errors

  useEffect(() => {
    // Check if the token is available
    const token = props.token; // Make sure to pass down the token as a prop

    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/feed/post/${postId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Include the token here
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch post.");
        }

        const resData = await response.json();
        setPost({
          title: resData.post.title,
          author: resData.post.creator.name,
          date: new Date(resData.post.createdAt).toLocaleDateString("en-US"),
          image: "http://localhost:8080/" + resData.post.imageUrl,
          content: resData.post.content,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong!"); // Set error state
      }
    };

    fetchPost();
  }, [postId, props.token]); // Include token in dependencies to re-fetch if it changes

  return (
    <section className="single-post">
      {error && <p className="error">{error}</p>}{" "}
      {/* Display error message if exists */}
      <h1>{post.title}</h1>
      <h2>
        Created by {post.author} on {post.date}
      </h2>
      <div className="single-post__image">
        <Image contain imageUrl={post.image} />
      </div>
      <p>{post.content}</p>
    </section>
  );
};

export default SinglePost;
