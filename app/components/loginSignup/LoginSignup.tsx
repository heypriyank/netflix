"use client";
import React, { useState } from "react";
import "./LoginSignup.css";
import { uniqueNamesGenerator, starWars } from "unique-names-generator";

const LoginSignup = (props: any) => {
    let token;
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
    }

    if (token) {
        props.push("/admin");
    }

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const checkEmail = (email: String) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) {
            if (email.length !== 0) {
                alert("Please Enter a valid email");
                setEmail("");
            }
        }
    };

    const passwordCheck = (password: string, confirmPassword: string) => {
        const min = 8;
        const max = 20;
        const regex = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            setPassword("");
            setConfirmPassword("");
            setIsLoading(false);
            return false;
        }

        if (password.length < min || password.length > max) {
            alert("Password should be in the range of 8-20 characters");
            setPassword("");
            setConfirmPassword("");
            setIsLoading(false);
            return false;
        }
        if (!regex.test(password)) {
            alert("Password should be alphanumeric with one special character");
            setPassword("");
            setConfirmPassword("");
            setIsLoading(false);
            return false;
        }

        return true;
    };

    const buttonAction = () => {
        setIsLoading(true);
        if (isLogin) {
            const data: any = {
                email,
                password,
            };

            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then(async (res) => {
                    setIsLoading(false);
                    const response = await res.json();
                    if (!response.body.token) throw new Error()
                    localStorage.setItem("token", response.body.token);
                    props.push("/admin");
                })
                .catch((err) => {
                        alert("Invalid Credentials");
                        setIsLoading(false);
                });
        } else {
            const check = passwordCheck(password, confirmPassword);
            if (check) {
                const generatedName = name.length
                    ? name
                    : randomNameGenerator();
                const data: any = {
                    email,
                    password,
                    name: name ? name : generatedName,
                };

                fetch("/api/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                })
                    .then(async (res) => {
                        setIsLoading(false);
                        const response = await res.json();
                        localStorage.setItem("token", response.body.token);
                        props.push("/admin");
                    })
                    .catch((err) => {
                        setIsLoading(false);
                        alert(err.response.data.message);
                    });
            }
        }
    };

    const randomNameGenerator = () => {
        const config = {
            dictionaries: [starWars],
        };
        const characterName = uniqueNamesGenerator(config);
        return characterName;
    };

    return (
        <div className="login__card__parent">
            <div className="login__card">
                <div className="login__card__image">
                    <img
                        src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c529.png"
                        alt="Netflix logo"
                    />
                </div>
                <div className="inputs">
                    {!isLogin ? (
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="string"
                            placeholder="Enter Name*"
                            value={name}
                            className="bg-black"
                        />
                    ) : null}
                    <input
                        onBlur={(e) => {
                            checkEmail(e.target.value);
                        }}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter Email*"
                        value={email}
                        className="bg-black"
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Enter Password*"
                        value={password}
                        className="bg-black"
                    />
                    {!isLogin ? (
                        <input
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            placeholder="Re-Enter Password*"
                            value={confirmPassword}
                            className="bg-black"
                        />
                    ) : null}
                    <button
                        onClick={() => buttonAction()}
                        disabled={
                            !(isLogin
                                ? email.length && password.length
                                : email.length &&
                                  password.length &&
                                  confirmPassword.length)
                        }
                        type="button"
                        className="bg-red-600 w-1/4 h-1/6"
                    >
                        {!isLoading ? (
                            isLogin ? (
                                "Login"
                            ) : (
                                "Sign Up"
                            )
                        ) : (
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        )}
                    </button>
                    <p
                        style={{ marginTop: isLogin ? "5vh" : "1vh" }}
                        onClick={() => {
                            setIsLogin(!isLogin);
                        }}
                    >
                        {isLogin
                            ? "Don't have an account? Signup"
                            : "Already have an account? Login"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
