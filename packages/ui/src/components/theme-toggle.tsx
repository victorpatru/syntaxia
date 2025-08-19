import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setThemeState] = useState<string>("system");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get stored theme or default to system
    const storedTheme = localStorage.getItem("theme") || "system";
    setThemeState(storedTheme);
    applyTheme(storedTheme);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      if (isOpen && !target.closest(".theme-toggle-container")) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme: string) {
    const root = document.documentElement;

    if (theme === "system") {
      const systemTheme = getSystemTheme();
      root.classList.toggle("light", systemTheme === "light");
    } else {
      root.classList.toggle("light", theme === "light");
    }
    // Dark mode is default, no class needed
  }

  function setTheme(newTheme: string) {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    setIsOpen(false); // Close dropdown after selection
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative inline-block theme-toggle-container">
      <button
        id="theme-toggle"
        type="button"
        aria-label="Toggle theme"
        className="font-mono text-xs bg-transparent border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber px-2 sm:px-3 py-1 transition-colors inline-flex items-center gap-1 relative h-8 w-8 sm:min-w-20"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <Sun className="h-3 w-3 rotate-0 scale-0 transition-all light:rotate-0 light:scale-100" />
        <Moon className="absolute h-3 w-3 rotate-0 scale-100 transition-all light:rotate-90 light:scale-0 left-2 sm:left-3" />
        <span className="sr-only">Toggle theme</span>
        <span className="ml-1 hidden sm:inline">theme</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 min-w-25 bg-terminal-dark border border-terminal-green/30 p-1 mt-0.5 font-mono shadow-lg">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className="flex items-center w-full px-3 py-2 text-xs bg-transparent border-0 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber cursor-pointer transition-colors text-left gap-2"
          >
            <Sun className="mr-2 h-3 w-3" />
            <span>light</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className="flex items-center w-full px-3 py-2 text-xs bg-transparent border-0 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber cursor-pointer transition-colors text-left gap-2"
          >
            <Moon className="mr-2 h-3 w-3" />
            <span>dark</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme("system")}
            className="flex items-center w-full px-3 py-2 text-xs bg-transparent border-0 text-terminal-green hover:bg-terminal-green/10 hover:text-terminal-amber cursor-pointer transition-colors text-left gap-2"
          >
            <Monitor className="mr-2 h-3 w-3" />
            <span>system</span>
          </button>
        </div>
      )}
    </div>
  );
}
