import React, { useState, useEffect } from "react";
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button
} from "@mui/material";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.ts";

interface UserData {
  uid: string;
  email: string;
  role: string;
  createdAt: any;
  disabled?: boolean;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const userList: UserData[] = [];
      snapshot.forEach((doc) => {
        userList.push({ uid: doc.id, ...doc.data() } as UserData);
      });
      setUsers(userList);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleStatus = async (uid: string, currentStatus?: boolean) => {
    try {
      await updateDoc(doc(db, "users", uid), {
        disabled: !currentStatus,
      });
      alert(`User has been ${!currentStatus ? "disabled" : "enabled"} successfully.`);
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Error updating user status");
    }
  };

  return (
    <Paper style={{ padding: "1rem", margin: "1rem" }}>
      <Typography variant="h5" gutterBottom>User Management</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.disabled ? "Disabled" : "Enabled"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={user.disabled ? "primary" : "error"}
                    onClick={() => handleToggleStatus(user.uid, user.disabled)}
                  >
                    {user.disabled ? "Enable" : "Disable"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AdminPanel;