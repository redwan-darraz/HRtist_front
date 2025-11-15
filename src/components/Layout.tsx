import { Outlet, Link } from "react-router-dom";
import { Users, Briefcase } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";
import logoHrtistDark from "@/assets/logo-hrtist-dark.png";
import logoHrtistLight from "@/assets/logo-hrtist-light.png";

const Layout = () => {
  const { resolvedTheme } = useTheme();
  const logo = resolvedTheme === "dark" ? logoHrtistLight : logoHrtistDark;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl shadow-elegant supports-[backdrop-filter]:bg-card/70">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="HRtist - Your HR assistant" 
                className="h-12 w-auto transition-opacity hover:opacity-80"
              />
            </Link>
            
            <nav className="flex gap-8">
              <NavLink
                to="/postes"
                className="text-sm font-medium transition-all duration-200 hover:text-primary px-3 py-2 rounded-lg hover:bg-accent/50"
                activeClassName="text-primary bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Postes</span>
                </div>
              </NavLink>
              <NavLink
                to="/candidates"
                className="text-sm font-medium transition-all duration-200 hover:text-primary px-3 py-2 rounded-lg hover:bg-accent/50"
                activeClassName="text-primary bg-accent"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Candidats</span>
                </div>
              </NavLink>
            </nav>
          </div>
          
          <ThemeToggle />
        </div>
      </header>
      
      <main className="container py-10 px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
