// src/pages/AdminDashboard.jsx
import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import SignupsWidget from "../components/SignupsWidget";
// ... import other widgets

export default function AdminDashboard() {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <SignupsWidget />
        </Grid>
        {/* <Grid item xs={12} md={6} lg={4}>
            <ConversationHealthWidget />
          </Grid>
          ... */}
      </Grid>
    </Box>
  );
}
