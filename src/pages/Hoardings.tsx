import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, SlidersHorizontal, ArrowDownAZ, Settings, User } from "lucide-react";
import { fetchHoardings, fetchRegions, fetchTypes, type Hoarding } from "@/data/hoardings";
import { useAuth } from "@/contexts/AuthContext";
import { HoardingCard } from "@/components/HoardingCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatINR } from "@/utils/currency";
import { useNavigate } from "react-router-dom";

export const Hoardings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hoardings, setHoardings] = useState<Hoarding[]>([]);
  const [regions, setRegions] = useState<string[]>(["All"]);
  const [types, setTypes] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [hoardingsData, regionsData, typesData] = await Promise.all([
          fetchHoardings(),
          fetchRegions(),
          fetchTypes()
        ]);

        setHoardings(hoardingsData);
        setRegions(["All", ...regionsData]);
        setTypes(["All", ...typesData]);
      } catch (error) {
        console.error("Failed to load hoardings data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Listen for hoarding creation events
    const handleHoardingCreated = () => {
      console.log('New hoarding created, refreshing data...');
      loadData();
    };

    window.addEventListener('hoardingCreated', handleHoardingCreated);

    return () => {
      window.removeEventListener('hoardingCreated', handleHoardingCreated);
    };
  }, []);

  // Filter and sort active hoardings
  const filteredHoardings = useMemo(() => {
    let result = hoardings.filter((h) => {
      const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === "All" || h.region === selectedRegion;
      const matchesType = selectedType === "All" || h.type === selectedType;
      const matchesPrice = h.price <= maxPrice;

      return matchesSearch && matchesRegion && matchesType && matchesPrice;
    });

    // Apply sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedRegion, selectedType, maxPrice, sortBy, hoardings]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRegion("All");
    setSelectedType("All");
    setMaxPrice(100000);
    setSortBy("featured");
  };

  const activeFilterCount = (selectedRegion !== "All" ? 1 : 0) +
    (selectedType !== "All" ? 1 : 0) +
    (maxPrice < 100000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-kaki-black pt-32 pb-20">
      <div className="container-custom">
        {/* Auth Button for Providers/Advertisers */}
        <div className="flex justify-end mb-8">
          {!isAuthenticated ? (
            <Button
              onClick={() => navigate("/login")}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 shadow-lg shadow-purple-500/20 group"
            >
              Sign In / Sign Up
              <User className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-600/10 rounded-full px-6 flex items-center gap-2 hover:border-purple-400 transition-all"
            >
              <User className="w-4 h-4 text-purple-400" />
              My Dashboard
            </Button>
          )}
        </div>

        {/* Header */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-kaki-grey mb-6 text-center">
              Discover Premium <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Advertising Spaces</span>
            </h1>
            <p className="text-kaki-grey text-lg md:text-xl text-center max-w-3xl mx-auto">
              Browse our curated collection of high-impact billboards, digital displays, and wallscapes to maximize your brand's reach.
            </p>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-kaki-dark-grey/50 border border-white/10 rounded-2xl p-4 md:p-6 mb-12 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          {/* Decorative background for the filter bar */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-purple-600/10 transition-colors duration-500"></div>

          <div className="relative space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Search - Takes 5 columns on desktop */}
              <div className="lg:col-span-5">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="text-kaki-grey w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                  <Input
                    placeholder="Search premium locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 bg-black/60 border-white/5 text-white placeholder:text-kaki-grey/50 h-12 rounded-xl focus:border-purple-500/50 transition-all text-base"
                  />
                </div>
              </div>

              {/* Region & Type Grid - Takes 4 columns on desktop */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                <Select value={selectedRegion} onValueChange={(value: string) => setSelectedRegion(value)}>
                  <SelectTrigger className="bg-black/60 border-white/5 text-white h-12 rounded-xl focus:ring-purple-500/30">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <SelectValue placeholder="Region" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-kaki-dark-grey border-white/10">
                    {regions.map((r) => (
                      <SelectItem key={r} value={r} className="focus:bg-purple-900/40 focus:text-white py-2">{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={(value: string) => setSelectedType(value)}>
                  <SelectTrigger className="bg-black/60 border-white/5 text-white h-12 rounded-xl focus:ring-purple-500/30">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-kaki-dark-grey border-white/10">
                    {types.map((t) => (
                      <SelectItem key={t} value={t} className="focus:bg-purple-900/40 focus:text-white py-2">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort - Takes 3 columns on desktop */}
              <div className="lg:col-span-3">
                <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                  <SelectTrigger className="bg-black/60 border-white/5 text-white h-12 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ArrowDownAZ className="w-4 h-4 text-purple-400" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-kaki-dark-grey border-white/10 text-white">
                    <SelectItem value="featured" className="focus:bg-purple-900/40 focus:text-white py-2">Featured</SelectItem>
                    <SelectItem value="price-asc" className="focus:bg-purple-900/40 focus:text-white py-2">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc" className="focus:bg-purple-900/40 focus:text-white py-2">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Slider & Clear Filter Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2 border-t border-white/5 mt-2">
              <div className="flex items-center gap-6 w-full md:w-auto flex-1 max-w-2xl group/slider">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover/slider:bg-purple-500/20 transition-colors">
                    <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-white whitespace-nowrap">Price Range</span>
                </div>
                <div className="flex-1 px-2">
                  <Slider
                    value={[maxPrice]}
                    max={100000}
                    step={1000}
                    onValueChange={(val) => setMaxPrice(val[0])}
                    className="py-4"
                  />
                </div>
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg px-4 py-2 min-w-[120px] text-center">
                  <span className="text-sm font-bold text-purple-400">
                    ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Clear Filters Button */}
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                  className="w-full md:w-auto text-purple-400 hover:text-white hover:bg-white/5 h-12 px-6 rounded-xl border border-dashed border-purple-500/30 hover:border-solid transition-all"
                >
                  Reset all filters ({activeFilterCount})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-end">
          <p className="text-kaki-grey">
            {isLoading ? (
              <span>Loading spaces...</span>
            ) : (
              <span>Showing <span className="text-white font-medium">{filteredHoardings.length}</span> available spaces</span>
            )}
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={`skeleton-${i}`} className="h-96 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
            ))}
          </div>
        ) : filteredHoardings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHoardings.map((hoarding) => (
              <HoardingCard key={hoarding.id} hoarding={hoarding} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/5 rounded-2xl border border-white/5 border-dashed">
            <MapPin className="w-12 h-12 text-kaki-grey/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No spaces found</h3>
            <p className="text-kaki-grey max-w-sm mx-auto mb-6">
              We couldn't find any billboards matching your current filters. Try adjusting your search criteria.
            </p>
            <Button onClick={resetFilters} className="bg-purple-600 hover:bg-purple-700 text-white">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hoardings;
