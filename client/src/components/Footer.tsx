import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically make an API call to subscribe the user
    toast({
      title: "Subscribed!",
      description: "You've been subscribed to our newsletter.",
    });
    
    setEmail("");
  };

  return (
    <footer className="bg-[#ADD8E6] bg-opacity-20 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg text-[#343A40] mb-4">TasteTranquil</h3>
            <p className="text-[#343A40] text-sm mb-4">
              Discover authentic Indian recipes and find culinary inspiration with our personalized recipe suggestions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#FF6B81] hover:text-[#7FB3D5] transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-[#FF6B81] hover:text-[#7FB3D5] transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-[#FF6B81] hover:text-[#7FB3D5] transition">
                <i className="fab fa-pinterest"></i>
              </a>
              <a href="#" className="text-[#FF6B81] hover:text-[#7FB3D5] transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-[#343A40] mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><a href="/browse" className="text-[#343A40] hover:text-[#FF6B81] transition">Categories</a></li>
              <li><a href="/browse" className="text-[#343A40] hover:text-[#FF6B81] transition">Popular Recipes</a></li>
              <li><a href="/browse" className="text-[#343A40] hover:text-[#FF6B81] transition">Latest Additions</a></li>
              <li><a href="/browse" className="text-[#343A40] hover:text-[#FF6B81] transition">Regional Cuisine</a></li>
              <li><a href="/browse" className="text-[#343A40] hover:text-[#FF6B81] transition">Festival Specials</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-[#343A40] mb-4">Learn</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#343A40] hover:text-[#FF6B81] transition">Cooking Techniques</a></li>
              <li><a href="#" className="text-[#343A40] hover:text-[#FF6B81] transition">Indian Spices Guide</a></li>
              <li><a href="#" className="text-[#343A40] hover:text-[#FF6B81] transition">Kitchen Tips</a></li>
              <li><a href="#" className="text-[#343A40] hover:text-[#FF6B81] transition">Menu Planning</a></li>
              <li><a href="#" className="text-[#343A40] hover:text-[#FF6B81] transition">Seasonal Cooking</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-[#343A40] mb-4">Join Our Community</h3>
            <p className="text-[#343A40] text-sm mb-3">
              Subscribe to our newsletter for new recipes and cooking tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <Input
                type="email"
                placeholder="Your email address"
                className="px-3 py-2 rounded-l-full border-0 flex-grow focus:ring-2 focus:ring-[#FF6B81]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                type="submit"
                className="bg-[#FF6B81] hover:bg-[#FFD1DC] text-white py-2 px-4 rounded-r-full font-medium transition"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-[#343A40]">
          <p>&copy; {new Date().getFullYear()} TasteTranquil. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
