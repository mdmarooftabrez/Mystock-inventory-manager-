import { useState } from "react";
import { Eye, Image as ImageIcon, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function ProductCard({ product, onDelete, deleting = false }) {
  const [failedImageUrl, setFailedImageUrl] = useState("");
  const inStock = product.stock > 0;
  const isLowStock = inStock && product.stock < 5;
  const imageIsAvailable = product.image && failedImageUrl !== product.image;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-900">
      <Link
        to={`/products/${product.id}`}
        title={`View ${product.name}`}
        className="relative block aspect-4/3 w-full overflow-hidden bg-gray-50 dark:bg-gray-800"
      >
        {imageIsAvailable ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-300"
            onError={() => setFailedImageUrl(product.image)}
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600">
            <ImageIcon size={44} strokeWidth={1.4} />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-2 min-h-5 truncate text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          {product.category || "Uncategorized"}
        </p>

        <Link
          to={`/products/${product.id}`}
          title={product.name}
          className="line-clamp-2 min-h-10 text-base font-semibold leading-5 text-gray-900 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-gray-100 dark:hover:text-emerald-400"
        >
          {product.name}
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-lg font-bold tabular-nums text-gray-950 dark:text-white">
            {currency.format(product.price)}
          </p>
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              !inStock
                ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                : isLowStock
                  ? "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                  : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                !inStock ? "bg-red-500" : isLowStock ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
            {!inStock ? "Out of stock" : isLowStock ? `Low stock · ${product.stock}` : `${product.stock} in stock`}
          </span>
        </div>

        <div className="mt-auto flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <Link
            to={`/products/${product.id}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          >
            <Eye size={16} />
            View details
          </Link>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            aria-label={deleting ? `Deleting ${product.name}` : `Delete ${product.name}`}
            className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-wait disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
