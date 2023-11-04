import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { MENU_LIST } from "../../shared/constants/MenuItems";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const dispatch = useDispatch();
  // const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);

  return (
    !location.pathname.includes("ordering") &&
    !location.pathname.includes("transaction") &&
    !location.pathname.includes("login") && (
      <Drawer
        variant="persistent"
        open={true}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
          },
        }}
      >
        <div
          style={{ height: "62px" }}
          // onClick={() => dispatch(toggleSidebar())}
        ></div>
        <Divider />
        <List>
          {MENU_LIST().map((item) => (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => navigate(item.route)}
                selected={location.pathname.includes(item.path)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "gray",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "gray",
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname.includes(item.path)
                      ? "white"
                      : null,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    )
  );
};

export default Sidebar;
