// src/components/Login.jsx
import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  Stack,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      return setError("Email and password are required.");
    }

    try {
      const res = await axios.post("http://localhost:3001/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",

        backgroundImage: "url('/msu.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "black",

        "::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,1)",
          backdropFilter: "blur(1px)",
          opacity: 0.3,
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          maxWidth="xs"
          sx={{
            width: "100%",
            p: 4,
            zIndex: 2, // put above the overlay
            backgroundColor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(5px)",
            borderRadius: 3,
          }}
        >
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src="/logo_msu.png"
              alt="MSU Logo"
              style={{
                width: 80, // adjust size as needed
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          <Typography variant="h5" align="center" gutterBottom>
            Welcome Back
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <Stack spacing={3}>
              <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                name="password"
                label="Password"
                fullWidth
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#8B1E3F85" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                size="large"
                fullWidth
                type="submit" // IMPORTANT
              >
                Login
              </Button>
            </Stack>
          </form>
          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              Don’t have an account?{" "}
              <Link
                component="button"
                sx={{ fontWeight: 600 }}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
