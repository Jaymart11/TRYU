import { lazy, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ROUTES } from "./shared/constants/ROUTES";
// import Layout from "./components/layout/Layout";
const InventoryList = lazy(() => import("./pages/Inventory/List/ListView"));
const CategoryList = lazy(() => import("./pages/Category/List/ListView"));
const ReportList = lazy(() => import("./pages/Report/ReportView"));
const BoxList = lazy(() => import("./pages/Box/List/ListView"));
const UserList = lazy(() => import("./pages/User/List/ListView"));
const ExpenseList = lazy(() => import("./pages/Expense/List/ListView"));
const AppBar = lazy(() => import("./components/layout/AppBar"));
const Sidebar = lazy(() => import("./components/layout/Sidebar"));
const Layout = lazy(() => import("./components/layout/Layout"));
const InvetoryForm = lazy(() => import("./pages/Inventory/Form/InventoryView"));
const CategoryForm = lazy(() => import("./pages/Category/Form/CategoryView"));
const BoxForm = lazy(() => import("./pages/Box/Form/BoxView"));
const UserForm = lazy(() => import("./pages/User/Form/UserView"));
const ExpenseForm = lazy(() => import("./pages/Expense/Form/ExpenseView"));

const Transaction = lazy(() => import("./pages/Ordering/TransactionView"));
const Ordering = lazy(() => import("./pages/Ordering/orderingView"));
const Login = lazy(() => import("./pages/Login/LoginView"));

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
