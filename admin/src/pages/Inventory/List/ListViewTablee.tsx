// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// // import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import { useFetchProducts } from "../../../shared/dao/productsDao";
// import { Button, Typography } from "@mui/material";
// import { IProduct, IProductCategory } from "../../../shared/interface/IProduct";
// import ModeEditIcon from "@mui/icons-material/ModeEdit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useNavigate } from "react-router-dom";
// import { ROUTES } from "../../../shared/constants/ROUTES";

// interface Column {
//   id: "name" | "category" | "quantity" | "action" | "code";
//   label: string;
//   minWidth?: number | string;
//   align?: "right";
//   format?: (value: number) => string;
// }

// type ITableData = Pick<IProductCategory, "name" | "code" | "quantity">;

// type ITableDatas = ITableData & {
//   category: string;
//   action?: string;
// };

// const columns: readonly Column[] = [
//   { id: "name", label: "Name" },
//   { id: "code", label: "Code" },
//   { id: "category", label: "Category" },
//   {
//     id: "quantity",
//     label: "Quantity",
//   },
//   {
//     id: "action",
//     label: "Action",
//     minWidth: 100,
//   },
// ];

// export default function ListView() {
//   console.log(412421412421);
//   const { data } = useFetchProducts();

//   console.log(data);

//   const tableData: IProduct[] = data?.map((d: IProduct) => {
//     return {
//       name: d.name,
//       code: d.code,
//       category: d.category.name,
//       quantity: d.quantity,
//     };
//   });

//   // const handleChangePage = (event: unknown, newPage: number) => {
//   //   setPage(newPage);
//   // };

//   // const handleChangeRowsPerPage = (
//   //   event: React.ChangeEvent<HTMLInputElement>
//   // ) => {
//   //   setRowsPerPage(+event.target.value);
//   //   setPage(0);
//   // };

//   const navigate = useNavigate();

//   return (
//     <>
//       <div style={{ display: "flex", justifyContent: "flex-end" }}>
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{ marginBottom: "10px" }}
//           onClick={() => navigate(`${ROUTES.PRODUCT.CREATE}`)}
//         >
//           Create Product
//         </Button>
//       </div>
//       <Paper sx={{ width: "100%", overflow: "hidden" }}>
//         <TableContainer sx={{ maxHeight: 440 }}>
//           <Table stickyHeader aria-label="sticky table">
//             <TableHead>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableCell
//                     key={column.id}
//                     align={column.align}
//                     style={{ width: column?.minWidth }}
//                   >
//                     {column.label}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tableData?.map((row: ITableDatas) => {
//                 return (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
//                     {columns.map((column: Column) => {
//                       const value = row[column.id];
//                       return column.id !== "action" ? (
//                         <TableCell key={column.id} align={column.align}>
//                           {
//                             <Typography variant="body2">
//                               {value as string}
//                             </Typography>
//                           }
//                         </TableCell>
//                       ) : (
//                         <TableCell key={column.id} align={column.align}>
//                           <ModeEditIcon
//                             color="success"
//                             sx={{ marginRight: "10px", cursor: "pointer" }}
//                           />
//                           <DeleteIcon
//                             color="error"
//                             sx={{ cursor: "pointer" }}
//                           />
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         {/* <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={rows.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       /> */}
//       </Paper>
//     </>
//   );
// }
