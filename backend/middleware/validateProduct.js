export function validateProduct(request, response, next) {
  const { name, price, stock } = request.body;

  if (
    !name ||
    price === undefined ||
    price === "" ||
    stock === undefined ||
    stock === ""
  ) {
    return response.status(400).json({
      success: false,
      message: "Name, price, and stock are required",
    });
  }

  next();
}
