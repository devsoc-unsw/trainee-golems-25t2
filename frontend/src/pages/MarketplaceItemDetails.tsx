import React from "react";
import Sidebar from "../Components/Sidebar";
import DotGrid from "../Components/DotGrid";
import { useSidebar } from "../hooks/useSidebar";
import { useParams, useNavigate } from "react-router-dom";

// This interface should match the one in Marketplace.tsx
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

// For now, use mock data. Replace with API call later.
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

const MarketplaceItemDetails: React.FC = () => {
  const { collapsed } = useSidebar();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const item = MOCK_ITEMS.find((itm) => itm.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Item not found</div>
          <button
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-950 relative overflow-hidden transition-colors duration-300">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 min-h-screen h-full w-full opacity-60 z-0">
        <DotGrid
          dotSize={3}
          gap={24}
          baseColor="#312e81"
          activeColor="#6366f1"
          proximity={80}
        />
      </div>
      <div className="flex min-h-screen h-full">
        <Sidebar />
        <div className={`flex-1 min-h-screen h-full overflow-auto p-6 transition-all duration-300 relative z-10 ${collapsed ? "md:ml-20" : "md:ml-72"}`}>
          <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8 mt-8">
            <button
              className="mb-4 text-indigo-600 hover:underline text-sm"
              onClick={() => navigate(-1)}
            >
              ← Back to Marketplace
            </button>
            <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
            <div className="mb-4 text-gray-500 text-sm">Status: <span className={item.status === 'available' ? 'text-green-600' : 'text-gray-400'}>{item.status}</span></div>
            <div className="mb-6 text-lg text-gray-700 dark:text-gray-300">{item.description}</div>
            <div className="mb-6 text-2xl font-extrabold text-indigo-700 dark:text-indigo-300">${item.price}</div>
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 font-bold mr-1">
                {item.user.name.split(' ').map(n => n[0]).join('')}
              </span>
              <span className="font-medium">{item.user.name}</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>{item.user.email}</span>
            </div>
            {/* TODO: Show edit/delete buttons if user is seller */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceItemDetails;
