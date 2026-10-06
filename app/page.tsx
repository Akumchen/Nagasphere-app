"use client";

import React from "react";

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
  [
    "Naga Oranges (Local)",
    "₹120",
    "/ kg",
    "Dimapur",
    "Evergreen Farms",
    "4.8",
    "24",
    "/oranges.png",
  ],
  [
    "Pure Naga Honey",
    "₹450",
    "/ 250g",
    "Kohima",
    "Hilltop Organics",
    "4.9",
    "36",
    "/honey.png",
  ],
  [
    "Traditional Bamboo Basket",
    "₹1,200",
    "",
    "Mokokchung",
    "Naga Crafts",
    "4.7",
    "19",
    "/basket.png",
  ],
  [
    "Naga Shawl (Traditional)",
    "₹1,500",
    "",
    "Wokha",
    "Ao Weaves",
    "4.9",
    "28",
    "/shawl.png",
  ],
  [
    "Bamboo Lamp",
    "₹800",
    "",
    "Tuensang",
    "Creative Naga",
    "4.6",
    "15",
    "/lamp.png",
  ],
  [
    "Organic Vegetables (Mixed)",
    "₹150",
    " / kg",
    "Zunheboto",
    "Green Valley Farm",
    "4.8",
    "22",
    "/vegetables.png",
  ],
];

const features = [
  [
    "✓",
    "Safe & Secure",
    "Your trust matters. We keep your data and transactions safe.",
  ],
  [
    "♣",
    "Support Local",
    "Help local farmers, artisans and small businesses grow.",
  ],
  [
    "◒",
    "Wide Variety",
    "From fresh produce to daily needs, find it all in one place.",
  ],
  [
    "●",
    "Nagaland Focused",
    "Built for our people, our culture, our future.",
  ],
  [
    "♥",
    "Community Driven",
    "Real people. Real businesses. A stronger Nagaland.",
  ],
];

export default function HomePage() {
  return (
    <>
      {/* Desktop approved homepage */}
      <div className="approved-desktop">
        <img
          src="/NagaSphere_Local_Marketplace_in_Nagaland.png"
          alt="NagaSphere approved homepage"
        />
      </div>

      {/* Mobile homepage */}
      <main className="mobile-home">
        <section className="hero">
          {/* header */}
          <header>
            <a href="/" className="brand">
              <img src="/nagasphere-logo.png" alt="" />
              <span>
                <b>NagaSphere</b>
                <small>Local Needs · Global Reach</small>
              </span>
            </a>

            <div className="header-actions">
              <a href="/listing" className="marketplace-button">
                Marketplace
              </a>

              <a href="/dashboard" className="account">
                My Account
              </a>
            </div>
          </header>

          <div className="hero-content">
            <div className="welcome">WELCOME TO</div>

            <h1>
              Naga<span>Sphere</span>
            </h1>

            <div className="script">
              Buy · Sell · Support Local
            </div>

            <p>
              Nagaland&apos;s local marketplace connecting people,
              products, services and opportunities.
            </p>

            <div className="search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="What are you looking for?"
                aria-label="Search"
              />

              <button type="button">Search</button>
            </div>

            <div className="note">
              <i>✓</i>
              Buy from local sellers
            </div>

            <div className="note">
              <i>✓</i>
              Sell your products &amp; services
            </div>

            <div className="note">
              <i>✓</i>
              Support Nagaland businesses
            </div>
          </div>
        </section>

        <section className="categories">
          <div className="heading">
            <small>EXPLORE</small>
            <h2>Shop by Category</h2>
            <a href="/marketplace">View all →</a>
          </div>

          <div className="cat-row">
            {categories.map(([name, image]) => (
              <a href="/marketplace" className="cat" key={name}>
                <img src={image} alt="" />
                <b>{name}</b>
              </a>
            ))}
          </div>
        </section>

        <section className="features">
          <div className="heading">
            <small>WHY NAGASPHERE</small>
            <h2>Built for Our Community</h2>
          </div>

          <div className="feature-row">
            {features.map(([icon, title, text]) => (
              <div className="feature" key={title}>
                <strong>{icon}</strong>
                <b>{title}</b>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="listings">
          <div className="heading">
            <small>DISCOVER</small>
            <h2>Featured Listings</h2>
            <a href="/marketplace">View all →</a>
          </div>

          <div className="listing-row">
            {listings.map(
              (
                [
                  title,
                  price,
                  unit,
                  location,
                  seller,
                  rating,
                  reviews,
                  image,
                ],
                index,
              ) => (
                <article className="card" key={`${title}-${index}`}>
                  <div className="card-image">
                    <img src={image} alt={title} />

                    <span>Featured</span>

                    <button type="button" aria-label={`Save ${title}`}>
                      ♡
                    </button>
                  </div>

                  <div className="card-body">
                    <h3>{title}</h3>

                    <div className="price">
                      {price}
                      <small>{unit}</small>
                    </div>

                    <div className="location">
                      📍 {location}
                    </div>

                    <div className="seller">
                      <span>{seller}</span>
                      <span>
                        ★ {rating} ({reviews})
                      </span>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>
                <section className="cta">
          <img src="/nagasphere-logo.png" alt="" />

          <div>
            <small>READY TO GET STARTED?</small>

            <h2>Have something to sell?</h2>

            <p>
              Join NagaSphere and connect with people across Nagaland.
            </p>

            <a href="/create-listing">Post a Listing →</a>
          </div>
        </section>

        <footer>
          <div className="footer-grid">
            <div>
              <a href="/" className="footer-brand">
                <img src="/nagasphere-logo.png" alt="" />

                <span>
                  <b>NagaSphere</b>
                  <small>Local Needs · Global Reach</small>
                </span>
              </a>

              <p>
                Nagaland&apos;s local marketplace connecting our
                community.
              </p>

              <em>Built for Nagaland. Built for our people.</em>
            </div>

            <div>
              <b>Marketplace</b>

              <a href="/marketplace">Browse Listings</a>
              <a href="/create-listing">Post a Listing</a>
              <a href="/marketplace">Categories</a>
            </div>

            <div>
              <b>Support</b>

              <a href="/help">Help Center</a>
              <a href="/contact">Contact Us</a>
              <a href="/terms">Terms &amp; Conditions</a>
              <a href="/privacy">Privacy Policy</a>
            </div>

            <div>
              <b>Stay Connected</b>

              <p>
                Get updates about new listings and opportunities in
                Nagaland.
              </p>

              <div className="subscribe">
                <input
                  type="email"
                  placeholder="Your email"
                  aria-label="Your email"
                />

                <button type="button">→</button>
              </div>
            </div>
          </div>

          <div className="bottom">
            <span>© 2026 NagaSphere. All rights reserved.</span>

            <span>
              Made with ♥ for Nagaland
            </span>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          background: #f7f5ef;
          color: #173b2a;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button,
        input {
          font: inherit;
        }

        .approved-desktop {
          width: 100%;
          min-height: 100vh;
          background: #f7f5ef;
        }

        .approved-desktop img {
          display: block;
          width: 100%;
          height: auto;
        }

        .mobile-home {
          display: none;
          width: 100%;
          overflow: hidden;
          background: #f7f5ef;
        }

        .hero {
          position: relative;
          min-height: 620px;
          color: white;
          background:
            linear-gradient(
              180deg,
              rgba(5, 35, 21, 0.7),
              rgba(5, 35, 21, 0.35) 45%,
              rgba(5, 35, 21, 0.75)
            ),
            url("/NagaSphere_Local_Marketplace_in_Nagaland.png")
              center / cover no-repeat;
        }

        header {
          position: relative;
          min-height: 60px;
          padding: 8px 12px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background: rgba(8, 30, 20, 0.18);
          border-bottom:
            1px solid rgba(255, 255, 255, 0.18);
        }

        /* LEFT SIDE LOGO */
        .brand {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
        }

        .brand img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .brand span {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .brand b {
          font-size: 15px;
          line-height: 1;
          color: white;
          white-space: nowrap;
        }

        .brand small {
          margin-top: 3px;
          font-size: 5.5px;
          line-height: 1;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
          white-space: nowrap;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .marketplace-button,
        .account {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 34px;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .marketplace-button {
          color: #173b2a;
          background: #f5f0df;
        }

        .account {
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.55);
          background: rgba(255, 255, 255, 0.08);
        }

        .hero-content {
          max-width: 700px;
          padding: 100px 7vw 70px;
        }

        .welcome {
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(52px, 10vw, 90px);
          line-height: 0.95;
          font-weight: 800;
          letter-spacing: -3px;
        }

        .hero h1 span {
          color: #d6b86a;
        }

        .script {
          margin-top: 13px;
          font-size: 22px;
          font-style: italic;
          font-family: Georgia, serif;
        }

        .hero p {
          max-width: 570px;
          margin: 20px 0;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.9);
        }

        .search {
          display: flex;
          align-items: center;
          max-width: 560px;
          min-height: 52px;
          overflow: hidden;
          border-radius: 8px;
          background: white;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
        }

        .search span {
          padding-left: 16px;
          color: #718078;
          font-size: 23px;
        }

        .search input {
          flex: 1;
          min-width: 0;
          padding: 14px;
          border: 0;
          outline: none;
          color: #173b2a;
          background: transparent;
        }

        .search input::placeholder {
          color: #929b96;
        }

        .search button {
          margin-right: 5px;
          padding: 11px 17px;
          border: 0;
          border-radius: 6px;
          color: white;
          background: #174e36;
          cursor: pointer;
        }

        .note {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin: 17px 18px 0 0;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.88);
        }

        .note i {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          color: #173b2a;
          background: #d6b86a;
          font-size: 10px;
          font-style: normal;
        }

        .categories,
        .listings {
          padding: 65px 7vw;
          background: #f7f5ef;
        }

        .heading {
          position: relative;
          margin-bottom: 28px;
        }

        .heading small {
          display: block;
          margin-bottom: 7px;
          color: #8a7850;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .heading h2 {
          margin: 0;
          color: #173b2a;
          font-family: Georgia, serif;
          font-size: 31px;
          line-height: 1.1;
        }

        .heading > a {
          position: absolute;
          right: 0;
          bottom: 2px;
          color: #53755f;
          font-size: 12px;
          font-weight: 700;
        }

        .cat-row,
        .listing-row,
        .feature-row {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
        }

        .cat-row::-webkit-scrollbar,
        .listing-row::-webkit-scrollbar,
        .feature-row::-webkit-scrollbar {
          display: none;
        }
                .cat {
          flex: 0 0 125px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
        }

        .cat img {
          width: 105px;
          height: 105px;
          object-fit: cover;
          border-radius: 50%;
          background: #e8e3d7;
        }

        .cat b {
          color: #254b37;
          font-size: 12px;
          line-height: 1.3;
        }

        .features {
          padding: 65px 7vw;
          background: #e8e3d7;
        }

        .feature {
          flex: 0 0 190px;
          padding: 20px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.65);
        }

        .feature > strong {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          margin-bottom: 15px;
          border-radius: 50%;
          color: #173b2a;
          background: #d6b86a;
          font-size: 17px;
        }

        .feature b {
          display: block;
          margin-bottom: 8px;
          color: #173b2a;
          font-size: 14px;
        }

        .feature p {
          margin: 0;
          color: #68766d;
          font-size: 11px;
          line-height: 1.6;
        }

        .listing-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          overflow: visible;
        }

        .card {
          min-width: 0;
          overflow: hidden;
          border-radius: 12px;
          background: white;
          box-shadow: 0 8px 25px rgba(30, 50, 40, 0.08);
        }

        .card-image {
          position: relative;
          aspect-ratio: 1.25;
          overflow: hidden;
          background: #e8e3d7;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-image span {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 5px 8px;
          border-radius: 4px;
          color: white;
          background: #174e36;
          font-size: 9px;
          font-weight: 700;
        }

        .card-image button {
          position: absolute;
          top: 9px;
          right: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: 0;
          border-radius: 50%;
          color: #173b2a;
          background: rgba(255, 255, 255, 0.9);
          cursor: pointer;
        }

        .card-body {
          padding: 15px;
        }

        .card h3 {
          margin: 0 0 8px;
          color: #173b2a;
          font-size: 14px;
          line-height: 1.35;
        }

        .price {
          color: #174e36;
          font-size: 18px;
          font-weight: 800;
        }

        .price small {
          color: #778078;
          font-size: 10px;
          font-weight: 500;
        }

        .location {
          margin-top: 8px;
          color: #778078;
          font-size: 10px;
        }

        .seller {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: 13px;
          padding-top: 11px;
          border-top: 1px solid #eeeae2;
          color: #69766e;
          font-size: 9px;
        }

        .seller > span:last-child {
          color: #a17c2d;
          white-space: nowrap;
        }

        .cta {
          display: flex;
          align-items: center;
          gap: 35px;
          padding: 65px 7vw;
          color: white;
          background:
            linear-gradient(
              90deg,
              rgba(9, 55, 35, 0.98),
              rgba(18, 75, 49, 0.94)
            );
        }

        .cta img {
          width: 100px;
          height: 100px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .cta > div {
          max-width: 600px;
        }

        .cta small {
          display: block;
          margin-bottom: 7px;
          color: #d6b86a;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .cta h2 {
          margin: 0;
          font-family: Georgia, serif;
          font-size: 32px;
        }

        .cta p {
          margin: 10px 0 20px;
          color: rgba(255, 255, 255, 0.78);
          font-size: 13px;
          line-height: 1.6;
        }

        .cta a {
          display: inline-flex;
          padding: 11px 17px;
          border-radius: 5px;
          color: #173b2a;
          background: #d6b86a;
          font-size: 11px;
          font-weight: 800;
        }

        footer {
          padding: 55px 7vw 25px;
          color: rgba(255, 255, 255, 0.75);
          background: #0d2b1d;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.4fr;
          gap: 35px;
          padding-bottom: 40px;
        }

        .footer-grid > div:first-child {
          max-width: 260px;
        }

        .footer-grid > div:last-child {
          max-width: 290px;
        }

        .footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 13px;
        }

        .footer-brand img {
          width: 38px;
          height: 38px;
          object-fit: contain;
        }

        .footer-brand span {
          display: flex;
          flex-direction: column;
        }

        .footer-brand b {
          color: white;
          font-size: 15px;
        }

        .footer-brand small {
          margin-top: 2px;
          font-size: 5.5px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .footer-grid p {
          margin: 0 0 12px;
          font-size: 10px;
          line-height: 1.7;
        }

        .footer-grid em {
          color: #d6b86a;
          font-size: 9px;
          font-style: normal;
        }

        .footer-grid > div > b {
          display: block;
          margin-bottom: 15px;
          color: white;
          font-size: 11px;
        }

        .footer-grid a {
          display: block;
          margin-bottom: 10px;
          color: rgba(255, 255, 255, 0.68);
          font-size: 10px;
        }

        .subscribe {
          display: flex;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 5px;
        }

        .subscribe input {
          flex: 1;
          min-width: 0;
          padding: 10px;
          border: 0;
          outline: none;
          color: white;
          background: rgba(255, 255, 255, 0.05);
          font-size: 10px;
        }

        .subscribe input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .subscribe button {
          width: 40px;
          border: 0;
          color: #173b2a;
          background: #d6b86a;
          cursor: pointer;
        }

        .bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.45);
          font-size: 9px;
        }

        @media (max-width: 700px) {
          .approved-desktop {
            display: none;
          }

          .mobile-home {
            display: block;
          }

          .hero {
            min-height: 420px;
          }

          .hero-content {
            padding: 65px 6vw 45px;
          }

          .hero h1 {
            font-size: 58px;
          }

          .script {
            font-size: 18px;
          }

          .hero p {
            font-size: 12px;
          }

          .search {
            min-height: 47px;
          }

          .search input {
            font-size: 11px;
          }

          .search button {
            padding: 9px 13px;
            font-size: 10px;
          }

          .categories,
          .listings,
          .features {
            padding: 45px 6vw;
          }

          .heading h2 {
            font-size: 25px;
          }

          .cat {
            flex-basis: 100px;
          }

          .cat img {
            width: 82px;
            height: 82px;
          }

          .feature {
            flex-basis: 175px;
          }

          .listing-row {
            display: flex;
            overflow-x: auto;
          }

          .card {
            flex: 0 0 260px;
          }

          .cta {
            padding: 45px 6vw;
          }

          .cta img {
            width: 75px;
            height: 75px;
          }

          .cta h2 {
            font-size: 25px;
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 30px 20px;
          }

          .footer-grid > div:first-child,
          .footer-grid > div:last-child {
            max-width: none;
          }

          footer {
            padding: 45px 6vw 20px;
          }
                    .bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 420px) {
          header {
            padding: 7px 10px;
          }

          .brand {
            gap: 5px;
          }

          .brand img {
            width: 34px;
            height: 34px;
          }

          .brand b {
            font-size: 13px;
          }

          .brand small {
            font-size: 5px;
            letter-spacing: 0.8px;
          }

          .header-actions {
            gap: 5px;
          }

          .marketplace-button,
          .account {
            min-height: 31px;
            padding: 6px 9px;
            font-size: 9px;
          }

          .hero-content {
            padding-top: 55px;
          }

          .hero h1 {
            font-size: 50px;
          }

          .script {
            font-size: 16px;
          }

          .note {
            display: flex;
            margin-right: 0;
          }

          .heading > a {
            font-size: 10px;
          }

          .cta {
            align-items: flex-start;
            gap: 20px;
          }

          .cta img {
            width: 60px;
            height: 60px;
          }

          .cta h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
}
