import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import stores from "../storage/StorageZustand";
const { useTokenStore } = stores;
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthentificationPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { setToken } = useTokenStore();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:4000/authentification", {
        username: username,
        password: password,
      });
      localStorage.setItem("token", res.data);
      setToken(res.data);
      navigate("/");
      window.location.reload();
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Invalid username or password!");
        } else if (error.response.status === 403) {
          alert(
            "Account needs to be verified first!Validation link was sent on your email!"
          );
        } else {
          console.error("Error:", error.response.status);
          alert("An error occurred. Please try again later.");
        }
      }
    }
  };

  const handleSignUp = async () => {
    try {
      const jUser = {
        email: email,
        username: username,
        password: password,
      };
      await axios.post("http://localhost:4000/signup", jUser).catch();
      alert("User added successfully!");
    } catch {
      alert("Username or Email already exists!");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLogin) {
      if (password === "" || username === "") {
        alert("Complete all the details!");
      } else {
        handleLogin();
      }
    } else {
      if (email === "" || password === "" || username === "") {
        alert("Complete all the details!");
      } else {
        handleSignUp();
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={3}
        style={{ padding: "32px", marginTop: "64px", backgroundColor: "white" }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {isLogin ? "Log In" : "Sign Up"}
        </Typography>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Grid item xs={12} style={{ marginBottom: "16px" }}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
          )}
          <Grid item xs={12} style={{ marginBottom: "16px" }}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} style={{ marginBottom: "16px" }}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              {isLogin ? "Log In" : "Sign Up"}
            </Button>
          </Grid>
        </form>
        <Typography
          variant="body1"
          align="center"
          style={{ marginTop: "16px" }}
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              textTransform: "none",
              fontWeight: "bold",
              marginLeft: "8px",
            }}
            color="primary"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </Button>
        </Typography>
      </Paper>
    </Container>
  );
}

export default AuthentificationPage;
