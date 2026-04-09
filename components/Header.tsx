import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">Stamp Reuse MVP</Link>
        <nav className="flex items-center gap-5 text-sm text-slate-600">
          <Link href="/workspace">Workspace</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/billing">Billing</Link>
          <Link href="/history">History</Link>
        </nav>
      </div>
    </header>
  );
}
