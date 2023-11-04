export const MinusProduct = (
  product: { product: string; name: string; quantity: number }[],
  name: string
) => {
  const less: { product: string; name: string; quantity: number }[] = [];
  const type = name.split(" ")[0];

  const kasalo = product.find((p) => p.name === `${type} Kasalo`);
  const meal = product.find((p) => p.name === `${type} Meal`);
  const pulutan = product.find((p) => p.name === `${type} Pulutan`);

  if (name === "Bangus Pulutan" || name === "Chicken Pulutan") {
    if (kasalo?.quantity === 2) {
      if (kasalo) {
        less.push(kasalo);
      }
    } else if (kasalo?.quantity === 1 && meal?.quantity === 2) {
      less.push(kasalo);
      less.push(meal);
    } else if (meal?.quantity === 4) {
      less.push(meal);
    }
  } else if (name.includes("Handaan")) {
    if (
      kasalo?.quantity === 1 &&
      pulutan?.quantity === 1 &&
      name.includes("Pork")
    ) {
      less.push(kasalo);
      less.push(pulutan);
    } else if (kasalo?.quantity === 3) {
      less.push(kasalo);
    } else if (kasalo?.quantity === 2 && meal?.quantity === 2) {
      less.push(kasalo);
      less.push(meal);
    } else if (kasalo?.quantity === 1 && meal?.quantity === 4) {
      less.push(kasalo);
      less.push(meal);
    } else if (meal?.quantity === 6) {
      less.push(meal);
    }
  } else if (name.includes("Fiesta")) {
    if (pulutan?.quantity === 2 && name.includes("Pork")) {
      less.push(pulutan);
    } else if (
      pulutan?.quantity === 1 &&
      kasalo?.quantity === 2 &&
      name.includes("Pork")
    ) {
      less.push(pulutan);
      less.push(kasalo);
    } else if (kasalo?.quantity === 4) {
      less.push(kasalo);
    } else if (kasalo?.quantity === 3 && meal?.quantity === 2) {
      less.push(kasalo);
      less.push(meal);
    } else if (kasalo?.quantity === 2 && meal?.quantity === 4) {
      less.push(kasalo);
      less.push(meal);
    } else if (kasalo?.quantity === 1 && meal?.quantity === 6) {
      less.push(kasalo);
      less.push(meal);
    } else if (meal?.quantity === 8) {
      less.push(meal);
    }
  }

  return less;
};
