export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/30">
      <div className="mx-auto max-w-5xl px-6 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-mono font-medium text-primary/80">$lol</span>
          <p>&copy; {new Date().getFullYear()} $lol</p>
        </div>
      </div>
    </footer>
  );
}
