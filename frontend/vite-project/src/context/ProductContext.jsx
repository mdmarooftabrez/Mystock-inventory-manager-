import { useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { formatProduct } from "../utils/product";
import AuthContext from "./auth-context";
import ProductContext from "./product-context";

export function ProductProvider({ children }) {
  const { user, loading } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [productsUserId, setProductsUserId] = useState(null);

  const loadProducts = useCallback(() => {
    setProductsLoading(true);
    setError("");
    setRefreshCount((count) => count + 1);
  }, []);

  useEffect(() => {
    if (loading || !user) return;

    let isCurrent = true;

    async function fetchProducts() {
      try {
        const data = await apiRequest("/products");

        if (isCurrent) {
          setProducts(data.products.map(formatProduct));
          setProductsUserId(user.id);
        }
      } catch (requestError) {
        if (isCurrent) {
          setProducts([]);
          setProductsUserId(user.id);
          setError(requestError.message);
        }
      } finally {
        if (isCurrent) setProductsLoading(false);
      }
    }

    fetchProducts();

    return () => {
      isCurrent = false;
    };
  }, [loading, user, refreshCount]);

  async function createProduct(formData) {
    setSaving(true);

    try {
      const data = await apiRequest("/products", { method: "POST", body: formData });
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
      const data = await apiRequest(`/products/${id}`, { method: "PUT", body: formData });
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
      await apiRequest(`/products/${id}`, { method: "DELETE" });

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
