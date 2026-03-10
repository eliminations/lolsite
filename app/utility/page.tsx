import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { UtilityGrid } from "@/components/utility/utility-grid";

export default function UtilityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 md:px-8 py-24 md:py-32">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Utility
            </h1>
            <p className="text-muted-foreground max-w-md">
              Tools being built for <span className="font-mono text-primary">$lol</span> holders. Shipping in the open.
            </p>
          </div>

          <UtilityGrid />
        </section>
      </main>

      <Footer />
    </div>
  );
}
