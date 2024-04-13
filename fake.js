import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';


const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const isAdminLoggedIn = () => {
    return (
      localStorage.getItem("isLoggedIn") === "true" &&
      localStorage.getItem("role") === "admin"
    );
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!isAdminLoggedIn()) {
      // Redirect to login page if not logged in as admin
      return navigate("/");
    }
  },);

  return (
    <div>
      <h1>admin page</h1>
      <p>token: {token}</p>
      <Button variant="contained">Contained</Button>
    </div>
  );
};

export default Admin;
