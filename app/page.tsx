"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./nagasphere-home.css";

const categories = [
  ["Fresh Produce", "/fresh-produce.png"],
  ["Food & Beverages", "/food-beverages.png"],
  ["Handicrafts", "/handicrafts.png"],
  ["Fashion & Apparel", "/fashion-apparel.png"],
  ["Home & Living", "/home-living.png"],
  ["Electronics", "/electronics.png"],
  ["Services", "/support.png"],
  ["More", "/basket.png"],
];

const listings = [
  ["Naga Oranges", "₹120 / kg", "Dimapur", "Evergreen Farms", "4.8", "/oranges.png"],
  ["Pure Naga Honey", "₹450 / 250g", "Kohima", "Hilltop Organics", "4.9", "/honey.png"],
  ["Traditional Bamboo Basket", "₹1,200", "Mokokchung", "Naga Crafts", "4.7", "/basket.png"],
  ["Naga Shawl (Traditional)", "₹1,500", "Wokha", "Ao Weaves", "4.9", "/shawl.png"],
  ["Bamboo Lamp", "₹800", "Tuensang", "Creative Naga", "4.6", "/lamp.png"],
  ["Organic Vegetables (Mixed)", "₹150 / kg", "Zunheboto", "Green Valley Farm", "4.8", "/vegetables.png"],
];

function SearchForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = query.trim();

    router.push(
      value
        ? `/listing?search=${encodeURIComponent(value)}`
        : "/listing"
    );
  }

  return (
    <form className="ns-search" onSubmit={submit}>
      <span aria-hidden="true">⌕</span>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, services, businesses..."
        aria-label="Search"
      />

      <button type="submit">Search</button>
    </form>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="ns-header">
      <div className="ns-header-inner">

        <a className="ns-brand" href="/">
          <img src="/nagasphere-logo.png" alt="NagaSphere" />

          <span>
            <strong>NagaSphere</strong>
            <small>Local Needs • Global Reach</small>
          </span>
        </a>

        <nav className="ns-nav" aria-label="Main navigation">
          <a className="active" href="/">Home</a>

          <a href="/listing">
            Marketplace <span>⌄</span>
          </a>

          <a href="#categories">Categories</a>

          <a href="/my-requests">My Requests</a>

          <a href="/messages">
            Messages <b>3</b>
          </a>

          <a href="/my-listings">
            More <span>⌄</span>
          </a>
        </nav>

        <div className="ns-header-actions">
          <SearchForm />

          <a
            href="/messages"
            className="ns-icon-link"
            aria-label="Notifications"
          >
            ♢<b>3</b>
          </a>

          <a className="ns-account" href="/profile">
            My Account
          </a>
        </div>

        <button
          className="ns-menu-button"
          aria-label="Open navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="ns-mobile-menu" aria-label="Mobile navigation">
          <a href="/" onClick={() => setOpen(false)}>Home</a>

          <a href="/listing" onClick={() => setOpen(false)}>
            Marketplace
          </a>

          <a href="#categories" onClick={() => setOpen(false)}>
            Categories
          </a>

          <a href="/my-requests" onClick={() => setOpen(false)}>
            My Requests
          </a>

          <a href="/messages" onClick={() => setOpen(false)}>
            Messages <b>3</b>
          </a>

          <a href="/messages" onClick={() => setOpen(false)}>
            Notifications <b>3</b>
          </a>

          <a href="/my-listings" onClick={() => setOpen(false)}>
            My Listings
          </a>

          <a href="/create-listing" onClick={() => setOpen(false)}>
            Sell on NagaSphere
          </a>

          <a href="/profile" onClick={() => setOpen(false)}>
            My Account
          </a>
        </nav>
      )}
    </header>
  );
}

export default function HomePage() {
  return (
    <main className="ns-page">

      <Header />

      <section className="ns-hero">
        <div className="ns-hero-content">

          <p className="eyebrow">WELCOME TO</p>

          <h1>NagaSphere</h1>

          <h2>Buy • Sell • Support Local</h2>

          <p>
            Discover local products, services and businesses across Nagaland.
            Connect with trusted sellers and support the people who make our
            community stronger.
          </p>

          <SearchForm />

          <div className="ns-hero-points">
            <span>Local Products</span>
            <span>Local People</span>
            <span>Stronger Together</span>
          </div>

        </div>
      </section>

      <section id="categories" className="ns-section">

        <div className="ns-section-heading">
          <div>
            <p className="eyebrow">EXPLORE</p>
            <h2>Shop by Category</h2>
          </div>

          <a href="/listing">View all →</a>
        </div>

        <div className="ns-category-grid">
          {categories.map(([name, image]) => (
            <a
              className="ns-category-card"
              href={`/listing?category=${encodeURIComponent(name)}`}
              key={name}
            >
              <img src={image} alt="" />
              <span>{name}</span>
            </a>
          ))}
        </div>

      </section>

      <section className="ns-section ns-features">

        <div className="ns-section-heading">
          <div>
            <p className="eyebrow">WHY NAGASPHERE</p>
            <h2>Built for Our Community</h2>
          </div>
        </div>

        <div className="ns-feature-grid">

          {[
            ["🛡️", "Safe & Secure", "Trade with confidence through a community-focused marketplace."],
            ["🤝", "Support Local", "Keep opportunities and spending closer to home."],
            ["✨", "Wide Variety", "Find products, services and everyday needs in one place."],
            ["📍", "Nagaland Focused", "Discover sellers and businesses across the state."],
            ["🌿", "Community Driven", "A marketplace designed around local people and needs."]
          ].map(([icon, title, text]) => (
            <article key={title}>
              <span>{icon}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}

        </div>

      </section>

      <section className="ns-section">

        <div className="ns-section-heading">
          <div>
            <p className="eyebrow">LOCAL PICKS</p>
            <h2>Featured Listings</h2>
          </div>

          <a href="/listing">View all →</a>
        </div>

        <div className="ns-listing-grid">

          {listings.map(
            ([title, price, location, seller, rating, image]) => (
              <a
                className="ns-listing-card"
                href="/listing"
                key={title}
              >
                <img src={image} alt={title} />

                <div className="ns-listing-body">

                  <span className="ns-price">{price}</span>

                  <h3>{title}</h3>

                  <p>📍 {location}</p>

                  <div>
                    <span>{seller}</span>
                    <strong>★ {rating}</strong>
                  </div>

                </div>
              </a>
            )
          )}

        </div>

      </section>

      <section className="ns-cta">

        <div>
          <p className="eyebrow">TOGETHER</p>

          <h2>
            Support Local. Build a Stronger Nagaland.
          </h2>

          <p>
            Explore what local sellers have to offer and discover your next
            favourite.
          </p>
        </div>

        <a href="/listing">
          Start Exploring →
        </a>

      </section>

      <footer className="ns-footer">

        <div className="ns-footer-main">

          <div className="ns-footer-brand">
            <img src="/nagasphere-logo.png" alt="NagaSphere" />

            <h3>NagaSphere</h3>

            <p>Local Needs • Global Reach</p>

            <span>Proudly Nagaland</span>
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
            <a href="/profile">My Account</a>
            <a href="/messages">Messages</a>
            <a href="/create-listing">Sell on NagaSphere</a>
          </div>

          <div>
            <h4>Stay Connected</h4>

            <p>
              Join the local marketplace built for Nagaland.
            </p>

            <form
              className="ns-newsletter"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                aria-label="Email"
                type="email"
                placeholder="Your email"
              />

              <button>Join</button>
            </form>
          </div>

        </div>

        <div className="ns-footer-bottom">
          © 2026 NagaSphere. Built for Nagaland.
        </div>

      </footer>

    </main>
  );
}
