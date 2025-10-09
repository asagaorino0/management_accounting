"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Package, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    name: "全体計算",
    href: "/",
    icon: Calculator,
  },
  {
    name: "商品別分析",
    href: "/products",
    icon: Package,
  },
  {
    name: "シミュレーター",
    href: "/simulation",
    icon: TrendingUp,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-center mb-8">
      <div className="inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              data-testid={`tab-${tab.href === "/" ? "overview" : tab.href === "/products" ? "products" : "simulation"}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
