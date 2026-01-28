"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="primary-background sticky top-0 z-[999] px-2 py-3">
      <div className="flex items-center justify-between">
        <h1 className="font-[poppins] text-2xl font-black text-white uppercase italic">Scordo</h1>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="primary-btn h-8 w-8 rounded-full p-2"
          >
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <Button className="primary-btn h-8 w-8 rounded-full">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
