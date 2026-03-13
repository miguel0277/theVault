import { Navigation } from "@/components/navigation";

export default function SettingsLayout({
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
