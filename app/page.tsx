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

        <a className="hotspot home" href="/" aria-label="Home" />
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
      <header className="m-header">
        <a href="/" aria-label="NagaSphere home" className="m-logo">
  <strong>NagaSphere</strong>
  <span>Local Needs • Global Reach</span>
</a>

        <button type="button" aria-label="Open menu">
          ☰
        </button>
      </header>

      <section className="m-hero">
        <div className="m-hero-art">
          <img
            src="/NagaSphere_Local_Marketplace_in_Nagaland.png"
            alt="Nagaland"
          />
        </div>

        <div className="m-hero-copy">
          <p>WELCOME TO</p>

          <h1>
            Naga<span>Sphere</span>
          </h1>

          <div className="tagline">
            Buy • Sell • Support Local
          </div>

          <p className="copy">
            Discover local products, connect with trusted sellers,
            support businesses and build a stronger Nagaland.
          </p>

          <SearchForm />

          <div className="hero-message">
            Local Products • Local People • Stronger Together
          </div>
        </div>
      </section>

      <section
        className="category-strip"
        id="categories"
        aria-label="Categories"
      >
        {categories.map(([icon, name]) => (
          <a
            key={name}
            href="/listing"
            className="category-item"
          >
            <span className="category-image">
              <span className="category-icon">{icon}</span>
            </span>

            <span>{name}</span>
          </a>
        ))}
      </section>

      <section className="benefits">
        <div className="benefit">
          <span className="benefit-icon">✓</span>
          <div>
            <strong>Safe & Secure</strong>
            <p>Buy and sell with confidence.</p>
          </div>
        </div>

        <div className="benefit">
          <span className="benefit-icon">♥</span>
          <div>
            <strong>Support Local</strong>
            <p>Help Nagaland businesses grow.</p>
          </div>
        </div>

        <div className="benefit">
          <span className="benefit-icon">◆</span>
          <div>
            <strong>Wide Variety</strong>
            <p>Find products and services for your needs.</p>
          </div>
        </div>

        <div className="benefit">
          <span className="benefit-icon">N</span>
          <div>
            <strong>Nagaland Focused</strong>
            <p>Built around our local community.</p>
          </div>
        </div>

        <div className="benefit">
          <span className="benefit-icon">∞</span>
          <div>
            <strong>Community Driven</strong>
            <p>Connect people, businesses and opportunities.</p>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="section-heading">
          <div>
            <h2>Featured Listings</h2>
            <p>Discover products from across Nagaland</p>
          </div>

          <a href="/listing">View all</a>
        </div>

        <div className="listing-grid">
          {listings.map((item) => (
            <a
              className="listing-card"
              href="/listing"
              key={item.title}
            >
              <div className="listing-image">
                <img
                  src="/NagaSphere_Local_Marketplace_in_Nagaland.png"
                  alt=""
                />

                <span className="listing-category">
                  Local
                </span>

                <span className="heart">♡</span>
              </div>

              <div className="listing-body">
                <h3>{item.title}</h3>

                <strong>{item.price}</strong>

                <div className="location">
                  📍 {item.location}
                </div>

                <div className="seller">
                  👤 {item.seller}
                </div>

                <div className="rating">
                  ★ {item.rating}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="support-cta">
        <img
          src="/NagaSphere_Local_Marketplace_in_Nagaland.png"
          alt="Nagaland"
        />

        <div>
          <h2>Support Local. Build a Stronger Nagaland.</h2>

          <p>
            Every purchase supports local people,
            businesses and communities.
          </p>
        </div>

        <a href="/listing">Start Exploring</a>
      </section>

      <footer className="ns-footer">
        <div className="footer-brand">
          <strong>NagaSphere</strong>

          <small>
            Local Needs • Global Reach
          </small>
        </div>

        <div>
          <h4>Quick Links</h4>
          <a href="/">Home</a>
          <a href="/listing">Marketplace</a>
          <a href="#categories">Categories</a>
          <a href="/my-requests">My Requests</a>
        </div>

        <div>
          <h4>Support</h4>
          <a href="/messages">Messages</a>
          <a href="/profile">My Account</a>
        </div>

        <div>
          <h4>Stay Connected</h4>
          <p>Discover what Nagaland has to offer.</p>
          <div className="socials">f  ◎  𝕏</div>
        </div>

        <div>
          <strong>Proudly Nagaland</strong>
        </div>
      </footer>
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
