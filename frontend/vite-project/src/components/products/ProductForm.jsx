import { useState } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";

function createInitialForm(product) {
  return {
    name: product?.name ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "",
    price: product?.price == null ? "" : String(product.price),
    stock: product?.stock == null ? "" : String(product.stock),
    imageUrl: product?.image ?? "",
    imageFile: null,
  };
}

function ProductForm({
  product,
  isSubmitting = false,
  submitError = "",
  submitLabel = "Create Product",
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(() => createInitialForm(product));
  const [previewUrl, setPreviewUrl] = useState(() => product?.image ?? "");
  const [previewError, setPreviewError] = useState(false);
  const [imageError, setImageError] = useState("");

  function updateField(event) {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));

    if (name === "imageUrl" && !formData.imageFile) {
      setPreviewUrl(value);
      setPreviewError(false);
      setImageError("");
    }
  }

  function updateImage(event) {
    const imageFile = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!imageFile) return;

    if (!imageFile.type.startsWith("image/")) {
      setImageError("Choose an image file, such as JPG, PNG, GIF, or WebP.");
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      setImageError("This image is larger than 5 MB. Choose a smaller image.");
      return;
    }

    setImageError("");
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setPreviewError(false);
    };
    reader.readAsDataURL(imageFile);

    setFormData((current) => ({ ...current, imageFile }));
  }

  function removeImageFile() {
    setFormData((current) => ({ ...current, imageFile: null }));
    setPreviewUrl(formData.imageUrl);
    setPreviewError(false);
    setImageError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const price = Number(formData.price);
    const stock = Number(formData.stock);

    const productData = new FormData();
    productData.append("name", formData.name.trim());
    productData.append("description", formData.description.trim());
    productData.append("category", formData.category.trim());
    productData.append("price", String(price));
    productData.append("stock", String(stock));
    productData.append("image_url", formData.imageUrl.trim());
    if (formData.imageFile) {
      productData.append("image", formData.imageFile);
    }

    onSubmit(productData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <section className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:mb-6 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-3 sm:mb-6 sm:gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Product details
            </p>
            <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
              {product ? "Update product details" : "Add a product"}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter the product name, price, and stock quantity. Add a description or image if useful.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
          <div className="md:col-span-2">
            <label
              htmlFor="productName"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mb-2"
            >
              Product name <span className="text-red-500">*</span>
            </label>
            <input
              id="productName"
              name="name"
              required
              maxLength={150}
              value={formData.name}
              onChange={updateField}
              placeholder="Example: Wireless headphones"
              autoComplete="off"
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-emerald-900"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="productDescription"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mb-2"
            >
              Description
            </label>
            <textarea
              id="productDescription"
              name="description"
              value={formData.description}
              onChange={updateField}
              rows={3}
              placeholder="Describe the product and its key features"
              className="w-full min-h-20 resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-emerald-900 sm:min-h-24"
            />
          </div>

          <div>
            <label
              htmlFor="productCategory"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mb-2"
            >
              Category
            </label>
            <input
              id="productCategory"
              name="category"
              maxLength={100}
              value={formData.category}
              onChange={updateField}
              placeholder="Example: Electronics"
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-emerald-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="productPrice"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mb-2"
              >
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  id="productPrice"
                  name="price"
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  max="99999999.99"
                  value={formData.price}
                  onChange={updateField}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-8 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-emerald-900"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="productStock"
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mb-2"
              >
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                id="productStock"
                name="stock"
                type="number"
                required
                min="0"
                max="2147483647"
                step="1"
                value={formData.stock}
                onChange={updateField}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-emerald-900"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="productImageUrl"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mb-2"
            >
              Image URL <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              id="productImageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={updateField}
              placeholder="https://example.com/product-image.jpg"
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-emerald-900"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="productImageFile"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300 sm:mb-2"
            >
              Or upload an image <span className="font-normal text-gray-400">(optional, max 5 MB)</span>
            </label>
            <div className="flex flex-row items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/60 sm:gap-4 sm:p-4">
              {previewUrl && !previewError ? (
                <img
                  src={previewUrl}
                  alt="Product preview"
                  className="h-16 w-16 shrink-0 rounded-md bg-white object-contain sm:h-24 sm:w-28"
                  onError={() => setPreviewError(true)}
                  onLoad={() => setPreviewError(false)}
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 sm:h-24 sm:w-28">
                  <ImagePlus size={24} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="productImageFile"
                  className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus-within:ring-2 focus-within:ring-emerald-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <UploadCloud size={17} />
                  Choose image
                  <input
                    id="productImageFile"
                    type="file"
                    accept="image/*"
                    onChange={updateImage}
                    className="sr-only"
                  />
                </label>
                <div className="mt-1 min-w-0">
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {formData.imageFile?.name || "PNG, JPG, GIF, or WebP"}
                  </p>
                  {previewError && (
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                      Preview unavailable. Check the image URL or choose another image.
                    </p>
                  )}
                  {imageError && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                      {imageError}
                    </p>
                  )}
                  {formData.imageFile && (
                    <button
                      type="button"
                      onClick={removeImageFile}
                      className="mt-1 text-xs font-medium text-red-600 underline underline-offset-2 dark:text-red-400"
                    >
                      Remove uploaded file
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {submitError && (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300" role="alert">
            {submitError}
          </p>
        )}

        <div className="mt-4 flex border-t border-gray-100 pt-4 dark:border-gray-800 sm:mt-6 sm:justify-end sm:gap-3 sm:pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="hidden min-h-11 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 sm:inline-flex"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 w-full rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-5 sm:py-2.5"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </section>
    </form>
  );
}

export default ProductForm;
