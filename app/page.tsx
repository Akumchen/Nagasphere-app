"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

type Listing = {
  id: string;
  type: "have" | "need";
  title: string;
  description: string | null;
  quantity: number | null;
  unit: string | null;
  budget_min: number | null;
  budget_max: number | null;
  city: string | null;
  state: string | null;
  category_id: string | null;
  created_at: string;
};

type Category = {
  id: string;
  name: string;
};

const categoryImages: Record<string, string> = {
  "Fresh Produce": "/fresh-produce.png",
  "Food & Beverages": "/food-beverages.png",
  Handicrafts: "/handicrafts.png",
  "Fashion & Apparel": "/fashion-apparel.png",
  "Home & Living": "/home-living.png",
  Electronics: "/electronics.png",
  Services: "/support.png",
};

const listingImages = [
  "/oranges.png",
  "/honey.png",
  "/basket.png",
  "/shawl.png",
  "/lamp.png",
  "/vegetables.png",
];

export default function HomePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const [
        { data: authData },
        { data: categoryData },
        { data: listingData },
      ] = await Promise.all([
        supabase.auth.getUser(),

        supabase
          .from("categories")
          .select("id,name")
          .order("name"),

        supabase
          .from("posts")
          .select(
            "id,type,title,description,quantity,unit,budget_min,budget_max,city,state,category_id,created_at"
          )
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      if (!mounted) return;

      setUserId(authData.user?.id ?? null);
      setCategories((categoryData ?? []) as Category[]);
      setListings((listingData ?? []) as Listing[]);
      setLoadingListings(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();

    const query = search.trim();

    router.push(
      query
        ? `/dashboard?search=${encodeURIComponent(query)}`
        : "/dashboard"
    );
  }

  async function handleSignOut() {
    await supabase.auth.signOut();

    setUserId(null);
    setMobileMenu(false);

    router.refresh();
  }

  function accountAction() {
    router.push(userId ? "/dashboard" : "/auth");
  }

  function categoryName(id: string | null) {
    return (
      categories.find((category) => category.id === id)?.name ?? "Local"
    );
  }

  const fallbackCategories: Category[] = [
    { id: "fresh", name: "Fresh Produce" },
    { id: "food", name: "Food & Beverages" },
    { id: "craft", name: "Handicrafts" },
    { id: "fashion", name: "Fashion & Apparel" },
    { id: "home", name: "Home & Living" },
    { id: "electronics", name: "Electronics" },
    { id: "services", name: "Services" },
  ];

  const displayedCategories = (
    categories.length ? categories : fallbackCategories
  ).slice(0, 7);

  return (
    <main className="home">

      {/* HERO */}
      <section className="hero">

        {/* EXACT APPROVED IMAGE */}
        <div
          className="hero-visual"
          aria-hidden="true"
        />

        <div
          className="hero-shade"
          aria-hidden="true"
        />

        {/* HEADER */}
        <header className="site-header">

          <button
            className="brand"
            onClick={() => router.push("/")}
            aria-label="NagaSphere home"
          >
            <img
              src="/nagasphere-logo.png"
              alt="NagaSphere"
            />
          </button>

          <nav
            className={`desktop-nav ${
              mobileMenu ? "open" : ""
            }`}
          >
            <button
              className="active"
              onClick={() => router.push("/")}
            >
              Home
            </button>

            <button
              onClick={() => router.push("/dashboard")}
            >
              Marketplace⌄
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("categories")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Categories
            </button>

            <button
              onClick={() => router.push("/my-requests")}
            >
              My Requests
            </button>

            <button
              onClick={() => router.push("/messages")}
            >
              Messages
            </button>

            <button onClick={accountAction}>
              More⌄
            </button>
          </nav>

          <div className="header-actions">

            <button
              className="header-icon"
              onClick={() =>
                document
                  .getElementById("hero-search")
                  ?.focus()
              }
              aria-label="Search"
            >
              ⌕
            </button>

            <button
              className="header-icon"
              onClick={() =>
                router.push(
                  userId ? "/messages" : "/auth"
                )
              }
              aria-label="Messages"
            >
              ♧
            </button>

            <button
              className="account-button"
              onClick={accountAction}
            >
              <span className="account-avatar">
                ●
              </span>
              My Account⌄
            </button>

            <button
              className="menu-button"
              onClick={() =>
                setMobileMenu((value) => !value)
              }
              aria-label="Open menu"
            >
              ☰
            </button>

          </div>
        </header>

        {/* HERO CONTENT */}
        <div className="hero-content">

          <p className="eyebrow">
            WELCOME TO
          </p>

          <h1>
            <span>Naga</span>
            <em>Sphere</em>
          </h1>

          <p className="hero-tagline">
            Buy • Sell • Support Local
          </p>

          <p className="hero-copy">
            Your trusted online marketplace in
            Nagaland — connecting farmers, local
            businesses and consumers, for a stronger
            community and a brighter future.
          </p>

          <form
            className="hero-search"
            onSubmit={handleSearch}
          >
            <span className="search-symbol">
              ⌕
            </span>

            <input
              id="hero-search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search for products, services, businesses..."
              aria-label="Search NagaSphere"
            />

            <button type="submit">
              Search
            </button>
          </form>

        </div>

        {/* HERO MESSAGE */}
        <div className="hero-message">
          <span>Local Products</span>
          <span>Local People</span>
          <strong>Stronger Together</strong>
        </div>

      </section>

      {/* CATEGORIES */}
      <section
        className="category-strip"
        id="categories"
      >
        <div className="category-row">

          {displayedCategories.map((category) => (
            <button
              className="category-card"
              key={category.id}
              onClick={() =>
                router.push(
                  `/dashboard?category=${encodeURIComponent(
                    category.name
                  )}`
                )
              }
            >
              <span className="category-image">
                <img
                  src={
                    categoryImages[
                      category.name
                    ] ?? "/support.png"
                  }
                  alt=""
                />
              </span>

              <span>
                {category.name}
              </span>
            </button>
          ))}

          <button
            className="category-card"
            onClick={() =>
              router.push("/dashboard")
            }
          >
            <span className="category-image more-icon">
              •••
            </span>

            <span>More</span>
          </button>

        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits">

        {[
          [
            "✓",
            "Safe & Secure",
            "Your trust matters. We keep your data and transactions safe.",
          ],
          [
            "♟",
            "Support Local",
            "Help local farmers, artisans and small businesses grow.",
          ],
          [
            "◆",
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
        ].map(([icon, title, text]) => (
          <div
            className="benefit"
            key={title}
          >
            <span className="benefit-icon">
              {icon}
            </span>

            <div>
              <strong>{title}</strong>

              <p>{text}</p>
            </div>
          </div>
        ))}

      </section>

      {/* FEATURED LISTINGS */}
      <section className="featured-section">

        <div className="section-heading">

          <div>
            <h2>
              Featured Listings
            </h2>

            <p>
              Top picks from our local sellers.
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
          >
            View All →
          </button>

        </div>

        {loadingListings ? (

          <div className="listing-loading">
            Loading local listings…
          </div>

        ) : listings.length ? (

          <div className="listing-grid">

            {listings.map((listing, index) => (

              <button
                className="listing-card"
                key={listing.id}
                onClick={() =>
                  router.push(
                    `/listing/${listing.id}`
                  )
                }
              >

                <div className="listing-image">

                  <img
                    src={
                      listingImages[
                        index %
                          listingImages.length
                      ]
                    }
                    alt=""
                  />

                  <span className="listing-heart">
                    ♡
                  </span>

                  <span
                    className={
                      listing.type === "need"
                        ? "need-badge"
                        : "have-badge"
                    }
                  >
                    {categoryName(
                      listing.category_id
                    )}
                  </span>

                </div>

                <div className="listing-body">

                  <h3>
                    {listing.title}
                  </h3>

                  <strong className="listing-price">

                    {listing.budget_min != null
                      ? `₹${listing.budget_min.toLocaleString(
                          "en-IN"
                        )}`
                      : "Price on request"}

                    {listing.unit
                      ? ` / ${listing.unit}`
                      : ""}

                  </strong>

                  <p className="listing-location">
                    ⌖{" "}
                    {listing.city ||
                      listing.state ||
                      "Nagaland"}
                  </p>

                  <div className="seller-row">

                    <span className="seller-avatar">
                      ●
                    </span>

                    <span>
                      {listing.type === "need"
                        ? "Local Buyer"
                        : "Local Seller"}
                    </span>

                    <span className="rating">
                      ★ 4.8
                    </span>

                  </div>

                </div>

              </button>

            ))}

          </div>

        ) : (

          <div className="empty-featured">

            <h3>
              Be among the first local sellers.
            </h3>

            <p>
              Create a listing and showcase your
              products or services across Nagaland.
            </p>

            <button
              onClick={() =>
                router.push(
                  userId
                    ? "/create-listing"
                    : "/auth"
                )
              }
            >
              Create a Listing
            </button>

          </div>

        )}

      </section>

      {/* SUPPORT CTA */}
      <section className="support-cta">

        <div className="cta-image">
          <img
            src="/vegetables.png"
            alt=""
          />
        </div>

        <div className="cta-copy">

          <h2>
            Support Local. Build a Stronger Nagaland.
          </h2>

          <p>
            Every purchase makes a difference — for
            our farmers, our businesses and our community.
          </p>

        </div>

        <button
          onClick={() =>
            router.push("/dashboard")
          }
        >
          Start Exploring →
        </button>

      </section>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-brand">

          <img
            src="/nagasphere-logo.png"
            alt="NagaSphere"
          />

          <p>
            Local Needs · Global Reach
          </p>

        </div>

        <div>

          <h4>Quick Links</h4>

          <button
            onClick={() => router.push("/")}
          >
            Home
          </button>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
          >
            Marketplace
          </button>

          <button
            onClick={() =>
              document
                .getElementById("categories")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
          >
            Categories
          </button>

          <button
            onClick={() =>
              router.push("/my-requests")
            }
          >
            My Requests
          </button>

        </div>

        <div>

          <h4>Support</h4>

          <button
            onClick={() =>
              router.push("/terms")
            }
          >
            Terms & Conditions
          </button>

          <button
            onClick={() =>
              router.push("/privacy")
            }
          >
            Privacy Policy
          </button>

          <button
            onClick={() =>
              router.push("/messages")
            }
          >
            Contact Us
          </button>

          {userId ? (
            <button onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <button
              onClick={() =>
                router.push("/auth")
              }
            >
              Sign In
            </button>
          )}

        </div>

        <div className="footer-news">

          <h4>Stay Connected</h4>

          <p>
            Get the latest updates and offers.
          </p>

          <form
            onSubmit={(e) =>
              e.preventDefault()
            }
          >

            <input
              placeholder="Your email address"
              aria-label="Email address"
            />

            <button type="submit">
              Subscribe
            </button>

          </form>

        </div>

        <p className="copyright">
          © {new Date().getFullYear()} NagaSphere.
          All rights reserved.
        </p>

      </footer>

      {/* STYLES */}
      <style jsx>{`

        .home {
          min-height: 100vh;
          background: #fff;
          color: #17352b;
          font-family: Arial, Helvetica, sans-serif;
          overflow-x: hidden;
        }

        button {
          font: inherit;
        }

        /* =========================
           HERO
        ========================= */

        .hero {
          min-height: 400px;
          position: relative;
          color: #fff;
          overflow: hidden;
        }

        .hero-visual {
          position: absolute;
          inset: 0;

          /*
            EXACT APPROVED IMAGE.
            Do not replace this with the old
            low-resolution hero JPG.
          */
          background:
            url("/NagaSphere_Local_Marketplace_in_Nagaland.png")
            center top / cover no-repeat;

          transform: scale(1.01);
        }

        .hero-shade {
          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              180deg,
              rgba(4,32,28,.50) 0%,
              rgba(7,48,35,.10) 42%,
              rgba(5,34,28,.28) 100%
            );
        }

        /* =========================
           HEADER
        ========================= */

        .site-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;

          padding:
            0
            max(20px, 6.5vw);

          display: flex;
          align-items: center;
          gap: 25px;

          z-index: 10;

          background:
            linear-gradient(
              180deg,
              rgba(7,31,28,.48),
              rgba(7,31,28,0)
            );
        }

        .brand {
          border: 0;
          background: none;
          padding: 0;
          cursor: pointer;
          flex: none;
        }

        .brand img {
          width: 225px;
          max-width: 27vw;
          height: auto;
          display: block;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: clamp(15px, 2.2vw, 31px);
          margin-left: auto;
        }

        .desktop-nav button,
        .account-button,
        .header-icon,
        .menu-button {
          border: 0;
          background: none;
          color: #fff;
          cursor: pointer;
          font-size: 13px;
          text-shadow:
            0 1px 8px rgba(0,0,0,.3);
        }

        .desktop-nav button {
          height: 52px;
          position: relative;
          white-space: nowrap;
        }

        .desktop-nav button.active {
          color: #65dc83;
        }

        .desktop-nav button.active:after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 7px;
          height: 2px;
          background: #4ee477;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 5px;
        }

        .header-icon {
          font-size: 22px;
          width: 30px;
        }

        .account-button {
          display: flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
        }

        .account-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #fff;
          color: #9aa09e;
          display: grid;
          place-items: center;
          font-size: 13px;
        }

        .menu-button {
          display: none;
          font-size: 25px;
        }

        /* =========================
           HERO CONTENT
        ========================= */

        .hero-content {
          position: relative;
          z-index: 2;

          padding:
            92px
            7%
            35px;

          max-width: 730px;
        }

        .eyebrow {
          margin: 0 0 1px;
          color: #65d66f;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: .5px;
        }

        .hero h1 {
          margin: 0;

          font-size:
            clamp(55px, 6.5vw, 82px);

          line-height: 1;
          font-weight: 800;
          letter-spacing: -3px;

          text-shadow:
            0 3px 14px rgba(0,0,0,.25);
        }

        .hero h1 span {
          color: #fff;
        }

        .hero h1 em {
          font-style: normal;
          color: #52d55d;
        }

        .hero-tagline {
          margin: 9px 0 7px;

          font-family:
            "Brush Script MT",
            "Segoe Script",
            cursive;

          font-size: 31px;
          line-height: 1.05;
        }

        .hero-copy {
          margin: 0 0 22px;
          max-width: 590px;

          font-size: 16px;
          line-height: 1.45;

          text-shadow:
            0 2px 8px rgba(0,0,0,.4);
        }

        /* =========================
           SEARCH
        ========================= */

        .hero-search {
          width: min(650px, 100%);
          height: 53px;

          border-radius: 30px;
          background: #fff;

          display: flex;
          align-items: center;

          padding:
            4px
            6px
            4px
            19px;

          box-shadow:
            0 7px 25px rgba(0,0,0,.22);
        }

        .search-symbol {
          font-size: 24px;
          color: #82908a;
        }

        .hero-search input {
          min-width: 0;
          flex: 1;

          border: 0;
          outline: 0;

          padding: 0 12px;

          color: #33433b;
          font-size: 13px;
        }

        .hero-search button {
          border: 0;

          background: #3cbd63;
          color: #fff;

          border-radius: 25px;

          padding: 13px 27px;

          font-weight: 700;
          cursor: pointer;
        }

        /* =========================
           HERO MESSAGE
        ========================= */

        .hero-message {
          position: absolute;
          z-index: 3;

          right: 8%;
          bottom: 92px;

          display: flex;
          flex-direction: column;
          align-items: flex-end;

          color: #fff;

          font-family:
            "Brush Script MT",
            "Segoe Script",
            cursive;

          font-size: 30px;
          line-height: .95;

          transform: rotate(-7deg);

          text-shadow:
            0 3px 8px rgba(0,0,0,.3);
        }

        .hero-message strong {
          font-weight: 600;
          font-size: 31px;
          position: relative;
        }

        .hero-message strong:after {
          content: "";
          position: absolute;

          height: 3px;

          background: #47d86b;

          left: 15px;
          right: -5px;
          bottom: -9px;

          transform: rotate(-2deg);
        }

        /* =========================
           CATEGORIES
        ========================= */

        .category-strip {
          background: #fff;

          padding: 18px 4%;

          border-bottom:
            1px solid #edf0eb;
        }

        .category-row {
          max-width: 1110px;
          margin: auto;

          display: grid;

          grid-template-columns:
            repeat(8, 1fr);
        }

        .category-card {
          border: 0;

          border-right:
            1px solid #edf0eb;

          background: #fff;

          min-height: 105px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          gap: 9px;

          color: #18352c;

          cursor: pointer;
        }

        .category-card:last-child {
          border-right: 0;
        }

        .category-card:hover
        .category-image {
          transform: translateY(-2px);
        }

        .category-image {
          width: 68px;
          height: 68px;

          border-radius: 14px;
          overflow: hidden;

          display: grid;
          place-items: center;

          transition: .15s;

          background: #edf2ed;
        }

        .category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-card > span:last-child {
          font-size: 12px;
          font-weight: 700;
          text-align: center;
        }

        .more-icon {
          background: #394846;
          color: #fff;

          font-size: 29px;
          letter-spacing: 2px;
        }

        /* =========================
           BENEFITS
        ========================= */

        .benefits {
          max-width: 1110px;

          margin:
            20px auto 0;

          background: #f2f8ee;

          border-radius: 12px;

          display: grid;

          grid-template-columns:
            repeat(5, 1fr);

          padding: 20px 22px;

          gap: 0;
        }

        .benefit {
          display: flex;
          gap: 11px;

          padding: 0 17px;

          border-right:
            1px solid #e0e9dc;
        }

        .benefit:first-child {
          padding-left: 0;
        }

        .benefit:last-child {
          border-right: 0;
          padding-right: 0;
        }

        .benefit-icon {
          width: 42px;
          height: 42px;

          flex: none;

          border-radius: 50%;

          background: #d9f3dc;
          color: #20a554;

          display: grid;
          place-items: center;

          font-size: 21px;
          font-weight: 800;
        }

        .benefit strong {
          font-size: 13px;
        }

        .benefit p {
          margin: 6px 0 0;

          color: #718079;

          font-size: 10px;
          line-height: 1.45;
        }

        /* =========================
           FEATURED
        ========================= */

        .featured-section {
          max-width: 1110px;

          margin: 0 auto;

          padding:
            25px 0
            28px;
        }

        .section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;

          padding:
            0 1px
            12px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 25px;
        }

        .section-heading p {
          margin: 5px 0 0;

          color: #5e6d65;

          font-size: 12px;
        }

        .section-heading > button {
          border: 0;
          background: none;

          color: #148747;

          font-weight: 800;
          cursor: pointer;
        }

        .listing-grid {
          display: grid;

          grid-template-columns:
            repeat(6, 1fr);

          gap: 11px;
        }

        .listing-card {
          border:
            1px solid #e7ebe5;

          background: #fff;

          border-radius: 9px;

          overflow: hidden;

          padding: 0;

          text-align: left;

          cursor: pointer;

          box-shadow:
            0 3px 12px
            rgba(22,51,39,.06);

          transition: .16s;
        }

        .listing-card:hover {
          transform: translateY(-2px);

          box-shadow:
            0 8px 20px
            rgba(22,51,39,.1);
        }

        .listing-image {
          height: 98px;

          background: #edf2ed;

          position: relative;

          overflow: hidden;
        }

        .listing-image img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .listing-heart {
          position: absolute;

          right: 8px;
          top: 6px;

          color: #fff;

          font-size: 24px;

          text-shadow:
            0 1px 5px #000;
        }

        .have-badge,
        .need-badge {
          position: absolute;

          bottom: 0;
          left: 0;

          background: #20934b;
          color: #fff;

          padding: 5px 9px;

          font-size: 8px;
          font-weight: 700;

          border-radius:
            0 7px 0 0;
        }

        .need-badge {
          background: #9a6a26;
        }

        .listing-body {
          padding: 8px;
        }

        .listing-body h3 {
          font-size: 11px;
          line-height: 1.3;

          margin:
            0 0 5px;

          color: #1c342b;

          min-height: 29px;
        }

        .listing-price {
          font-size: 12px;
          color: #117c42;
        }

        .listing-location {
          font-size: 9px;

          color: #77827b;

          margin: 5px 0;
        }

        .seller-row {
          display: flex;
          align-items: center;

          gap: 5px;

          border-top:
            1px solid #edf0ec;

          padding-top: 6px;

          font-size: 8px;
          color: #69756e;
        }

        .seller-avatar {
          width: 18px;
          height: 18px;

          border-radius: 50%;

          background: #c9d4ce;
          color: #74847b;

          display: grid;
          place-items: center;
        }

        .rating {
          margin-left: auto;
          color: #e9a700;
        }

        .listing-loading,
        .empty-featured {
          padding: 50px;

          text-align: center;

          background: #f8faf7;

          border-radius: 12px;
        }

        .empty-featured h3 {
          font-family: Georgia, serif;
        }

        .empty-featured button {
          border: 0;

          border-radius: 20px;

          background: #1d8050;
          color: #fff;

          padding: 11px 18px;

          cursor: pointer;
        }

        /* =========================
           CTA
        ========================= */

        .support-cta {
          max-width: 1110px;

          margin:
            0 auto 18px;

          background: #f1f7ec;

          border-radius: 13px;

          display: grid;

          grid-template-columns:
            280px 1fr auto;

          align-items: center;

          overflow: hidden;
        }

        .cta-image {
          height: 92px;
        }

        .cta-image img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .cta-copy {
          padding: 15px 25px;
        }

        .cta-copy h2 {
          font-size: 16px;
          margin:
            0 0 7px;
        }

        .cta-copy p {
          font-size: 11px;

          margin: 0;

          line-height: 1.5;

          color: #52655b;
        }

        .support-cta > button {
          margin-right: 25px;

          border: 0;

          border-radius: 24px;

          background: #0b6046;
          color: #fff;

          padding: 13px 21px;

          font-weight: 800;

          white-space: nowrap;

          cursor: pointer;
        }

        /* =========================
           FOOTER
        ========================= */

        .footer {
          background: #073d35;

          color: #dceae5;

          padding:
            28px
            max(20px, 6.5vw)
            16px;

          display: grid;

          grid-template-columns:
            1.1fr .75fr .85fr 1.2fr;

          gap: 28px;
        }

        .footer-brand img {
          width: 180px;

          filter:
            brightness(0)
            invert(1);

          margin-bottom: 8px;
        }

        .footer-brand p,
        .footer-news p {
          font-size: 10px;

          color: #a8c1b8;

          margin: 0;
        }

        .footer h4 {
          font-size: 11px;

          margin:
            0 0 9px;
        }

        .footer
        > div:not(.footer-brand):not(.footer-news)
        button {
          display: block;

          border: 0;

          background: none;

          color: #c5d7d0;

          padding: 3px 0;

          font-size: 10px;

          cursor: pointer;
        }

        .footer-news form {
          display: flex;

          background: #fff;

          border-radius: 20px;

          overflow: hidden;

          margin-top: 8px;
        }

        .footer-news input {
          min-width: 0;
          flex: 1;

          border: 0;
          outline: 0;

          padding: 9px 11px;

          font-size: 10px;
        }

        .footer-news button {
          border: 0;

          background: #40b963;

          color: #fff;

          padding: 0 13px;

          font-size: 10px;
        }

        .copyright {
          grid-column: 1 / -1;

          border-top:
            1px solid
            rgba(255,255,255,.13);

          padding-top: 12px;

          margin: 0;

          color: #8fa9a0;

          font-size: 9px;
        }

        /* =========================
           TABLET
        ========================= */

        @media (max-width: 1000px) {

          .desktop-nav {
            gap: 13px;
          }

          .desktop-nav button {
            font-size: 11px;
          }

          .header-icon {
            display: none;
          }

          .benefits {
            margin-inline: 15px;
          }

          .featured-section {
            padding-inline: 15px;
          }

          .listing-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .support-cta {
            margin-inline: 15px;
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 700px) {

          /*
            Same desktop design,
            proportionally adapted.
          */

          .hero {
            min-height: 620px;
          }

          .hero-visual {
            background-position:
              center top;

            background-size:
              cover;
          }

          .site-header {
            height: 64px;

            padding-inline: 16px;
          }

          .brand img {
            width: 175px;
            max-width: 55vw;
          }

          .desktop-nav {
            display: none;

            position: absolute;

            top: 64px;
            left: 0;
            right: 0;

            background:
              rgba(5,34,29,.97);

            padding: 10px 18px;

            flex-direction: column;

            align-items: stretch;

            gap: 0;
          }

          .desktop-nav.open {
            display: flex;
          }

          .desktop-nav button {
            height: auto;

            padding: 11px;

            text-align: left;
          }

          .desktop-nav button.active:after {
            display: none;
          }

          .account-button {
            display: none;
          }

          .menu-button {
            display: block;
          }

          .hero-content {
            padding:
              105px
              20px
              35px;
          }

          .eyebrow {
            font-size: 14px;
          }

          .hero h1 {
            font-size: 52px;

            letter-spacing: -2px;
          }

          .hero-tagline {
            font-size: 25px;
          }

          .hero-copy {
            font-size: 13px;

            max-width: 520px;
          }

          .hero-message {
            right: 18px;

            bottom: 125px;

            font-size: 21px;
          }

          .hero-message strong {
            font-size: 23px;
          }

          .hero-search {
            height: 49px;
          }

          .hero-search input {
            font-size: 12px;
          }

          .hero-search button {
            padding:
              12px 17px;
          }

          /*
            Categories remain the same design.
            They simply scroll horizontally.
          */

          .category-strip {
            padding:
              12px 10px;

            overflow-x: auto;

            scrollbar-width: thin;
          }

          .category-row {
            min-width: 760px;

            grid-template-columns:
              repeat(8, 1fr);
          }

          .category-card {
            min-height: 95px;
          }

          .category-image {
            width: 56px;
            height: 56px;
          }

          .category-card > span:last-child {
            font-size: 11px;
          }

          /*
            Benefits stack only because
            five columns cannot physically
            fit on a phone.
          */

          .benefits {
            margin:
              12px 12px 0;

            grid-template-columns: 1fr;

            padding: 12px;
          }

          .benefit {
            border-right: 0;

            border-bottom:
              1px solid #e0e9dc;

            padding:
              10px 0;
          }

          .benefit:last-child {
            border-bottom: 0;
          }

          .featured-section {
            padding-top: 20px;
          }

          /*
            Same listing cards,
            two columns on mobile.
          */

          .listing-grid {
            grid-template-columns:
              repeat(2, 1fr);

            gap: 10px;
          }

          .listing-image {
            height: 130px;
          }

          /*
            CTA becomes vertical while
            retaining the same visual design.
          */

          .support-cta {
            grid-template-columns: 1fr;

            margin-inline: 12px;
          }

          .cta-image {
            height: 120px;
          }

          .cta-copy {
            padding: 18px;
          }

          .support-cta > button {
            margin:
              0
              18px
              18px;
          }

          /*
            Footer becomes mobile columns.
          */

          .footer {
            grid-template-columns:
              1fr 1fr;

            padding-inline: 20px;
          }

          .footer-news {
            grid-column: 1 / -1;
          }

          .copyright {
            grid-column: 1 / -1;
          }
        }

        /* =========================
           SMALL PHONES
        ========================= */

        @media (max-width: 430px) {

          .hero {
            min-height: 650px;
          }

          .site-header {
            padding-inline: 13px;
          }

          .brand img {
            width: 160px;
          }

          .hero-content {
            padding:
              102px
              17px
              35px;
          }

          .hero h1 {
            font-size: 45px;
          }

          .hero-tagline {
            font-size: 22px;
          }

          .hero-copy {
            font-size: 12px;
          }

          .hero-message {
            bottom: 145px;

            right: 15px;

            font-size: 19px;
          }

          .hero-message strong {
            font-size: 21px;
          }

          .hero-search {
            height: 47px;

            padding-left: 13px;
          }

          .hero-search input {
            font-size: 10px;

            padding:
              0 7px;
          }

          .hero-search button {
            padding:
              11px 13px;

            font-size: 11px;
          }

          .listing-grid {
            grid-template-columns:
              1fr 1fr;
          }

          .listing-image {
            height: 118px;
          }

          .listing-body h3 {
            font-size: 10px;
          }

          .listing-price {
            font-size: 11px;
          }

          .footer {
            grid-template-columns: 1fr;
          }

          .footer-news {
            grid-column: auto;
          }

          .copyright {
            grid-column: auto;
          }
        }

      `}</style>

    </main>
  );
}
