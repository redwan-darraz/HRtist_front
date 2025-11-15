import { Outlet } from "react-router-dom";
import { Users, Briefcase } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 font-semibold text-xl">
              <Briefcase className="h-6 w-6 text-primary" />
              <span>HRtist</span>
            </div>
            
            <nav className="flex gap-6">
              <NavLink
                to="/"
                end
                className="text-sm font-medium transition-colors hover:text-primary"
                activeClassName="text-primary"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Postes
                </div>
              </NavLink>
              <NavLink
                to="/candidates"
                className="text-sm font-medium transition-colors hover:text-primary"
                activeClassName="text-primary"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Candidats
                </div>
              </NavLink>
            </nav>
          </div>
          
          <ThemeToggle />
        </div>
      </header>
      
      <main className="container py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
