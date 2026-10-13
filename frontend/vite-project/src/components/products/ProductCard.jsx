import { Eye, Image as ImageIcon, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function ProductCard({ product, onDelete, deleting = false }) {
  const inStock = product.stock > 0;

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <Link
        to={`/products/${product.id}`}
        className="block overflow-hidden rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-800"
        aria-label={`View ${product.name}`}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="flex h-44 items-center justify-center text-gray-400 dark:text-gray-500">
            <ImageIcon size={34} strokeWidth={1.4} />
          </span>
        )}
      </Link>

      <div className="px-1 pb-1 pt-3">
        {product.category && (
          <p className="mb-1 truncate text-xs font-medium text-emerald-700 dark:text-emerald-400">
            {product.category}
          </p>
        )}
        <Link
          to={`/products/${product.id}`}
          className="block truncate text-sm font-semibold text-gray-900 hover:text-emerald-700 dark:text-gray-100 dark:hover:text-emerald-400"
        >
          {product.name}
        </Link>

        <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          {currency.format(product.price)}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`}
          />
          <span
            className={`text-xs font-medium ${inStock ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {inStock ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-2 dark:border-gray-800">
          <Link
            to={`/products/${product.id}`}
            aria-label={`View ${product.name}`}
            title="View product"
            className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Eye size={16} />
          </Link>
          <button
            type="button"
            aria-label={`Delete ${product.name}`}
            title="Delete product"
            onClick={onDelete}
            disabled={deleting}
            className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
