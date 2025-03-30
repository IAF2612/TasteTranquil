import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logoutMutation } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/Browse" },
    { name: "Favorites", path: "/Favorites" },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navigateTo = (path: string) => {
    if (location !== path) {
      navigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-28">
      <div className="container flex h-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.path}
                    onClick={() => {
                      navigateTo(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`cursor-pointer ${
                      location === item.path
                        ? "text-foreground"
                        : "text-foreground/60"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigateTo("/")}
          >
            <img
              src="/assets/logo.png"
              alt="TasteTranquil Logo"
              className="h-24 w-auto pl-24"
            />
            <span className="text-lg font-bold">
              <span className="text-[#86C9E5]">Taste</span>
              <span className="text-[#FF7474]">Tranquil</span>
            </span>
          </div>
        </div>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <a
                  onClick={() => navigateTo(item.path)}
                  className={`cursor-pointer ${
                    location === item.path
                      ? "text-foreground"
                      : "text-foreground/60"
                  }`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {!isLoading && !user && (
            <Button
              variant="ghost"
              onClick={() => navigateTo("/auth")}
              className="text-[#8B7355] hover:text-[#6F5B3E] font-medium transition-colors" // Added class for button style
            >
              Sign In
            </Button>
          )}
          {!isLoading && user && (
            <Button variant="ghost" onClick={handleLogout}>
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
