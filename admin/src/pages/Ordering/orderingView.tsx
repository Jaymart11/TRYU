import DeleteIcon from "@mui/icons-material/Delete";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  // Checkbox,
  Collapse,
  Divider,
  Fade,
  Grid,
  IconButton,
  Modal,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFetchCategory } from "../../shared/dao/categoryDao";
import { useFetchProducts } from "../../shared/dao/productsDao";
import AvailableProducts from "./avaibleProductsView";
import { useCreateOrder } from "../../shared/dao/orderDao";
import { IOrder } from "../../shared/interface/IOrder";
import { useParams } from "react-router-dom";
import { AddProduct } from "../../shared/hooks/AddProduct";
import { MinusProduct } from "../../shared/hooks/MinusProduct";

interface ProductBase {
  id: string;
  name: string;
  price: number;
  selected: boolean;
  boxQuantity: number;
  boxID: string;
}

interface Product extends ProductBase {
  quantity?: number;
}

interface Product2 extends ProductBase {
  quantity: number;
  less?: { product: string; name: string; quantity: number }[];
}

interface Product2Test extends ProductBase {
  quantity: number;
  less: { product: string; name: string; quantity: number }[];
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

const POSOrdering: React.FC = () => {
  const [value, setValue] = React.useState("");
  const [discount, setDiscount] = React.useState(0);

  const { transaction } = useParams();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { data: catData } = useFetchCategory();
  const { data } = useFetchProducts(value);

  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product2[]>([]);

  const getCurrentProductQuantity = (productId: string) => {
    const product = selectedProducts.find((p) => p.id === productId);
    return product ? product.quantity : 0;
  };

  useEffect(() => {
    if (data) {
      const updatedProducts = data
        .map((d) => d.product)
        .flat(1)
        .map((p) => ({
          id: p._id,
          name: p.name,
          code: p.code,
          quantity:
            p?.quantity !== undefined
              ? p.quantity - (getCurrentProductQuantity(p._id) || 0)
              : undefined,
          price: p.price,
          selected: false,
          boxQuantity: p.box.quantity,
          boxID: p.box._id,
        }));

      setCurrentProducts(updatedProducts);
    }
    //eslint-disable-next-line
  }, [data]);

  const handleProductClick = (product: Product) => {
    const updatedSelectedProducts = [...selectedProducts];
    const existingProductIndex = updatedSelectedProducts.findIndex(
      (p) => p.id === product.id
    );

    const less: { product: string; name: string; quantity: number }[] =
      AddProduct(product, currentProducts);

    if (existingProductIndex !== -1) {
      if (product.quantity === undefined) {
        updatedSelectedProducts[existingProductIndex].less = [
          ...(updatedSelectedProducts[existingProductIndex].less || []),
          ...less,
        ];
      }
      updatedSelectedProducts[existingProductIndex].quantity += 1;
    } else {
      if (product.quantity === undefined) {
        updatedSelectedProducts.push({ ...product, quantity: 1, less });
      } else {
        updatedSelectedProducts.push({ ...product, quantity: 1 });
      }
    }

    setCurrentProducts((prevProducts) => {
      return prevProducts.map((prod) => {
        if (prod.id === product.id) {
          return {
            ...prod,
            quantity:
              prod.quantity !== undefined ? prod.quantity - 1 : undefined,
            boxQuantity: prod.boxQuantity - 1,
          };
        }

        const lessQuantity =
          less.find((l) => prod.id === l.product)?.quantity || 0;
        return less.some((l) => prod.id === l.product)
          ? {
              ...prod,
              quantity:
                prod.quantity !== undefined
                  ? prod.quantity - lessQuantity
                  : undefined,
            }
          : prod;
      });
    });

    setSelectedProducts(updatedSelectedProducts);
  };

  const handleProductClick2 = (product: Product) => {
    const updatedProducts = [...selectedProducts];
    const existingProduct = updatedProducts.find((p) => p.id === product.id);

    let less: { product: string; name: string; quantity: number }[] = [];

    if (existingProduct) {
      existingProduct.quantity -= 1;

      if (existingProduct?.less) {
        less = MinusProduct(existingProduct?.less, product.name);

        for (let i = 0; i < less.length; i++) {
          const product2 = less[i];

          const index = existingProduct.less.findIndex(
            (product1) => product1.product === product2.product
          );

          if (index !== -1) {
            existingProduct.less.splice(index, 1);
            break;
          }
        }
      }
    }

    setCurrentProducts((p) => {
      return p.map((prod) => {
        if (prod.id === product.id) {
          return {
            ...prod,
            quantity:
              prod?.quantity !== undefined ? prod.quantity + 1 : undefined,
            boxQuantity: prod.boxQuantity + 1,
          };
        }

        const lessQuantity =
          less.find((l) => prod.id === l.product)?.quantity || 0;
        return less.some((l) => prod.id === l.product)
          ? {
              ...prod,
              quantity:
                prod.quantity !== undefined
                  ? prod.quantity + lessQuantity
                  : undefined,
            }
          : prod;
      });
    });

    setSelectedProducts(updatedProducts.filter((p) => p.quantity !== 0));
  };

  const handleRemoveProduct = (product: Product2) => {
    const updatedProducts = [...selectedProducts];
    const productToRemove = updatedProducts.find((p) => p.id === product.id);

    let less: { product: string; name: string; quantity: number }[];
    if (product.less?.length) {
      less = product.less.reduce(
        (
          accumulator: { product: string; name: string; quantity: number }[],
          currentValue: { product: string; name: string; quantity: number }
        ) => {
          // Check if the product already exists in the accumulator
          const existingProduct = accumulator.find(
            (item) => item.product === currentValue.product
          );

          if (existingProduct) {
            // If the product exists, update the quantity
            existingProduct.quantity += currentValue.quantity;
          } else {
            // If the product doesn't exist, add it to the accumulator
            accumulator.push(currentValue);
          }

          return accumulator;
        },
        []
      );
    }

    if (productToRemove) {
      productToRemove.selected = false;
      setCurrentProducts((p) => {
        return p.map((prod) => {
          if (prod.id === product.id) {
            return {
              ...prod,
              quantity:
                prod?.quantity !== undefined
                  ? prod.quantity + productToRemove.quantity
                  : undefined,
              boxQuantity: prod.boxQuantity + productToRemove.quantity,
            };
          }

          const lessQuantity =
            less?.find((l) => prod.id === l.product)?.quantity || 0;
          return less?.some((l) => prod.id === l.product)
            ? {
                ...prod,
                quantity:
                  prod.quantity !== undefined
                    ? prod.quantity + lessQuantity
                    : undefined,
              }
            : prod;
        });
      });
      setSelectedProducts(updatedProducts.filter((p) => p.id !== product.id));
    }
  };

  // const handleToggleProductSelection = (product: Product) => {
  //   const updatedProducts = [...selectedProducts];
  //   const productToToggle = updatedProducts.find((p) => p.id === product.id);

  //   if (productToToggle) {
  //     productToToggle.selected = !productToToggle.selected;
  //     setSelectedProducts(updatedProducts);
  //   }
  // };

  // const handleRemoveSelected = () => {
  //   const updatedProducts = [...selectedProducts];
  //   const selectedToRemove = updatedProducts.filter((p) => p.selected);

  //   const availableProd = [...currentProducts, ...selectedToRemove].reduce(
  //     (acc: Product[], item) => {
  //       const existingItem = acc.find((i) => i.id === item.id);
  //       if (existingItem) {
  //         if (existingItem?.quantity !== undefined && item?.quantity) {
  //           existingItem.quantity += item.quantity;
  //         }
  //       } else {
  //         acc.push({ ...item });
  //       }
  //       return acc;
  //     },
  //     []
  //   );

  //   setCurrentProducts(availableProd);
  //   setSelectedProducts(
  //     updatedProducts
  //       .filter((p) => !p.selected)
  //       .map((p) => ({ ...p, selected: false }))
  //   );
  // };

  const createOrderMutation = useCreateOrder();

  let orderType: "Dine-In" | "Take-Out" | "Grab" | "Food Panda" = "Dine-In";

  switch (transaction) {
    case "dinein":
      orderType = "Dine-In";
      break;
    case "takeout":
      orderType = "Take-Out";
      break;
    case "foodpanda":
      orderType = "Food Panda";
      break;
    case "grab":
      orderType = "Grab";
      break;
  }

  const handleSubmit = async () => {
    if (selectedProducts.length > 0) {
      const val: IOrder = {
        products: selectedProducts.map(
          ({ id, quantity, price, boxID, less }) => ({
            product: id,
            box: boxID,
            quantity,
            price,
            less: less?.length ? less : undefined,
          })
        ),
        cashier: "650b30d97d3feec62164027f",
        totalAmount: selectedProducts.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        ),
        paymentMethod: "Cash",
        orderType: orderType,
        discount: discount || undefined,
      };

      await createOrderMutation.mutateAsync(val);
    }
  };

  const renderSelectedProducts = () => {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="Selected Products">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedProducts.map((product) => (
              <TableRow key={product.id}>
                {/* <TableCell>
                  <Checkbox
                    checked={product.selected}
                    onChange={() => handleToggleProductSelection(product)}
                  />
                </TableCell> */}
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => handleRemoveProduct(product)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  function addQuantitiesWithSameProduct(product: Product2Test) {
    if (!product.less || product.less.length === 0) {
      return product;
    }

    const productQuantityMap = new Map<
      string,
      { name: string; quantity: number }
    >();

    // Iterate through the 'less' array and sum quantities by product
    for (const item of product.less) {
      if (productQuantityMap.has(item.product)) {
        const existingItem = productQuantityMap.get(item.product)!;
        existingItem.quantity += item.quantity;
      } else {
        productQuantityMap.set(item.product, {
          name: item.name,
          quantity: item.quantity,
        });
      }
    }

    // Create a new 'less' array with the summed quantities and names
    const newLess = Array.from(productQuantityMap.entries()).map(
      ([product, { name, quantity }]) => ({
        product,
        name,
        quantity,
      })
    );

    // Return the updated 'ProductBase' object
    return {
      ...product,
      less: newLess,
    };
  }

  console.log(selectedProducts);

  return (
    <>
      <div style={{ marginTop: "70px" }}>
        <Typography variant="h4" gutterBottom color="primary">
          Ordering ({orderType.toUpperCase()})
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={false}
            >
              <Tab label="All" value={""} />
              {catData?.map(({ _id, name }) => (
                <Tab label={name} value={_id} key={_id} />
              ))}
            </Tabs>
            <Card>
              <CardContent>
                {
                  <AvailableProducts
                    currentProducts={currentProducts}
                    handleProductClick={handleProductClick}
                    handleProductClick2={handleProductClick2}
                    selectedProducts={selectedProducts}
                  />
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Selected Products
                </Typography>
                {renderSelectedProducts()}
                <TextField
                  sx={{ margin: "20px 0" }}
                  label="Discount"
                  variant="outlined"
                  fullWidth
                  type="number"
                  onChange={(e) => {
                    setDiscount(e.target.value as unknown as number);
                  }}
                  value={discount || ""}
                  disabled={selectedProducts.length === 0}
                />
                {/* <Typography variant="h6" gutterBottom>
                  Total Price: PHP{" "}
                  {selectedProducts.reduce(
                    (total, item) => total + item.quantity * item.price,
                    0
                  ) - discount}
                </Typography> */}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleOpen}
                  disabled={selectedProducts.length === 0}
                >
                  Place Order
                </Button>
                {/* {selectedProducts.some((product) => product.selected) && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemoveSelected}
                  >
                    Remove Items
                  </Button>
                )} */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      <Modal
        disableAutoFocus
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div>
              <Typography
                id="transition-modal-title"
                variant="h4"
                component="h2"
                color="primary"
              >
                Order Summary
              </Typography>
              <Typography
                id="transition-modal-title"
                component="h2"
                color="primary"
              >
                Order Type: <b>{orderType.toUpperCase()}</b>
              </Typography>
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {selectedProducts.map((product) => {
                    if (
                      product.name.includes("Handaan") ||
                      product.name.includes("Fiesta") ||
                      product.name.includes("Bangus Pulutan") ||
                      product.name.includes("Chicken Pulutan")
                    ) {
                      return (
                        <>
                          <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{ fontSize: "20px" }}
                            >
                              {product?.name}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{ fontSize: "20px" }}
                            >
                              x{product?.quantity}
                            </TableCell>
                          </TableRow>
                          {product?.less?.length ? (
                            <TableRow>
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={6}
                              >
                                <Collapse
                                  in={open}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Table size="small" aria-label="purchases">
                                    <TableBody>
                                      {addQuantitiesWithSameProduct(
                                        product as Product2Test
                                      ).less.map(
                                        (historyRow: {
                                          product: string;
                                          name: string;
                                          quantity: number;
                                        }) => (
                                          <TableRow key={historyRow?.product}>
                                            <TableCell
                                              component="th"
                                              scope="row"
                                            >
                                              {historyRow?.name}
                                            </TableCell>
                                            <TableCell>
                                              x{historyRow?.quantity}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                    </TableBody>
                                  </Table>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          ) : (
                            ""
                          )}
                        </>
                      );
                    } else {
                      return (
                        <TableRow key={product.id}>
                          <TableCell sx={{ fontSize: "20px" }}>
                            {product.name}
                          </TableCell>
                          <TableCell sx={{ fontSize: "20px" }}>
                            x{product.quantity}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div>
              {discount ? (
                <Typography color="gray">Discount: PHP {discount}</Typography>
              ) : (
                ""
              )}
              <Divider sx={{ margin: "10px 0" }} />
              <Typography variant="h5" color="white">
                Total: PHP{" "}
                {selectedProducts.reduce(
                  (total, item) => total + item.quantity * item.price,
                  0
                ) - discount}
              </Typography>
            </div>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSubmit}
              disabled={selectedProducts.length === 0}
            >
              Finish Order
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default POSOrdering;
