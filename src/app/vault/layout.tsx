import { Navigation } from "@/components/navigation";

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen">{children}</main>
    </>
  );
}
