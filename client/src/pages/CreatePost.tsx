import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the type for the form values
interface FormValues {
  title: string;
  postText: string;
  username: string;
}

function CreatePost() {
  const initialValues: FormValues = {
    title: "",
    postText: "",
    username: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!"),
    postText: Yup.string().required("Post content is required!"),
    username: Yup.string().min(3, "Username must be at least 3 characters").max(15, "Username must be at most 15 characters").required("Username is required!"),
  });

  // Type the 'data' parameter in the onSubmit function
  const onSubmit = (data: FormValues) => {
    axios.post("http://localhost:3001/posts", data).then((response) => {
      navigate("/");
    }).catch((error) => {
      console.error("Error creating post:", error);
    });
  };

  let navigate = useNavigate();
  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label htmlFor="title">Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autoComplete="off"
            id="title"
            name="title"
            placeholder="(Ex. Title...)"
          />

          <label htmlFor="postText">Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autoComplete="off"
            id="postText"
            name="postText"
            placeholder="(Ex. Post...)"
          />

          <label htmlFor="username">Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="username"
            name="username"
            placeholder="(Ex. John123...)"
          />

          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
