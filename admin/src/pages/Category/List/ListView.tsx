import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button } from "@mui/material";
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
  useDeleteCategory,
  useFetchCategory,
} from "../../../shared/dao/categoryDao";

export default function ListView() {
  const { data, refetch } = useFetchCategory();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  useEffect(() => {
    refetch();
    //eslint-disable-next-line
  }, []);

  const navigate = useNavigate();

  const deleteCategoryMutation = useDeleteCategory();

  const handleDelete = async (productId: string) => {
    setOpenDialog(true);
    setSelectedCategoryId(productId);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCategoryMutation.mutateAsync(selectedCategoryId);
      setOpenDialog(false);
    } catch (error) {
      // Handle error
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = (id: string) => {
    navigate(ROUTES.CATEGORY.UPDATE, { state: { id } });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginBottom: "10px" }}
          onClick={() => navigate(`${ROUTES.CATEGORY.CREATE}`)}
        >
          Create Category
        </Button>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row?._id}>
                  <TableCell component="th" scope="row">
                    {row?.name}
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
      </Paper>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category?
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
