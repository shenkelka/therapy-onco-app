import { Home, BookOpen, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function Layout({ children, currentPage }: LayoutProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const isCurrentPage = (page: string) => {
    if (page === "home") return location === "/";
    if (page === "therapy") return location === "/therapy";
    if (page === "help") return location === "/help";
    return false;
  };

  const NavigationItem = ({ href, page, icon: Icon, label }: { 
    href: string; 
    page: string; 
    icon: any; 
    label: string; 
  }) => (
    <Link href={href}>
      <Button
        variant="ghost"
        className={`${
          isMobile 
            ? 'flex flex-col items-center space-y-1 p-2 rounded-xl' 
            : 'flex items-center space-x-3 w-full justify-start p-3 rounded-lg'
        } ${
          isCurrentPage(page) ? "bg-soft-mint text-gray-700" : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Icon className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'} ${isCurrentPage(page) ? "text-gray-700" : "text-gray-400"}`} />
        <span className={`${
          isMobile ? 'text-xs' : 'text-sm'
        } font-medium ${isCurrentPage(page) ? "text-gray-700" : "text-gray-400"}`}>
          {label}
        </span>
      </Button>
    </Link>
  );

  if (isMobile) {
    return (
      <div className="max-w-md mx-auto bg-warm-beige min-h-screen relative">
        {children}

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-6 py-4">
          <div className="flex justify-around items-center">
            <NavigationItem href="/" page="home" icon={Home} label="Главная" />
            <NavigationItem href="/therapy" page="therapy" icon={BookOpen} label="Дневник" />
            <NavigationItem href="/help" page="help" icon={Users} label="Помощь" />
            <Button variant="ghost" className="flex flex-col items-center space-y-1 p-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-medium text-gray-400">Профиль</span>
            </Button>
          </div>
        </nav>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full left-0 top-0 z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-soft-mint rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Therapy App</h1>
              <p className="text-sm text-gray-500">Онко-поддержка</p>
            </div>
          </div>

          <nav className="space-y-2">
            <NavigationItem href="/" page="home" icon={Home} label="Главная" />
            <NavigationItem href="/therapy" page="therapy" icon={BookOpen} label="Дневник терапии" />
            <NavigationItem href="/help" page="help" icon={Users} label="Взаимопомощь" />
            
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Button variant="ghost" className="flex items-center space-x-3 w-full justify-start p-3 rounded-lg text-gray-400 hover:text-gray-600">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Профиль</span>
              </Button>
            </div>
          </nav>
        </div>

        {/* Quick Stats */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-soft-mint to-soft-blue rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Сегодня</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Записей в дневнике</span>
                <span className="font-medium text-gray-800">3</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Помощь оказана</span>
                <span className="font-medium text-gray-800">2</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop Main Content */}
      <main className="flex-1 ml-64">
        <div className="max-w-6xl mx-auto bg-warm-beige min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}