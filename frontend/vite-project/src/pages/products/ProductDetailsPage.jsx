import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Layers3, Package, Pencil, Trash2 } from "lucide-react";
import { useProduct } from "../../hooks/useProduct";
import ProductContext from "../../context/product-context";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteProduct, deletingId } = useContext(ProductContext);
  const { product, error, loading } = useProduct(id);
  const [actionError, setActionError] = useState("");
  const isDeleting = deletingId === String(id);

  async function handleDelete() {
    if (!product) return;
    if (!window.confirm(`Delete “${product.name}”? This action cannot be undone.`)) return;

    setActionError("");

    try {
      await deleteProduct(product.id);
      navigate("/products", { replace: true });
    } catch (deleteError) {
      setActionError(deleteError.message || "Could not delete this product.");
    }
  }

  if (loading && !product) {
    return <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">Loading product details…</p>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <Package size={30} className="mx-auto text-gray-400" />
        <h1 className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
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
    <section className="mx-auto max-w-5xl">
      <Link
        to="/products"
        className="mb-2 inline-flex min-h-10 items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-emerald-700 dark:text-gray-400 dark:hover:text-emerald-400 sm:mb-5 sm:min-h-11"
      >
        <ArrowLeft size={16} />
        Back to products
      </Link>

      {(error || actionError) && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300" role="alert">
          {actionError || error}
        </p>
      )}

      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="relative min-h-40 overflow-hidden bg-gray-50 dark:bg-gray-800/70 sm:min-h-96">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                <Package size={56} strokeWidth={1.25} />
              </div>
            )}
          </div>

          <div className="flex flex-col p-3 sm:p-8">
            <div className="flex-1">
              {product.category && (
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  {product.category}
                </p>
              )}
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                {product.name}
              </h1>
              <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100 sm:mt-3 sm:text-2xl">
                {currency.format(product.price)}
              </p>

              <span
                className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium sm:mt-4 ${
                  product.stock > 0
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    product.stock > 0 ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </span>

              <div className="mt-4 sm:mt-7">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Product description
                </h2>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-5 sm:mt-2 sm:leading-6 text-gray-600 dark:text-gray-300">
                  {product.description || "No description is available for this product."}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-y border-gray-100 py-3 dark:border-gray-800 sm:mt-8 sm:gap-4 sm:py-5">
                <DetailMeta
                  icon={<Layers3 size={17} />}
                  label="Category"
                  value={product.category || "Uncategorized"}
                />
                <DetailMeta
                  icon={<Package size={17} />}
                  label="Available stock"
                  value={String(product.stock)}
                />
                <DetailMeta
                  icon={<CalendarDays size={17} />}
                  label="Date added"
                  value={formatDate(product.created_at)}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:gap-3">
              <Link
                to={`/products/${product.id}/edit`}
                className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg bg-emerald-700 px-2 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 sm:flex-1 sm:gap-2 sm:px-4 sm:text-sm"
              >
                <Pencil size={16} />
                Edit product
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-red-200 px-2 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950 sm:flex-1 sm:gap-2 sm:px-4 sm:text-sm"
              >
                <Trash2 size={16} />
                {isDeleting ? "Deleting…" : "Delete product"}
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

function DetailMeta({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-gray-400 dark:text-gray-500">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
          {value}
        </p>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
