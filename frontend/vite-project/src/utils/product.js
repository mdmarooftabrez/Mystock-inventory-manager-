export function formatProduct(product) {
  return {
    ...product,
    id: String(product.id),
    description: product.description || "",
    category: product.category || "",
    image: product.image_url || "",
    price: Number(product.price),
    stock: Number(product.stock),
  };
}
