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
                <a href="/" className="active">Home</a>

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

                <button className="ns-icon-button ns-bell" aria-label="Notifications">
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
                    <span className="ns-listing-tag">{item.type}</span>
                    <button aria-label="Save listing">♡</button>
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

        {/* SUPPORT LOCAL CTA */}
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
              <h2>Support Local.<br />Build a Stronger Nagaland.</h2>

              <p>
                Every purchase makes a difference — for our farmers,
                our businesses and our community.
              </p>

              <a href="/marketplace" className="ns-cta-button">
                Start Exploring
              </a>
            </div>

            <div className="ns-cta-leaf" aria-hidden="true">❯</div>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="ns-footer">
          <div className="ns-footer-inner">

            <div className="ns-footer-brand">
              <div className="ns-footer-logo-row">
                <img src="/nagasphere-logo.png" alt="NagaSphere" />
                <div>
                  <strong>NagaSphere</strong>
                  <span>Local Needs · Global Reach</span>
                </div>
              </div>

              <p>
                Connecting Nagaland. Supporting local.
                Building a stronger community together.
              </p>

              <strong className="ns-proud">Proudly Nagaland</strong>
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
              <p>Get local marketplace updates and news.</p>

              <div className="ns-newsletter-form">
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                />
                <button aria-label="Subscribe">→</button>
              </div>

              <div className="ns-socials">
                <a href="#" aria-label="Facebook">f</a>
                <a href="#" aria-label="Instagram">◎</a>
                <a href="#" aria-label="YouTube">▶</a>
              </div>
            </div>

          </div>

          <div className="ns-footer-bottom">
            <span>© {new Date().getFullYear()} NagaSphere. All rights reserved.</span>
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
          font-family: Inter, Arial, Helvetica, sans-serif;
          color: #203d2c;
          background: #fff;
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
          min-height: 620px;
          color: #fff;
          background:
            linear-gradient(
              90deg,
              rgba(8, 32, 20, 0.72) 0%,
              rgba(8, 32, 20, 0.38) 48%,
              rgba(8, 32, 20, 0.18) 100%
            ),
            url("/nagasphere-hero.jpg") center center / cover no-repeat;
        }

        .ns-header {
          position: absolute;
          z-index: 20;
          top: 0;
          left: 0;
          width: 100%;
          background: rgba(12, 35, 22, 0.20);
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        }

        .ns-header-inner {
          width: min(1180px, calc(100% - 54px));
          height: 82px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .ns-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .ns-logo {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        .ns-brand-copy {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .ns-brand-copy strong {
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .ns-brand-copy span {
          margin-top: 4px;
          font-size: 9px;
          letter-spacing: 1.5px;
          opacity: 0.82;
          text-transform: uppercase;
        }

        .ns-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 19px;
          font-size: 13px;
          white-space: nowrap;
        }

        .ns-nav > a {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          height: 82px;
          color: rgba(255, 255, 255, 0.92);
          transition: opacity 0.2s ease;
        }

        .ns-nav > a:hover {
          opacity: 0.72;
        }

        .ns-nav > a.active {
          font-weight: 700;
        }

        .ns-nav > a.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 18px;
          height: 2px;
          border-radius: 99px;
          background: #b7d86a;
        }

        .ns-nav-badge {
          gap: 7px !important;
        }

        .ns-nav-badge b,
        .ns-bell b {
          min-width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #a8cf59;
          color: #18331f;
          font-size: 9px;
          font-weight: 800;
        }

        .ns-icon-button {
          width: 31px;
          height: 31px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #fff;
          cursor: pointer;
          font-size: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .ns-bell {
          font-size: 16px;
        }

        .ns-bell b {
          position: absolute;
          top: 0;
          right: -3px;
          min-width: 13px;
          height: 13px;
          font-size: 7px;
        }

        .ns-account {
          padding: 10px 15px !important;
          height: auto !important;
          border: 1px solid rgba(255,255,255,0.45);
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
          width: min(1180px, calc(100% - 54px));
          min-height: 620px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 115px 25px 70px;
        }

        .ns-hero-copy {
          width: min(660px, 64%);
          padding-top: 30px;
        }

        .ns-welcome {
          font-size: 14px;
          letter-spacing: 4px;
          font-weight: 700;
          margin-bottom: 8px;
          opacity: 0.95;
        }

        .ns-hero-copy h1 {
          margin: 0;
          font-size: clamp(58px, 7vw, 91px);
          line-height: 0.94;
          font-weight: 800;
          letter-spacing: -4px;
          color: #fff;
        }

        .ns-hero-copy h1 span {
          color: #9fd15a;
        }

        .ns-handwritten {
          margin: 14px 0 22px 8px;
          color: #d4e8a4;
          font-family: "Comic Sans MS", "Segoe Print", cursive;
          font-size: clamp(20px, 2.1vw, 29px);
          transform: rotate(-2deg);
        }

        .ns-hero-copy p {
          max-width: 625px;
          margin: 0 0 26px;
          color: rgba(255,255,255,0.94);
          font-size: 16px;
          line-height: 1.7;
        }

        .ns-search {
          width: min(610px, 100%);
          height: 58px;
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 12px 32px rgba(0,0,0,0.18);
        }

        .ns-search > span {
          color: #6b806d;
          margin-left: 18px;
          font-size: 23px;
        }

        .ns-search input {
          flex: 1;
          min-width: 0;
          height: 100%;
          border: 0;
          outline: 0;
          padding: 0 14px;
          color: #24402e;
          background: transparent;
          font-size: 14px;
        }

        .ns-search input::placeholder {
          color: #849184;
        }

        .ns-search button {
          height: 42px;
          margin-right: 8px;
          padding: 0 25px;
          border: 0;
          border-radius: 4px;
          background: #72a940;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
        }

        .ns-hero-note {
          align-self: center;
          margin: 100px 22px 0 0;
          font-family: "Comic Sans MS", "Segoe Print", cursive;
          color: #d9eaa9;
          font-size: 22px;
          line-height: 1.75;
          transform: rotate(-5deg);
          text-align: left;
          text-shadow: 0 2px 7px rgba(0,0,0,0.25);
        }

        .ns-hero-note div:nth-child(2) {
          margin-left: 23px;
        }

        .ns-hero-note div:nth-child(3) {
          margin-left: 46px;
        }

        /* =========================
           SHARED SECTIONS
        ========================= */

        .ns-section-inner {
          width: min(1140px, calc(100% - 54px));
          margin: 0 auto;
        }

        .ns-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .ns-section-heading > div > span {
          display: block;
          margin-bottom: 5px;
          color: #82aa4d;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2.5px;
        }

        .ns-section-heading h2 {
          margin: 0;
          color: #21432f;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          font-weight: 700;
        }

        .ns-section-heading > a {
          color: #6e9b42;
          font-size: 13px;
          font-weight: 700;
        }

        /* =========================
           CATEGORIES
        ========================= */

        .ns-category-section {
          padding: 44px 0 42px;
          background: #fff;
        }

        .ns-category-row {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 17px;
        }

        .ns-category {
          min-width: 0;
          text-align: center;
        }

        .ns-category-image {
          width: 88px;
          height: 88px;
          margin: 0 auto 10px;
          border-radius: 50%;
          overflow: hidden;
          background: #edf4e6;
          border: 1px solid #e0ead8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ns-category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.25s ease;
        }

        .ns-category:hover img {
          transform: scale(1.06);
        }

        .ns-category > span {
          display: block;
          color: #304b38;
          font-size: 12px;
          line-height: 1.3;
          font-weight: 600;
        }

        /* =========================
           FEATURES
        ========================= */

        .ns-feature-strip {
          padding: 27px 0;
          background: #eef6e8;
          border-top: 1px solid #e3eddc;
          border-bottom: 1px solid #e3eddc;
        }

        .ns-feature-inner {
          width: min(1140px, calc(100% - 54px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 25px;
        }

        .ns-feature {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .ns-feature-icon {
          flex: 0 0 38px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #7eaa4c;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          font-weight: 700;
        }

        .ns-feature h3 {
          margin: 1px 0 5px;
          color: #315239;
          font-size: 12px;
          font-weight: 800;
        }

        .ns-feature p {
          margin: 0;
          color: #6e7f71;
          font-size: 10px;
          line-height: 1.45;
        }

        /* =========================
           LISTINGS
        ========================= */

        .ns-listings-section {
          padding: 50px 0 54px;
          background: #fff;
        }

        .ns-listings-row {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 14px;
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
          object-fit: cover;
          display: block;
        }

        .ns-listing-tag {
          position: absolute;
          top: 9px;
          left: 9px;
          padding: 4px 8px;
          border-radius: 3px;
          background: rgba(255,255,255,0.93);
          color: #56783e;
          font-size: 9px;
          font-weight: 700;
        }

        .ns-listing-image button {
          position: absolute;
          top: 7px;
          right: 7px;
          width: 27px;
          height: 27px;
          border: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          color: #557052;
          font-size: 17px;
          cursor: pointer;
        }

        .ns-listing-body {
          padding: 12px 11px 11px;
        }

        .ns-listing-body h3 {
          min-height: 34px;
          margin: 0 0 5px;
          color: #294731;
          font-size: 13px;
          line-height: 1.3;
        }

        .ns-listing-price {
          color: #5f913b;
          font-size: 17px;
          font-weight: 800;
        }

        .ns-listing-price small {
          color: #788479;
          font-size: 9px;
          font-weight: 500;
        }

        .ns-listing-location {
          margin-top: 8px;
          color: #79857b;
          font-size: 9px;
        }

        .ns-listing-location span {
          color: #7da348;
        }

        .ns-listing-footer {
          margin-top: 11px;
          padding-top: 9px;
          border-top: 1px solid #edf0eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          color: #718076;
          font-size: 8px;
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
          background: #eaf3e2;
          overflow: hidden;
        }

        .ns-cta-inner {
          width: min(1140px, calc(100% - 54px));
          min-height: 245px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 36% 1fr 130px;
          align-items: stretch;
        }

        .ns-cta-image {
          min-height: 245px;
          overflow: hidden;
        }

        .ns-cta-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .ns-cta-copy {
          padding: 42px 40px;
        }

        .ns-cta-copy > span {
          color: #82a953;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .ns-cta-copy h2 {
          margin: 8px 0 10px;
          color: #244832;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          line-height: 1.15;
        }

        .ns-cta-copy p {
          max-width: 510px;
          margin: 0 0 19px;
          color: #6d7e70;
          font-size: 12px;
          line-height: 1.55;
        }

        .ns-cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 0 19px;
          border-radius: 4px;
          background: #72a941;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
        }

        .ns-cta-leaf {
          align-self: center;
          justify-self: center;
          color: #9fca68;
          font-size: 85px;
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
          width: min(1140px, calc(100% - 54px));
          margin: 0 auto;
          padding: 48px 0 36px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.45fr;
          gap: 55px;
        }

        .ns-footer-logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ns-footer-logo-row img {
          width: 45px;
          height: 45px;
          object-fit: contain;
        }

        .ns-footer-logo-row strong {
          display: block;
          color: #fff;
          font-size: 19px;
        }

        .ns-footer-logo-row span {
          display: block;
          margin-top: 3px;
          color: #a9baa9;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .ns-footer-brand > p {
          max-width: 280px;
          margin: 17px 0 15px;
          color: #9fb0a1;
          font-size: 10px;
          line-height: 1.65;
        }

        .ns-proud {
          color: #a9cc6b;
          font-size: 10px;
          letter-spacing: 0.8px;
        }

        .ns-footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .ns-footer-column h3 {
          margin: 0 0 17px;
          color: #fff;
          font-size: 12px;
        }

        .ns-footer-column a {
          margin-bottom: 10px;
          color: #9eafa1;
          font-size: 10px;
        }

        .ns-footer-column a:hover {
          color: #d0e493;
        }

        .ns-newsletter p {
          margin: 0 0 12px;
          color: #9eafa1;
          font-size: 10px;
          line-height: 1.5;
        }

        .ns-newsletter-form {
          width: 100%;
          display: flex;
          height: 36px;
        }

        .ns-newsletter-form input {
          min-width: 0;
          flex: 1;
          border: 1px solid rgba(255,255,255,0.14);
          border-right: 0;
          border-radius: 4px 0 0 4px;
          outline: 0;
          background: rgba(255,255,255,0.06);
          color: #fff;
          padding: 0 10px;
          font-size: 9px;
        }

        .ns-newsletter-form button {
          width: 39px;
          border: 0;
          border-radius: 0 4px 4px 0;
          background: #73a843;
          color: #fff;
          cursor: pointer;
        }

        .ns-socials {
          display: flex;
          gap: 7px;
          margin-top: 15px;
        }

        .ns-socials a {
          width: 27px;
          height: 27px;
          margin: 0;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #b8c7ba;
          font-size: 11px;
        }

        .ns-footer-bottom {
          width: min(1140px, calc(100% - 54px));
          margin: 0 auto;
          padding: 15px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #809386;
          font-size: 8px;
        }

        /* =========================
           MOBILE
           Deliberate mobile version
           of the same original design
        ========================= */

        @media (max-width: 700px) {

          .ns-hero {
            min-height: 650px;
            background-position: 55% center;
          }

          .ns-header {
            position: absolute;
            background: rgba(10, 31, 19, 0.28);
          }

          .ns-header-inner {
            width: calc(100% - 28px);
            height: 67px;
            justify-content: center;
          }

          .ns-brand {
            position: absolute;
            left: 0;
          }

          .ns-logo {
            width: 39px;
            height: 39px;
          }

          .ns-brand-copy strong {
            font-size: 16px;
          }

          .ns-brand-copy span {
            font-size: 6px;
            letter-spacing: 1px;
          }

          .ns-nav {
            margin-left: auto;
            gap: 8px;
          }

          .ns-nav > a:not(.ns-account),
          .ns-nav .ns-icon-button {
            display: none;
          }

          .ns-account {
            display: inline-flex !important;
            height: 32px !important;
            padding: 0 10px !important;
            align-items: center;
            font-size: 9px;
          }

          .ns-hero-inner {
            width: calc(100% - 28px);
            min-height: 650px;
            padding: 108px 0 38px;
            display: block;
          }

          .ns-hero-copy {
            width: 100%;
            padding-top: 45px;
          }

          .ns-welcome {
            font-size: 10px;
            letter-spacing: 3px;
          }

          .ns-hero-copy h1 {
            font-size: clamp(52px, 17vw, 74px);
            letter-spacing: -3px;
          }

          .ns-handwritten {
            margin: 12px 0 19px 3px;
            font-size: 20px;
          }

          .ns-hero-copy p {
            max-width: 100%;
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 21px;
          }

          .ns-search {
            height: 52px;
          }

          .ns-search > span {
            margin-left: 13px;
            font-size: 20px;
          }

          .ns-search input {
            padding: 0 8px;
            font-size: 12px;
          }

          .ns-search button {
            height: 38px;
            margin-right: 7px;
            padding: 0 13px;
            font-size: 10px;
          }

          .ns-hero-note {
            position: absolute;
            right: 2px;
            bottom: 25px;
            margin: 0;
            font-size: 16px;
            line-height: 1.55;
          }

          .ns-hero-note div:nth-child(2) {
            margin-left: 15px;
          }

          .ns-hero-note div:nth-child(3) {
            margin-left: 29px;
          }

          .ns-section-inner {
            width: calc(100% - 28px);
          }

          .ns-section-heading {
            margin-bottom: 18px;
          }

          .ns-section-heading h2 {
            font-size: 25px;
          }

          .ns-section-heading > a {
            font-size: 10px;
          }

          .ns-category-section {
            padding: 31px 0 28px;
          }

          .ns-category-row {
            display: flex;
            overflow-x: auto;
            gap: 17px;
            padding: 2px 1px 8px;
            margin-right: -14px;
            scrollbar-width: none;
            scroll-snap-type: x mandatory;
          }

          .ns-category-row::-webkit-scrollbar,
          .ns-listings-row::-webkit-scrollbar,
          .ns-feature-inner::-webkit-scrollbar {
            display: none;
          }

          .ns-category {
            flex: 0 0 78px;
            scroll-snap-align: start;
          }

          .ns-category-image {
            width: 70px;
            height: 70px;
          }

          .ns-category > span {
            font-size: 10px;
          }

          .ns-feature-strip {
            padding: 19px 0;
          }

          .ns-feature-inner {
            width: calc(100% - 28px);
            display: flex;
            overflow-x: auto;
            gap: 11px;
            padding-bottom: 2px;
            scrollbar-width: none;
            scroll-snap-type: x mandatory;
          }

          .ns-feature {
            flex: 0 0 250px;
            min-height: 68px;
            padding: 10px;
            border: 1px solid #dce8d5;
            border-radius: 6px;
            background: rgba(255,255,255,0.35);
            scroll-snap-align: start;
          }

          .ns-feature-icon {
            flex-basis: 32px;
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .ns-feature h3 {
            font-size: 11px;
          }

          .ns-feature p {
            font-size: 9px;
          }

          .ns-listings-section {
            padding: 35px 0 37px;
          }

          .ns-listings-row {
            display: flex;
            overflow-x: auto;
            gap: 12px;
            margin-right: -14px;
            padding: 2px 1px 10px;
            scrollbar-width: none;
            scroll-snap-type: x mandatory;
          }

          .ns-listing-card {
            flex: 0 0 220px;
            scroll-snap-align: start;
          }

          .ns-listing-body h3 {
            font-size: 12px;
          }

          .ns-cta-inner {
            width: 100%;
            min-height: 0;
            display: flex;
            flex-direction: column;
          }

          .ns-cta-image {
            height: 180px;
            min-height: 180px;
            order: 1;
          }

          .ns-cta-copy {
            order: 2;
            padding: 29px 22px 32px;
          }

          .ns-cta-copy h2 {
            font-size: 26px;
          }

          .ns-cta-copy p {
            font-size: 11px;
          }

          .ns-cta-leaf {
            display: none;
          }

          .ns-footer-inner {
            width: calc(100% - 28px);
            padding: 37px 0 28px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px 20px;
          }

          .ns-footer-brand {
            grid-column: 1 / -1;
          }

          .ns-newsletter {
            grid-column: 1 / -1;
          }

          .ns-footer-column h3 {
            margin-bottom: 13px;
          }

          .ns-footer-column a {
            margin-bottom: 8px;
          }

          .ns-footer-bottom {
            width: calc(100% - 28px);
            padding: 14px 0;
            flex-direction: column;
            gap: 6px;
            font-size: 8px;
          }
        }

        @media (max-width: 390px) {

          .ns-hero {
            min-height: 625px;
          }

          .ns-hero-inner {
            min-height: 625px;
          }

          .ns-brand-copy span {
            display: none;
          }

          .ns-account {
            padding: 0 8px !important;
            font-size: 8px;
          }

          .ns-hero-copy {
            padding-top: 31px;
          }

          .ns-hero-copy h1 {
            font-size: 51px;
          }

          .ns-handwritten {
            font-size: 17px;
          }

          .ns-hero-copy p {
            font-size: 12px;
          }

          .ns-search {
            height: 49px;
          }

          .ns-search button {
            padding: 0 10px;
          }

          .ns-hero-note {
            font-size: 14px;
            bottom: 22px;
          }

          .ns-listing-card {
            flex-basis: 205px;
          }

          .ns-feature {
            flex-basis: 235px;
          }
        }
      `}</style>
    </>
  );
}
