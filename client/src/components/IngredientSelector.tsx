import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Flame, Sprout, Flower, Circle, 
  Snowflake, Leaf, Cookie, CircleOff, CircleDashed, CircleDot, 
  Carrot, Egg, Bean, Drumstick, Square, Droplet, 
  Fish, Droplets, Triangle, PanelTop, X, SearchIcon
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Ingredient } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IngredientSelectorProps {
  onSuggestRecipes: (selectedIngredients: string[]) => void;
}

const IngredientSelector = ({ onSuggestRecipes }: IngredientSelectorProps) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: ingredients, isLoading } = useQuery<Ingredient[]>({
    queryKey: ["/api/ingredients"],
  });

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(ingredient)) {
        return prev.filter((item) => item !== ingredient);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  const handleSuggestClick = () => {
    const logo = document.querySelector('.logo-image') as HTMLElement;
    if (logo) {
      logo.style.transform = 'rotate(360deg) scale(1.2)';
      logo.style.transition = 'all 0.5s ease-in-out';
      setTimeout(() => {
        logo.style.transform = 'rotate(0) scale(1)';
        onSuggestRecipes(selectedIngredients);
      }, 500);
    } else {
      onSuggestRecipes(selectedIngredients);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) => prev.filter(item => item !== ingredient));
  };

  const handleClearAll = () => {
    setSelectedIngredients([]);
  };

  const renderIngredientIcon = (iconName?: string, category?: string) => {
    if (!iconName) return null;

    const iconColor = category === 'Spices' ? 'text-[#FF6B81]' : 
                     category === 'Proteins & Dairy' ? 'text-[#E67E22]' : 
                     'text-[#7FB3D5]';

    const iconProps = {
      size: 18,
      className: `${iconColor} mr-2`
    };

    switch (iconName) {
      case 'PepperHot': return <Flame {...iconProps} />;
      case 'Sprout': return <Sprout {...iconProps} />;
      case 'Flower2': return <Flower {...iconProps} />;
      case 'Flame': return <Flame {...iconProps} />;
      case 'Cherry': return <Cookie {...iconProps} />;
      case 'Sparkles': return <Sparkles {...iconProps} />;
      case 'Dot': return <Circle {...iconProps} />;
      case 'Snowflake': return <Snowflake {...iconProps} />;
      case 'Leaf': return <Leaf {...iconProps} />;
      case 'Nut': return <Cookie {...iconProps} />;
      case 'CircleOff': return <CircleOff {...iconProps} />;
      case 'CircleDashed': return <CircleDashed {...iconProps} />;
      case 'CircleDot': return <CircleDot {...iconProps} />;
      case 'Carrot': return <Carrot {...iconProps} />;
      case 'Egg': return <Egg {...iconProps} />;
      case 'Bean': return <Bean {...iconProps} />;
      case 'Pickle': return <Triangle {...iconProps} />;
      case 'Citrus': return <Circle {...iconProps} />;
      case 'Drumstick': return <Drumstick {...iconProps} />;
      case 'Square': return <Square {...iconProps} />;
      case 'Milk': return <Droplet {...iconProps} />;
      case 'Beef': return <PanelTop {...iconProps} />;
      case 'Fish': return <Fish {...iconProps} />;
      case 'Droplets': return <Droplets {...iconProps} />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="my-10 bg-white p-6 rounded-xl shadow-md flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B81]"></div>
      </div>
    );
  }

  if (!ingredients || ingredients.length === 0) {
    return <div className="my-10 bg-white p-6 rounded-xl shadow-md">No ingredients found.</div>;
  }

  const spices = ingredients.filter(ing => ing.category === 'Spices');
  const vegetables = ingredients.filter(ing => ing.category === 'Vegetables & Fruits');
  const proteins = ingredients.filter(ing => ing.category === 'Proteins & Dairy');

  const filteredIngredients = ingredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      activeTab === "all" || 
      (activeTab === "spices" && ing.category === "Spices") ||
      (activeTab === "vegetables" && ing.category === "Vegetables & Fruits") ||
      (activeTab === "proteins" && ing.category === "Proteins & Dairy");

    return matchesSearch && matchesCategory;
  });

  const getIngredientBgColor = (category: string) => {
    switch(category) {
      case 'Spices': return 'bg-red-50 hover:bg-red-100';
      case 'Vegetables & Fruits': return 'bg-blue-50 hover:bg-blue-100';
      case 'Proteins & Dairy': return 'bg-amber-50 hover:bg-amber-100';
      default: return 'bg-gray-50 hover:bg-gray-100';
    }
  };

  const getIngredientTextColor = (category: string) => {
    switch(category) {
      case 'Spices': return 'text-[#FF6B81]';
      case 'Vegetables & Fruits': return 'text-[#7FB3D5]';
      case 'Proteins & Dairy': return 'text-[#E67E22]';
      default: return 'text-gray-700';
    }
  };

  const getBadgeVariant = (category: string) => {
    const ingredient = ingredients.find(ing => ing.name === category);
    if (!ingredient) return "default";

    switch(ingredient.category) {
      case 'Spices': return "destructive";
      case 'Vegetables & Fruits': return "secondary";
      case 'Proteins & Dairy': return "outline";
      default: return "default";
    }
  };

  return (
    <section className="my-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="font-bold text-2xl text-[#343A40] mb-2">
            <span className="text-[#FF6B81]">What's in your kitchen?</span>
          </h2>
          <p className="text-gray-600">Select ingredients you have for personalized recipe suggestions</p>
        </div>
        <Button 
          onClick={(e) => {
            e.preventDefault();
            handleSuggestClick(e);
          }}
          disabled={selectedIngredients.length === 0}
          className="mt-4 md:mt-0 bg-gradient-to-r from-[#FF6B81] to-[#FF8E9E] hover:from-[#FF8E9E] hover:to-[#FF6B81] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          <Sparkles className="mr-2 h-4 w-4" /> 
          {selectedIngredients.length > 0 
            ? `Suggest Recipes (${selectedIngredients.length})` 
            : "Suggest Recipes"}
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300 focus:border-[#FF6B81] focus:ring focus:ring-[#FFD1DC] focus:ring-opacity-50"
          />
        </div>

        {selectedIngredients.length > 0 && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Selected Ingredients</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearAll}
                className="text-xs h-6 text-gray-500 hover:text-[#FF6B81]"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient) => (
                <Badge 
                  key={ingredient} 
                  variant={getBadgeVariant(ingredient)}
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {renderIngredientIcon(
                    ingredients.find(ing => ing.name === ingredient)?.icon,
                    ingredients.find(ing => ing.name === ingredient)?.category
                  )}
                  {ingredient}
                  <X 
                    size={14} 
                    className="ml-1 cursor-pointer" 
                    onClick={() => handleRemoveIngredient(ingredient)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full mb-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="all" 
            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="spices" 
            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#FF6B81] rounded-md"
          >
            Spices
          </TabsTrigger>
          <TabsTrigger 
            value="vegetables" 
            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#7FB3D5] rounded-md"
          >
            Vegetables
          </TabsTrigger>
          <TabsTrigger 
            value="proteins" 
            className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#E67E22] rounded-md"
          >
            Proteins
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[320px] rounded-md border p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredIngredients.map((ingredient) => (
              <div 
                key={ingredient.id}
                onClick={() => handleIngredientToggle(ingredient.name)}
                className={`
                  ${getIngredientBgColor(ingredient.category)}
                  ${selectedIngredients.includes(ingredient.name) ? 'ring-2 ring-offset-1' : ''}
                  ${selectedIngredients.includes(ingredient.name) && ingredient.category === 'Spices' ? 'ring-[#FF6B81]' : ''}
                  ${selectedIngredients.includes(ingredient.name) && ingredient.category === 'Vegetables & Fruits' ? 'ring-[#7FB3D5]' : ''}
                  ${selectedIngredients.includes(ingredient.name) && ingredient.category === 'Proteins & Dairy' ? 'ring-[#E67E22]' : ''}
                  p-3 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105
                `}
              >
                <div className="flex items-center">
                  {renderIngredientIcon(ingredient.icon, ingredient.category)}
                  <span className={`${getIngredientTextColor(ingredient.category)} font-medium`}>
                    {ingredient.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredIngredients.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <SearchIcon size={24} className="mb-2" />
              <p>No ingredients found matching "{searchQuery}"</p>
            </div>
          )}
        </ScrollArea>
      </Tabs>
    </section>
  );
};

export default IngredientSelector;