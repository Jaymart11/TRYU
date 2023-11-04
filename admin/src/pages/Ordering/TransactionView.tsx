import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../shared/constants/ROUTES";
import { Menu, MenuItem } from "@mui/material";

const TransactionView: React.FC = () => {
  const navigate = useNavigate();

  const [orderMenuAnchor, setOrderMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const [invMenuAnchor, setInvMenuAnchor] = useState<null | HTMLElement>(null);

  // Function to open the Order Menu
  const openOrderMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOrderMenuAnchor(event.currentTarget);
  };

  // Function to close the Order Menu
  const closeOrderMenu = () => {
    setOrderMenuAnchor(null);
  };

  // Function to open the Order Menu
  const openInvMenu = (event: React.MouseEvent<HTMLElement>) => {
    setInvMenuAnchor(event.currentTarget);
  };

  // Function to close the Order Menu
  const closeInvMenu = () => {
    setInvMenuAnchor(null);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Paper
        elevation={10}
        style={{
          padding: "16px",
          textAlign: "center",
          height: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Typography variant="h4">Pick Transaction</Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={openOrderMenu}>
            Order
          </Button>
          {/* Inventory Buttons */}
          <Button
            variant="contained"
            color="secondary"
            style={{ marginLeft: "8px" }}
            onClick={openInvMenu}
          >
            Inventory
          </Button>
          <Button
            variant="contained"
            color="error"
            style={{ marginLeft: "8px" }}
          >
            Expense
          </Button>
        </Box>
      </Paper>

      {/* Order Menu */}
      <Menu
        anchorEl={orderMenuAnchor}
        open={Boolean(orderMenuAnchor)}
        onClose={closeOrderMenu}
      >
        <MenuItem onClick={() => navigate(`${ROUTES.ORDERING}/dinein`)}>
          Dine-In
        </MenuItem>
        <MenuItem onClick={() => navigate(`${ROUTES.ORDERING}/takeout`)}>
          Take-Out
        </MenuItem>
        <MenuItem onClick={() => navigate(`${ROUTES.ORDERING}/foodpanda`)}>
          Food Panda
        </MenuItem>
        <MenuItem onClick={() => navigate(`${ROUTES.ORDERING}/grab`)}>
          Grab
        </MenuItem>
      </Menu>

      {/* Inventory Menu */}
      <Menu
        anchorEl={invMenuAnchor}
        open={Boolean(invMenuAnchor)}
        onClose={closeInvMenu}
      >
        <MenuItem onClick={() => navigate(`${ROUTES.ORDERING}/dinein`)}>
          Product
        </MenuItem>
        <MenuItem onClick={() => navigate(`${ROUTES.ORDERING}/takeout`)}>
          Box / Packaging
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TransactionView;
