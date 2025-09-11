import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Coffee,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { CartItem } from "../CustomerApp";
import { API_BASE_URL } from "../../api";

// Define Book interface
interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  coverImage?: string;
  isPopular?: boolean;
  isNew?: boolean;
  isbn?: string;
  stock?: number;
  publishedYear?: number | string;
  publisher?: string;
  image?: string | null;
}

interface BookStorefrontProps {
  onAddToCart: (book: Omit<CartItem, "quantity">) => void;
}

export function BookStorefront({ onAddToCart }: BookStorefrontProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  // Fetch books
  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch(`${API_BASE_URL}/book/all`);
        if (response.ok) {
          const data = await response.json();
          setBooks(
            data.map((book: any) => ({
              id: book.isbn || book.id || "",
              title: book.title,
              author: book.author,
              category: book.genre || "Unknown",
              price: book.price,
              rating: book.rating || 0,
              description: book.description || "",
              coverImage: book.image || "",
              isPopular: false,
              isNew: false,
              isbn: book.isbn,
              stock: book.quantity,
              publishedYear: book.publishedYear || "",
              publisher: book.publisher || "",
              image: book.image || null,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    }

    fetchBooks();
  }, []);

  // Categories
  const categories = ["all", ...new Set(books.map((b) => b.category))];

  // Filtered books
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.isbn?.includes(searchTerm) ?? false);
    const matchesCategory =
      categoryFilter === "all" || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Toggle favorites
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  // Render stars
  const renderStars = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
      );
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-3 h-3 text-orange-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
    }
    return stars;
  };

  // Currency formatting
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("ZAR", "R");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-6 mb-8 border border-orange-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full">
            <Coffee className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-orange-800 mb-1">
              Welcome to Our Cozy Corner
            </h2>
            <p className="text-orange-700">
              Discover your next favorite book and let it wrap you in warmth
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 border-orange-100">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
                <Input
                  placeholder="Search for your next cozy read..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 border-orange-200 focus:border-orange-400"
                />
              </div>
            </div>
            <div className="min-w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-orange-200 focus:border-orange-400">
                  <Filter className="h-4 w-4 mr-2 text-orange-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Popular */}
        <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Sparkles className="w-5 h-5" />
              Popular This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {books
                .filter((book) => book.isPopular)
                .slice(0, 3)
                .map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <div className="w-12 h-16 bg-orange-200 rounded flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-orange-800 text-sm">
                        {book.title}
                      </p>
                      <p className="text-xs text-orange-600">{book.author}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(book.rating)}
                        <span className="text-xs text-orange-600 ml-1">
                          {book.rating}
                        </span>
                      </div>
                    </div>
                    <p className="font-semibold text-orange-800">
                      {formatCurrency(book.price)}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* New Arrivals */}
        <Card className="border-orange-100 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Sparkles className="w-5 h-5" />
              New Arrivals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {books
                .filter((book) => book.isNew)
                .slice(0, 3)
                .map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <div className="w-12 h-16 bg-yellow-200 rounded flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-orange-800 text-sm">
                        {book.title}
                      </p>
                      <p className="text-xs text-orange-600">{book.author}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(book.rating)}
                        <span className="text-xs text-orange-600 ml-1">
                          {book.rating}
                        </span>
                      </div>
                    </div>
                    <p className="font-semibold text-orange-800">
                      {formatCurrency(book.price)}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <Card
            key={book.id}
            className="overflow-hidden border-orange-100 hover:shadow-lg transition-shadow bg-gradient-to-b from-white to-orange-25"
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-orange-100 to-amber-100 relative">
              <ImageWithFallback
                src={book.coverImage || "/api/placeholder/200/267"}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {book.isPopular && (
                  <Badge className="bg-orange-500 text-white text-xs">
                    Popular
                  </Badge>
                )}
                {book.isNew && (
                  <Badge className="bg-green-500 text-white text-xs">New</Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFavorite(book.id)}
                className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 border-orange-200 hover:bg-white"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.includes(book.id)
                      ? "fill-red-500 text-red-500"
                      : "text-orange-400"
                  }`}
                />
              </Button>
            </div>

            <CardHeader className="pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base line-clamp-2 text-orange-800">
                  {book.title}
                </CardTitle>
                <p className="text-sm text-orange-600">{book.author}</p>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {renderStars(book.rating)}
                    <span className="text-sm text-orange-600 ml-1">
                      ({book.rating})
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-orange-200 text-orange-600"
                  >
                    {book.category}
                  </Badge>
                </div>

                <p className="text-sm text-orange-700 line-clamp-2">
                  {book.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xl font-bold text-orange-800">
                    {formatCurrency(book.price)}
                  </p>
                  <Button
                    onClick={() =>
                      onAddToCart({
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        price: book.price,
                        coverImage: book.coverImage,
                      })
                    }
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <Card className="border-orange-100">
          <CardContent className="text-center py-12">
            <Coffee className="h-12 w-12 mx-auto text-orange-300 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-orange-800">
              No books found
            </h3>
            <p className="text-orange-600">
              Try adjusting your search or browse our cozy collection.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
