import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ROUTES } from "./shared/constants/ROUTES";
// import Layout from "./components/layout/Layout";
import AppBar from "./components/layout/AppBar";
import Layout from "./components/layout/Layout";
import Sidebar from "./components/layout/Sidebar";
import BoxForm from "./pages/Box/Form/BoxView";
import BoxList from "./pages/Box/List/ListView";
import CategoryForm from "./pages/Category/Form/CategoryView";
import CategoryList from "./pages/Category/List/ListView";
import ExpenseForm from "./pages/Expense/Form/ExpenseView";
import ExpenseList from "./pages/Expense/List/ListView";
import InvetoryForm from "./pages/Inventory/Form/InventoryView";
import InventoryList from "./pages/Inventory/List/ListView";
import Login from "./pages/Login/LoginView";
import Transaction from "./pages/Ordering/TransactionView";
import Ordering from "./pages/Ordering/orderingView";
import ReportList from "./pages/Report/ReportView";
import UserForm from "./pages/User/Form/UserView";
import UserList from "./pages/User/List/ListView";

const App = () => {
  const navigate = useNavigate();

  // Check if the user is authenticated (e.g., by checking localStorage).
  const isAuthenticated = localStorage.getItem("user") !== null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, []);

  return (
    <>
      <Sidebar />
      <AppBar />
      <Routes>
        <Route path={`${ROUTES.LOGIN}`} element={<Login />} />
        <Route
          path={`${ROUTES.PRODUCT.LIST}`}
          element={
            <Layout>
              <InventoryList />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.PRODUCT.CREATE}`}
          element={
            <Layout>
              <InvetoryForm />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.PRODUCT.UPDATE}`}
          element={
            <Layout>
              <InvetoryForm />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.CATEGORY.LIST}`}
          element={
            <Layout>
              <CategoryList />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.CATEGORY.CREATE}`}
          element={
            <Layout>
              <CategoryForm />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.CATEGORY.UPDATE}`}
          element={
            <Layout>
              <CategoryForm />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.BOX.LIST}`}
          element={
            <Layout>
              <BoxList />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.BOX.CREATE}`}
          element={
            <Layout>
              <BoxForm />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.BOX.UPDATE}`}
          element={
            <Layout>
              <BoxForm />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.USER.LIST}`}
          element={
            <Layout>
              <UserList />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.USER.CREATE}`}
          element={
            <Layout>
              <UserForm />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.USER.UPDATE}`}
          element={
            <Layout>
              <UserForm />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.EXPENSE.LIST}`}
          element={
            <Layout>
              <ExpenseList />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.EXPENSE.CREATE}`}
          element={
            <Layout>
              <ExpenseForm />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.EXPENSE.UPDATE}`}
          element={
            <Layout>
              <ExpenseForm />
            </Layout>
          }
        />
        <Route
          path={`${ROUTES.REPORT.EXPORT}`}
          element={
            <Layout>
              <ReportList />
            </Layout>
          }
        />
        //ORDERING
        <Route path={`${ROUTES.TRANSACTION}`} element={<Transaction />} />
        <Route
          path={`${ROUTES.ORDERING}/:transaction`}
          element={<Ordering />}
        />
      </Routes>
    </>
  );
};

export default App;
