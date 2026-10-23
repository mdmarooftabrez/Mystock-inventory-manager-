import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../../components/products/ProductForm";
import ProductContext from "../../context/product-context";

function AddProductPage() {
  const navigate = useNavigate();
  const { createProduct, saving: isSubmitting } = useContext(ProductContext);
  const [submitError, setSubmitError] = useState("");

  async function handleCreate(formData) {
    setSubmitError("");

    try {
      const product = await createProduct(formData);
      navigate(`/products/${product.id}`);
    } catch (error) {
      setSubmitError(error.message || "Could not create this product.");
    }
  }

  return (
    <section className="mx-auto max-w-4xl">
      <Link
        to="/products"
        className="mb-2 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400 sm:mb-5 sm:min-h-11"
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <ProductForm
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitLabel="Create product"
        onSubmit={handleCreate}
        onCancel={() => navigate("/products")}
      />
    </section>
  );
}

export default AddProductPage;
