import { ArrowRight, Boxes, CircleAlert, Package, Plus, Wallet } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import ProductContext from "../context/product-context";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function DashboardPage() {
  const { products, loading, error } = useContext(ProductContext);
  const stockUnits = products.reduce((total, product) => total + product.stock, 0);
  const inventoryValue = products.reduce((total, product) => total + product.price * product.stock, 0);
  const lowStockCount = products.filter((product) => product.stock < 5).length;
  const recentProducts = [...products]
    .sort((first, second) => new Date(second.created_at || 0) - new Date(first.created_at || 0))
    .slice(0, 5);

  const stats = [
    { label: "Products", value: products.length, icon: <Package size={19} /> },
    { label: "Units in stock", value: stockUnits, icon: <Boxes size={19} /> },
    { label: "Low stock items", value: lowStockCount, icon: <CircleAlert size={19} /> },
    { label: "Stock value", value: currency.format(inventoryValue), icon: <Wallet size={19} /> },
  ];

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Your workspace</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Inventory overview</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">A quick look at the products you are tracking.</p>
        </div>
        <Link to="/products/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
          <Plus size={18} /> Add product
        </Link>
      </div>

      {error && <p role="alert" className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon }) => (
          <article key={label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{icon}</span>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{loading ? "..." : value}</p>
          </article>
        ))}
      </div>

      <section className="mt-7 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Recently added</h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Your latest items in the catalog.</p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400">View all <ArrowRight size={15} /></Link>
        </div>

        {recentProducts.length ? (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentProducts.map((product) => (
              <li key={product.id}>
                <Link to={`/products/${product.id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50 dark:hover:bg-gray-800/60">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</span>
                    <span className="mt-1 block truncate text-xs text-gray-500 dark:text-gray-400">{product.category || "Uncategorized"}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{currency.format(product.price)}</span>
                    <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">{product.stock} in stock</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-12 text-center">
            <Package size={28} className="mx-auto text-gray-400" />
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{loading ? "Loading your catalog..." : "No products yet. Add one to get started."}</p>
            {!loading && <Link to="/products/new" className="mt-4 inline-flex text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400">Add your first product</Link>}
          </div>
        )}
      </section>
    </section>
  );
}

export default DashboardPage;
