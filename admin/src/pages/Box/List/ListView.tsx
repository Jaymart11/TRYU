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
import { useDeleteBox, useFetchBox } from "../../../shared/dao/boxDao";
import { IUser } from "../../../shared/interface/IUser";

const userJson = localStorage.getItem("user");
const user: IUser = userJson ? JSON.parse(userJson) : null;

export default function ListView() {
  const { data, refetch } = useFetchBox();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBoxId, setSelectedBoxId] = useState("");

  useEffect(() => {
    refetch();
    //eslint-disable-next-line
  }, []);

  const navigate = useNavigate();

  const deleteBoxMutation = useDeleteBox();

  const handleDelete = async (productId: string) => {
    setOpenDialog(true);
    setSelectedBoxId(productId);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBoxMutation.mutateAsync(selectedBoxId);
      setOpenDialog(false);
    } catch (error) {
      // Handle error
      console.error("Error deleting box:", error);
    }
  };

  const handleEdit = (id: string) => {
    navigate(ROUTES.BOX.UPDATE, { state: { id } });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            marginBottom: "10px",
            visibility: user?.role === "Manager" ? "" : "hidden",
          }}
          onClick={() => navigate(`${ROUTES.BOX.CREATE}`)}
        >
          Create Packaging
        </Button>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow key={row?._id}>
                  <TableCell component="th" scope="row">
                    {row?.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row?.quantity}
                  </TableCell>
                  <TableCell>
                    <ModeEditIcon
                      color="success"
                      sx={{ marginRight: "10px", cursor: "pointer" }}
                      onClick={() => handleEdit(row?._id)}
                    />
                    {user?.role === "Manager" && (
                      <DeleteIcon
                        color="error"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleDelete(row?._id)}
                      />
                    )}
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
            Are you sure you want to delete this box?
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
