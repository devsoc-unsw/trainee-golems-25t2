import React, { useState } from "react";
import MarketplaceItemForm from "../Components/MarketplaceItemForm";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import DotGrid from "../Components/DotGrid";
import { useSidebar } from "../hooks/useSidebar";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  user: {
    name: string;
    email: string;
  };
}
const MOCK_ITEMS: MarketplaceItem[] = [
  {
    id: "1",
    title: "Used Textbook: Calculus 101",
    description: "A well-kept calculus textbook, perfect for first-year students.",
    price: 25,
    status: "available",
    user: { name: "Alice Smith", email: "alice@example.com" },
  },
  {
    id: "2",
    title: "Dorm Mini Fridge",
    description: "Compact fridge, works great, ideal for dorm rooms.",
    price: 60,
    status: "available",
    user: { name: "Bob Lee", email: "bob@example.com" },
  },
  {
    id: "3",
    title: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness.",
    price: 15,
    status: "sold",
    user: { name: "Carol Tan", email: "carol@example.com" },
  },
];

const Marketplace: React.FC = () => {
  const { collapsed } = useSidebar();
  const [items, setItems] = useState<MarketplaceItem[]>(MOCK_ITEMS);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MarketplaceItem | null>(null);
  const navigate = useNavigate();
  // Simulate current user
  const CURRENT_USER_EMAIL = "hello@example.com";
  const CURRENT_USER_NAME = "My Email";
  const recommended = items.filter(item => item.user.email !== CURRENT_USER_EMAIL);
  const myListings = items.filter(item => item.user.email === CURRENT_USER_EMAIL);

  const handleAddOrEditProduct = (item: { title: string; description: string; price: number }) => {
    if (editItem) {
      // Edit mode: update the item
      setItems(prev => prev.map(i =>
        i.id === editItem.id
          ? { ...i, title: item.title, description: item.description, price: item.price }
          : i
      ));
    } else {
      // Add mode: add new item
      setItems(prev => [
        ...prev,
        {
          id: (prev.length + 1).toString(),
          title: item.title,
          description: item.description,
          price: item.price,
          status: "available",
          user: { name: CURRENT_USER_NAME, email: CURRENT_USER_EMAIL },
        },
      ]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-950 relative overflow-hidden transition-colors duration-300">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 min-h-screen h-full w-full opacity-60 z-0">
        <DotGrid
          dotSize={3}
          gap={24}
          baseColor="#312e81"  // darker indigo-900
          activeColor="#6366f1"
          proximity={80}
        />
      </div>
      <div className="flex min-h-screen h-full">
        {/* Sidebar Component */}
        <Sidebar />
        {/* Main Content Area */}
        <div
          className={`flex-1 min-h-screen h-full overflow-auto p-6 transition-all duration-300 relative z-10 ${
            collapsed ? "md:ml-20" : "md:ml-72"
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
            {/* Recommended Products */}
            <h2 className="text-lg font-semibold mb-3 mt-2">Recommended Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {recommended.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 dark:text-gray-500 py-12">
                  No recommended products found.
                </div>
              ) : (
                recommended.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 flex flex-col transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl border border-transparent hover:border-indigo-300 dark:hover:border-indigo-700 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 truncate max-w-[70%]">{item.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${item.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>{item.status === 'available' ? 'Available' : 'Sold'}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">{item.description}</p>
                    <div className="flex items-center justify-between mt-auto mb-3">
                      <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300">${item.price}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 font-bold mr-1">
                        {item.user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                      <span className="font-medium">{item.user.name}</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span>{item.user.email}</span>
                    </div>
                    <button
                      className="mt-auto w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-colors"
                      disabled={item.status !== 'available'}
                      onClick={() => navigate(`/marketplace/${item.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>
            {/* My Listings */}
            <div className="flex items-center justify-between mt-10 mb-3">
              <h2 className="text-lg font-semibold">Your Listings</h2>
                <button
                  className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  onClick={() => { setShowForm(true); setEditItem(null); }}
                >
                  Add Listing
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
            {/* Modal for Add Product Form */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-0 max-w-xl w-full relative animate-fadein">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold focus:outline-none"
                    onClick={() => { setShowForm(false); setEditItem(null); }}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <MarketplaceItemForm
                    onSubmit={handleAddOrEditProduct}
                    initialValues={editItem ? { title: editItem.title, description: editItem.description, price: editItem.price } : undefined}
                    isEdit={!!editItem}
                  />
                </div>
              </div>
            )}
              {myListings.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 dark:text-gray-500 py-12">
                  You have no listings yet.
                </div>
              ) : (
                myListings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 flex flex-col border border-transparent group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 truncate max-w-[70%]">{item.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 ${item.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>{item.status === 'available' ? 'Available' : 'Sold'}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">{item.description}</p>
                    <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-3">${item.price}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 font-bold mr-1">
                        {item.user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                      <span className="font-medium">{item.user.name}</span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span>{item.user.email}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="py-2 px-4 rounded-lg bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-colors"
                        onClick={() => { setEditItem(item); setShowForm(true); }}
                      >
                        Edit
                      </button>
                      <button
                        className="py-2 px-4 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this listing?')) {
                            setItems(prev => prev.filter(i => i.id !== item.id));
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
