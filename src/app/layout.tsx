import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Rich Mode Academy | Learn, explore and launch PoolForge",
  description: "Explore Rich Mode Academy, discover membership plans and launch your PoolForge market workspace.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}</body></html>;
}
