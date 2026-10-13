import { useContext, useEffect, useState } from "react";
import API_URL from "../api/api";
import AuthContext from "./auth-context";
import ProductContext from "./product-context";

function formatProduct(product) {
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

export function ProductProvider({ children }) {
  const { user, loading } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [productsUserId, setProductsUserId] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!user) return;

    async function getProducts() {
      setError("");

      try {
        const response = await fetch(`${API_URL}/products`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load products.");
        }

        setProducts(data.products.map(formatProduct));
        setProductsUserId(user.id);
      } catch (requestError) {
        setProducts([]);
        setProductsUserId(user.id);
        setError(requestError.message || "Could not load products.");
      } finally {
        setProductsLoading(false);
      }
    }

    getProducts();
  }, [loading, user, refreshCount]);

  function loadProducts() {
    setProductsLoading(true);
    setRefreshCount((count) => count + 1);
  }

  async function createProduct(formData) {
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create this product.");
      }

      const newProduct = formatProduct(data.product);

      setProducts((currentProducts) => [newProduct, ...currentProducts]);
      return newProduct;
    } finally {
      setSaving(false);
    }
  }

  async function updateProduct(id, formData) {
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update this product.");
      }

      const updatedProduct = formatProduct(data.product);

      setProducts((currentProducts) => currentProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ));

      return updatedProduct;
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id) {
    setDeletingId(String(id));

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Could not delete this product.");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== String(id)),
      );
    } finally {
      setDeletingId(null);
    }
  }

  const value = {
    products: user?.id === productsUserId ? products : [],
    loading: loading || (!!user && (productsUserId !== user.id || productsLoading)),
    error: user?.id === productsUserId ? error : "",
    saving,
    deletingId,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
