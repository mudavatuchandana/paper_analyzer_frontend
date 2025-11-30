// src/components/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Alert,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [editMode] = useState("minimal");
  const [data, setData] = useState(null); // holds session_id, text, corrections, figures
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("edit_mode", editMode);

    try {
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setData(res.data);
      setMessages([
        { text: "I've analyzed your paper. Ask me anything!", sender: "ai" },
      ]);
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    }
  };

  // WebSocket connection
  // WebSocket connection
  // Remove these lines completely:
  // const ws = useRef(null);
  // The entire useEffect with WebSocket
  // ws.current?.close() etc.

  // Replace with this simple version:
  useEffect(() => {
    if (data?.session_id) {
      setMessages([
        { text: "I've analyzed your paper. Ask me anything!", sender: "ai" },
      ]);
    }
  }, [data?.session_id]);

  const sendMessage = async () => {
    if (!input.trim() || !data?.session_id) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { text: userMsg, sender: "user" }]);
    setInput("");

    // Show typing indicator
    setMessages((prev) => [
      ...prev,
      { text: "Thinking...", sender: "ai", typing: true },
    ]);

    try {
      const res = await axios.post(
        `${API_URL}/api/chat`,
        { session_id: data.session_id, message: userMsg },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessages((prev) =>
        prev
          .filter((m) => !m.typing)
          .concat({ text: res.data.answer, sender: "ai" })
      );
    } catch (err) {
      setMessages((prev) =>
        prev
          .filter((m) => !m.typing)
          .concat({
            text: "Sorry, I couldn't respond. Try again.",
            sender: "ai",
          })
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LEFT SIDE — LOGO */}
          <Box display="flex" alignItems="center">
            <img
              src="/logo_msu.png"
              alt="MSU Logo"
              style={{
                height: 60,
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* RIGHT SIDE — LOGOUT BUTTON */}
          <IconButton color="primary" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            PaperAI - Academic Assistant
          </Typography>

          <Box sx={{ mt: 3 }}>
            <input
              accept=".pdf,.txt"
              style={{ display: "none" }}
              id="file-input"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file-input">
              <Button variant="outlined" component="span" fullWidth>
                {file ? file.name : "Choose PDF or Text File"}
              </Button>
            </label>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleUpload}
              disabled={!file}
            >
              Upload & Analyze
            </Button>
          </Box>
        </Paper>

        {data && (
          <Box mt={6}>
            {/* Original vs Corrected */}
            <Box
              sx={{
                display: { xs: "block", md: "flex" }, // stacked on mobile, side-by-side on desktop
                gap: 4,
              }}
            >
              {/* LEFT */}
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, height: 500, overflow: "auto" }}>
                  <Typography variant="h6">Original Text</Typography>
                  <pre
                    style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}
                  >
                    {data.original_text}
                  </pre>
                </Paper>
              </Box>

              {/* RIGHT */}
              <Box sx={{ flex: 1 }}>
                <Paper sx={{ p: 3, height: 500, overflow: "auto" }}>
                  <Typography variant="h6">Corrected Version</Typography>
                  {data.corrections?.length > 0 && (
                    <Box mt={3}>
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        Found {data.corrections.length} spelling/grammar issues:
                      </Alert>

                      <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: "#fff8e1" }}
                      >
                        {data.corrections.map((c, i) => (
                          <Box key={i} sx={{ mb: 1 }}>
                            <strong style={{ color: "#d32f2f" }}>
                              {c.original}
                            </strong>
                            <span style={{ margin: "0 8px", color: "#666" }}>
                              →
                            </span>
                            <strong style={{ color: "#2e7d32" }}>
                              {c.corrected}
                            </strong>
                          </Box>
                        ))}
                      </Paper>
                    </Box>
                  )}
                  <div
                    dangerouslySetInnerHTML={{ __html: data.corrected_text }}
                  />
                </Paper>
              </Box>
            </Box>

            {/* Figures */}
            {data.figures?.length > 0 && (
              <Box mt={6}>
                <Typography variant="h5" gutterBottom>
                  Figure Analysis
                </Typography>
                <Grid container spacing={4}>
                  {data.figures.map((fig) => (
                    <Grid item xs={12} md={6} key={fig.id}>
                      <Paper sx={{ p: 3 }}>
                        <img
                          src={fig.image}
                          alt={`Figure ${fig.id}`}
                          style={{ width: "100%", borderRadius: 12 }}
                        />
                        <Box mt={2} p={2} bgcolor="#f8fafc">
                          <strong>AI Analysis:</strong>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: fig.analysis.replace(/\n/g, "<br>"),
                            }}
                          />
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Chat */}
            <Paper
              sx={{
                mt: 6,
                p: 4,
                bgcolor: "#111827", // deeper modern dark
                color: "white",
                borderRadius: 3,
                boxShadow: "0 0 20px rgba(0,0,0,0.4)",
              }}
            >
              {/* TITLE */}
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: "#e2e8f0", // bright grey, super readable
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Ask Anything About This Paper
              </Typography>

              {/* MESSAGE WINDOW */}
              <Box
                sx={{
                  height: 500,
                  overflowY: "auto",
                  bgcolor: "#0f172a", // dark navy
                  p: 3,
                  borderRadius: 3,
                  mb: 2,
                  border: "1px solid #1e293b",
                }}
                ref={messagesEndRef}
              >
                {messages.map((m, i) => (
                  <Box
                    key={i}
                    sx={{
                      maxWidth: "80%",
                      ml: m.sender === "user" ? "auto" : 0,
                      mb: 2,
                      p: 2.2,
                      borderRadius: 3,
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                      bgcolor: m.sender === "user" ? "#2563eb" : "#374151",
                      color: "white",
                      boxShadow:
                        m.sender === "user"
                          ? "0 2px 6px rgba(37,99,235,0.3)"
                          : "0 2px 6px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: m.text.replace(/\n/g, "<br>"),
                      }}
                    />
                  </Box>
                ))}
              </Box>

              {/* INPUT BAR */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask about methods, results, figures..."
                  variant="outlined"
                  sx={{
                    input: { color: "white" },
                    bgcolor: "#1e293b",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#475569",
                      },
                      "&:hover fieldset": {
                        borderColor: "#64748b",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#3b82f6",
                        borderWidth: 2,
                      },
                    },
                  }}
                />

                <Button
                  variant="contained"
                  size="large"
                  onClick={sendMessage}
                  sx={{
                    bgcolor: "#3b82f6",
                    "&:hover": { bgcolor: "#2563eb" },
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                  }}
                >
                  Send
                </Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
