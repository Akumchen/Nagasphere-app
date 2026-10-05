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
  ["Naga Oranges (Local)", "₹120", "/ kg", "Dimapur", "Evergreen Farms", "4.8", "24", "/oranges.png"],
  ["Pure Naga Honey", "₹450", "/ 250g", "Kohima", "Hilltop Organics", "4.9", "36", "/honey.png"],
  ["Traditional Bamboo Basket", "₹1,200", "", "Mokokchung", "Naga Crafts", "4.7", "19", "/basket.png"],
  ["Naga Shawl (Traditional)", "₹1,500", "", "Wokha", "Ao Weaves", "4.9", "28", "/shawl.png"],
  ["Bamboo Lamp", "₹800", "", "Tuensang", "Creative Naga", "4.6", "15", "/lamp.png"],
  ["Organic Vegetables (Mixed)", "₹150", " / kg", "Zunheboto", "Green Valley Farm", "4.8", "22", "/vegetables.png"],
];

const features = [
  ["✓", "Safe & Secure", "Your trust matters. We keep your data and transactions safe."],
  ["♣", "Support Local", "Help local farmers, artisans and small businesses grow."],
  ["◒", "Wide Variety", "From fresh produce to daily needs, find it all in one place."],
  ["●", "Nagaland Focused", "Built for our people, our culture, our future."],
  ["♥", "Community Driven", "Real people. Real businesses. A stronger Nagaland."],
];

export default function HomePage() {
  return (
    <>
      {/* Desktop: the approved reference image is the visual source of truth. */}
      <div className="approved-desktop">
        <img
          src="/NagaSphere_Local_Marketplace_in_Nagaland.png"
          alt="NagaSphere approved homepage"
        />
      </div>

      {/* Mobile: same original content and visual system, deliberately reflowed for phones. */}
      <main className="mobile-home">
        <section className="hero">
          <header>
            <a href="/" className="brand">
              <img src="/nagasphere-logo.png" alt="" />
              <span>
                <b>NagaSphere</b>
                <small>Local Needs · Global Reach</small>
              </span>
            </a>

            <a href="/account" className="account">
              My Account
            </a>
          </header>

          <div className="hero-content">
            <small className="welcome">WELCOME TO</small>

            <h1>
              Naga<span>Sphere</span>
            </h1>

            <div className="script">
              Buy · Sell · Support Local
            </div>

            <p>
              Your trusted online marketplace in Nagaland — connecting farmers,
              local businesses and consumers, for a stronger community and a
              brighter future.
            </p>

            <div className="search">
              <span>⌕</span>
              <input
                placeholder="Search for products, services, businesses..."
              />
              <button>Search</button>
            </div>

            <div className="note">
              <i>Local Products</i>
              <i>Local People</i>
              <i>Stronger Together</i>
            </div>
          </div>
        </section>

        <section className="categories">
          <div className="heading">
            <div>
              <small>EXPLORE</small>
              <h2>Shop by Category</h2>
            </div>

            <a href="/marketplace">View All →</a>
          </div>

          <div className="cat-row">
            {categories.map(([name, image]) => (
              <a className="cat" href="/marketplace" key={name}>
                <img src={image} alt="" />
                <b>{name}</b>
              </a>
            ))}
          </div>
        </section>

        <section className="features">
          <div className="feature-row">
            {features.map(([icon, title, text]) => (
              <article className="feature" key={title}>
                <strong>{icon}</strong>

                <div>
                  <b>{title}</b>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="listings">
          <div className="heading">
            <div>
              <small>DISCOVER</small>
              <h2>Featured Listings</h2>
            </div>

            <a href="/marketplace">View All →</a>
          </div>

          <div className="listing-row">
            {listings.map(
              ([
                name,
                price,
                unit,
                location,
                seller,
                rating,
                reviews,
                image,
              ]) => (
                <article className="card" key={name}>
                  <div className="card-image">
                    <img src={image} alt={name} />
                    <span>Local</span>
                    <button aria-label="Save">♡</button>
                  </div>

                  <div className="card-body">
                    <h3>{name}</h3>

                    <div className="price">
                      {price}
                      <small>{unit}</small>
                    </div>

                    <div className="location">
                      ⌖ {location}
                    </div>

                    <div className="seller">
                      <span>{seller}</span>
                      <span>
                        ★ {rating} <small>({reviews})</small>
                      </span>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </section>

        <section className="cta">
          <img src="/vegetables.png" alt="Local farmers" />

          <div>
            <small>TOGETHER WE GROW</small>

            <h2>
              Support Local. Build a Stronger Nagaland.
            </h2>

            <p>
              Every purchase makes a difference — for our farmers, our
              businesses and our community.
            </p>

            <a href="/marketplace">Start Exploring →</a>
          </div>
        </section>

        <footer>
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <img src="/nagasphere-logo.png" alt="" />

                <b>
                  NagaSphere
                  <small>Local Needs · Global Reach</small>
                </b>
              </div>

              <p>
                Connecting Nagaland. Supporting local. Building a stronger
                community together.
              </p>

              <em>Proudly Nagaland</em>
            </div>

            <div>
              <b>Quick Links</b>

              <a href="/">Home</a>
              <a href="/marketplace">Marketplace</a>
              <a href="#categories">Categories</a>
              <a href="/requests">My Requests</a>
            </div>

            <div>
              <b>Support</b>

              <a href="/help">Help Centre</a>
              <a href="/contact">Contact Us</a>
              <a href="/terms">Terms & Conditions</a>
              <a href="/privacy">Privacy Policy</a>
            </div>

            <div>
              <b>Stay Connected</b>

              <p>Get the latest updates and offers.</p>

              <div className="subscribe">
                <input placeholder="Your email address" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>

          <div className="bottom">
            © 2026 NagaSphere. All rights reserved.
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
          background: #082623;
          color: #123d2d;
          font-family: Inter, Arial, Helvetica, sans-serif;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button,
        input {
          font: inherit;
        }

        .approved-desktop {
  display: block;
  width: 100%;
  line-height: 0;
  margin: 0;
  padding: 0;
  height: auto;
  overflow: hidden;
}

        .approved-desktop img {
          display: block;
          width: 100%;
          height: auto;
        }

        .mobile-home {
          display: none;
        }

        .approved-desktop {
  display: none;
}

.mobile-home {
  display: block;
}

          .hero {
            height: 430px;
            min-height: 430px;
            color: #fff;
            background:
              linear-gradient(
                90deg,
                rgba(8, 32, 20, 0.68),
                rgba(8, 32, 20, 0.2)
              ),
              url("/nagasphere-hero.jpg") 56% center / cover no-repeat;
          }

          header {
            height: 60px;
            padding: 0 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(8, 30, 20, 0.18);
            border-bottom: 1px solid rgba(255, 255, 255, 0.18);
          }

          .brand {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .brand img {
            width: 36px;
            height: 36px;
            object-fit: contain;
          }

          .brand span {
            display: flex;
            flex-direction: column;
          }

          .brand b {
            font-size: 15px;
          }

          .brand small {
            font-size: 5.5px;
            letter-spacing: 1px;
            text-transform: uppercase;
            opacity: 0.85;
          }

          .account {
            font-size: 9px;
            padding: 8px 10px;
            border: 1px solid rgba(255, 255, 255, 0.55);
            border-radius: 5px;
          }

          .hero-content {
            padding: 30px 14px 0;
          }

          .welcome {
            font-size: 9px;
            letter-spacing: 2.5px;
            font-weight: 700;
          }

          .hero h1 {
            font-size: 46px;
            line-height: 0.95;
            letter-spacing: -2px;
            margin: 5px 0 8px;
          }

          .hero h1 span {
            color: #9fd15a;
          }

          .script {
            font-family:
              "Comic Sans MS",
              "Segoe Print",
              cursive;
            color: #d8e9ae;
            font-size: 19px;
            transform: rotate(-2deg);
            margin-bottom: 13px;
          }

          .hero p {
            font-size: 11.5px;
            line-height: 1.48;
            margin: 0 0 15px;
          }

          .search {
            height: 47px;
            border-radius: 24px;
            background: #fff;
            display: flex;
            align-items: center;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }

          .search span {
            color: #708374;
            font-size: 21px;
            margin-left: 13px;
          }

          .search input {
            min-width: 0;
            flex: 1;
            height: 100%;
            border: 0;
            outline: 0;
            padding: 0 7px;
            font-size: 11px;
          }

          .search button {
            height: 37px;
            margin-right: 5px;
            padding: 0 14px;
            border: 0;
            border-radius: 20px;
            background: #3eae69;
            color: #fff;
            font-size: 10px;
            font-weight: 700;
          }

          .note {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-top: 14px;
            font-size: 15px;
            line-height: 1.15;
          }

          .note i {
            font-family:
              "Comic Sans MS",
              "Segoe Print",
              cursive;
            transform: rotate(-4deg);
          }

          .note i:nth-child(2) {
            margin-right: 15px;
          }

          .note i:nth-child(3) {
            margin-right: 30px;
          }

          .categories,
          .listings {
            padding: 22px 14px;
          }

          .heading {
            display: flex;
            justify-content: space-between;
            align-items: end;
            margin-bottom: 14px;
          }

          .heading small {
            font-size: 8px;
            color: #72a447;
            letter-spacing: 2px;
            font-weight: 800;
          }

          .heading h2 {
            font:
              700 23px Georgia,
              serif;
            margin: 2px 0 0;
            color: #21432f;
          }

          .heading > a {
            font-size: 9px;
            color: #57933d;
            font-weight: 800;
          }

          .cat-row,
          .listing-row,
          .feature-row {
            display: flex;
            overflow-x: auto;
            gap: 12px;
            scrollbar-width: none;
          }

          .cat-row::-webkit-scrollbar,
          .listing-row::-webkit-scrollbar,
          .feature-row::-webkit-scrollbar {
            display: none;
          }

          .cat {
            flex: 0 0 70px;
            text-align: center;
          }

          .cat img {
            width: 62px;
            height: 62px;
            display: block;
            object-fit: cover;
            border-radius: 11px;
            border: 1px solid #e0ead8;
            margin: 0 auto 7px;
          }

          .cat b {
            display: block;
            font-size: 9px;
            line-height: 1.2;
            color: #304b38;
          }

          .features {
            margin: 0 14px 22px;
            padding: 12px 8px;
            border-radius: 9px;
            background: #eef6e8;
            border: 1px solid #e3eddc;
          }

          .feature {
            flex: 0 0 225px;
            display: flex;
            gap: 9px;
            padding: 7px 8px;
            border: 1px solid #e2eddf;
            border-radius: 7px;
          }

          .feature > strong {
            flex: 0 0 29px;
            width: 29px;
            height: 29px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #cfeecb;
            color: #15904f;
          }

          .feature b {
            font-size: 10px;
          }

          .feature p {
            margin: 3px 0 0;
            font-size: 8px;
            line-height: 1.4;
            color: #718074;
          }

          .listing-row {
            display: grid;
            grid-template-columns: 1fr;
            gap: 14px;
            overflow-x: visible;
          }

          .card {
            flex: 0 0 200px;
            border: 1px solid #e2e9df;
            border-radius: 7px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 4px 16px rgba(36, 65, 43, 0.06);
          }

          .card-image {
            height: 150px;
            position: relative;
          }

          .card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .card-image span {
            position: absolute;
            left: 8px;
            bottom: 8px;
            background: #167d49;
            color: #fff;
            padding: 4px 7px;
            border-radius: 3px;
            font-size: 8px;
          }

          .card-image button {
            position: absolute;
            right: 7px;
            top: 7px;
            width: 26px;
            height: 26px;
            border: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.92);
            font-size: 16px;
          }

          .card-body {
            padding: 10px;
          }

          .card h3 {
            font-size: 10px;
            line-height: 1.3;
            margin: 0 0 4px;
            color: #294731;
          }

          .price {
            font-size: 14px;
            font-weight: 800;
            color: #4e943b;
          }

          .price small {
            font-size: 8px;
            color: #788479;
            font-weight: 500;
          }

          .location {
            margin-top: 7px;
            font-size: 8px;
            color: #79857b;
          }

          .seller {
            margin-top: 9px;
            padding-top: 8px;
            border-top: 1px solid #edf0eb;
            display: flex;
            justify-content: space-between;
            font-size: 7px;
            color: #718076;
          }

          .seller > span:last-child {
            color: #789f45;
            font-weight: 800;
          }

          .cta {
            margin: 0 14px 15px;
            border-radius: 8px;
            overflow: hidden;
            background: #eaf3e2;
            display: grid;
            grid-template-columns: 42% 58%;
          }

          .cta img {
            width: 100%;
            height: 145px;
            object-fit: cover;
          }

          .cta > div {
            padding: 17px 13px;
          }

          .cta small {
            font-size: 7px;
            letter-spacing: 1.5px;
            color: #82a953;
            font-weight: 800;
          }

          .cta h2 {
            font:
              700 17px/1.15 Georgia,
              serif;
            color: #244832;
            margin: 6px 0 8px;
          }

          .cta p {
            font-size: 8.5px;
            line-height: 1.45;
            color: #6d7e70;
            margin: 0 0 10px;
          }

          .cta a {
            display: inline-flex;
            background: #72a941;
            color: #fff;
            border-radius: 4px;
            padding: 8px 11px;
            font-size: 8px;
            font-weight: 800;
          }

          footer {
            background: #183827;
            color: #dfe9df;
            padding: 29px 14px 0;
          }

          .footer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 22px 18px;
          }

          .footer-grid > div:first-child,
          .footer-grid > div:last-child {
            grid-column: 1 / -1;
          }

          .footer-brand {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .footer-brand img {
            width: 38px;
            height: 38px;
          }

          .footer-brand b {
            font-size: 16px;
            color: #fff;
          }

          .footer-brand small {
            display: block;
            font-size: 5.5px;
            color: #a9baa9;
            letter-spacing: 1px;
          }

          .footer-grid p {
            font-size: 8px;
            line-height: 1.5;
            color: #9fb0a1;
          }

          .footer-grid em {
            font-size: 8px;
            color: #a9cc6b;
          }

          .footer-grid > div > b {
            font-size: 10px;
            color: #fff;
          }

          .footer-grid a {
            display: block;
            margin-top: 9px;
            font-size: 8px;
            color: #9eafa1;
          }

          .subscribe {
            height: 32px;
            display: flex;
            margin-top: 8px;
          }

          .subscribe input {
            min-width: 0;
            flex: 1;
            border: 1px solid rgba(255, 255, 255, 0.14);
            background: rgba(255, 255, 255, 0.06);
            color: #fff;
            border-radius: 4px 0 0 4px;
            padding: 0 8px;
            font-size: 8px;
          }

          .subscribe button {
            border: 0;
            background: #73a843;
            color: #fff;
            border-radius: 0 4px 4px 0;
            padding: 0 9px;
            font-size: 8px;
          }

          .bottom {
            margin-top: 22px;
            padding: 10px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 7px;
            color: #809386;
            display: flex;
            justify-content: space-between;
            gap: 10px;
          }

          @media (max-width: 390px) {
            .hero {
              height: 420px;
              min-height: 420px;
            }

            .hero h1 {
              font-size: 43px;
            }

            .script {
              font-size: 18px;
            }

            .hero p {
              font-size: 11px;
            }

            .note {
              font-size: 14px;
            }

            .cat {
              flex-basis: 66px;
            }

            .cat img {
              width: 60px;
              height: 60px;
            }

            .feature {
              flex-basis: 215px;
            }

            .card {
              flex-basis: 190px;
            }

            .cta {
              grid-template-columns: 1fr;
            }

            .cta img {
              height: 145px;
            }

            .bottom {
              flex-direction: column;
            }
          }
        }
      `}</style>
    </>
  );
}
