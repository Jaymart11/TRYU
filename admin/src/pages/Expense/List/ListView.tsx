import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, TablePagination } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/ROUTES";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  useDeleteExpense,
  useFetchExpense,
} from "../../../shared/dao/expenseDao";

export default function ListView() {
  const [page, setPage] = useState(0);
  const { data, refetch } = useFetchExpense(page);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState("");

  useEffect(() => {
    refetch();
    //eslint-disable-next-line
  }, [page]);

  const navigate = useNavigate();

  const deleteExpenseMutation = useDeleteExpense();

  const handleDelete = async (productId: string) => {
    setOpenDialog(true);
    setSelectedExpenseId(productId);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteExpenseMutation.mutateAsync(selectedExpenseId);
      setOpenDialog(false);
    } catch (error) {
      // Handle error
      console.error("Error deleting expense:", error);
    }
  };

  const handleEdit = (id: string) => {
    navigate(ROUTES.EXPENSE.UPDATE, { state: { id } });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{ marginBottom: "10px" }}
          onClick={() => navigate(`${ROUTES.EXPENSE.CREATE}`)}
        >
          Create Expense
        </Button>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.expenses?.map((row) => (
                <TableRow key={row?._id}>
                  <TableCell component="th" scope="row">
                    {row?.product_id ? row?.product_id.name : row?.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.quantity}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.amount}
                  </TableCell>
                  <TableCell>
                    <ModeEditIcon
                      color="success"
                      sx={{ marginRight: "10px", cursor: "pointer" }}
                      onClick={() => handleEdit(row?._id)}
                    />
                    <DeleteIcon
                      color="error"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDelete(row?._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={data?.totalCount || 0}
          rowsPerPage={10}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this expense?
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
