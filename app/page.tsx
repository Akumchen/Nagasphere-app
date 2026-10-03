"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function HomePage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUserId(data.user?.id ?? null);
    });

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const query = search.trim();

    if (query) {
      router.push(`/dashboard?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/dashboard");
    }
  }

  function goAccount() {
    router.push(userId ? "/dashboard" : "/auth");
  }

  return (
    <main className="nagasphere-home">
      <div className="reference-page">

        {/* EXACT REFERENCE DESIGN */}
        <img
          src="/NagaSphere_Local_Marketplace_in_Nagaland.png"
          alt="NagaSphere — Local Marketplace in Nagaland"
          className="reference-image"
        />

        {/* HEADER NAVIGATION */}

        <button
          className="hotspot home"
          aria-label="Home"
          onClick={() => router.push("/")}
        />

        <button
          className="hotspot marketplace"
          aria-label="Marketplace"
          onClick={() => router.push("/dashboard")}
        />

        <button
          className="hotspot categories"
          aria-label="Categories"
          onClick={() =>
            document
              .getElementById("category-area")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        />

        <button
          className="hotspot requests"
          aria-label="My Requests"
          onClick={() => router.push("/my-requests")}
        />

        <button
          className="hotspot messages"
          aria-label="Messages"
          onClick={() => router.push("/messages")}
        />

        <button
          className="hotspot account"
          aria-label="My Account"
          onClick={goAccount}
        />

        {/* SEARCH */}

        <form className="search-area" onSubmit={handleSearch}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search NagaSphere"
            autoComplete="off"
          />
        </form>

        {/* CATEGORY AREA */}

        <div
          id="category-area"
          className="hotspot category-area"
          aria-hidden="true"
        />

        {/* FEATURED LISTINGS */}

        <button
          className="hotspot featured"
          aria-label="View featured listings"
          onClick={() => router.push("/dashboard")}
        />

        {/* SUPPORT / EXPLORE CTA */}

        <button
          className="hotspot explore"
          aria-label="Explore NagaSphere"
          onClick={() =>
            router.push(userId ? "/create-listing" : "/auth")
          }
        />

        {/* FOOTER */}

        <button
          className="hotspot terms"
          aria-label="Terms and Conditions"
          onClick={() => router.push("/terms")}
        />

        <button
          className="hotspot privacy"
          aria-label="Privacy Policy"
          onClick={() => router.push("/privacy")}
        />
      </div>

      <style jsx>{`
        .nagasphere-home {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          background: #ffffff;
          overflow-x: hidden;
        }

        .reference-page {
          position: relative;
          width: 100%;
          max-width: 1199px;
          margin: 0 auto;
          line-height: 0;
        }

        .reference-image {
          display: block;
          width: 100%;
          height: auto;
          margin: 0;
          padding: 0;
          user-select: none;
          -webkit-user-drag: none;
        }

        .hotspot {
          position: absolute;
          z-index: 10;
          display: block;
          margin: 0;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .hotspot:focus-visible {
          outline: 2px solid rgba(46, 170, 91, 0.9);
          outline-offset: 2px;
        }

        /*
          The reference image is 1199 × 1312.
          All interactive areas are positioned proportionally
          so the exact reference artwork scales with the screen.
        */

        /* Top navigation */

        .home {
          left: 0%;
          top: 0%;
          width: 24%;
          height: 8%;
        }

        .marketplace {
          left: 38%;
          top: 0%;
          width: 12%;
          height: 8%;
        }

        .categories {
          left: 50%;
          top: 0%;
          width: 12%;
          height: 8%;
        }

        .requests {
          left: 62%;
          top: 0%;
          width: 12%;
          height: 8%;
        }

        .messages {
          left: 74%;
          top: 0%;
          width: 11%;
          height: 8%;
        }

        .account {
          right: 0%;
          top: 0%;
          width: 15%;
          height: 8%;
        }

        /* Search bar */

        .search-area {
          position: absolute;
          z-index: 11;
          left: 7%;
          top: 20.5%;
          width: 55%;
          height: 4.8%;
          margin: 0;
          padding: 0;
        }

        .search-area input {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0 17%;
          border: 0;
          outline: none;
          border-radius: 999px;
          background: transparent;
          color: #163b30;
          font-family: inherit;
          font-size: clamp(11px, 1.15vw, 16px);
          line-height: normal;
        }

        .search-area input::placeholder {
          color: transparent;
        }

        .search-area input:focus {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 2px rgba(56, 170, 91, 0.55);
        }

        /* Categories */

        .category-area {
          left: 0;
          top: 30%;
          width: 100%;
          height: 17%;
          cursor: default;
        }

        /* Featured listings */

        .featured {
          left: 3%;
          top: 47%;
          width: 94%;
          height: 31%;
        }

        /* Main CTA */

        .explore {
          right: 4%;
          top: 77%;
          width: 25%;
          height: 10%;
        }

        /* Footer links */

        .terms {
          left: 34%;
          bottom: 2%;
          width: 15%;
          height: 7%;
        }

        .privacy {
          left: 49%;
          bottom: 2%;
          width: 15%;
          height: 7%;
        }

        @media (max-width: 700px) {
          .search-area {
            left: 7%;
            top: 20%;
            width: 56%;
            height: 5%;
          }

          .search-area input {
            padding: 0 12%;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .search-area {
            left: 7%;
            top: 19.8%;
            width: 57%;
            height: 5.2%;
          }

          .search-area input {
            padding: 0 10%;
            font-size: 10px;
          }
        }
      `}</style>
    </main>
  );
}
