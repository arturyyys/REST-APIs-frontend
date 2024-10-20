import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";

class SinglePost extends Component {
  // Initial state holds the details of the post to be fetched and displayed
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    // Extracting the postId from the URL params
    const postId = this.props.match.params.postId;

    // Fetching the single post data from the server (URL should be replaced with actual API)
    fetch("URL")
      .then((res) => {
        // If the response status is not 200, an error is thrown
        if (res.status !== 200) {
          throw new Error("Failed to fetch status");
        }
        return res.json(); // Converting the response to JSON
      })
      .then((resData) => {
        // Once data is fetched, setting the state with the post details
        this.setState({
          title: resData.post.title,
          author: resData.post.creator.name,
          date: new Date(resData.post.createdAt).toLocaleDateString("en-US"), // Formatting the date
          content: resData.post.content,
        });
      })
      .catch((err) => {
        // If an error occurs during the fetch, it's logged to the console
        console.log(err);
      });
  }

  render() {
    // Rendering the post details: title, author, date, image, and content
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1> {/* Displaying the post title */}
        <h2>
          Created by {this.state.author} on {this.state.date}{" "}
          {/* Displaying author and formatted date */}
        </h2>
        <div className="single-post__image">
          {/* Displaying the post image using the custom Image component */}
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p> {/* Displaying the post content */}
      </section>
    );
  }
}

export default SinglePost;
