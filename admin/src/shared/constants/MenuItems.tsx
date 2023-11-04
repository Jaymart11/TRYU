import { ROUTES } from "./ROUTES";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import { IUser } from "../interface/IUser";

export const MENU_LIST = () => {
  const userJson = localStorage.getItem("user");
  const user: IUser = userJson ? JSON.parse(userJson) : null;

  const menuItems = [
    {
      route: ROUTES.PRODUCT.LIST,
      path: "product",
      title: "Inventory",
      icon: <InventoryIcon />,
    },
    {
      route: ROUTES.BOX.LIST,
      path: "box",
      title: "Packaging",
      icon: <InventoryIcon />,
    },
    {
      route: ROUTES.REPORT.EXPORT,
      path: "report",
      title: "Report",
      icon: <CategoryIcon />,
    },

    {
      route: ROUTES.EXPENSE.LIST,
      path: "expense",
      title: "Expense",
      icon: <CategoryIcon />,
    },
  ];

  if (user?.role === "Manager") {
    menuItems.push({
      route: ROUTES.USER.LIST,
      path: "user",
      title: "User",
      icon: <CategoryIcon />,
    });

    menuItems.push({
      route: ROUTES.CATEGORY.LIST,
      path: "category",
      title: "Category",
      icon: <CategoryIcon />,
    });
  }

  return menuItems.sort(function (a, b) {
    const fa = a.title.toLowerCase(),
      fb = b.title.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
};
