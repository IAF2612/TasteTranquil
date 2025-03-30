import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import Favorites from "@/pages/Favorites";
import RecipeView from "@/pages/RecipeView";
import AuthPage from "@/pages/auth-page";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF6F8]">
      <Header />
      <div className="flex-grow pt-28">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/browse" component={Browse} />
          <ProtectedRoute path="/favorites" component={Favorites} />
          <Route path="/recipe/:id" component={RecipeView} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
