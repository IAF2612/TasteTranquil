import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Utensils, Menu, ChefHat, Sparkles } from "lucide-react";

interface HeroProps {
  onSearch: (query: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of background images for carousel effect
  const backgroundImages = [
    "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1631515242808-497c3d4a6a71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  ];

  // Rotate backgrounds every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    onSearch(term);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl my-6 bg-[#343A40]">
      {/* Background image with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          opacity: 0.3
        }}
      />
      
      {/* Content gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B81]/80 to-[#7FB3D5]/80 mix-blend-multiply"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto py-12 px-6 md:py-16 md:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left column - Text content */}
          <div className="text-left">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4 mr-2 text-white" />
              <span className="text-sm text-white font-medium">TasteTranquil</span>
            </div>
            <h2 className="font-bold text-3xl md:text-5xl text-white mb-4 leading-tight">
              Discover <span className="text-[#FFD1DC]">Authentic</span> Indian Cuisine
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-md">
              Explore traditional Indian recipes crafted for your home kitchen. From regional delicacies to popular classics.
            </p>
            
            {/* Quick search tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Button 
                onClick={() => handleQuickSearch("curry")}
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                #Curry
              </Button>
              <Button 
                onClick={() => handleQuickSearch("vegetarian")}
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                #Vegetarian
              </Button>
              <Button 
                onClick={() => handleQuickSearch("dessert")}
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                #Dessert
              </Button>
              <Button 
                onClick={() => handleQuickSearch("south indian")}
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                #SouthIndian
              </Button>
            </div>
            
            {/* Info blocks */}
            <div className="grid grid-cols-3 gap-3 mt-6 mb-8 md:mb-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <Utensils className="h-5 w-5 mx-auto mb-1 text-white" />
                <p className="text-xs text-white/90">76 Recipes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <Menu className="h-5 w-5 mx-auto mb-1 text-white" />
                <p className="text-xs text-white/90">11 Categories</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <ChefHat className="h-5 w-5 mx-auto mb-1 text-white" />
                <p className="text-xs text-white/90">All Levels</p>
              </div>
            </div>
          </div>
          
          {/* Right column - Search */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
            <h3 className="font-semibold text-xl text-white mb-4">Find Your Perfect Recipe</h3>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                <Input
                  type="text"
                  placeholder="Search by recipe name or ingredient..."
                  className="w-full pl-10 py-6 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-2 focus:ring-white/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSearch(searchQuery);
                }}
                className="w-full bg-gradient-to-r from-[#FF6B81] to-[#FF8E9E] hover:from-[#FF8E9E] hover:to-[#FF6B81] text-white font-medium py-6 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
              >
                <Search className="h-4 w-4 mr-2" /> Search Recipes
              </Button>
              <p className="text-xs text-white/70 text-center">
                Try searching for "Butter Chicken", "Paneer", or "Biryani"
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
