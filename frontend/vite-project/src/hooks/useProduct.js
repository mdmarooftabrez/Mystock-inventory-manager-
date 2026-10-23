import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { formatProduct } from "../utils/product";

export function useProduct(id) {
  const [result, setResult] = useState({ id: null, product: null, error: "" });
  const isCurrentProduct = result.id === id;

  useEffect(() => {
    let isCurrent = true;

    async function loadProduct() {
      try {
        const data = await apiRequest(`/products/${id}`);
        if (isCurrent) {
          setResult({ id, product: formatProduct(data.product), error: "" });
        }
      } catch (error) {
        if (isCurrent) {
          setResult({ id, product: null, error: error.message });
        }
      }
    }

    loadProduct();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  return {
    product: isCurrentProduct ? result.product : null,
    error: isCurrentProduct ? result.error : "",
    loading: !isCurrentProduct,
  };
}
