import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import API_URL from "../../api/api";
import ProductForm from "../../components/products/ProductForm";
import ProductContext from "../../context/product-context";

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProduct, saving: isSubmitting } = useContext(ProductContext);
  const [request, setRequest] = useState({ id: null, product: null, error: "" });
  const [submitError, setSubmitError] = useState("");
  const product = request.id === id ? request.product : null;
  const loading = request.id !== id;
  const error = request.id === id ? request.error : "";

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadProduct() {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load this product.");
        }

        const productData = data.product;
        if (isCurrentRequest) {
          setRequest({
            id,
            error: "",
            product: {
              ...productData,
              id: String(productData.id),
              description: productData.description || "",
              category: productData.category || "",
              image: productData.image_url || "",
              price: Number(productData.price),
              stock: Number(productData.stock),
            },
          });
        }
      } catch (requestError) {
        if (isCurrentRequest) {
          setRequest({
            id,
            product: null,
            error: requestError.message || "Could not load this product.",
          });
        }
      }
    }

    loadProduct();

    return () => {
      isCurrentRequest = false;
    };
  }, [id]);

  async function handleUpdate(formData) {
    setSubmitError("");

    try {
      const updatedProduct = await updateProduct(id, formData);
      navigate(`/products/${updatedProduct.id}`);
    } catch (updateError) {
      setSubmitError(updateError.message || "Could not save these changes.");
    }
  }

  if (loading && !product) {
    return <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">Loading product…</p>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {error ? "Could not load product" : "Product not found"}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {error || "This product may have been removed."}
        </p>
        <Link
          to="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <Link
        to={`/products/${product.id}`}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400"
      >
        <ArrowLeft size={16} />
        Back to product
      </Link>

      <ProductForm
        key={product.id}
        product={product}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitLabel="Save changes"
        onSubmit={handleUpdate}
        onCancel={() => navigate(`/products/${product.id}`)}
      />
    </section>
  );
}

export default EditProductPage;
