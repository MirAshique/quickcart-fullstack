import { useEffect, useState } from "react";
import API from "../../api/axios";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

const MAIN_CATEGORIES = {
  Electronics: {
    subCategories: {
      Laptops: ["Apple", "Dell", "HP", "Lenovo"],
      "Mobile Phones": ["Apple", "Samsung", "Xiaomi", "OnePlus"],
      Accessories: ["Logitech", "Anker", "Sony"]
    }
  }
};

const inputClass =
  "w-full px-4 py-2 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    mainCategory: "",
    subCategory: "",
    brand: "",
    stock: "",
    images: "",
    tags: ""
  });

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data.products || []);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: formData.images
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i !== ""),
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== "")
      };

      if (editingProduct) {
        await API.put(`/products/${editingProduct._id}`, payload);
        toast.success("Product updated");
      } else {
        await API.post("/products", payload);
        toast.success("Product created");
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.log(err);
      toast.error("Error saving product");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      images: product.images?.join(", ") || "",
      tags: product.tags?.join(", ") || ""
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      mainCategory: "",
      subCategory: "",
      brand: "",
      stock: "",
      images: "",
      tags: ""
    });
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const subCategories =
    MAIN_CATEGORIES[formData.mainCategory]?.subCategories || {};

  const brands = subCategories[formData.subCategory] || [];

  const previewImages = formData.images
    .split(",")
    .map((img) => img.trim())
    .filter((img) => img !== "");

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Products</h1>

        <button
          onClick={() => {
            resetForm();
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white hover:shadow-soft transition"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Brand</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-t dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.brand}</td>
                <td className="px-6 py-4">${product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => openEdit(product)}
                    className="text-blue-500"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl w-full max-w-2xl shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl font-bold">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputClass}
                required
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={inputClass}
                rows={3}
                required
              />

              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className={inputClass}
                required
              />

              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className={inputClass}
                required
              />

              <select
                value={formData.mainCategory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mainCategory: e.target.value,
                    subCategory: "",
                    brand: ""
                  })
                }
                className={inputClass}
                required
              >
                <option value="">Select Main Category</option>
                {Object.keys(MAIN_CATEGORIES).map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={formData.subCategory}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subCategory: e.target.value,
                    brand: ""
                  })
                }
                className={inputClass}
                required
              >
                <option value="">Select Sub Category</option>
                {Object.keys(subCategories).map((sub) => (
                  <option key={sub}>{sub}</option>
                ))}
              </select>

              <select
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className={inputClass}
                required
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand}>{brand}</option>
                ))}
              </select>

              <textarea
                placeholder="Paste image URLs separated by comma"
                value={formData.images}
                onChange={(e) =>
                  setFormData({ ...formData, images: e.target.value })
                }
                rows={3}
                className={inputClass}
              />

              {/* Live Preview */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {previewImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="preview"
                      className="h-20 w-full object-cover rounded-lg border"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/150?text=Invalid+URL")
                      }
                    />
                  ))}
                </div>
              )}

              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className={inputClass}
              />

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-primary text-white"
                >
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
