import { Sparkles } from "lucide-react";
import { Button } from "./button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./navigation-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { TerminalUserMenu } from "./terminal-user-menu";
import { ThemeToggle } from "./theme-toggle";

// const navigationLinks = [{ href: "/interview", label: "~/start-interview" }];

interface DashboardHeaderProps {
  credits?: number;
}

export function DashboardHeader({ credits }: DashboardHeaderProps) {
  return (
    <header className="border-b border-terminal-green/30 bg-terminal-dark font-mono">
      <div className="mx-auto max-w-6xl px-6 flex h-14 md:h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden bg-transparent hover:bg-terminal-green/10 border border-terminal-green/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-amber/60"
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
                title="Toggle menu"
              >
                <svg
                  className="pointer-events-none text-terminal-green"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </PopoverTrigger>
            {/* <PopoverContent
              align="start"
              className="w-48 p-1 md:hidden bg-terminal-dark border-terminal-green/30 rounded-sm shadow-lg"
            >
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link) => (
                    <NavigationMenuItem key={link.href} className="w-full">
                      <NavigationMenuLink
                        href={link.href}
                        className="py-1.5 text-terminal-green/90 hover:text-terminal-amber hover:bg-terminal-green/5 font-mono text-sm px-2 rounded block w-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-terminal-amber/60"
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent> */}
          </Popover>

          {/* Main nav */}
          <div className="flex items-center gap-6">
            {/* Terminal-style logo */}
            <a
              href="/"
              className="text-terminal-green hover:text-terminal-amber transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-terminal-amber/60"
              aria-label="Home"
            >
              <div className="flex items-center gap-1">
                <span className="text-terminal-amber">$</span>
                <span className="font-mono font-bold">syntaxia</span>
                <span className="text-terminal-green animate-pulse">_</span>
              </div>
            </a>

            {/* Navigation menu */}
            {/* <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink
                      href={link.href}
                      className="text-terminal-green/90 hover:text-terminal-amber py-1.5 font-mono text-sm transition-colors hover:bg-terminal-green/5 px-2 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-terminal-amber/60"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu> */}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Credits indicator */}
          {typeof credits === "number" ? (
            <a
              href="/credits"
              className="group inline-flex items-center gap-2 bg-transparent border border-terminal-green/30 text-terminal-green px-3 py-2 hover:bg-terminal-green/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-amber/60"
              aria-label="View credits"
              title="View credits"
            >
              <Sparkles className="w-3 h-3 text-terminal-green" />
              <span className="font-mono text-sm leading-none">{credits}</span>
              <span className="text-terminal-green font-mono text-xs">
                credits
              </span>
            </a>
          ) : null}

          {/* Custom Terminal User Menu */}
          <TerminalUserMenu />
        </div>
      </div>
    </header>
  );
}
