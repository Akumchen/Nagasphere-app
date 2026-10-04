"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./nagasphere-home.css";

type Listing = {
  title: string;
  price: string;
  location: string;
  seller: string;
  rating: string;
};

const listings: Listing[] = [
  {
    title: "Naga Oranges (Local)",
    price: "₹120 / kg",
    location: "Dimapur",
    seller: "Evergreen Farms",
    rating: "4.8 (24)",
  },
  {
    title: "Pure Naga Honey",
    price: "₹450 / 250g",
    location: "Kohima",
    seller: "Hilltop Organics",
    rating: "4.9 (36)",
  },
  {
    title: "Traditional Bamboo Basket",
    price: "₹1,200",
    location: "Mokokchung",
    seller: "Naga Crafts",
    rating: "4.7 (19)",
  },
  {
    title: "Naga Shawl (Traditional)",
    price: "₹1,500",
    location: "Wokha",
    seller: "Ao Weaves",
    rating: "4.9 (28)",
  },
  {
    title: "Bamboo Lamp",
    price: "₹800",
    location: "Tuensang",
    seller: "Creative Naga",
    rating: "4.6 (15)",
  },
  {
    title: "Organic Vegetables (Mixed)",
    price: "₹150 / kg",
    location: "Zunheboto",
    seller: "Green Valley Farm",
    rating: "4.8 (22)",
  },
];

const categories = [
  ["🥬", "Fresh Produce"],
  ["🍯", "Food & Beverages"],
  ["🧺", "Handicrafts"],
  ["👕", "Fashion & Apparel"],
  ["🏠", "Home & Living"],
  ["📱", "Electronics"],
  ["🛠️", "Services"],
  ["•••", "More"],
];

function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim();

    router.push(
      value
        ? `/listing?search=${encodeURIComponent(value)}`
        : "/listing"
    );
  }

  return (
    <form className="search-bar" onSubmit={submit}>
      <span className="search-icon">⌕</span>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for products, services, businesses..."
        aria-label="Search"
      />

      <button type="submit">Search</button>
    </form>
  );
}

function DesktopHome() {
  return (
    <div className="desktop-home">
      <div className="reference-frame">
        <img
          src="/NagaSphere_Local_Marketplace_in_Nagaland.png"
          alt="NagaSphere — Local Marketplace in Nagaland"
        />

        <a
          className="hotspot home"
          href="/"
          aria-label="Home"
        />

        <a
          className="hotspot marketplace"
          href="/listing"
          aria-label="Marketplace"
        />

        <a
          className="hotspot categories"
          href="#categories"
          aria-label="Categories"
        />

        <a
          className="hotspot requests"
          href="/my-requests"
          aria-label="My Requests"
        />

        <a
          className="hotspot messages"
          href="/messages"
          aria-label="Messages"
        />

        <a
          className="hotspot account"
          href="/profile"
          aria-label="My Account"
        />

        <div className="desktop-search">
          <SearchForm />
        </div>

        <a
          className="hotspot viewall"
          href="/listing"
          aria-label="View all listings"
        />

        <a
          className="hotspot cta"
          href="/listing"
          aria-label="Start exploring"
        />
      </div>
    </div>
  );
}

function MobileHome() {
  return (
    <div className="mobile-home">
      <div className="mobile-reference-frame">
        <img
          src="/NagaSphere_Local_Marketplace_in_Nagaland.png"
          alt="NagaSphere — Local Marketplace in Nagaland"
        />

        <div className="mobile-header-overlay">
          <a
            href="/"
            className="mobile-logo"
            aria-label="NagaSphere home"
          >
            <strong>NagaSphere</strong>
            <span>Local Needs • Global Reach</span>
          </a>

          <button
            type="button"
            aria-label="Open menu"
            className="mobile-menu-button"
            onClick={() => {
              document
                .getElementById("mobile-categories")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            ☰
          </button>
        </div>

        <a
          className="mobile-hotspot mobile-home-link"
          href="/"
          aria-label="Home"
        />

        <a
          className="mobile-hotspot mobile-marketplace-link"
          href="/listing"
          aria-label="Marketplace"
        />

        <a
          className="mobile-hotspot mobile-categories-link"
          href="#mobile-categories"
          aria-label="Categories"
        />

        <a
          className="mobile-hotspot mobile-requests-link"
          href="/my-requests"
          aria-label="My Requests"
        />

        <a
          className="mobile-hotspot mobile-messages-link"
          href="/messages"
          aria-label="Messages"
        />

        <a
          className="mobile-hotspot mobile-account-link"
          href="/profile"
          aria-label="My Account"
        />

        <div className="mobile-search-overlay">
          <SearchForm />
        </div>

        <a
          className="mobile-hotspot mobile-viewall-link"
          href="/listing"
          aria-label="View all listings"
        />

        <a
          className="mobile-hotspot mobile-cta-link"
          href="/listing"
          aria-label="Start exploring"
        />
      </div>

      <nav
        id="mobile-categories"
        className="mobile-access-links"
        aria-label="Mobile navigation"
      >
        <a href="/listing">Marketplace</a>
        <a href="/listing">Categories</a>
        <a href="/my-requests">My Requests</a>
        <a href="/messages">Messages</a>
        <a href="/profile">My Account</a>
      </nav>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="ns-page">
      <DesktopHome />
      <MobileHome />
    </main>
  );
}
