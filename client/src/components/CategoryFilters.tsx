import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Coffee, UtensilsCrossed, WineOff, Pizza, Beef, GlassWater, 
  MilkOff, Soup, Flame, Crosshair, Flower, ChefHat, Menu
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryFiltersProps {
  onCategorySelect: (category: string) => void;
}

interface CategoryItem {
  name: string;
  icon: React.ReactNode;
  gradient: string;
}

const CategoryFilters = ({ onCategorySelect }: CategoryFiltersProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All Recipes");
  const [expanded, setExpanded] = useState(false);

  const categoryItems: CategoryItem[] = [
    {
      name: "All Recipes",
      icon: <Menu size={22} />,
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      name: "North Indian",
      icon: <Flame size={22} />,
      gradient: "from-red-500 to-orange-500"
    },
    {
      name: "South Indian",
      icon: <Soup size={22} />,
      gradient: "from-green-500 to-teal-500"
    },
    {
      name: "Western Indian",
      icon: <Crosshair size={22} />,
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      name: "Coastal Indian",
      icon: <GlassWater size={22} />,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Street Food",
      icon: <Pizza size={22} />,
      gradient: "from-orange-500 to-amber-500"
    },
    {
      name: "Dessert",
      icon: <Coffee size={22} />,
      gradient: "from-pink-500 to-rose-500"
    },
    {
      name: "Vegetarian",
      icon: <Flower size={22} />,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Breakfast",
      icon: <Coffee size={22} />,
      gradient: "from-amber-500 to-yellow-500"
    },
    {
      name: "Main Course",
      icon: <UtensilsCrossed size={22} />,
      gradient: "from-gray-700 to-gray-900"
    },
    {
      name: "Snack",
      icon: <Beef size={22} />,
      gradient: "from-orange-400 to-amber-400"
    }
  ];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <section className="my-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="font-bold text-2xl text-[#343A40] mb-1">Browse Categories</h2>
          <p className="text-gray-500 text-sm">Explore recipes by regional cuisines and meal types</p>
        </div>
        <Button 
          onClick={toggleExpanded}
          variant="outline"
          size="sm"
          className="text-[#FF6B81] border-[#FF6B81] hover:bg-[#FFD1DC]/20"
        >
          {expanded ? "Show Less" : "Show All"}
        </Button>
      </div>

      {/* Mobile display (vertical grid for small screens) */}
      <div className={`md:hidden grid grid-cols-2 sm:grid-cols-3 gap-3 ${expanded ? '' : 'max-h-[270px] overflow-hidden'}`}>
        {categoryItems.map((category) => (
          <div
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={`
              relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300
              ${selectedCategory === category.name 
                ? 'ring-2 ring-[#FF6B81] shadow-md transform scale-[1.02]' 
                : 'hover:shadow-md hover:scale-[1.02]'}
            `}
          >
            <div className={`
              absolute inset-0 bg-gradient-to-br ${category.gradient} ${selectedCategory === category.name ? 'opacity-100' : 'opacity-80'}
            `}></div>
            <div className="relative p-4 flex flex-col items-center justify-center text-center h-24">
              <div className="text-white mb-2">{category.icon}</div>
              <span className="text-white font-medium text-sm">{category.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop display (horizontal scroll for larger screens) */}
      <div className="hidden md:block">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 pb-4">
            {categoryItems.map((category) => (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`
                  relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300
                  ${selectedCategory === category.name 
                    ? 'ring-2 ring-[#FF6B81] shadow-md transform scale-[1.02]' 
                    : 'hover:shadow-md hover:transform hover:scale-[1.02]'}
                `}
                style={{ minWidth: '140px' }}
              >
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${category.gradient} ${selectedCategory === category.name ? 'opacity-100' : 'opacity-80'}
                `}></div>
                <div className="relative p-4 flex flex-col items-center justify-center text-center h-24">
                  <div className="text-white mb-2">{category.icon}</div>
                  <span className="text-white font-medium text-sm">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default CategoryFilters;
