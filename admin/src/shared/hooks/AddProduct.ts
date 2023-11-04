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

export const AddProduct = (product: Product, currentProducts: Product[]) => {
  const less: { product: string; name: string; quantity: number }[] = [];
  const type = product.name.split(" ")[0];

  const kasaloProduct = currentProducts.find(
    (p) => p.name === `${type} Kasalo`
  );
  const mealProduct = currentProducts.find((p) => p.name === `${type} Meal`);
  const pulutanProduct = currentProducts.find(
    (p) => p.name === `${type} Pulutan`
  );

  if (product.name === "Bangus Pulutan" || product.name === "Chicken Pulutan") {
    if (
      kasaloProduct &&
      kasaloProduct.quantity &&
      kasaloProduct.quantity >= 2
    ) {
      less.push({
        product: kasaloProduct.id,
        name: kasaloProduct.name,
        quantity: 2,
      });
    } else if (
      kasaloProduct &&
      kasaloProduct.quantity &&
      kasaloProduct.quantity >= 1 &&
      mealProduct &&
      mealProduct.quantity &&
      mealProduct.quantity >= 2
    ) {
      less.push({
        product: kasaloProduct.id,
        name: kasaloProduct.name,
        quantity: 1,
      });
      less.push({
        product: mealProduct.id,
        name: mealProduct.name,
        quantity: 2,
      });
    } else if (
      mealProduct &&
      mealProduct.quantity &&
      mealProduct.quantity >= 4
    ) {
      less.push({
        product: mealProduct.id,
        name: mealProduct.name,
        quantity: 4,
      });
    }
  } else if (product.name.includes("Handaan")) {
    if (
      kasaloProduct &&
      kasaloProduct.quantity &&
      kasaloProduct.quantity >= 1 &&
      pulutanProduct &&
      pulutanProduct.quantity &&
      pulutanProduct.quantity >= 1 &&
      product.name.includes("Pork")
    ) {
      less.push({
        product: kasaloProduct.id,
        name: kasaloProduct.name,
        quantity: 1,
      });
      less.push({
        product: pulutanProduct.id,
        name: pulutanProduct.name,
        quantity: 1,
      });
    } else if (
      kasaloProduct &&
      kasaloProduct.quantity &&
      kasaloProduct.quantity >= 3
    ) {
      less.push({
        product: kasaloProduct.id,
        name: kasaloProduct.name,
        quantity: 3,
      });
    } else if (
      kasaloProduct &&
      kasaloProduct.quantity &&
      kasaloProduct.quantity >= 2 &&
      mealProduct &&
      mealProduct.quantity &&
      mealProduct.quantity >= 2
    ) {
      less.push({
        product: kasaloProduct.id,
        name: kasaloProduct.name,
        quantity: 2,
      });
      less.push({
        product: mealProduct.id,
        name: mealProduct.name,
        quantity: 2,
      });
    } else if (
      kasaloProduct &&
      kasaloProduct.quantity &&
      kasaloProduct.quantity >= 1 &&
      mealProduct &&
      mealProduct.quantity &&
      mealProduct.quantity >= 4
    ) {
      less.push({
        product: kasaloProduct.id,
        name: kasaloProduct.name,
        quantity: 1,
      });
      less.push({
        product: mealProduct.id,
        name: mealProduct.name,
        quantity: 4,
      });
    } else if (
      mealProduct &&
      mealProduct.quantity &&
      mealProduct.quantity >= 6
    ) {
      less.push({
        product: mealProduct.id,
        name: mealProduct.name,
        quantity: 6,
      });
    }
  } else if (product.name.includes("Fiesta")) {
    if (
      pulutanProduct &&
      pulutanProduct.quantity &&
      pulutanProduct.quantity >= 2 &&
      product.name.includes("Pork")
    ) {
      less.push({
        product: pulutanProduct.id,
        name: pulutanProduct.name,
        quantity: 2,
      });
    } else if (
      pulutanProduct &&
      pulutanProduct.quantity &&
      pulutanProduct.quantity >= 1 &&
      kasaloProduct &&
      kasaloProduct.quantity &&
      kasaloProduct.quantity >= 2 &&
      product.name.includes("Pork")
    ) {
      less.push({
        product: pulutanProduct.id,
        name: pulutanProduct.name,
        quantity: 1,
      });
      less.push({
        product: kasaloProduct.id,
        name: kasaloProduct.name,
        quantity: 2,
      });
    } else if (
      kasaloProduct &&
      kasaloProduct.quantity &&
      kasaloProduct.quantity >= 4
    ) {
      less.push({
        product: kasaloProduct.id,
        name: kasaloProduct.name,
        quantity: 4,
      });
    } else if (
      kasaloProduct &&
      kasaloProduct.quantity &&
      kasaloProduct.quantity >= 3 &&
      mealProduct &&
      mealProduct.quantity &&
      mealProduct.quantity >= 2
    ) {
      less.push({
        product: kasaloProduct.id,
        name: kasaloProduct.name,
        quantity: 3,
      });
      less.push({
        product: mealProduct.id,
        name: mealProduct.name,
        quantity: 2,
      });
    } else if (
      kasaloProduct &&
      kasaloProduct.quantity &&
      kasaloProduct.quantity >= 2 &&
      mealProduct &&
      mealProduct.quantity &&
      mealProduct.quantity >= 4
    ) {
      less.push({
        product: kasaloProduct.id,
        name: kasaloProduct.name,
        quantity: 2,
      });
      less.push({
        product: mealProduct.id,
        name: mealProduct.name,
        quantity: 4,
      });
    } else if (
      kasaloProduct &&
      kasaloProduct.quantity &&
      kasaloProduct.quantity >= 1 &&
      mealProduct &&
      mealProduct.quantity &&
      mealProduct.quantity >= 6
    ) {
      less.push({
        product: kasaloProduct.id,
        name: kasaloProduct.name,
        quantity: 1,
      });
      less.push({
        product: mealProduct.id,
        name: mealProduct.name,
        quantity: 6,
      });
    } else if (
      mealProduct &&
      mealProduct.quantity &&
      mealProduct.quantity >= 8
    ) {
      less.push({
        product: mealProduct.id,
        name: mealProduct.name,
        quantity: 8,
      });
    }
  }

  return less;
};
