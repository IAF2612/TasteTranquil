import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import CategoryFilters from "@/components/CategoryFilters";
import RecipeList from "@/components/RecipeList";
import CustomPagination from "@/components/CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Recipes");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [
      "/api/recipes",
      searchQuery,
      selectedCategory,
      sortBy,
      currentPage,
    ],
    queryFn: async () => {
      // Build URL with query parameters
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedCategory && selectedCategory !== "All Recipes")
        params.append("category", selectedCategory);
      if (sortBy) params.append("sortBy", sortBy);
      if (currentPage) params.append("page", currentPage.toString());

      const res = await fetch(`/api/recipes?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch recipes");
      return res.json();
    },
  });

  const recipes = data?.recipes || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="container mx-auto pt-20 pb-10 px-4">
      <Hero onSearch={handleSearch} />

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 my-6">
        <CategoryFilters onCategorySelect={handleCategorySelect} />

        <div className="w-full md:w-64">
          <Select onValueChange={handleSortChange} defaultValue={sortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort recipes by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="time">Cooking Time (Shortest)</SelectItem>
              <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="h-60 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B81]"></div>
        </div>
      ) : recipes.length > 0 ? (
        <>
          <RecipeList
            title={
              searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory !== "All Recipes"
                  ? selectedCategory
                  : "All Recipes"
            }
            recipes={recipes}
          />

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <CustomPagination
                count={totalPages}
                page={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-bold text-[#343A40]">No recipes found</h2>
          <p className="mt-2 text-[#343A40]">
            {searchQuery
              ? `No recipes matching "${searchQuery}"`
              : selectedCategory !== "All Recipes"
                ? `No recipes in the "${selectedCategory}" category`
                : "No recipes available"}
          </p>
        </div>
      )}
    </main>
  );
};

export default Browse;
