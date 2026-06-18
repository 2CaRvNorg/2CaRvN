import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">2CaRvN<span className="text-primary">.</span></span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Learning that feels alive. Build skills with world-class instructors and a community of curious minds.
            </p>
          </div>
          {[
            { title: "Learn", items: ["Courses", "Paths", "Live classes", "Certifications"] },
            { title: "Company", items: ["About", "Careers", "Press", "Contact"] },
            { title: "Resources", items: ["Blog", "Help center", "Community", "Status"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold">{col.title}</h4>
              <ul className="mt-4 space-y-2">
                {col.items.map((i) => (
                  <li key={i}><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{i}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} 2CaRvN Learning. Crafted with care.</p>
          <p>Privacy · Terms · Cookies</p>
        </div>
      </div>
    </footer>
  );
}
