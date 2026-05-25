"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileSearch, FolderPlus, ShieldCheck } from "lucide-react";
import { RoleSwitcher } from "./RoleSwitcher";

const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart3
  },
  {
    href: "/reviews",
    label: "Review List",
    icon: FileSearch
  },
  {
    href: "/reviews/new",
    label: "New Review",
    icon: FolderPlus
  }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard" aria-label="FinProof Agent dashboard">
          <span className="brand__mark">
            <ShieldCheck size={22} aria-hidden="true" />
          </span>
          <span>
            <strong>FinProof</strong>
            <small>Compliance Agent</small>
          </span>
        </Link>

        <nav className="sidebar__nav" aria-label="Primary navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link key={item.href} className="nav-link" data-active={isActive} href={item.href}>
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Demo MVP</p>
            <h1>준법심의 AI Workspace</h1>
          </div>
          <RoleSwitcher />
        </header>
        <div className="workspace__content">{children}</div>
      </div>
    </div>
  );
}
