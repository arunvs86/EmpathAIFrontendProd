import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Drawer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import CloseIcon from "@mui/icons-material/Close";

export default function SignupsWidget() {
  const [trend, setTrend] = useState([]);
  const [summary, setSummary] = useState(0);
  const [loading, setLoading] = useState(true);

  const [drawerDate, setDrawerDate] = useState(null);
  const [users, setUsers] = useState([]);
  const [drillLoading, setDrillLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/admin/metrics/signups?days=30&minCount=5`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(({ trend, summary }) => {
        setTrend(trend);
        setSummary(summary);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openDrill = (day) => {
    setDrawerDate(day);
    setDrillLoading(true);
    fetch(`https://empathai-server-gkhjhxeahmhkghd6.uksouth-01.azurewebsites.net/admin/metrics/signups/drill?date=${day}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(({ users }) => setUsers(users))
      .catch(console.error)
      .finally(() => setDrillLoading(false));
  };

  if (loading) {
    return (
      <Box textAlign="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            New Sign-ups (Last 30 days): {summary} users
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={trend} onClick={({ activeLabel }) => openDrill(activeLabel)}>
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                <YAxis />
                <Tooltip formatter={(v) => [`${v}`, "Users"]} />
                <Bar dataKey="count" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
            <Typography variant="caption" color="textSecondary">
              * Click a bar to see that day’s new users
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={!!drawerDate}
        onClose={() => setDrawerDate(null)}
      >
        <Box p={3} width={360}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Users Joined on {drawerDate}
            </Typography>
            <IconButton onClick={() => setDrawerDate(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {drillLoading ? (
            <Box textAlign="center" p={2}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Joined At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.country || "—"}</TableCell>
                    <TableCell>
                      {new Date(u.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Drawer>
    </>
  );
}
