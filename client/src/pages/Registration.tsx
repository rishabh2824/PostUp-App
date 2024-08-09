import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RegistrationValues {
    username: string;
    password: string;
}

const Registration: React.FC = () => {
    const navigate = useNavigate();

    const initialValues: RegistrationValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(3, "Username must be at least 3 characters").max(15, "Username can't be longer than 15 characters").required("Username is required"),
        password: Yup.string().min(4, "Password must be at least 4 characters").max(20, "Password can't be longer than 20 characters").required("Password is required"),
    });

    const onSubmit = (data: RegistrationValues) => {
        axios.post("http://localhost:3001/auth/register", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            } else {
                alert("Registration successful!");
                navigate("/login");
            }
        }).catch((error) => {
            console.error("There was an error during registration!", error);
        });
    };

    return (
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="username"
                        placeholder="(Ex. John123...)"
                    />

                    <label>Password: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field
                        autoComplete="off"
                        type="password"
                        id="inputCreatePost"
                        name="password"
                        placeholder="Your Password..."
                    />

                    <button type="submit"> Register</button>
                </Form>
            </Formik>
        </div>
    );
}

export default Registration;