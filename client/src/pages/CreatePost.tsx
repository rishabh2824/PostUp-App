import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

interface FormValues {
    title: string;
    postText: string;
    username: string;
}

function CreatePost() {
    const { authState } = useContext(AuthContext);
    let navigate = useNavigate();

    const initialValues: FormValues = {
        title: "",
        postText: "",
        username: authState.username,
    };

    useEffect(() => {
        if (!authState.status) {
            navigate("/login");
        }
    }, [authState.status, navigate]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a Title!"),
        postText: Yup.string().required("Post content is required!"),
    });

    const onSubmit = (data: FormValues) => {
        axios.post("http://localhost:3001/posts", data, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        }).then((response) => {
            navigate("/");
        }).catch((error) => {
            console.error("Error creating post:", error);
        });
    };

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

                    <Field
                        type="hidden"
                        id="username"
                        name="username"
                    />

                    <button type="submit">Create Post</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreatePost;