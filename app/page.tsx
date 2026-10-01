"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const categories = {
  "Fresh Produce": [
    "Vegetables",
    "Fruits",
    "Rice & Grains",
    "Spices",
    "Meat & Fish",
    "Flowers & Plants",
  ],
  "Food & Groceries": [
    "Packaged Food",
    "Bakery",
    "Homemade Food",
    "Beverages",
    "Groceries",
    "Household Supplies",
  ],
  Fashion: [
    "Traditional Naga Wear",
    "Clothing",
    "Shoes",
    "Bags & Accessories",
    "Tailoring",
  ],
  "Home & Living": [
    "Furniture",
    "Home Appliances",
    "Kitchen Items",
    "Home Decor",
    "Construction Supplies",
  ],
  Services: [
    "Transport",
    "Repair & Maintenance",
    "Education & Tutoring",
    "Photography",
    "Catering",
    "Professional Services",
  ],
  Electronics: [
    "Mobile Phones",
    "Computers",
    "Accessories",
    "Appliances",
    "Used Electronics",
  ],
  "Local Businesses": [
    "Shops",
    "Restaurants",
    "Hotels & Homestays",
    "Farms",
    "Local Manufacturers",
  ],
  Other: [
    "Jobs",
    "Vehicles",
    "Rentals",
    "Other Local Offers",
  ],
} as const;

type Category = keyof typeof categories;

const listings = [
  {
    name: "Fresh Naga King Chilli",
    location: "Kohima",
    price: "₹120 / pack",
    category: "Fresh Produce",
    subcategory: "Spices",
  },
  {
    name: "Organic Pineapple",
    location: "Mokokchung",
    price: "₹80 / kg",
    category: "Fresh Produce",
    subcategory: "Fruits",
  },
  {
    name: "Handwoven Traditional Shawl",
    location: "Dimapur",
    price: "₹1,800",
    category: "Fashion",
    subcategory: "Traditional Naga Wear",
  },
  {
    name: "Home Catering Service",
    location: "Dimapur",
    price: "From ₹250 / plate",
    category: "Services",
    subcategory: "Catering",
  },
];

export default function Home() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [selectedSubcategory, setSelectedSubcategory] =
    useState<string | null>(null);

  function openCategory(category: Category) {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  }

  function openSubcategory(subcategory: string) {
    setSelectedSubcategory(subcategory);
  }

  function backToCategories() {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  }

  const visibleListings = listings.filter((listing) => {
    if (!selectedCategory) return true;

    if (!selectedSubcategory) {
      return listing.category === selectedCategory;
    }

    return (
      listing.category === selectedCategory &&
      listing.subcategory === selectedSubcategory
    );
  });

  return (
    <main>
      <header>
        <div className="brand">
          Naga<span>Sphere</span>
        </div>

        <nav>
          <a href="#browse">Browse</a>
          <a href="#how">How it works</a>
          <a href="#sell">Sell / Offer</a>

          <button onClick={() => router.push("/auth")}>
            Sign in
          </button>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">NAGALAND'S LOCAL MARKETPLACE</p>

          <h1>
            What you need.
            <br />
            <em>Someone here has it.</em>
          </h1>

          <p className="lead">
            Find products, services and local businesses around Nagaland — or
            tell people what you have to offer.
          </p>

          <div className="actions">
            <button
              className="primary"
              onClick={() => router.push("/auth?mode=signup")}
            >
              I Need Something
            </button>

            <button
              className="secondary"
              onClick={() => router.push("/auth?mode=signup")}
            >
              I Have Something
            </button>
          </div>
        </div>

        <div className="heroCard">
          <div className="pulse" />
          <b>Local-first matching</b>

          <p>
            Connect buyers and sellers without the noise of a generic social
            feed.
          </p>

          <div className="mini">
            📍 Nagaland &nbsp; • &nbsp; Verified listings
          </div>
        </div>
      </section>

      <section id="browse" className="section">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">EXPLORE</p>

            <h2>
              {selectedCategory
                ? selectedSubcategory
                  ? selectedSubcategory
                  : selectedCategory
                : "Find what’s around you"}
            </h2>
          </div>

          {selectedCategory && (
            <button onClick={backToCategories}>
              ← Categories
            </button>
          )}
        </div>

        {!selectedCategory && (
          <>
            <p className="lead" style={{ fontSize: "15px" }}>
              Choose a category to browse local products, services and
              businesses.
            </p>

            <div className="categories">
              {(Object.keys(categories) as Category[]).map((category) => (
                <button
                  className="category"
                  key={category}
                  onClick={() => openCategory(category)}
                >
                  <span>{category}</span>
                  <span>→</span>
                </button>
              ))}
            </div>
          </>
        )}

        {selectedCategory && !selectedSubcategory && (
          <>
            <p className="eyebrow" style={{ marginTop: "30px" }}>
              BROWSE {selectedCategory.toUpperCase()}
            </p>

            <div className="categories">
              {categories[selectedCategory].map((subcategory) => (
                <button
                  className="category"
                  key={subcategory}
                  onClick={() => openSubcategory(subcategory)}
                >
                  <span>{subcategory}</span>
                  <span>→</span>
                </button>
              ))}
            </div>
          </>
        )}

        {selectedSubcategory && (
          <div style={{ marginTop: "30px" }}>
            <button
              className="secondary"
              onClick={() => setSelectedSubcategory(null)}
            >
              ← Back to {selectedCategory}
            </button>
          </div>
        )}

        {selectedCategory && (
          <div className="listings">
            {visibleListings.length > 0 ? (
              visibleListings.map((listing) => (
                <article className="listing" key={listing.name}>
                  <div className="photo">{listing.name[0]}</div>

                  <div>
                    <h3>{listing.name}</h3>
                    <p>📍 {listing.location}</p>
                    <p>{listing.subcategory}</p>
                    <strong>{listing.price}</strong>
                  </div>
                </article>
              ))
            ) : (
              <p style={{ color: "#697067" }}>
                No listings yet in this section. Be the first to add one.
              </p>
            )}
          </div>
        )}
      </section>

      <section id="how" className="how">
        <p className="eyebrow">SIMPLE BY DESIGN</p>

        <h2>From need to connection.</h2>

        <div className="steps">
          <div>
            <b>01</b>
            <h3>Post what you need</h3>
            <p>
              Describe the product or service you are looking for.
            </p>
          </div>

          <div>
            <b>02</b>
            <h3>Discover local offers</h3>
            <p>
              See relevant listings from people and businesses nearby.
            </p>
          </div>

          <div>
            <b>03</b>
            <h3>Connect directly</h3>
            <p>
              Chat, agree on details and complete your transaction.
            </p>
          </div>
        </div>
      </section>

      <section id="sell" className="cta">
        <div>
          <p className="eyebrow">FOR SELLERS & BUSINESSES</p>

          <h2>Turn local reach into real customers.</h2>

          <p>
            Create a listing, receive enquiries and grow your local business.
          </p>
        </div>

        <button
          className="primary"
          onClick={() => router.push("/auth?mode=signup")}
        >
          Create a listing →
        </button>
      </section>

      <footer>
        <b>NagaSphere</b>
        <span>Built for local commerce in Nagaland.</span>
        <span>© 2026 NagaSphere</span>
      </footer>
    </main>
  );
}
