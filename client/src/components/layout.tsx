import { Home, BookOpen, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage }: LayoutProps) {
  const [location] = useLocation();

  const isCurrentPage = (page: string) => {
    if (page === "home") return location === "/";
    if (page === "therapy") return location === "/therapy";
    if (page === "help") return location === "/help";
    return false;
  };

  return (
    <div className="max-w-md mx-auto bg-warm-beige min-h-screen relative">
      {children}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-6 py-4">
        <div className="flex justify-around items-center">
          <Link href="/">
            <Button
              variant="ghost"
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl ${
                isCurrentPage("home") ? "bg-soft-mint" : ""
              }`}
            >
              <Home className={`w-5 h-5 ${isCurrentPage("home") ? "text-gray-700" : "text-gray-400"}`} />
              <span className={`text-xs font-medium ${isCurrentPage("home") ? "text-gray-700" : "text-gray-400"}`}>
                Главная
              </span>
            </Button>
          </Link>

          <Link href="/therapy">
            <Button
              variant="ghost"
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl ${
                isCurrentPage("therapy") ? "bg-soft-mint" : ""
              }`}
            >
              <BookOpen className={`w-5 h-5 ${isCurrentPage("therapy") ? "text-gray-700" : "text-gray-400"}`} />
              <span className={`text-xs font-medium ${isCurrentPage("therapy") ? "text-gray-700" : "text-gray-400"}`}>
                Дневник
              </span>
            </Button>
          </Link>

          <Link href="/help">
            <Button
              variant="ghost"
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl ${
                isCurrentPage("help") ? "bg-soft-mint" : ""
              }`}
            >
              <Users className={`w-5 h-5 ${isCurrentPage("help") ? "text-gray-700" : "text-gray-400"}`} />
              <span className={`text-xs font-medium ${isCurrentPage("help") ? "text-gray-700" : "text-gray-400"}`}>
                Помощь
              </span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 p-2"
          >
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-xs font-medium text-gray-400">Профиль</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
