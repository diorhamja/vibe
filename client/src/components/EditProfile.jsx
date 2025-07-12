// import React, { useState } from "react";
// import {
//   Box,
//   Tabs,
//   Tab,
//   Typography,
//   TextField,
//   Button,
//   Avatar,
//   Divider,
//   Paper,
//   useTheme,
// } from "@mui/material";
// import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import axios from "axios";

// const EditProfile = () => {
//   const { user, setUser, logout } = useAuth();
//   const navigate = useNavigate();

//   const [name, setName] = useState(user.name);
//   const [email, setEmail] = useState(user.email);

//   const handleSave = async (e) => {
//     e.preventDefault();

//     if (!user._id) {
//       return;
//     }

//     try {
//       const res = await axios.patch(
//         `http://localhost:8000/api/users/${user._id}`,
//         {
//           name,
//           email,
//         },
//         { withCredentials: true }
//       );

//       console.log("User saved:", res.data);
//       setUser(res.data);
//     } catch (err) {
//       console.error("Error saving user:", err.response?.data || err.message);
//     }
//   };

//   const handleLogout = (e) => {
//     e.preventDefault();

//     logout();
//     navigate("/");
//   };

//   return (
//     <Paper
//       sx={{
//         p: 4,
//         bgcolor: "rgba(255,255,255,0.7)",
//         backdropFilter: "blur(4px)",
//         borderRadius: 2,
//         boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//       }}
//     >
//       <Typography variant="h5" fontWeight={600} color="#5E6B8D" gutterBottom>
//         Account Information
//       </Typography>
//       <Divider sx={{ mb: 3 }} />

//       <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
//         <TextField
//           fullWidth
//           label="Name"
//           name="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderRadius: 1,
//               bgcolor: "rgba(255,255,255,0.8)",
//             },
//           }}
//         />
//       </Box>

//       <TextField
//         fullWidth
//         label="Email"
//         name="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         sx={{
//           mb: 3,
//           "& .MuiOutlinedInput-root": {
//             borderRadius: 1,
//             bgcolor: "rgba(255,255,255,0.8)",
//           },
//         }}
//       />

//       <Button
//         variant="contained"
//         sx={{
//           background: "linear-gradient(135deg, #B5E8E0, #D4B8F5)",
//           color: "#5E6B8D",
//           borderRadius: 1,
//           mb: 2,
//           px: 4,
//           py: 1.5,
//           fontWeight: 500,
//           "&:hover": {
//             background: "linear-gradient(135deg, #A5D8D1, #C3A8E5)",
//           },
//         }}
//         onClick={handleSave}
//       >
//         Save Changes
//       </Button>

//       <br />

//       <Button
//         variant="outlined"
//         onClick={handleLogout}
//         sx={{
//           borderColor: "#7D8BA5",
//           color: "#7D8BA5",
//         }}
//       >
//         <LogoutOutlinedIcon />
//         Logout
//       </Button>
//     </Paper>
//   );
// };

// export default EditProfile;

import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Paper,
  useTheme,
  IconButton,
  Stack,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const EditProfile = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profilePicture, setProfilePicture] = useState(
    user.profilePicture || ""
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.profilePicture || "");

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user._id) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const res = await axios.patch(
        `http://localhost:8000/api/users/${user._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("User saved:", res.data);
      setUser(res.data);
      setSelectedFile(null); // Clear selected file after successful save
    } catch (err) {
      console.error("Error saving user:", err.response?.data || err.message);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  return (
    <Paper
      sx={{
        p: 4,
        bgcolor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(4px)",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h5" fontWeight={600} color="#5E6B8D" gutterBottom>
        Account Information
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "flex-start",
          paddingInline: 7,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ position: "relative", mb: 2 }}>
            <Avatar
              src={previewUrl || profilePicture}
              sx={{
                width: 150,
                height: 150,
                bgcolor: "#B5E8E0",
                fontSize: "2rem",
                fontWeight: 500,
                color: "#5E6B8D",
              }}
            >
              {!previewUrl && !profilePicture && name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <IconButton
              component="label"
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "rgba(181, 232, 224, 0.9)",
                color: "#5E6B8D",
                "&:hover": {
                  bgcolor: "rgba(165, 216, 209, 0.9)",
                },
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <PhotoCameraIcon fontSize="small" />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileSelect}
              />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  bgcolor: "rgba(255,255,255,0.8)",
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  bgcolor: "rgba(255,255,255,0.8)",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                alignSelf: "center",
                flexDirection: "column",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #B5E8E0, #D4B8F5)",
                  color: "#5E6B8D",
                  borderRadius: 1,
                  px: 4,
                  py: 1.5,
                  fontWeight: 500,
                  width: "200px",
                  "&:hover": {
                    background: "linear-gradient(135deg, #A5D8D1, #C3A8E5)",
                  },
                }}
                onClick={handleSave}
              >
                Save Changes
              </Button>

              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  borderColor: "#7D8BA5",
                  color: "#7D8BA5",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LogoutOutlinedIcon fontSize="small" />
                Logout
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default EditProfile;
