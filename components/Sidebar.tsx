"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, GraduationCap, Wallet, ClipboardCheck, BookOpen,
  Headphones, Users, Settings,
} from "lucide-react";
import { cliente } from "@/lib/config";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: GraduationCap, label: "Matrículas", href: "/matriculas" },
  { icon: Wallet, label: "Financeiro", href: "/financeiro" },
  { icon: ClipboardCheck, label: "Secretaria", href: "/secretaria" },
  { icon: BookOpen, label: "Pedagógico", href: "/pedagogico" },
  { icon: Headphones, label: "SAAD", href: "/saad" },
  { icon: Users, label: "Equipe", href: "/equipe" },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="sticky top-3 hidden h-[calc(100vh-1.5rem)] w-64 shrink-0 flex-col text-white m-3 rounded-3xl glass-dark md:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/25 font-bold text-white backdrop-blur">
          {cliente.nome.charAt(0)}
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight">{cliente.nome}</p>
          <p className="text-[11px] text-white/60">Gestão de Matrículas</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV.map((item) => {
          const active = item.href === "/" ? path === "/" : path.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
                active ? "bg-white/90 text-teal-700 font-semibold shadow-lg" : "text-white/75 hover:bg-white/15 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-2xl bg-white/10 p-4">
        <p className="text-xs text-white/80">🧪 Demo · dados fictícios</p>
      </div>
    </aside>
  );
}
