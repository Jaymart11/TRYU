import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  useDeleteProduct,
  useFetchProducts,
} from "../../../shared/dao/productsDao";
import { Button } from "@mui/material";
import { IProduct, IProductCategory } from "../../../shared/interface/IProduct";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/ROUTES";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IUser } from "../../../shared/interface/IUser";

// type ITableData = Pick<IProduct, "name" | "code" | "category" | "quantity">;
interface Props {
  row: IProduct;
  handleDelete: (productId: string) => Promise<void>;
  handleEdit: (id: string) => void;
}

const userJson = localStorage.getItem("user");
const user: IUser = userJson ? JSON.parse(userJson) : null;

function Row({ row, handleDelete, handleEdit }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ width: 10 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row?.name}
        </TableCell>
      </TableRow>
      {row?.product?.length ? (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Code</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.product?.map((historyRow: IProductCategory) => (
                      <TableRow key={historyRow?._id}>
                        <TableCell component="th" scope="row">
                          {historyRow?.name}
                        </TableCell>
                        <TableCell>{historyRow?.code}</TableCell>
                        <TableCell>{historyRow?.quantity}</TableCell>
                        <TableCell>
                          <ModeEditIcon
                            color="success"
                            sx={{ marginRight: "10px", cursor: "pointer" }}
                            onClick={() => handleEdit(historyRow?._id)}
                          />
                          {user?.role === "Manager" && (
                            <DeleteIcon
                              color="error"
                              sx={{ cursor: "pointer" }}
                              onClick={() => handleDelete(historyRow?._id)}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      ) : (
        ""
      )}
    </>
  );
}

export default function ListView() {
  const { data, refetch } = useFetchProducts();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    refetch();
    if (!localStorage.getItem("user")) {
      navigate("/");
    }
    //eslint-disable-next-line
  }, []);

  const deleteProductMutation = useDeleteProduct();

  const handleDelete = async (productId: string) => {
    setOpenDialog(true);
    setSelectedProductId(productId);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(selectedProductId);
      setOpenDialog(false);
    } catch (error) {
      // Handle error
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (id: string) => {
    navigate(ROUTES.PRODUCT.UPDATE, { state: { id } });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {user?.role === "Manager" && (
          <Button
            variant="contained"
            color="primary"
            sx={{ marginBottom: "10px" }}
            onClick={() => navigate(`${ROUTES.PRODUCT.CREATE}`)}
          >
            Create Product
          </Button>
        )}
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row: IProduct) => (
                <Row
                  key={row.name}
                  row={row}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
