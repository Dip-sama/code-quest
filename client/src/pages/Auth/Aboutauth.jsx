import React from 'react';
import axios from "axios";
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  SET_USER,
  CLEAR_USER,
  SET_ERROR,
  CLEAR_ERROR,
  SET_LOADING,
  CLEAR_LOADING,
  SET_OTP_REQUIRED,
  SET_OTP_SENT,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAIL,
} from './constants/actionTypes';

const Aboutauth = () => {
  return (
    <div className="auth-container-1">
      <h1>Join the Stack Overflow community</h1>
      <p>Get unstuck — ask a question</p>
      <p>Unlock new privileges like voting and commenting</p>
      <p>Save your favorite tags, filters, and jobs</p>
      <p>Earn reputation and badges</p>
      <p style={{ fontSize: "13px", color: "#666767" }}>
        Collaborate and share knowledge with a private group for
      </p>
      <p style={{ fontSize: "13px", color: "#007ac6" }}>
        Get Stack Overflow for Teams free for up to 50 users.
      </p>
    </div>
  );
};

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: AUTH_START });
        const { data } = await axios.post("http://localhost:5000/user/signup", formData);
        dispatch({ type: AUTH_SUCCESS, payload: data });
        navigate("/");
    } catch (error) {
        console.log("Signup error:", error.response?.data);
        dispatch({ type: AUTH_FAIL, payload: error.response?.data?.message || "Signup failed!" });
        alert(error.response?.data?.message || "Signup failed!");
    }
};

export const login = (formData, navigate) => async (dispatch) => {
    try {
        dispatch({ type: AUTH_START });
        const { data } = await axios.post("http://localhost:5000/user/login", formData);
        dispatch({ type: AUTH_SUCCESS, payload: data });
        navigate("/");
    } catch (error) {
        console.log("Login error:", error.response?.data);
        dispatch({ type: AUTH_FAIL, payload: error.response?.data?.message || "Login failed!" });
        alert(error.response?.data?.message || "Login failed!");
    }
};

export default Aboutauth;
