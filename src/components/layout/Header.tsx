import {
  Dumbbell,
  BarChart3,
  ClipboardList,
  Home,
  LogOut,
  Clock,
  Zap,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const navItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/exercises", icon: Dumbbell, label: "Exercises" },
    { to: "/programs", icon: Zap, label: "Programs" },
    // { to: "/workout", icon: ClipboardList, label: "Log Workout" },
    { to: "/history", icon: Clock, label: "History" },
    { to: "/progress", icon: BarChart3, label: "Progress" },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-7 bg-gradient-power rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />

              <img
                src="/assets/img/logo.jpg"
                alt="Iron-Log Logo"
                className="h-20 w-20 object-contain"
              />
            </div>
            <span className="font-display text-2xl tracking-wider text-gradient-power">
              IRONTRACK
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                activeClassName="text-primary bg-secondary glow-primary"
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="ml-4 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>

          {/* Mobile nav */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                    activeClassName="text-primary bg-secondary glow-primary"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium text-lg">{item.label}</span>
                  </NavLink>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-start gap-2 px-4 py-2 mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium text-lg">Logout</span>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
