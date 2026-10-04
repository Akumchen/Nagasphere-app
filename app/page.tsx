"use client";

import React from "react";

const categories = [
  { name: "Fresh Produce", image: "/fresh-produce.png" },
  { name: "Food & Beverages", image: "/food-beverages.png" },
  { name: "Handicrafts", image: "/handicrafts.png" },
  { name: "Fashion & Apparel", image: "/fashion-apparel.png" },
  { name: "Home & Living", image: "/home-living.png" },
  { name: "Electronics", image: "/electronics.png" },
  { name: "Services", image: "/support.png" },
  { name: "More", image: "/basket.png" },
];

const listings = [
  {
    name: "Naga Oranges",
    type: "Local",
    price: "₹180",
    unit: "/ kg",
    location: "Kohima",
    seller: "Naga Valley Farms",
    rating: "4.9",
    reviews: "24",
    image: "/oranges.png",
  },
  {
    name: "Pure Naga Honey",
    type: "Local",
    price: "₹450",
    unit: "/ 500g",
    location: "Mokokchung",
    seller: "Naga Honey Co.",
    rating: "4.8",
    reviews: "18",
    image: "/honey.png",
  },
  {
    name: "Traditional Bamboo Basket",
    type: "Handmade",
    price: "₹650",
    unit: "",
    location: "Dimapur",
    seller: "Naga Craft House",
    rating: "5.0",
    reviews: "11",
    image: "/basket.png",
  },
  {
    name: "Naga Shawl",
    type: "Traditional",
    price: "₹1,800",
    unit: "",
    location: "Kohima",
    seller: "Heritage Weaves",
    rating: "4.9",
    reviews: "31",
    image: "/shawl.png",
  },
  {
    name: "Bamboo Lamp",
    type: "Handmade",
    price: "₹950",
    unit: "",
    location: "Dimapur",
    seller: "Bamboo Artisans",
    rating: "4.8",
    reviews: "16",
    image: "/lamp.png",
  },
  {
    name: "Organic Vegetables",
    type: "Fresh",
    price: "₹120",
    unit: "/ kg",
    location: "Wokha",
    seller: "Green Valley Farm",
    rating: "4.9",
    reviews: "27",
    image: "/vegetables.png",
  },
];

const features = [
  {
    icon: "✓",
    title: "Safe & Secure",
    text: "Your trust matters. We keep your data and transactions safe.",
  },
  {
    icon: "♥",
    title: "Support Local",
    text: "Help local farmers, artisans and small businesses grow.",
  },
  {
    icon: "◆",
    title: "Wide Variety",
    text: "From fresh produce to daily needs, find it all in one place.",
  },
  {
    icon: "⌂",
    title: "Nagaland Focused",
    text: "Built for our people, our culture, our future.",
  },
  {
    icon: "●",
    title: "Community Driven",
    text: "Real people. Real businesses. A stronger Nagaland.",
  },
];

function SearchIcon() {
  return <span aria-hidden="true">⌕</span>;
}

function Chevron() {
  return <span aria-hidden="true">⌄</span>;
}

export default function HomePage() {
  return (
    <>
      <main className="ns-page">

        {/* HERO */}
        <section className="ns-hero">
          <header className="ns-header">
            <div className="ns-header-inner">
              <a href="/" className="ns-brand">
                <img
                  src="/nagasphere-logo.png"
                  alt="NagaSphere"
                  className="ns-logo"
                />
                <div className="ns-brand-copy">
                  <strong>NagaSphere</strong>
                  <span>Local Needs · Global Reach</span>
                </div>
              </a>

              <nav className="ns-nav">
                <a href="/" className="active">
                  Home
                </a>

                <a href="/marketplace">
                  Marketplace <Chevron />
                </a>

                <a href="#categories">Categories</a>

                <a href="/requests">My Requests</a>

                <a href="/messages" className="ns-nav-badge">
                  Messages <b>3</b>
                </a>

                <a href="#more">
                  More <Chevron />
                </a>

                <button className="ns-icon-button" aria-label="Search">
                  <SearchIcon />
                </button>

                <button
                  className="ns-icon-button ns-bell"
                  aria-label="Notifications"
                >
                  ♧<b>0</b>
                </button>

                <a href="/account" className="ns-account">
                  My Account
                </a>
              </nav>
            </div>
          </header>

          <div className="ns-hero-inner">
            <div className="ns-hero-copy">
              <div className="ns-welcome">WELCOME TO</div>

              <h1>
                Naga<span>Sphere</span>
              </h1>

              <div className="ns-handwritten">
                Buy • Sell • Support Local
              </div>

              <p>
                Your trusted online marketplace in Nagaland — connecting
                farmers, local businesses and consumers, for a stronger
                community and a brighter future.
              </p>

              <div className="ns-search">
                <SearchIcon />

                <input
                  type="text"
                  placeholder="What are you looking for?"
                  aria-label="Search NagaSphere"
                />

                <button>Search</button>
              </div>
            </div>

            <div className="ns-hero-note">
              <div>Local Products</div>
              <div>Local People</div>
              <div>Stronger Together</div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="categories" className="ns-category-section">
          <div className="ns-section-inner">
            <div className="ns-section-heading">
              <div>
                <span>EXPLORE</span>
                <h2>Shop by Category</h2>
              </div>

              <a href="/marketplace">View All →</a>
            </div>

            <div className="ns-category-row">
              {categories.map((category) => (
                <a
                  href="/marketplace"
                  className="ns-category"
                  key={category.name}
                >
                  <div className="ns-category-image">
                    <img src={category.image} alt="" />
                  </div>

                  <span>{category.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="ns-feature-strip">
          <div className="ns-feature-inner">
            {features.map((feature) => (
              <div className="ns-feature" key={feature.title}>
                <div className="ns-feature-icon">{feature.icon}</div>

                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED LISTINGS */}
        <section className="ns-listings-section">
          <div className="ns-section-inner">
            <div className="ns-section-heading">
              <div>
                <span>DISCOVER</span>
                <h2>Featured Listings</h2>
              </div>

              <a href="/marketplace">View All →</a>
            </div>

            <div className="ns-listings-row">
              {listings.map((item) => (
                <article className="ns-listing-card" key={item.name}>
                  <div className="ns-listing-image">
                    <img src={item.image} alt={item.name} />

                    <span className="ns-listing-tag">
                      {item.type}
                    </span>

                    <button aria-label="Save listing">
                      ♡
                    </button>
                  </div>

                  <div className="ns-listing-body">
                    <h3>{item.name}</h3>

                    <div className="ns-listing-price">
                      {item.price}
                      <small>{item.unit}</small>
                    </div>

                    <div className="ns-listing-location">
                      <span>⌖</span> {item.location}
                    </div>

                    <div className="ns-listing-footer">
                      <span>{item.seller}</span>

                      <span className="ns-rating">
                        ★ {item.rating}
                        <small>({item.reviews})</small>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SUPPORT LOCAL */}
        <section className="ns-cta">
          <div className="ns-cta-inner">
            <div className="ns-cta-image">
              <img
                src="/vegetables.png"
                alt="Supporting local farmers"
              />
            </div>

            <div className="ns-cta-copy">
              <span>TOGETHER WE GROW</span>

              <h2>
                Support Local.
                <br />
                Build a Stronger Nagaland.
              </h2>

              <p>
                Every purchase makes a difference — for our farmers,
                our businesses and our community.
              </p>

              <a
                href="/marketplace"
                className="ns-cta-button"
              >
                Start Exploring
              </a>
            </div>

            <div className="ns-cta-leaf" aria-hidden="true">
              ❯
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ns-footer">
          <div className="ns-footer-inner">
            <div className="ns-footer-brand">
              <div className="ns-footer-logo-row">
                <img
                  src="/nagasphere-logo.png"
                  alt="NagaSphere"
                />

                <div>
                  <strong>NagaSphere</strong>
                  <span>Local Needs · Global Reach</span>
                </div>
              </div>

              <p>
                Connecting Nagaland. Supporting local.
                Building a stronger community together.
              </p>

              <strong className="ns-proud">
                Proudly Nagaland
              </strong>
            </div>

            <div className="ns-footer-column">
              <h3>Quick Links</h3>

              <a href="/">Home</a>
              <a href="/marketplace">Marketplace</a>
              <a href="#categories">Categories</a>
              <a href="/requests">My Requests</a>
            </div>

            <div className="ns-footer-column">
              <h3>Support</h3>

              <a href="/help">Help Centre</a>
              <a href="/contact">Contact Us</a>
              <a href="/terms">Terms & Conditions</a>
              <a href="/privacy">Privacy Policy</a>
            </div>

            <div className="ns-footer-column ns-newsletter">
              <h3>Stay Connected</h3>

              <p>
                Get local marketplace updates and news.
              </p>

              <div className="ns-newsletter-form">
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                />

                <button aria-label="Subscribe">
                  →
                </button>
              </div>

              <div className="ns-socials">
                <a href="#" aria-label="Facebook">
                  f
                </a>

                <a href="#" aria-label="Instagram">
                  ◎
                </a>

                <a href="#" aria-label="YouTube">
                  ▶
                </a>
              </div>
            </div>
          </div>

          <div className="ns-footer-bottom">
            <span>
              © {new Date().getFullYear()} NagaSphere.
              All rights reserved.
            </span>

            <span>Made for Nagaland ♥</span>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #fff;
          color: #203d2c;
          font-family: Inter, Arial, Helvetica, sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }

        /* =========================
           HERO
        ========================= */

        .ns-hero {
          position: relative;
          min-height: 560px;
          color: #fff;
          overflow: hidden;

          background:
            linear-gradient(
              90deg,
              rgba(8, 32, 20, 0.70) 0%,
              rgba(8, 32, 20, 0.34) 52%,
              rgba(8, 32, 20, 0.12) 100%
            ),
            url("/nagasphere-hero.jpg")
              center center / cover no-repeat;
        }

        .ns-header {
          position: absolute;
          z-index: 20;
          top: 0;
          left: 0;
          width: 100%;

          background: rgba(12, 35, 22, 0.18);
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        }

        .ns-header-inner {
          width: min(1180px, calc(100% - 50px));
          height: 74px;
          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .ns-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
        }

        .ns-logo {
          width: 44px;
          height: 44px;
          object-fit: contain;
        }

        .ns-brand-copy {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .ns-brand-copy strong {
          font-size: 20px;
          font-weight: 800;
        }

        .ns-brand-copy span {
          margin-top: 3px;
          font-size: 8px;
          letter-spacing: 1.3px;
          opacity: 0.82;
          text-transform: uppercase;
        }

        .ns-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
          font-size: 12px;
          white-space: nowrap;
        }

        .ns-nav > a {
          position: relative;
          height: 74px;

          display: inline-flex;
          align-items: center;
          gap: 4px;

          color: rgba(255, 255, 255, 0.94);
        }

        .ns-nav > a.active {
          font-weight: 700;
        }

        .ns-nav > a.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 15px;

          height: 2px;
          border-radius: 99px;
          background: #b7d86a;
        }

        .ns-nav-badge {
          gap: 6px !important;
        }

        .ns-nav-badge b,
        .ns-bell b {
          min-width: 16px;
          height: 16px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;
          background: #a8cf59;
          color: #18331f;

          font-size: 8px;
          font-weight: 800;
        }

        .ns-icon-button {
          width: 29px;
          height: 29px;
          padding: 0;
          border: 0;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          position: relative;

          background: transparent;
          color: #fff;
          cursor: pointer;
          font-size: 19px;
        }

        .ns-bell {
          font-size: 15px;
        }

        .ns-bell b {
          position: absolute;
          top: 0;
          right: -3px;

          min-width: 12px;
          height: 12px;
          font-size: 6px;
        }

        .ns-account {
          padding: 9px 13px !important;
          height: auto !important;

          border: 1px solid rgba(255, 255, 255, 0.48);
          border-radius: 5px;
          font-weight: 600;
        }

        .ns-account::after {
          display: none !important;
        }

        /* HERO CONTENT */

        .ns-hero-inner {
          position: relative;
          z-index: 2;

          width: min(1180px, calc(100% - 50px));
          min-height: 560px;
          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 100px 25px 55px;
        }

        .ns-hero-copy {
          width: min(650px, 64%);
          padding-top: 20px;
        }

        .ns-welcome {
          margin-bottom: 6px;

          font-size: 12px;
          letter-spacing: 3.5px;
          font-weight: 700;
        }

        .ns-hero-copy h1 {
          margin: 0;

          color: #fff;
          font-size: clamp(56px, 7vw, 88px);
          line-height: 0.94;
          letter-spacing: -4px;
          font-weight: 800;
        }

        .ns-hero-copy h1 span {
          color: #9fd15a;
        }

        .ns-handwritten {
          margin: 12px 0 19px 7px;

          color: #d4e8a4;

          font-family:
            "Comic Sans MS",
            "Segoe Print",
            cursive;

          font-size: clamp(19px, 2vw, 27px);
          transform: rotate(-2deg);
        }

        .ns-hero-copy p {
          max-width: 620px;
          margin: 0 0 22px;

          color: rgba(255, 255, 255, 0.94);
          font-size: 14px;
          line-height: 1.65;
        }

        .ns-search {
          width: min(600px, 100%);
          height: 54px;

          display: flex;
          align-items: center;

          background: #fff;
          border-radius: 6px;
          overflow: hidden;

          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
        }

        .ns-search > span {
          margin-left: 17px;
          color: #6b806d;
          font-size: 22px;
        }

        .ns-search input {
          flex: 1;
          min-width: 0;
          height: 100%;

          padding: 0 13px;

          border: 0;
          outline: 0;

          background: transparent;
          color: #24402e;
          font-size: 13px;
        }

        .ns-search input::placeholder {
          color: #849184;
        }

        .ns-search button {
          height: 39px;
          margin-right: 7px;
          padding: 0 23px;

          border: 0;
          border-radius: 4px;

          background: #72a940;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .ns-hero-note {
          align-self: center;

          margin: 65px 20px 0 0;

          color: #d9eaa9;

          font-family:
            "Comic Sans MS",
            "Segoe Print",
            cursive;

          font-size: 20px;
          line-height: 1.7;

          transform: rotate(-5deg);
          text-shadow: 0 2px 7px rgba(0, 0, 0, 0.25);
        }

        .ns-hero-note div:nth-child(2) {
          margin-left: 21px;
        }

        .ns-hero-note div:nth-child(3) {
          margin-left: 42px;
        }

        /* =========================
           SHARED
        ========================= */

        .ns-section-inner {
          width: min(1140px, calc(100% - 50px));
          margin: 0 auto;
        }

        .ns-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .ns-section-heading > div > span {
          display: block;
          margin-bottom: 4px;

          color: #82aa4d;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2.4px;
        }

        .ns-section-heading h2 {
          margin: 0;

          color: #21432f;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 29px;
          font-weight: 700;
        }

        .ns-section-heading > a {
          color: #6e9b42;
          font-size: 12px;
          font-weight: 700;
        }

        /* =========================
           CATEGORIES
        ========================= */

        .ns-category-section {
          padding: 39px 0 37px;
          background: #fff;
        }

        .ns-category-row {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 14px;
        }

        .ns-category {
          min-width: 0;
          text-align: center;
        }

        .ns-category-image {
          width: 82px;
          height: 82px;

          margin: 0 auto 9px;

          overflow: hidden;
          border-radius: 50%;
          border: 1px solid #e0ead8;

          background: #edf4e6;
        }

        .ns-category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;

          transition: transform 0.25s ease;
        }

        .ns-category:hover img {
          transform: scale(1.06);
        }

        .ns-category > span {
          display: block;

          color: #304b38;
          font-size: 11px;
          line-height: 1.3;
          font-weight: 600;
        }

        /* =========================
           FEATURES
        ========================= */

        .ns-feature-strip {
          padding: 24px 0;

          background: #eef6e8;

          border-top: 1px solid #e3eddc;
          border-bottom: 1px solid #e3eddc;
        }

        .ns-feature-inner {
          width: min(1140px, calc(100% - 50px));
          margin: 0 auto;

          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
        }

        .ns-feature {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .ns-feature-icon {
          flex: 0 0 35px;

          width: 35px;
          height: 35px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;
          background: #7eaa4c;
          color: #fff;

          font-size: 15px;
          font-weight: 700;
        }

        .ns-feature h3 {
          margin: 0 0 4px;

          color: #315239;
          font-size: 11px;
          font-weight: 800;
        }

        .ns-feature p {
          margin: 0;

          color: #6e7f71;
          font-size: 9px;
          line-height: 1.4;
        }

        /* =========================
           LISTINGS
        ========================= */

        .ns-listings-section {
          padding: 43px 0 46px;
          background: #fff;
        }

        .ns-listings-row {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 12px;
        }

        .ns-listing-card {
          min-width: 0;
          overflow: hidden;

          background: #fff;
          border: 1px solid #e2e9df;
          border-radius: 7px;

          box-shadow: 0 4px 16px rgba(36, 65, 43, 0.055);
        }

        .ns-listing-image {
          position: relative;
          aspect-ratio: 1 / 0.82;
          overflow: hidden;
          background: #edf2e9;
        }

        .ns-listing-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .ns-listing-tag {
          position: absolute;
          top: 8px;
          left: 8px;

          padding: 4px 7px;

          border-radius: 3px;
          background: rgba(255, 255, 255, 0.93);

          color: #56783e;
          font-size: 8px;
          font-weight: 700;
        }

        .ns-listing-image button {
          position: absolute;
          top: 6px;
          right: 6px;

          width: 26px;
          height: 26px;

          border: 0;
          border-radius: 50%;

          background: rgba(255, 255, 255, 0.92);
          color: #557052;

          font-size: 16px;
          cursor: pointer;
        }

        .ns-listing-body {
          padding: 10px;
        }

        .ns-listing-body h3 {
          min-height: 32px;
          margin: 0 0 4px;

          color: #294731;
          font-size: 12px;
          line-height: 1.3;
        }

        .ns-listing-price {
          color: #5f913b;
          font-size: 16px;
          font-weight: 800;
        }

        .ns-listing-price small {
          color: #788479;
          font-size: 8px;
          font-weight: 500;
        }

        .ns-listing-location {
          margin-top: 7px;
          color: #79857b;
          font-size: 8px;
        }

        .ns-listing-location span {
          color: #7da348;
        }

        .ns-listing-footer {
          margin-top: 9px;
          padding-top: 8px;

          border-top: 1px solid #edf0eb;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 3px;

          color: #718076;
          font-size: 7px;
        }

        .ns-rating {
          color: #789f45;
          font-weight: 800;
          white-space: nowrap;
        }

        .ns-rating small {
          color: #9a9f9b;
          font-weight: 500;
          margin-left: 2px;
        }

        /* =========================
           CTA
        ========================= */

        .ns-cta {
          overflow: hidden;
          background: #eaf3e2;
        }

        .ns-cta-inner {
          width: min(1140px, calc(100% - 50px));
          min-height: 225px;

          margin: 0 auto;

          display: grid;
          grid-template-columns: 36% 1fr 105px;
          align-items: stretch;
        }

        .ns-cta-image {
          min-height: 225px;
          overflow: hidden;
        }

        .ns-cta-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .ns-cta-copy {
          padding: 35px 37px;
        }

        .ns-cta-copy > span {
          color: #82a953;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .ns-cta-copy h2 {
          margin: 7px 0 9px;

          color: #244832;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 28px;
          line-height: 1.15;
        }

        .ns-cta-copy p {
          max-width: 500px;
          margin: 0 0 16px;

          color: #6d7e70;
          font-size: 11px;
          line-height: 1.5;
        }

        .ns-cta-button {
          min-height: 38px;
          padding: 0 18px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 4px;

          background: #72a941;
          color: #fff;

          font-size: 10px;
          font-weight: 800;
        }

        .ns-cta-leaf {
          align-self: center;
          justify-self: center;

          color: #9fca68;
          font-size: 72px;

          transform: rotate(28deg);
          opacity: 0.78;
        }

        /* =========================
           FOOTER
        ========================= */

        .ns-footer {
          background: #183827;
          color: #dfe9df;
        }

        .ns-footer-inner {
          width: min(1140px, calc(100% - 50px));
          margin: 0 auto;

          padding: 42px 0 32px;

          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.45fr;
          gap: 42px;
        }

        .ns-footer-logo-row {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .ns-footer-logo-row img {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .ns-footer-logo-row strong {
          display: block;
          color: #fff;
          font-size: 18px;
        }

        .ns-footer-logo-row span {
          display: block;
          margin-top: 2px;
          color: #a9baa9;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .ns-footer-brand > p {
          max-width: 275px;
          margin: 15px 0 13px;

          color: #9fb0a1;
          font-size: 9px;
          line-height: 1.6;
        }

        .ns-proud {
          color: #a9cc6b;
          font-size: 9px;
          letter-spacing: 0.8px;
        }

        .ns-footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .ns-footer-column h3 {
          margin: 0 0 15px;
          color: #fff;
          font-size: 11px;
        }

        .ns-footer-column a {
          margin-bottom: 9px;
          color: #9eafa1;
          font-size: 9px;
        }

        .ns-footer-column a:hover {
          color: #d0e493;
        }

        .ns-newsletter p {
          margin: 0 0 10px;
          color: #9eafa1;
          font-size: 9px;
          line-height: 1.5;
        }

        .ns-newsletter-form {
          width: 100%;
          height: 34px;
          display: flex;
        }

        .ns-newsletter-form input {
          flex: 1;
          min-width: 0;

          padding: 0 9px;

          border: 1px solid rgba(255, 255, 255, 0.14);
          border-right: 0;
          border-radius: 4px 0 0 4px;

          outline: 0;

          background: rgba(255, 255, 255, 0.06);
          color: #fff;

          font-size: 8px;
        }

        .ns-newsletter-form button {
          width: 37px;

          border: 0;
          border-radius: 0 4px 4px 0;

          background: #73a843;
          color: #fff;
          cursor: pointer;
        }

        .ns-socials {
          display: flex;
          gap: 6px;
          margin-top: 13px;
        }

        .ns-socials a {
          width: 26px;
          height: 26px;
          margin: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 50%;

          color: #b8c7ba;
          font-size: 10px;
        }

        .ns-footer-bottom {
          width: min(1140px, calc(100% - 50px));
          margin: 0 auto;

          padding: 14px 0;

          display: flex;
          justify-content: space-between;
          gap: 20px;

          border-top: 1px solid rgba(255, 255, 255, 0.1);

          color: #809386;
          font-size: 7px;
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 700px) {
          .ns-hero {
            min-height: 430px;
            height: 430px;
            background-position: 56% center;
          }

          .ns-header {
            background: rgba(8, 30, 20, 0.18);
          }

          .ns-header-inner {
            width: calc(100% - 24px);
            height: 60px;
          }

          .ns-brand {
            gap: 5px;
          }

          .ns-logo {
            width: 36px;
            height: 36px;
          }

          .ns-brand-copy strong {
            font-size: 15px;
          }

          .ns-brand-copy span {
            font-size: 5.5px;
            letter-spacing: 1px;
          }

          .ns-nav {
            gap: 0;
          }

          .ns-nav > a:not(.ns-account),
          .ns-nav .ns-icon-button {
            display: none;
          }

          .ns-account {
            display: inline-flex !important;
            height: 30px !important;
            padding: 0 11px !important;

            align-items: center;

            border: 1px solid rgba(255, 255, 255, 0.55) !important;
            border-radius: 5px !important;

            font-size: 9px;
          }

          .ns-hero-inner {
            width: calc(100% - 28px);
            height: 430px;
            min-height: 430px;

            padding: 82px 0 20px;

            display: block;
          }

          .ns-hero-copy {
            width: 100%;
            padding-top: 10px;
          }

          .ns-welcome {
            font-size: 9px;
            letter-spacing: 2.5px;
            margin-bottom: 5px;
          }

          .ns-hero-copy h1 {
            font-size: 46px;
            line-height: 0.96;
            letter-spacing: -2.5px;
            white-space: nowrap;
          }

          .ns-handwritten {
            margin: 9px 0 13px 2px;
            font-size: 19px;
          }

          .ns-hero-copy p {
            max-width: 100%;
            font-size: 11.5px;
            line-height: 1.48;
            margin-bottom: 15px;
          }

          .ns-search {
            width: 100%;
            height: 47px;
            border-radius: 24px;
          }

          .ns-search > span {
            margin-left: 13px;
            font-size: 19px;
          }

          .ns-search input {
            padding: 0 7px;
            font-size: 11px;
          }

          .ns-search button {
            height: 37px;
            margin-right: 5px;
            padding: 0 14px;
            font-size: 10px;
          }

          .ns-hero-note {
            position: absolute;
            right: 2px;
            bottom: 18px;
            margin: 0;

            font-size: 15px;
            line-height: 1.25;
          }

          .ns-hero-note div:nth-child(2) {
            margin-left: 13px;
          }

          .ns-hero-note div:nth-child(3) {
            margin-left: 27px;
          }

          .ns-section-inner {
            width: calc(100% - 28px);
          }

          .ns-category-section {
            padding: 20px 0 21px;
          }

          .ns-section-heading {
            margin-bottom: 14px;
          }

          .ns-section-heading > div > span {
            font-size: 8px;
          }

          .ns-section-heading h2 {
            font-size: 23px;
          }

          .ns-section-heading > a {
            font-size: 9px;
          }

          .ns-category-row {
            display: flex;
            overflow-x: auto;
            gap: 15px;

            padding: 1px 0 4px;

            scrollbar-width: none;
          }

          .ns-category-row::-webkit-scrollbar {
            display: none;
          }

          .ns-category {
            flex: 0 0 68px;
          }

          .ns-category-image {
            width: 62px;
            height: 62px;
            margin-bottom: 7px;
            border-radius: 11px;
          }

          .ns-category > span {
            font-size: 9px;
          }

          .ns-feature-strip {
            width: calc(100% - 28px);
            margin: 0 auto 20px;
            padding: 13px 9px;
            border-radius: 9px;
          }

          .ns-feature-inner {
            width: 100%;

            display: flex;
            overflow-x: auto;
            gap: 8px;

            scrollbar-width: none;
          }

          .ns-feature-inner::-webkit-scrollbar {
            display: none;
          }

          .ns-feature {
            flex: 0 0 225px;
            min-height: 60px;

            padding: 7px 8px;

            border: 1px solid #e2eddf;
            border-radius: 7px;

            background: rgba(255, 255, 255, 0.22);
          }

          .ns-feature-icon {
            flex-basis: 29px;
            width: 29px;
            height: 29px;
            font-size: 13px;
          }

          .ns-feature h3 {
            font-size: 10px;
            margin: 1px 0 4px;
          }

          .ns-feature p {
            font-size: 8px;
          }

          .ns-listings-section {
            padding: 0 0 25px;
          }

          .ns-listings-row {
            display: flex;
            overflow-x: auto;
            gap: 10px;

            padding: 1px 0 6px;

            scrollbar-width: none;
          }

          .ns-listings-row::-webkit-scrollbar {
            display: none;
          }

          .ns-listing-card {
            flex: 0 0 200px;
          }

          .ns-listing-body h3 {
            font-size: 10px;
          }

          .ns-listing-price {
            font-size: 13px;
          }

          .ns-cta {
            width: calc(100% - 28px);
            margin: 0 auto 14px;
            border-radius: 8px;
          }

          .ns-cta-inner {
            min-height: 0;

            display: grid;
            grid-template-columns: 42% 58%;
            align-items: stretch;
          }

          .ns-cta-image {
            height: 140px;
            min-height: 140px;
          }

          .ns-cta-copy {
            padding: 17px 14px;
          }

          .ns-cta-copy h2 {
            font-size: 17px;
          }

          .ns-cta-copy p {
            font-size: 8.5px;
          }

          .ns-cta-button {
            min-height: 30px;
            padding: 0 11px;
            font-size: 8px;
            margin-top: 7px;
          }

          .ns-cta-leaf {
            display: none;
          }

          .ns-footer-inner {
            width: calc(100% - 28px);
            padding: 29px 0 21px;

            grid-template-columns: 1fr 1fr;
            gap: 24px 18px;
          }

          .ns-footer-brand,
          .ns-newsletter {
            grid-column: 1 / -1;
          }

          .ns-footer-column h3 {
            font-size: 10px;
          }

          .ns-footer-column a {
            font-size: 8px;
          }

          .ns-newsletter p {
            font-size: 8px;
          }

          .ns-footer-bottom {
            width: calc(100% - 28px);

            padding: 10px 0;

            flex-direction: column;
            gap: 5px;

            font-size: 7px;
          }
        }

        @media (max-width: 390px) {
          .ns-hero {
            height: 420px;
            min-height: 420px;
          }

          .ns-hero-inner {
            height: 420px;
            min-height: 420px;
          }

          .ns-brand-copy span {
            display: none;
          }

          .ns-hero-copy h1 {
            font-size: 43px;
          }

          .ns-handwritten {
            font-size: 18px;
          }

          .ns-hero-copy p {
            font-size: 11px;
          }

          .ns-hero-note {
            font-size: 14px;
            bottom: 17px;
          }

          .ns-category {
            flex-basis: 66px;
          }

          .ns-category-image {
            width: 60px;
            height: 60px;
          }

          .ns-feature {
            flex-basis: 215px;
          }

          .ns-listing-card {
            flex-basis: 190px;
          }

          .ns-cta-inner {
            grid-template-columns: 1fr;
          }

          .ns-cta-image {
            height: 145px;
            min-height: 145px;
          }
        }
      `}</style>
    </>
  );
}
