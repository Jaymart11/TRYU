import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setIsMobileOrTablet } from "../../store/sidebarSlice";

const AppBar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(setIsMobileOrTablet(isMobileOrTablet));
  }, [dispatch, isMobileOrTablet]);

  const appBarWidth =
    location.pathname.includes("ordering") ||
    location.pathname.includes("transaction") ||
    location.pathname.includes("login")
      ? "100%"
      : "calc(100% - 240px)";

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        width: "100%",
        maxWidth: appBarWidth,
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <Toolbar>
        {/* <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleOpen}
        >
          Test
        </IconButton> */}

        <Typography variant="h6" noWrap component="div" color="primary">
          Try Ü Sisig
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
