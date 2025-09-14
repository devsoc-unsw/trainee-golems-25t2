import React, { useState } from "react";


interface MarketplaceItemFormProps {
  onSubmit: (item: { title: string; description: string; price: number }) => void;
  initialValues?: { title: string; description: string; price: number };
  isEdit?: boolean;
}

const MarketplaceItemForm: React.FC<MarketplaceItemFormProps> = ({ onSubmit, initialValues, isEdit }) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [price, setPrice] = useState(initialValues?.price?.toString() || "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price.trim()) {
      setError("All fields are required.");
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError("Price must be a positive number.");
      return;
    }
    setError("");
    onSubmit({ title, description, price: Number(price) });
    setTitle("");
    setDescription("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 flex flex-col gap-4 max-w-xl mx-auto mt-2 mb-10">
      <h2 className="text-xl font-bold mb-2">{isEdit ? "Edit Listing" : "Add New Product"}</h2>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <input
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        rows={3}
      />
      <input
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        min="1"
        step="0.01"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors mt-2"
      >
        {isEdit ? "Save Changes" : "Add Product"}
      </button>
    </form>
  );
};

export default MarketplaceItemForm;
