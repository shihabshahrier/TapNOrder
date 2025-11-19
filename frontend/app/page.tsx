import Link from "next/link";
import { ArrowRight, ChefHat } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
      <div className="bg-black text-white p-4 rounded-full mb-6">
        <ChefHat size={48} />
      </div>

      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        Kacchi King
      </h1>

      <p className="text-gray-500 mb-8 max-w-md text-lg">
        Experience the best Kacchi Biryani in town. Order directly through WhatsApp for quick delivery.
      </p>

      <Link
        href="/menu"
        className="bg-black text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95"
      >
        View Menu
        <ArrowRight size={20} />
      </Link>
    </div>
  );
}
