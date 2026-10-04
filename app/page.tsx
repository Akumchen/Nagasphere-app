"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import "./nagasphere-home.css";

function SearchOverlay() {
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
    <form className="desktop-search exact-search" onSubmit={submit}>
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

export default function HomePage() {
  return (
    <main className="ns-page">
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

        <SearchOverlay />

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
    </main>
  );
}
