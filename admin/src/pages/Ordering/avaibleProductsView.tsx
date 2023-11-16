import React from "react";
import {
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  styled,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  selected: boolean;
  boxQuantity: number;
  boxID: string;
}

interface AvailableProductsProps {
  currentProducts: Product[];
  handleProductClick: (product: Product) => void;
  handleProductClick2: (product: Product) => void;
  selectedProducts: Product[];
}

const CustomTableContainer = styled(TableContainer)({
  maxHeight: "70vh",
  "&::-webkit-scrollbar": {
    width: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#363636",
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#adadad",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#adadad",
    borderRadius: "10px",
  },
});

const AvailableProducts: React.FC<AvailableProductsProps> = ({
  currentProducts,
  handleProductClick,
  handleProductClick2,
  selectedProducts,
}) => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Available Products
      </Typography>
      <CustomTableContainer component={Paper} variant="outlined">
        <Table>
          <TableBody>
            {currentProducts?.map((product) => {
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {product?.name}
                    </Typography>
                    {product?.quantity !== undefined ? (
                      <p style={{ color: "gray", fontSize: "12px" }}>
                        Quantity: {product.quantity}
                      </p>
                    ) : (
                      ""
                    )}
                    <p style={{ color: "gray", fontSize: "12px" }}>
                      Packaging Quantity: {product?.boxQuantity}
                    </p>
                  </TableCell>
                  <TableCell>PHP {product.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleProductClick(product)}
                      disabled={
                        (product?.quantity === 0 &&
                          product?.quantity !== undefined) ||
                        product?.boxQuantity === 0 ||
                        //disable for bangus pulutan
                        (product.name === "Bangus Pulutan" &&
                          (currentProducts.find(
                            (p) => p.name === "Bangus Kasalo"
                          )?.quantity ?? 0) < 2 &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Bangus Kasalo"
                            )?.quantity ?? 0) === 1 &&
                            (currentProducts.find(
                              (p) => p.name === "Bangus Meal"
                            )?.quantity ?? 0) >= 2
                          ) &&
                          (currentProducts.find((p) => p.name === "Bangus Meal")
                            ?.quantity ?? 0) < 4) ||
                        // disable for chicken pulutan
                        (product.name === "Chicken Pulutan" &&
                          (currentProducts.find(
                            (p) => p.name === "Chicken Kasalo"
                          )?.quantity ?? 0) <= 2 &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Chicken Kasalo"
                            )?.quantity ?? 0) === 1 &&
                            (currentProducts.find(
                              (p) => p.name === "Chicken Meal"
                            )?.quantity ?? 0) >= 2
                          ) &&
                          (currentProducts.find(
                            (p) => p.name === "Chicken Meal"
                          )?.quantity ?? 0) <= 4) ||
                        //disable for Pork Handaan
                        (product.name === "Pork Handaan" &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Pork Kasalo"
                            )?.quantity ?? 0) === 1 &&
                            (currentProducts.find(
                              (p) => p.name === "Pork Pulutan"
                            )?.quantity ?? 0) >= 1
                          ) &&
                          (currentProducts.find((p) => p.name === "Pork Kasalo")
                            ?.quantity ?? 0) <= 3 &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Pork Kasalo"
                            )?.quantity ?? 0) === 2 &&
                            (currentProducts.find((p) => p.name === "Pork Meal")
                              ?.quantity ?? 0) >= 2
                          ) &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Pork Kasalo"
                            )?.quantity ?? 0) === 1 &&
                            (currentProducts.find((p) => p.name === "Pork Meal")
                              ?.quantity ?? 0) >= 4
                          ) &&
                          (currentProducts.find((p) => p.name === "Pork Meal")
                            ?.quantity ?? 0) <= 6) ||
                        //disable for Bangus Handaan
                        (product.name === "Bangus Handaan" &&
                          (currentProducts.find(
                            (p) => p.name === "Bangus Kasalo"
                          )?.quantity ?? 0) <= 3 &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Bangus Kasalo"
                            )?.quantity ?? 0) === 2 &&
                            (currentProducts.find(
                              (p) => p.name === "Bangus Meal"
                            )?.quantity ?? 0) >= 2
                          ) &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Bangus Kasalo"
                            )?.quantity ?? 0) === 1 &&
                            (currentProducts.find(
                              (p) => p.name === "Bangus Meal"
                            )?.quantity ?? 0) >= 4
                          ) &&
                          (currentProducts.find((p) => p.name === "Bangus Meal")
                            ?.quantity ?? 0) <= 6) ||
                        //disable for Chicken  Handaan

                        (product.name === "Chicken Handaan" &&
                          (currentProducts.find(
                            (p) => p.name === "Chicken Kasalo"
                          )?.quantity ?? 0) <= 3 &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Chicken Kasalo"
                            )?.quantity ?? 0) === 2 &&
                            (currentProducts.find(
                              (p) => p.name === "Chicken Meal"
                            )?.quantity ?? 0) >= 2
                          ) &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Chicken Kasalo"
                            )?.quantity ?? 0) === 1 &&
                            (currentProducts.find(
                              (p) => p.name === "Chicken Meal"
                            )?.quantity ?? 0) >= 4
                          ) &&
                          (currentProducts.find(
                            (p) => p.name === "Chicken Meal"
                          )?.quantity ?? 0) <= 6) ||
                        //disable for Pork Fiesta
                        (product.name === "Pork Fiesta" &&
                          (currentProducts.find(
                            (p) => p.name === "Pork Pulutan"
                          )?.quantity ?? 0) <= 2 &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Pork Kasalo"
                            )?.quantity ?? 0) >= 2 &&
                            (currentProducts.find(
                              (p) => p.name === "Pork Pulutan"
                            )?.quantity ?? 0) === 1
                          ) &&
                          (currentProducts.find((p) => p.name === "Pork Kasalo")
                            ?.quantity ?? 0) < 4 &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Pork Kasalo"
                            )?.quantity ?? 0) === 3 &&
                            (currentProducts.find((p) => p.name === "Pork Meal")
                              ?.quantity ?? 0) >= 2
                          ) &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Pork Kasalo"
                            )?.quantity ?? 0) === 2 &&
                            (currentProducts.find((p) => p.name === "Pork Meal")
                              ?.quantity ?? 0) >= 4
                          ) &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Pork Kasalo"
                            )?.quantity ?? 0) === 1 &&
                            (currentProducts.find((p) => p.name === "Pork Meal")
                              ?.quantity ?? 0) >= 6
                          ) &&
                          (currentProducts.find((p) => p.name === "Pork Meal")
                            ?.quantity ?? 0) <= 8) ||
                        //disable for Bangus fiesta

                        (product.name === "Bangus Fiesta" &&
                          (currentProducts.find(
                            (p) => p.name === "Bangus Kasalo"
                          )?.quantity ?? 0) <= 4 &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Bangus Kasalo"
                            )?.quantity ?? 0) === 3 &&
                            (currentProducts.find(
                              (p) => p.name === "Bangus Meal"
                            )?.quantity ?? 0) >= 2
                          ) &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Bangus Kasalo"
                            )?.quantity ?? 0) === 2 &&
                            (currentProducts.find(
                              (p) => p.name === "Bangus Meal"
                            )?.quantity ?? 0) >= 4
                          ) &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Bangus Kasalo"
                            )?.quantity ?? 0) === 1 &&
                            (currentProducts.find(
                              (p) => p.name === "Bangus Meal"
                            )?.quantity ?? 0) >= 6
                          ) &&
                          (currentProducts.find((p) => p.name === "Bangus Meal")
                            ?.quantity ?? 0) <= 8) ||
                        //disable for Chicken Fiesta

                        (product.name === "Chicken Fiesta" &&
                          (currentProducts.find(
                            (p) => p.name === "Chicken Kasalo"
                          )?.quantity ?? 0) <= 4 &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Chicken Kasalo"
                            )?.quantity ?? 0) === 3 &&
                            (currentProducts.find(
                              (p) => p.name === "Chicken Meal"
                            )?.quantity ?? 0) >= 2
                          ) &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Chicken Kasalo"
                            )?.quantity ?? 0) === 2 &&
                            (currentProducts.find(
                              (p) => p.name === "Chicken Meal"
                            )?.quantity ?? 0) >= 4
                          ) &&
                          !(
                            (currentProducts.find(
                              (p) => p.name === "Chicken Kasalo"
                            )?.quantity ?? 0) === 1 &&
                            (currentProducts.find(
                              (p) => p.name === "Chicken Meal"
                            )?.quantity ?? 0) >= 6
                          ) &&
                          (currentProducts.find(
                            (p) => p.name === "Chicken Meal"
                          )?.quantity ?? 0) <= 8)
                      }
                    >
                      <AddIcon />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleProductClick2(product)}
                      disabled={
                        !selectedProducts.find((p) => p.id === product.id)
                      }
                    >
                      <RemoveIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CustomTableContainer>
    </div>
  );
};

export default AvailableProducts;
