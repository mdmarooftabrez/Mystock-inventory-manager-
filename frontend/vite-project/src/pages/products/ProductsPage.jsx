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
  const filteredProducts = products.filter((product) => {
    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    const category = product.category.toLowerCase();

    return (
      name.includes(query) ||
      description.includes(query) ||
      category.includes(query)
    );
  });

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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-52 animate-pulse rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 sm:h-64"
          />
        ))}
      </div>
    );
  } else if (error && products.length === 0) {
    productList = null;
  } else if (filteredProducts.length > 0) {
    productList = (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
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
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center dark:border-gray-700 dark:bg-gray-900 sm:px-5 sm:py-16">
        <Package size={30} className="mx-auto text-gray-400 dark:text-gray-500" />
        <h2 className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {search.trim() ? "No products match your search" : "No products in your inventory yet"}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {search.trim()
            ? "Try another product name, description, or category."
            : "Add a product to start tracking its price and stock level."}
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-3 flex items-start justify-between gap-2 sm:mb-6 sm:items-center sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Inventory
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage product details, prices, and stock levels.
          </p>
        </div>

        <Link
          to="/products/new"
          className="hidden min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 sm:inline-flex"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <label className="mb-3 flex min-h-11 items-center gap-2.5 rounded-lg border border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900 sm:mb-5 sm:gap-3 sm:px-3.5 sm:py-2.5">
        <Search size={17} className="text-gray-500 dark:text-gray-400" />
        <span className="sr-only">Search products</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by product name, description, or category..."
          className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </label>

      <div className="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-2.5 py-2 dark:border-gray-800 dark:bg-gray-900 sm:mb-5 sm:px-4 sm:py-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 sm:h-10 sm:w-10">
            <Package size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
            <p className="truncate text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
              {search.trim() ? "Products matching your search" : "Products in your inventory"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadProducts}
          disabled={loading}
          aria-label="Refresh products"
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-wait disabled:opacity-60 dark:text-gray-300 dark:hover:bg-gray-800 sm:px-3 sm:py-2"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {(error || actionError) && (
        <div
          className="mb-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:p-4"
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
