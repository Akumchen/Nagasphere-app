"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

type Listing = {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  quantity?: number | null;
  unit?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  city?: string | null;
  state?: string | null;
  category_id?: string | null;
  categoryName?: string;
};

type Category = { id: string; name: string; slug: string };

const categoryVisuals = [
  { name: "Fresh Produce", image: "/fresh-produce.png" },
  { name: "Food & Beverages", image: "/food-beverages.png" },
  { name: "Handicrafts", image: "/handicrafts.png" },
  { name: "Fashion & Apparel", image: "/fashion-apparel.png" },
  { name: "Home & Living", image: "/home-living.png" },
  { name: "Electronics", image: "/electronics.png" },
  { name: "Services", icon: "⚒" },
  { name: "More", icon: "•••" },
];

const listingImages = [
  "/oranges.png",
  "/honey.png",
  "/basket.png",
  "/shawl.png",
  "/lamp.png",
  "/vegetables.png",
];

function mapCategory(name?: string) {
  const n = (name || "").toLowerCase();
  if (n.includes("food") || n.includes("agri") || n.includes("produce")) return "Fresh Produce";
  if (n.includes("fashion") || n.includes("cloth") || n.includes("textile")) return "Fashion & Apparel";
  if (n.includes("home") || n.includes("living") || n.includes("furniture")) return "Home & Living";
  if (n.includes("electronic")) return "Electronics";
  if (n.includes("service")) return "Services";
  if (n.includes("handicraft") || n.includes("craft")) return "Handicrafts";
  return "More";
}

function priceFor(listing: Listing) {
  const value = listing.budget_min ?? listing.budget_max;
  if (value == null) return "Contact seller";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function iconSvg(kind: "search" | "bell" | "user" | "chevron" | "pin") {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "search")
    return <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="11" cy="11" r="7" {...common}/><path d="m16.5 16.5 4 4" {...common}/></svg>;
  if (kind === "bell")
    return <svg viewBox="0 0 24 24" width="20" height="20"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" {...common}/><path d="M10 21h4" {...common}/></svg>;
  if (kind === "user")
    return <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="8" r="3.5" {...common}/><path d="M5 20c.8-3.5 3.1-5 7-5s6.2 1.5 7 5" {...common}/></svg>;
  if (kind === "pin")
    return <svg viewBox="0 0 24 24" width="15" height="15"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" {...common}/><circle cx="12" cy="10" r="2.2" {...common}/></svg>;
  return <svg viewBox="0 0 24 24" width="13" height="13"><path d="m6 9 6 6 6-6" {...common}/></svg>;
}

export default function HomePage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: authData }, { data: categoryData }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("categories").select("id,name,slug").order("name"),
      ]);
      setUserId(authData.user?.id ?? null);
      setCategories(categoryData || []);
      setCheckingAuth(false);

      const { data: posts } = await supabase
        .from("posts")
        .select("id,title,description,type,quantity,unit,budget_min,budget_max,city,state,category_id")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      const categoryMap = new Map((categoryData || []).map(c => [c.id, c.name]));
      setListings((posts || []).map(post => ({
        ...post,
        categoryName: post.category_id ? categoryMap.get(post.category_id) : undefined,
      })));
    }
    load();
  }, [supabase]);

  const visibleListings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter(l =>
      [l.title, l.description, l.city, l.state, l.categoryName].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [listings, searchTerm]);

  const featured = visibleListings.slice(0, 6);

  function goSearch() {
    document.getElementById("featured-listings")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUserId(null);
    router.refresh();
  }

  return (
    <main className="nsPage">
      <section className="nsHero">
        <div className="nsHeroPhoto" />
        <div className="nsHeroShade" />

        <header className="nsHeader">
          <div className="nsHeaderInner">
            <button className="nsBrand" onClick={() => router.push("/")} aria-label="NagaSphere home">
              <img src="/nagasphere-logo.png" alt="NagaSphere" />
              <span className="nsBrandText">
                <strong><span>Naga</span><em>Sphere</em></strong>
                <small>Local Needs • Global Reach</small>
              </span>
            </button>

            <nav className="nsNav">
              <button className="active" onClick={() => router.push("/")}>Home</button>
              <button onClick={() => router.push("/dashboard")}>Marketplace <span>⌄</span></button>
              <button onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}>Categories</button>
              <button onClick={() => router.push("/my-requests")}>My Requests</button>
              <button onClick={() => router.push("/messages")}>Messages <b className="badge">3</b></button>
              <button onClick={() => router.push("/dashboard")}>More <span>⌄</span></button>
            </nav>

            <div className="nsActions">
              <button aria-label="Search" onClick={() => document.getElementById("home-search")?.focus()}>{iconSvg("search")}</button>
              <button aria-label="Notifications" className="actionBadge">{iconSvg("bell")}<b>3</b></button>
              <button className="accountBtn" onClick={() => router.push(userId ? "/dashboard" : "/auth")}>
                <span className="avatar">{iconSvg("user")}</span>
                <span>{checkingAuth ? "My Account" : userId ? "My Account" : "My Account"}</span>
                {iconSvg("chevron")}
              </button>
            </div>
          </div>
        </header>

        <div className="nsHeroContent">
          <div className="welcome">WELCOME TO</div>
          <h1>Naga<span>Sphere</span></h1>
          <div className="scriptLine">Buy • Sell • Support Local</div>
          <p>Your trusted online marketplace in Nagaland — connecting<br className="desktopOnly" /> farmers, local businesses and consumers, for a stronger<br className="desktopOnly" /> community and a brighter future.</p>

          <div className="searchShell">
            <div className="searchIcon">{iconSvg("search")}</div>
            <input
              id="home-search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") goSearch(); }}
              placeholder="Search for products, services, businesses..."
            />
            <button onClick={goSearch}>Search</button>
          </div>
        </div>

        <div className="heroSlogan">
          <span>Local Products</span>
          <span>Local People</span>
          <span>Stronger Together</span>
          <i />
        </div>
      </section>

      <section id="categories" className="categoryRow">
        <div className="categoryInner">
          {categoryVisuals.map(item => (
            <button key={item.name} className="categoryItem" onClick={() => {
              setSearchTerm(item.name === "More" ? "" : item.name);
              document.getElementById("featured-listings")?.scrollIntoView({ behavior: "smooth" });
            }}>
              {item.image ? <img src={item.image} alt="" /> : <span className="categoryIcon">{item.icon}</span>}
              <strong>{item.name}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="benefitsWrap">
        <div className="benefits">
          <div className="benefit"><span className="benefitIcon">✓</span><div><b>Safe & Secure</b><small>Your trust matters. We keep<br/>your data and transactions safe.</small></div></div>
          <div className="benefit"><span className="benefitIcon">♟</span><div><b>Support Local</b><small>Help local farmers, artisans<br/>and small businesses grow.</small></div></div>
          <div className="benefit"><span className="benefitIcon">⌁</span><div><b>Wide Variety</b><small>From fresh produce to daily needs,<br/>find it all in one place.</small></div></div>
          <div className="benefit"><span className="benefitIcon">⌖</span><div><b>Nagaland Focused</b><small>Built for our people,<br/>our culture, our future.</small></div></div>
          <div className="benefit"><span className="benefitIcon">♥</span><div><b>Community Driven</b><small>Real people. Real businesses.<br/>A stronger Nagaland.</small></div></div>
        </div>
      </section>

      <section id="featured-listings" className="featuredSection">
        <div className="sectionHead">
          <div><h2>Featured Listings</h2><p>Top picks from our local sellers</p></div>
          <button onClick={() => router.push("/dashboard")}>View All →</button>
        </div>

        {featured.length ? (
          <div className="listingGrid">
            {featured.map((listing, index) => {
              const category = mapCategory(listing.categoryName);
              const image = listingImages[index % listingImages.length];
              return (
                <article key={listing.id} className="listingCard" onClick={() => router.push(`/listing/${listing.id}`)}>
                  <div className="listingPhoto">
                    <img src={image} alt="" />
                    <span>{category}</span>
                    <b className="heart">♡</b>
                  </div>
                  <div className="listingBody">
                    <h3>{listing.title}</h3>
                    <div className="price">{priceFor(listing)}{listing.unit ? <small> / {listing.unit}</small> : ""}</div>
                    <div className="location">{iconSvg("pin")} {listing.city || listing.state || "Nagaland"}</div>
                    <div className="seller"><span className="miniAvatar">{(listing.title || "N").charAt(0).toUpperCase()}</span><span>{listing.type === "need" ? "Local Buyer" : "Local Seller"}</span><span className="rating">★ 4.8</span></div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="emptyFeatured">
            <h3>No active listings yet</h3>
            <p>Be among the first to add something to NagaSphere.</p>
            <button onClick={() => router.push("/create-listing")}>Create a Listing</button>
          </div>
        )}
      </section>

      <section className="supportBanner">
        <div className="supportImage" />
        <div><h2>Support Local. Build a Stronger Nagaland.</h2><p>Every purchase makes a difference — for our farmers,<br/>our businesses and our community.</p></div>
        <button onClick={() => document.getElementById("featured-listings")?.scrollIntoView({ behavior: "smooth" })}>Start Exploring <span>→</span></button>
        <div className="leafMark">⌁</div>
      </section>

      <footer className="nsFooter">
        <div className="footerGrid">
          <div className="footerBrand">
            <div className="footerLogo"><img src="/nagasphere-logo.png" alt="NagaSphere" /></div>
          </div>
          <div><h4>Quick Links</h4><button onClick={() => router.push("/")}>Home</button><button onClick={() => router.push("/dashboard")}>Marketplace</button><button onClick={() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })}>Categories</button><button onClick={() => router.push("/my-requests")}>My Requests</button></div>
          <div><h4>Support</h4><button onClick={() => router.push("/profile")}>Help Center</button><button onClick={() => router.push("/profile")}>Contact Us</button><button onClick={() => router.push("/terms")}>Terms & Conditions</button><button onClick={() => router.push("/privacy")}>Privacy Policy</button></div>
          <div className="stayConnected"><h4>Stay Connected</h4><p>Get the latest updates and offers.</p><div className="subscribe"><input placeholder="Your email address"/><button>Subscribe</button></div><div className="socials"><span>f</span><span>◎</span><span>▶</span><span>◉</span></div></div>
        </div>
        <div className="footerBottom"><span>© 2026 NagaSphere. All rights reserved.</span><span>Proudly Nagaland ⛰</span></div>
      </footer>

      <style jsx>{`
        * { box-sizing: border-box; }
        .nsPage { background:#fffdf8; color:#173a30; font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; overflow-x:hidden; }
        button { font:inherit; }
        .nsHero { position:relative; min-height:405px; color:white; overflow:hidden; background:#0d3a31; }
        .nsHeroPhoto { position:absolute; inset:0; background-image:url("/nagasphere-hero.jpg"); background-size:cover; background-position:center 55%; transform:scale(1.04); }
        .nsHeroShade { position:absolute; inset:0; background:linear-gradient(90deg,rgba(3,39,35,.63),rgba(3,39,35,.18) 60%,rgba(3,39,35,.15)),linear-gradient(0deg,rgba(3,39,35,.28),transparent 45%); }
        .nsHeader { position:absolute; z-index:5; top:0; left:0; right:0; }
        .nsHeaderInner { max-width:1110px; margin:auto; height:78px; display:flex; align-items:center; gap:24px; padding:0 18px; }
        .nsBrand { border:0; background:transparent; color:#fff; display:flex; align-items:center; gap:8px; padding:0; cursor:pointer; text-align:left; min-width:240px; }
        .nsBrand img { width:54px; height:54px; object-fit:contain; object-position:center; filter:drop-shadow(0 2px 6px rgba(0,0,0,.22)); }
        .nsBrandText strong { display:block; font-size:22px; line-height:1; letter-spacing:-.7px; }
        .nsBrandText strong span { color:#fff; }
        .nsBrandText strong em { color:#53c54e; font-style:normal; }
        .nsBrandText small { display:block; margin-top:5px; font-size:9px; letter-spacing:1.2px; color:rgba(255,255,255,.82); }
        .nsNav { display:flex; align-items:center; justify-content:center; gap:22px; flex:1; }
        .nsNav button { position:relative; border:0; background:transparent; color:rgba(255,255,255,.95); padding:8px 0; font-size:12px; cursor:pointer; white-space:nowrap; }
        .nsNav button.active { color:#52c650; }
        .nsNav button.active:after { content:""; position:absolute; left:0; right:0; bottom:-6px; height:2px; background:#52c650; border-radius:2px; }
        .nsNav button span { margin-left:3px; font-size:11px; }
        .badge { position:absolute; top:-8px; right:-12px; background:#ef4b45; color:#fff; border-radius:999px; font-size:7px; min-width:13px; height:13px; display:grid; place-items:center; }
        .nsActions { display:flex; align-items:center; gap:12px; }
        .nsActions > button { border:0; background:transparent; color:#fff; padding:5px; cursor:pointer; position:relative; }
        .actionBadge b { position:absolute; right:-2px; top:-3px; width:13px; height:13px; border-radius:50%; background:#ef4b45; font-size:7px; display:grid; place-items:center; }
        .accountBtn { display:flex!important; align-items:center; gap:7px; font-size:11px; white-space:nowrap; }
        .avatar { width:29px; height:29px; border-radius:50%; background:#fff; color:#5d6a66; display:grid; place-items:center; }
        .nsHeroContent { position:relative; z-index:2; max-width:1110px; margin:auto; padding:96px 22px 38px; }
        .welcome { color:#55c94f; font-size:15px; font-weight:800; letter-spacing:.5px; margin-bottom:2px; }
        .nsHeroContent h1 { margin:0; font-size:54px; line-height:1; letter-spacing:-2px; font-weight:800; }
        .nsHeroContent h1 span { color:#50c54d; }
        .scriptLine { margin-top:8px; font-family:"Brush Script MT","Segoe Script",cursive; font-size:29px; color:#fff; }
        .nsHeroContent p { margin:7px 0 17px; font-size:13px; line-height:1.42; color:rgba(255,255,255,.96); }
        .searchShell { width:min(650px,100%); height:50px; border-radius:28px; background:#fff; display:flex; align-items:center; padding:5px; box-shadow:0 8px 30px rgba(0,0,0,.22); }
        .searchIcon { color:#83918e; margin-left:13px; display:flex; }
        .searchShell input { flex:1; min-width:0; border:0; outline:0; padding:0 12px; color:#344842; font-size:12px; background:transparent; }
        .searchShell input::placeholder { color:#899591; }
        .searchShell button { height:40px; min-width:103px; border:0; border-radius:22px; background:#42b85a; color:#fff; font-size:12px; font-weight:800; cursor:pointer; }
        .heroSlogan { position:absolute; z-index:3; right:115px; top:182px; font-family:"Brush Script MT","Segoe Script",cursive; font-size:26px; line-height:1.05; transform:rotate(-5deg); color:#fff; text-align:center; }
        .heroSlogan span { display:block; text-shadow:0 2px 5px rgba(0,0,0,.25); }
        .heroSlogan i { display:block; width:120px; height:4px; background:#48c957; border-radius:8px; transform:rotate(-5deg); margin:6px auto 0; }
        .categoryRow { background:#fff; border-bottom:1px solid #e9ece9; }
        .categoryInner { max-width:1110px; margin:auto; min-height:125px; display:grid; grid-template-columns:repeat(8,1fr); align-items:center; }
        .categoryItem { border:0; background:#fff; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; min-height:100px; border-right:1px solid #edf0ed; color:#18382f; }
        .categoryItem:last-child { border-right:0; }
        .categoryItem img,.categoryIcon { width:60px; height:60px; border-radius:12px; object-fit:cover; }
        .categoryIcon { display:grid; place-items:center; background:#3b4745; color:#fff; font-size:27px; font-weight:800; }
        .categoryItem strong { font-size:12px; font-weight:700; }
        .benefitsWrap { padding:20px 24px 22px; background:#fffdf8; }
        .benefits { max-width:1105px; margin:auto; background:#f0f7ee; border-radius:13px; display:grid; grid-template-columns:repeat(5,1fr); padding:19px 16px; }
        .benefit { display:flex; gap:11px; align-items:flex-start; padding:0 18px; border-right:1px solid #dfeadf; }
        .benefit:last-child { border-right:0; }
        .benefitIcon { width:36px; height:36px; flex:0 0 36px; display:grid; place-items:center; border-radius:50%; background:#d7f0d6; color:#1a9d55; font-weight:900; font-size:16px; }
        .benefit b { display:block; font-size:11px; margin:1px 0 6px; }
        .benefit small { display:block; color:#6c7c73; font-size:9px; line-height:1.45; }
        .featuredSection { max-width:1110px; margin:auto; padding:7px 0 28px; }
        .sectionHead { display:flex; justify-content:space-between; align-items:flex-end; padding:0 2px 13px; }
        .sectionHead h2 { margin:0; font-size:24px; letter-spacing:-.7px; color:#173c31; }
        .sectionHead p { margin:5px 0 0; font-size:11px; color:#6c7a72; }
        .sectionHead button { border:0; background:transparent; color:#168b4b; font-size:11px; font-weight:800; cursor:pointer; }
        .listingGrid { display:grid; grid-template-columns:repeat(6,1fr); gap:11px; }
        .listingCard { background:#fff; border:1px solid #e7ebe8; border-radius:9px; overflow:hidden; box-shadow:0 4px 14px rgba(23,52,42,.07); cursor:pointer; transition:.18s ease; }
        .listingCard:hover { transform:translateY(-3px); box-shadow:0 9px 22px rgba(23,52,42,.13); }
        .listingPhoto { height:100px; position:relative; overflow:hidden; background:#eaf0ea; }
        .listingPhoto img { width:100%; height:100%; object-fit:cover; display:block; }
        .listingPhoto > span { position:absolute; left:7px; bottom:7px; background:#299d63; color:#fff; padding:4px 7px; border-radius:5px; font-size:7px; font-weight:800; }
        .heart { position:absolute; top:7px; right:7px; color:#fff; font-size:18px; text-shadow:0 1px 4px #333; }
        .listingBody { padding:9px 10px 11px; }
        .listingBody h3 { margin:0 0 6px; font-size:11px; color:#244236; min-height:27px; line-height:1.25; }
        .price { color:#169a4e; font-size:12px; font-weight:900; }
        .price small { font-size:9px; color:#4e6559; font-weight:600; }
        .location { display:flex; align-items:center; gap:4px; margin-top:7px; color:#78857e; font-size:8px; }
        .seller { display:flex; align-items:center; gap:5px; border-top:1px solid #edf0ed; margin-top:8px; padding-top:7px; color:#65746c; font-size:8px; }
        .miniAvatar { width:17px; height:17px; border-radius:50%; background:#d6dfd9; display:grid; place-items:center; color:#335747; font-size:8px; font-weight:900; }
        .rating { margin-left:auto; color:#e6a91e; font-size:8px; }
        .emptyFeatured { border:1px dashed #ccd9d0; border-radius:10px; text-align:center; padding:35px; color:#6e7d74; }
        .emptyFeatured h3 { color:#244236; margin:0 0 5px; }
        .emptyFeatured p { margin:0 0 14px; font-size:12px; }
        .emptyFeatured button { border:0; background:#15844a; color:#fff; padding:10px 15px; border-radius:7px; font-weight:800; cursor:pointer; }
        .supportBanner { max-width:1110px; min-height:92px; margin:0 auto 17px; border-radius:13px; overflow:hidden; display:grid; grid-template-columns:290px 1fr auto 80px; align-items:center; background:#eef7eb; }
        .supportImage { height:92px; background:url("/support.png") center/cover; }
        .supportBanner h2 { margin:0 0 5px; font-size:17px; color:#183c31; }
        .supportBanner p { margin:0; color:#5e7066; font-size:10px; line-height:1.45; }
        .supportBanner button { margin-right:22px; border:0; background:#0e654c; color:#fff; padding:12px 17px; border-radius:22px; font-size:10px; font-weight:800; cursor:pointer; }
        .supportBanner button span { margin-left:15px; }
        .leafMark { color:#64ae60; font-size:45px; transform:rotate(-30deg); }
        .nsFooter { background:#003c37; color:#fff; padding:26px 0 14px; }
        .footerGrid { max-width:1110px; margin:auto; display:grid; grid-template-columns:1.25fr .8fr .9fr 1.45fr; gap:30px; padding:0 0 20px; }
        .footerLogo img { width:205px; height:85px; object-fit:contain; object-position:left center; filter:brightness(0) invert(1); opacity:.95; }
        .footerGrid h4 { margin:7px 0 9px; font-size:10px; }
        .footerGrid > div > button { display:block; border:0; background:transparent; color:rgba(255,255,255,.75); padding:3px 0; font-size:9px; cursor:pointer; }
        .stayConnected p { margin:0 0 8px; color:rgba(255,255,255,.7); font-size:9px; }
        .subscribe { display:flex; max-width:290px; height:27px; }
        .subscribe input { flex:1; min-width:0; border:0; outline:0; border-radius:16px 0 0 16px; padding:0 11px; font-size:9px; }
        .subscribe button { border:0; background:#48bb5d; color:#fff; border-radius:0 16px 16px 0; padding:0 14px; font-size:9px; font-weight:800; }
        .socials { display:flex; gap:10px; margin-top:9px; }
        .socials span { width:18px; height:18px; border-radius:50%; background:rgba(255,255,255,.14); display:grid; place-items:center; font-size:9px; }
        .footerBottom { max-width:1110px; margin:auto; border-top:1px solid rgba(255,255,255,.15); padding:12px 0 0; display:flex; justify-content:space-between; color:rgba(255,255,255,.58); font-size:8px; }
        @media(max-width:1000px) {
          .nsNav { gap:12px; }
          .nsNav button { font-size:10px; }
          .nsHeaderInner,.nsHeroContent,.featuredSection,.supportBanner,.footerGrid,.footerBottom { margin-left:18px; margin-right:18px; }
          .listingGrid { grid-template-columns:repeat(3,1fr); }
          .benefits { grid-template-columns:repeat(2,1fr); gap:15px 0; }
          .benefit:nth-child(2),.benefit:nth-child(4) { border-right:0; }
          .heroSlogan { right:45px; }
        }
        @media(max-width:720px) {
          .nsHero { min-height:580px; }
          .nsHeaderInner { height:72px; }
          .nsBrand { min-width:0; }
          .nsBrand img { width:42px; height:42px; }
          .nsBrandText strong { font-size:17px; }
          .nsBrandText small { font-size:7px; }
          .nsNav { display:none; }
          .nsActions { margin-left:auto; }
          .accountBtn span:not(.avatar) { display:none; }
          .nsHeroContent { padding-top:105px; }
          .nsHeroContent h1 { font-size:45px; }
          .scriptLine { font-size:25px; }
          .heroSlogan { right:18px; top:auto; bottom:72px; font-size:20px; }
          .searchShell { height:48px; }
          .categoryInner { grid-template-columns:repeat(4,1fr); }
          .categoryItem { min-height:95px; }
          .categoryItem img,.categoryIcon { width:50px; height:50px; }
          .categoryItem strong { font-size:9px; text-align:center; }
          .benefits { grid-template-columns:1fr; padding:15px; }
          .benefit { border-right:0!important; padding:8px 5px; }
          .featuredSection { padding-top:5px; }
          .listingGrid { grid-template-columns:repeat(2,1fr); }
          .supportBanner { grid-template-columns:1fr; }
          .supportImage { height:130px; }
          .supportBanner > div:not(.supportImage):not(.leafMark) { padding:18px; }
          .supportBanner button { margin:0 18px 18px; }
          .leafMark { display:none; }
          .footerGrid { grid-template-columns:1fr 1fr; }
          .footerBrand,.stayConnected { grid-column:1/-1; }
          .footerBottom { margin:0 18px; }
          .desktopOnly { display:none; }
        }
      `}</style>
    </main>
  );
}

