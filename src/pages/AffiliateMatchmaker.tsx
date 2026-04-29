import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ArrowLeft, Search, Copy, CheckCircle2, Percent, ExternalLink, Crown } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";

type Product = {
  name: string;
  category: string;
  commission: number;
  image: string;
  link: string;
  description: string;
};

const nicheProducts: Record<string, Product[]> = {
  gardening: [
    { name: "AeroGarden Harvest", category: "Indoor Growing", commission: 12, image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=300&fit=crop", link: "https://aerogarden.com/ref/ai-remote", description: "Smart countertop garden system for herbs & greens." },
    { name: "Greenworks 40V Mower", category: "Lawn Care", commission: 8, image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=300&fit=crop", link: "https://greenworks.com/ref/ai-remote", description: "Battery-powered electric mower, eco-friendly pick." },
    { name: "Gardyn Home Kit 3.0", category: "Hydroponics", commission: 15, image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop", link: "https://gardyn.com/ref/ai-remote", description: "AI-powered vertical indoor garden with 30 pods." },
  ],
  cooking: [
    { name: "Our Place Always Pan", category: "Cookware", commission: 10, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", link: "https://ourplace.com/ref/ai-remote", description: "The viral 8-in-1 non-stick ceramic pan." },
    { name: "Thermapen ONE", category: "Thermometers", commission: 14, image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop", link: "https://thermoworks.com/ref/ai-remote", description: "Instant-read thermometer trusted by pro chefs." },
    { name: "KitchenAid Artisan", category: "Mixers", commission: 7, image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=300&fit=crop", link: "https://kitchenaid.com/ref/ai-remote", description: "Iconic stand mixer with 10+ attachments." },
  ],
  fitness: [
    { name: "Whoop 4.0 Band", category: "Wearables", commission: 18, image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=300&fit=crop", link: "https://whoop.com/ref/ai-remote", description: "Advanced strain & recovery tracker for athletes." },
    { name: "TRX Home2 System", category: "Equipment", commission: 12, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop", link: "https://trx.com/ref/ai-remote", description: "Suspension training kit — gym-quality at home." },
    { name: "Athletic Greens AG1", category: "Supplements", commission: 20, image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop", link: "https://athleticgreens.com/ref/ai-remote", description: "All-in-one daily greens supplement powder." },
  ],
  tech: [
    { name: "Elgato Stream Deck", category: "Streaming", commission: 10, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=300&fit=crop", link: "https://elgato.com/ref/ai-remote", description: "Customizable LCD keys for streamers & creators." },
    { name: "Rode PodMic USB", category: "Audio", commission: 15, image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop", link: "https://rode.com/ref/ai-remote", description: "Broadcast-quality USB/XLR dynamic microphone." },
    { name: "CalDigit TS4 Dock", category: "Accessories", commission: 9, image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=300&fit=crop", link: "https://caldigit.com/ref/ai-remote", description: "18-port Thunderbolt 4 docking station." },
  ],
};

const defaultProducts: Product[] = [
  { name: "StreamYard Pro", category: "Streaming", commission: 30, image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop", link: "https://streamyard.com/ref/ai-remote", description: "Browser-based live streaming studio." },
  { name: "Canva Pro", category: "Design", commission: 25, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop", link: "https://canva.com/ref/ai-remote", description: "Design platform with thousands of templates." },
  { name: "ConvertKit", category: "Email Marketing", commission: 30, image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=300&fit=crop", link: "https://convertkit.com/ref/ai-remote", description: "Email marketing built for creators." },
];

const AffiliateMatchmaker = () => {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const { hasProAccess } = useSubscription();

  if (!hasProAccess) {
    return (
      <div className="px-4 py-20 max-w-md mx-auto text-center">
        <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Pro Feature</h1>
        <p className="text-muted-foreground mb-6">Affiliate Matchmaker requires a Pro or Launchpad plan.</p>
        <Link to="/pricing">
          <Button variant="hero" size="lg">Upgrade to Pro</Button>
        </Link>
      </div>
    );
  }

  const getProducts = (): Product[] => {
    if (!query.trim()) return defaultProducts;
    const key = Object.keys(nicheProducts).find((k) =>
      k.includes(query.toLowerCase().trim())
    );
    if (key) return nicheProducts[key];
    // fuzzy: check if any niche keyword is in the query
    const fallback = Object.keys(nicheProducts).find((k) =>
      query.toLowerCase().includes(k)
    );
    return fallback ? nicheProducts[fallback] : defaultProducts;
  };

  const products = getProducts();

  const handleCopy = (product: Product) => {
    navigator.clipboard.writeText(product.link);
    setCopied(product.name);
    toast.success(`Copied ${product.name} affiliate link!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Find Your Perfect Products</h1>
        <p className="text-muted-foreground mb-8">
          Type a niche below — like <span className="text-primary font-medium">Gardening</span>,{" "}
          <span className="text-primary font-medium">Cooking</span>,{" "}
          <span className="text-primary font-medium">Fitness</span>, or{" "}
          <span className="text-primary font-medium">Tech</span> — to discover matched affiliate products.
        </p>

        <div className="mb-10 space-y-2">
          <Label htmlFor="affiliate-niche-search">Search by niche or keyword</Label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              id="affiliate-niche-search"
              name="affiliate_niche"
              type="search"
              autoComplete="off"
              placeholder="Enter your niche (e.g. 'Gardening')…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-14 text-base bg-card border-border/50 rounded-xl"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.name}
              className="glass-card rounded-xl overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-300 group"
            >
              {/* Product Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1556740758-90de940a6f90?w=400&h=300&fit=crop";
                    target.onerror = null;
                  }}
                />
                {/* Commission Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary/90 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                  <Percent className="h-3 w-3" />
                  {p.commission}% Commission
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs text-primary/80 font-medium uppercase tracking-wider mb-1">
                  {p.category}
                </span>
                <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {p.description}
                </p>

                <Button
                  variant="glass"
                  className="w-full gap-2 border border-border/50 hover:border-primary/50"
                  onClick={() => handleCopy(p)}
                >
                  {copied === p.name ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Affiliate Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {products === defaultProducts && query.trim() !== "" && (
          <p className="text-center text-muted-foreground mt-8 text-sm">
            No exact niche match — showing popular picks. Try <span className="text-primary">Gardening</span>, <span className="text-primary">Cooking</span>, <span className="text-primary">Fitness</span>, or <span className="text-primary">Tech</span>.
          </p>
        )}
    </div>
  );
};

export default AffiliateMatchmaker;
