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

type Category = { id: string; name: string };

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

  async function handleSearch(event: FormEvent) {
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

  function listingImage(index: number) {
    return listingImages[index % listingImages.length];
  }

  const fallbackCategories = [
    { id: "fresh", name: "Fresh Produce" },
    { id: "food", name: "Food & Beverages" },
    { id: "craft", name: "Handicrafts" },
    { id: "fashion", name: "Fashion & Apparel" },
    { id: "home", name: "Home & Living" },
    { id: "electronics", name: "Electronics" },
    { id: "services", name: "Services" },
  ];

  const displayedCategories = categories.length
    ? categories.slice(0, 8)
    : fallbackCategories;

  return (
    <main className="home">
      {/* HEADER */}
      <header className="site-header">
        <button
          className="brand"
          onClick={() => router.push("/")}
          aria-label="NagaSphere home"
        >
          <img src="/nagasphere-logo.png" alt="NagaSphere" />
        </button>

        <nav className={`desktop-nav ${mobileMenu ? "open" : ""}`}>
          <button onClick={() => router.push("/dashboard")}>
            Marketplace
          </button>

          <button
            onClick={() =>
              document
                .getElementById("categories")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Categories
          </button>

          <button onClick={() => router.push("/my-requests")}>
            My Requests
          </button>

          <button onClick={() => router.push("/messages")}>
            Messages
          </button>

          <button onClick={accountAction}>
            {userId ? "Dashboard" : "More"}
          </button>
        </nav>

        <div className="header-actions">
          <button
            className="account-button"
            onClick={accountAction}
          >
            {userId ? "Dashboard" : "My Account"}
          </button>

          <button
            className="menu-button"
            onClick={() => setMobileMenu((value) => !value)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div
          className="hero-visual"
          aria-hidden="true"
        />

        <div className="hero-shade" />

        <div className="hero-content">
          <p className="eyebrow">
            WELCOME TO
          </p>

          <h1>NagaSphere</h1>

          <p className="hero-tagline">
            Buy • Sell • Support Local
          </p>

          <p className="hero-copy">
            Your trusted online marketplace in Nagaland — connecting farmers,
            local businesses and consumers, for a stronger community and a
            brighter future.
          </p>

          <form
            className="hero-search"
            onSubmit={handleSearch}
          >
            <span>⌕</span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products, services, businesses..."
              aria-label="Search NagaSphere"
            />

            <button type="submit">
              Search
            </button>
          </form>
        </div>

        <div className="hero-message">
          <strong>Local Products</strong>
          <span>Local People</span>
          <b>Stronger Together</b>
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        className="category-section"
        id="categories"
      >
        <div className="section-heading">
          <div>
            <p className="section-kicker">
              DISCOVER LOCAL
            </p>

            <h2>
              Shop by Category
            </h2>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
          >
            View All →
          </button>
        </div>

        <div className="category-grid">
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
              <span className="category-icon">
                <img
                  src={
                    categoryImages[category.name] ??
                    "/support.png"
                  }
                  alt=""
                />
              </span>

              <span>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits">
        <div>
          <span className="benefit-icon">
            🌿
          </span>

          <div>
            <strong>
              Support Local Farmers
            </strong>

            <p>
              Help local producers reach more buyers.
            </p>
          </div>
        </div>

        <div>
          <span className="benefit-icon">
            🤝
          </span>

          <div>
            <strong>
              Connect with Local People
            </strong>

            <p>
              Buy and sell directly within the community.
            </p>
          </div>
        </div>

        <div>
          <span className="benefit-icon">
            ✦
          </span>

          <div>
            <strong>
              Grow Together
            </strong>

            <p>
              Build stronger local businesses and communities.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="featured-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">
              LOCAL MARKETPLACE
            </p>

            <h2>
              Featured Listings
            </h2>

            <p className="subheading">
              Top picks from our local sellers.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
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
                    src={listingImage(index)}
                    alt=""
                  />

                  <span
                    className={
                      listing.type === "need"
                        ? "need-badge"
                        : "have-badge"
                    }
                  >
                    {listing.type === "need"
                      ? "I Need"
                      : "For Sale"}
                  </span>
                </div>

                <div className="listing-body">
                  <p className="listing-category">
                    {categoryName(
                      listing.category_id
                    )}
                  </p>

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
              Create a listing and showcase your products
              or services across Nagaland.
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
        <div>
          <p className="section-kicker">
            ONE LOCAL PURCHASE AT A TIME
          </p>

          <h2>
            Support Local. Build a Stronger Nagaland.
          </h2>

          <p>
            Every purchase makes a difference — for our
            farmers, entrepreneurs, families and communities.
          </p>
        </div>

        <button
          onClick={() =>
            router.push(
              userId
                ? "/create-listing"
                : "/auth"
            )
          }
        >
          {userId
            ? "Create a Listing"
            : "Join NagaSphere"}{" "}
          →
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
            Connecting Nagaland through local commerce.
          </p>
        </div>

        <div className="footer-links">
          <button
            onClick={() => router.push("/dashboard")}
          >
            Marketplace
          </button>

          <button
            onClick={() =>
              router.push("/my-requests")
            }
          >
            My Requests
          </button>

          <button
            onClick={() =>
              router.push("/messages")
            }
          >
            Messages
          </button>

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

        <p className="copyright">
          © {new Date().getFullYear()} NagaSphere.
          Built for Nagaland.
        </p>
      </footer>

      {/* RESPONSIVE DESIGN */}
      <style jsx>{`
        .home {
          min-height: 100vh;
          background: #fbfaf5;
          color: #203127;
          font-family: Arial, Helvetica, sans-serif;
          overflow-x: hidden;
        }

        button {
          font: inherit;
        }

        /* HEADER */

        .site-header {
          height: 76px;
          padding: 0 clamp(18px, 5vw, 64px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          background: #fffdf8;
          position: relative;
          z-index: 20;
          border-bottom: 1px solid rgba(31, 55, 40, 0.08);
        }

        .brand {
          border: 0;
          background: none;
          padding: 0;
          cursor: pointer;
        }

        .brand img {
          width: clamp(135px, 13vw, 180px);
          display: block;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2.2vw, 34px);
          margin-left: auto;
        }

        .desktop-nav button,
        .account-button,
        .menu-button {
          border: 0;
          background: none;
          color: #34463a;
          cursor: pointer;
          font-size: 14px;
        }

        .desktop-nav button:hover,
        .footer button:hover {
          color: #23663d;
        }

        .account-button {
          padding: 11px 17px;
          border: 1px solid #d9dfd5;
          border-radius: 999px;
          background: #fff;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .menu-button {
          display: none;
          font-size: 25px;
        }

        /* HERO */

        .hero {
          min-height: 430px;
          position: relative;
          display: flex;
          align-items: center;
          padding: 62px clamp(22px, 7vw, 88px);
          color: #fff;
          overflow: hidden;
        }

        .hero-visual {
          position: absolute;
          inset: 0;
          background-image: url("/NagaSphere_Local_Marketplace_in_Nagaland.png");
          background-size: cover;
          background-position: center top;
          transform: scale(1.01);
        }

        .hero-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(11, 38, 27, 0.76) 0%,
              rgba(11, 38, 27, 0.5) 47%,
              rgba(11, 38, 27, 0.18) 100%
            );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }

        .eyebrow {
          letter-spacing: 3px;
          font-size: 13px;
          margin: 0 0 10px;
          font-weight: 700;
        }

        .hero h1 {
          font-family: Georgia, serif;
          font-size: clamp(48px, 7vw, 86px);
          line-height: 0.95;
          margin: 0 0 10px;
          font-weight: 500;
        }

        .hero-tagline {
          font-size: clamp(19px, 2vw, 27px);
          margin: 0 0 18px;
          font-weight: 600;
        }

        .hero-copy {
          max-width: 620px;
          line-height: 1.6;
          font-size: 16px;
          margin: 0 0 26px;
        }

        .hero-search {
          height: 56px;
          max-width: 650px;
          border-radius: 999px;
          background: #fff;
          display: flex;
          align-items: center;
          padding: 5px 7px 5px 20px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.18);
        }

        .hero-search span {
          font-size: 24px;
          color: #637065;
        }

        .hero-search input {
          min-width: 0;
          flex: 1;
          border: 0;
          outline: 0;
          background: none;
          padding: 0 12px;
          font-size: 14px;
          color: #203127;
        }

        .hero-search button {
          border: 0;
          border-radius: 999px;
          padding: 13px 21px;
          background: #244d35;
          color: #fff;
          cursor: pointer;
        }

        .hero-message {
          position: absolute;
          z-index: 2;
          right: clamp(25px, 8vw, 100px);
          bottom: 70px;
          display: flex;
          flex-direction: column;
          text-align: right;
          gap: 5px;
          font-family: Georgia, serif;
          font-size: 21px;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
        }

        .hero-message strong {
          font-size: 27px;
        }

        /* SECTIONS */

        .category-section,
        .featured-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 58px clamp(20px, 4vw, 40px);
        }

        .section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 26px;
        }

        .section-kicker {
          margin: 0 0 7px;
          font-size: 11px;
          letter-spacing: 2.3px;
          font-weight: 800;
          color: #56805f;
        }

        .section-heading h2 {
          font-family: Georgia, serif;
          font-weight: 500;
          font-size: clamp(30px, 4vw, 43px);
          margin: 0;
        }

        .section-heading button {
          border: 0;
          background: none;
          color: #2c6843;
          font-weight: 700;
          cursor: pointer;
        }

        /* CATEGORIES */

        .category-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 12px;
        }

        .category-card {
          border: 1px solid #e5e8df;
          background: #fff;
          border-radius: 15px;
          padding: 17px 10px;
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 10px;
          color: #35483b;
          cursor: pointer;
          min-height: 130px;
          justify-content: center;
          transition: 0.18s;
        }

        .category-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 9px 25px rgba(32, 49, 39, 0.08);
        }

        .category-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #f1f5ed;
          display: grid;
          place-items: center;
          overflow: hidden;
        }

        .category-icon img {
          width: 75%;
          height: 75%;
          object-fit: contain;
        }

        .category-card > span:last-child {
          font-size: 12px;
          font-weight: 700;
          text-align: center;
          line-height: 1.25;
        }

        /* BENEFITS */

        .benefits {
          background: #eef3ea;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
          padding: 30px max(20px, 7vw);
        }

        .benefits > div {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .benefit-icon {
          font-size: 25px;
        }

        .benefits strong {
          font-size: 14px;
        }

        .benefits p {
          margin: 6px 0 0;
          color: #68746b;
          font-size: 12px;
          line-height: 1.45;
        }

        /* LISTINGS */

        .subheading {
          margin: 7px 0 0;
          color: #778077;
          font-size: 13px;
        }

        .listing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .listing-card {
          border: 1px solid #e5e7e1;
          background: #fff;
          border-radius: 17px;
          padding: 0;
          overflow: hidden;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 5px 18px rgba(28, 49, 36, 0.04);
          transition: 0.18s;
        }

        .listing-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(28, 49, 36, 0.09);
        }

        .listing-image {
          height: 190px;
          background: #edf1e9;
          position: relative;
          overflow: hidden;
        }

        .listing-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .have-badge,
        .need-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          border-radius: 999px;
          padding: 6px 10px;
          background: #fff;
          color: #2f6a43;
          font-size: 11px;
          font-weight: 800;
        }

        .need-badge {
          color: #8a5a20;
        }

        .listing-body {
          padding: 16px;
        }

        .listing-category {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.3px;
          color: #729078;
          font-weight: 800;
          margin: 0 0 6px;
        }

        .listing-body h3 {
          font-family: Georgia, serif;
          font-size: 20px;
          font-weight: 500;
          margin: 0 0 11px;
          color: #26382c;
        }

        .listing-price {
          font-size: 16px;
          color: #315f3e;
        }

        .listing-location {
          font-size: 12px;
          color: #7b847c;
          margin: 9px 0 0;
        }

        .listing-loading,
        .empty-featured {
          padding: 55px 25px;
          text-align: center;
          background: #fff;
          border: 1px solid #e6e8e2;
          border-radius: 18px;
          color: #69736c;
        }

        .empty-featured h3 {
          font-family: Georgia, serif;
          font-size: 24px;
          margin: 0 0 8px;
          color: #27382c;
        }

        .empty-featured p {
          margin: 0 auto 18px;
          max-width: 520px;
          line-height: 1.5;
        }

        .empty-featured button {
          border: 0;
          border-radius: 999px;
          background: #234f35;
          color: #fff;
          padding: 12px 19px;
          cursor: pointer;
        }

        /* CTA */

        .support-cta {
          margin: 10px auto 0;
          max-width: 1120px;
          border-radius: 24px;
          background: #234c34;
          color: #fff;
          padding: 45px clamp(25px, 5vw, 65px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .support-cta .section-kicker {
          color: #bdd2bf;
        }

        .support-cta h2 {
          font-family: Georgia, serif;
          font-weight: 500;
          font-size: clamp(29px, 4vw, 44px);
          margin: 0 0 9px;
        }

        .support-cta p:not(.section-kicker) {
          max-width: 650px;
          line-height: 1.55;
          margin: 0;
          color: #d8e4d9;
          font-size: 14px;
        }

        .support-cta button {
          white-space: nowrap;
          border: 0;
          border-radius: 999px;
          padding: 14px 21px;
          background: #fff;
          color: #234c34;
          font-weight: 800;
          cursor: pointer;
        }

        /* FOOTER */

        .footer {
          margin-top: 55px;
          background: #18251c;
          color: #dce5dd;
          padding: 42px max(22px, 7vw) 25px;
          display: grid;
          grid-template-columns: 1.3fr 2fr;
          gap: 30px;
        }

        .footer-brand img {
          width: 160px;
          filter: brightness(0) invert(1);
          opacity: 0.95;
        }

        .footer-brand p {
          color: #9eaaa0;
          font-size: 12px;
        }

        .footer-links {
          display: flex;
          justify-content: flex-end;
          align-content: flex-start;
          flex-wrap: wrap;
          gap: 12px 24px;
        }

        .footer button {
          border: 0;
          background: none;
          color: #c5d0c7;
          cursor: pointer;
          font-size: 12px;
        }

        .copyright {
          grid-column: 1 / -1;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 20px;
          color: #7f8c82;
          font-size: 11px;
          margin: 0;
        }

        /* TABLET */

        @media (max-width: 900px) {
          .desktop-nav {
            gap: 13px;
          }

          .desktop-nav button {
            font-size: 12px;
          }

          .category-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .listing-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-message {
            right: 35px;
          }

          .benefits {
            padding-inline: 30px;
          }
        }

        /* MOBILE */

        @media (max-width: 700px) {
          .site-header {
            height: 68px;
          }

          .desktop-nav {
            display: none;
            position: absolute;
            top: 68px;
            left: 0;
            right: 0;
            padding: 15px 20px;
            background: #fffdf8;
            border-bottom: 1px solid #e5e8e1;
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.07);
            flex-direction: column;
            align-items: stretch;
          }

          .desktop-nav.open {
            display: flex;
          }

          .desktop-nav button {
            text-align: left;
            padding: 10px;
          }

          .account-button {
            display: none;
          }

          .menu-button {
            display: block;
          }

          .hero {
            min-height: 560px;
            padding: 55px 22px 100px;
            align-items: flex-end;
          }

          .hero-visual {
            background-position: 56% top;
          }

          .hero-shade {
            background:
              linear-gradient(
                180deg,
                rgba(11, 38, 27, 0.35),
                rgba(11, 38, 27, 0.82) 65%,
                rgba(11, 38, 27, 0.92)
              );
          }

          .hero-content {
            width: 100%;
          }

          .hero h1 {
            font-size: 54px;
          }

          .hero-copy {
            font-size: 14px;
            line-height: 1.5;
          }

          .hero-search {
            height: 50px;
            padding-left: 15px;
          }

          .hero-search input {
            font-size: 13px;
          }

          .hero-search button {
            padding: 11px 15px;
          }

          .hero-message {
            right: 22px;
            top: 42px;
            bottom: auto;
            font-size: 14px;
          }

          .hero-message strong {
            font-size: 18px;
          }

          .category-section,
          .featured-section {
            padding-top: 42px;
            padding-bottom: 42px;
          }

          .section-heading {
            align-items: flex-start;
          }

          .category-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .category-card {
            min-height: 110px;
          }

          .benefits {
            grid-template-columns: 1fr;
            padding: 26px 22px;
            gap: 20px;
          }

          .listing-grid {
            grid-template-columns: 1fr;
          }

          .listing-image {
            height: 210px;
          }

          .support-cta {
            margin-inline: 15px;
            flex-direction: column;
            align-items: flex-start;
            border-radius: 20px;
            padding: 34px 25px;
          }

          .support-cta button {
            width: 100%;
          }

          .footer {
            grid-template-columns: 1fr;
            padding-top: 35px;
          }

          .footer-links {
            justify-content: flex-start;
          }

          .copyright {
            grid-column: 1;
          }
        }

        /* SMALL PHONES */

        @media (max-width: 420px) {
          .hero {
            min-height: 590px;
          }

          .hero h1 {
            font-size: 47px;
          }

          .hero-search button {
            font-size: 12px;
          }

          .hero-search input {
            padding: 0 5px;
          }

          .category-grid {
            gap: 9px;
          }

          .category-card {
            padding: 13px 7px;
          }

          .listing-body h3 {
            font-size: 18px;
          }
        }
      `}</style>
    </main>
  );
}
