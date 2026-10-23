import { ArrowRight, Boxes, CircleAlert, Package, Plus, Wallet } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import ProductContext from "../context/product-context";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function DashboardPage() {
  const { products, loading, error } = useContext(ProductContext);
  const totals = { units: 0, lowStock: 0, value: 0 };

  products.forEach((product) => {
    totals.units += product.stock;

    if (product.stock < 5) {
      totals.lowStock += 1;
    }

    totals.value += product.price * product.stock;
  });

  const recentProducts = [...products]
    .sort((first, second) => {
      const firstDate = new Date(first.created_at || 0);
      const secondDate = new Date(second.created_at || 0);
      return secondDate - firstDate;
    })
    .slice(0, 5);

  const stats = [
    { label: "Products", value: products.length, icon: <Package size={19} /> },
    { label: "Units in stock", value: totals.units, icon: <Boxes size={19} /> },
    { label: "Low stock items", value: totals.lowStock, icon: <CircleAlert size={19} /> },
    { label: "Stock value", value: currency.format(totals.value), icon: <Wallet size={19} /> },
  ];

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-start justify-between gap-2 sm:mb-7 sm:gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Inventory dashboard</p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">Inventory overview</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track your products, stock levels, and inventory value at a glance.</p>
        </div>
        <Link to="/products/new" className="hidden min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 sm:inline-flex">
          <Plus size={16} /> Add product
        </Link>
      </div>

      {error && <p role="alert" className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</p>}

      <div className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-4">
        {stats.map(({ label, value, icon }) => (
          <article key={label} className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 text-xs font-medium text-gray-500 dark:text-gray-400 sm:text-sm">{label}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 sm:h-9 sm:w-9">{icon}</span>
            </div>
            <p className="mt-2 break-words text-lg font-bold leading-tight text-gray-900 dark:text-white sm:mt-4 sm:text-2xl">{loading ? "..." : value}</p>
          </article>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 sm:mt-7">
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-800 sm:gap-3 sm:px-5 sm:py-4">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Recently added products</h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">The latest products added to your inventory.</p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400">View all <ArrowRight size={15} /></Link>
        </div>

        {recentProducts.length ? (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentProducts.map((product) => (
              <li key={product.id}>
                <Link to={`/products/${product.id}`} className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-gray-800/60 sm:gap-4 sm:px-5 sm:py-4">
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
          <div className="px-4 py-10 text-center sm:px-5 sm:py-12">
            <Package size={28} className="mx-auto text-gray-400" />
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{loading ? "Loading your products..." : "Your inventory is empty. Add a product to start tracking stock."}</p>
          </div>
        )}
      </section>
    </section>
  );
}

export default DashboardPage;
