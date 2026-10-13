import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Plus, RefreshCw, Search } from "lucide-react";
import ProductCard from "../../components/products/ProductCard";
import ProductContext from "../../context/product-context";

function ProductsPage() {
  const { products, loading, error, deletingId, loadProducts, deleteProduct } = useContext(ProductContext);
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState("");

  const query = search.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    [product.name, product.description, product.category]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setActionError("");

    try {
      await deleteProduct(product.id);
    } catch (deleteError) {
      setActionError(deleteError.message || "Could not delete this product.");
    }
  }

  let productList;

  if (loading && products.length === 0) {
    productList = (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          />
        ))}
      </div>
    );
  } else if (error && products.length === 0) {
    productList = null;
  } else if (filteredProducts.length > 0) {
    productList = (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={() => handleDelete(product)}
            deleting={deletingId === product.id}
          />
        ))}
      </div>
    );
  } else {
    productList = (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
        <Package size={30} className="mx-auto text-gray-400 dark:text-gray-500" />
        <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {search.trim() ? "No matching products" : "Your catalog is empty"}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {search.trim()
            ? "Try a different name, description, or category."
            : "Add your first product to start building your catalog."}
        </p>
        {!search.trim() && (
          <Link
            to="/products/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <Plus size={17} />
            Add your first product
          </Link>
        )}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Product inventory
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            All Products
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your catalog, stock, and product details.
          </p>
        </div>

        <Link
          to="/products/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <label className="mb-5 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 dark:border-gray-700 dark:bg-gray-900">
        <Search size={17} className="text-gray-500 dark:text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products..."
          aria-label="Search products by name, description, or category"
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </label>

      <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Package size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {search.trim() ? "Matching your search" : "In your catalog"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadProducts}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {(error || actionError) && (
        <div
          className="mb-5 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <span>{actionError || error}</span>
          {error && (
            <button
              type="button"
              onClick={loadProducts}
              className="shrink-0 font-semibold underline underline-offset-2"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {productList}
    </section>
  );
}

export default ProductsPage;
