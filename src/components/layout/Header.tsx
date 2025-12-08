import { Dumbbell, BarChart3, ClipboardList, Home, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const navItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/exercises", icon: Dumbbell, label: "Exercises" },
    { to: "/workout", icon: ClipboardList, label: "Log Workout" },
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
          <nav
            className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border px-4 py-2 z-50"
            style={{
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingLeft: "env(safe-area-inset-left)",
              paddingRight: "env(safe-area-inset-right)",
            }}
          >
            <div className="flex justify-around">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground transition-all duration-200"
                  activeClassName="text-primary"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-xs font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
