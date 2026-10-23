import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../../components/products/ProductForm";
import { useProduct } from "../../hooks/useProduct";
import ProductContext from "../../context/product-context";

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProduct, saving: isSubmitting } = useContext(ProductContext);
  const { product, error, loading } = useProduct(id);
  const [submitError, setSubmitError] = useState("");

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
    return <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">Loading product details…</p>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {error ? "Could not load product" : "Product not found"}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {error || "This product may have been deleted or the link may be incorrect."}
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
        className="mb-2 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400 sm:mb-5 sm:min-h-11"
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
