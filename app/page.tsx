"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { useRouter } from "next/navigation";

type Listing = {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  quantity?: number | null;
  unit?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  city?: string | null;
  state?: string | null;
  category_id?: string | null;
  categoryName?: string;
  subcategory?: string;
  location?: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

const categories: Record<string, string[]> = {
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
};

function mapCategory(categoryName?: string) {
  const name = (categoryName || "").toLowerCase();

  if (
    name.includes("food") ||
    name.includes("agriculture") ||
    name.includes("produce")
  ) {
    return "Fresh Produce";
  }

  if (name.includes("service")) {
    return "Services";
  }

  if (name.includes("business")) {
    return "Local Businesses";
  }

  return "Other";
}

export default function HomePage() {
  const supabase = createClient();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null
  );

  const [listings, setListings] = useState<Listing[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    async function loadData() {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id,name,slug")
        .order("name");

      if (categoryData) {
        setDbCategories(categoryData);
      }

      const { data: postData } = await supabase
        .from("posts")
        .select(
          "id,title,description,type,quantity,unit,budget_min,budget_max,city,state,category_id"
        )
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (!postData) {
        setListings([]);
        return;
      }

      const categoryMap = new Map(
        (categoryData || []).map((category) => [
          category.id,
          category.name,
        ])
      );

      const mappedListings: Listing[] = postData.map((post) => {
        const categoryName = post.category_id
          ? categoryMap.get(post.category_id)
          : undefined;

        const location =
          post.city && post.state
            ? `${post.city}, ${post.state}`
            : post.city || post.state || "Nagaland";

        return {
          ...post,
          categoryName,
          subcategory: categoryName,
          location,
        };
      });

      setListings(mappedListings);
    }

    loadData();
  }, [supabase]);

  const locations = useMemo(() => {
    return Array.from(
      new Set(
        listings
          .map((listing) => listing.location)
          .filter((location): location is string => Boolean(location))
      )
    ).sort();
  }, [listings]);

  const visibleListings = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return listings.filter((listing) => {
      const mappedCategory = mapCategory(listing.categoryName);

      if (
        selectedCategory &&
        mappedCategory !== selectedCategory
      ) {
        return false;
      }

      if (
        selectedSubcategory &&
        listing.subcategory !== selectedSubcategory
      ) {
        return false;
      }

      if (
        locationFilter &&
        listing.location !== locationFilter
      ) {
        return false;
      }

      if (search) {
        const searchableText = [
          listing.title,
          listing.description,
          listing.location,
          listing.categoryName,
          listing.subcategory,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(search)) {
          return false;
        }
      }

      return true;
    });
  }, [
    listings,
    selectedCategory,
    selectedSubcategory,
    locationFilter,
    searchTerm,
  ]);

  function clearFilters() {
    setSearchTerm("");
    setLocationFilter("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  }

  const filtersActive =
    Boolean(searchTerm) ||
    Boolean(locationFilter) ||
    Boolean(selectedCategory) ||
    Boolean(selectedSubcategory);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#166534",
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            NagaSphere
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <button
              onClick={() => router.push("/auth")}
              style={{
                border: "1px solid #166534",
                background: "#ffffff",
                color: "#166534",
                padding: "10px 16px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Login
            </button>

            <button
              onClick={() => router.push("/auth?mode=signup")}
              style={{
                border: "none",
                background: "#166534",
                color: "#ffffff",
                padding: "10px 16px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #166534 0%, #15803d 50%, #22c55e 100%)",
          color: "#ffffff",
          padding: "70px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 64px)",
              margin: 0,
              fontWeight: 800,
            }}
          >
            Welcome to NagaSphere
          </h1>

          <p
            style={{
              fontSize: 20,
              marginTop: 18,
              marginBottom: 30,
              opacity: 0.95,
            }}
          >
            Discover products, services, businesses and local opportunities
            across Nagaland.
          </p>

          {/* SEARCH */}
          <div
            style={{
              display: "flex",
              gap: 10,
              maxWidth: 850,
              margin: "0 auto",
              flexWrap: "wrap",
            }}
          >
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, services, businesses..."
              style={{
                flex: "1 1 320px",
                padding: "15px 16px",
                borderRadius: 10,
                border: "none",
                fontSize: 16,
                minWidth: 0,
                outline: "none",
              }}
            />

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{
                flex: "0 1 220px",
                padding: "15px 16px",
                borderRadius: 10,
                border: "none",
                fontSize: 16,
                background: "#ffffff",
                color: "#111827",
                outline: "none",
              }}
            >
              <option value="">All locations</option>

              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            {filtersActive && (
              <button
                onClick={clearFilters}
                style={{
                  padding: "15px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: "#ffffff",
                  color: "#166534",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "45px 24px 20px",
        }}
      >
        <h2
          style={{
            fontSize: 30,
            marginBottom: 20,
          }}
        >
          Browse Categories
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
          }}
        >
          {Object.keys(categories).map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(
                    active ? null : category
                  );
                  setSelectedSubcategory(null);
                }}
                style={{
                  padding: "16px 12px",
                  borderRadius: 10,
                  border: active
                    ? "2px solid #166534"
                    : "1px solid #d1d5db",
                  background: active
                    ? "#dcfce7"
                    : "#ffffff",
                  color: "#111827",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* SUBCATEGORIES */}
        {selectedCategory && (
          <div
            style={{
              marginTop: 20,
              padding: 20,
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {selectedCategory}
            </h3>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {categories[selectedCategory].map(
                (subcategory) => {
                  const active =
                    selectedSubcategory === subcategory;

                  return (
                    <button
                      key={subcategory}
                      onClick={() =>
                        setSelectedSubcategory(
                          active ? null : subcategory
                        )
                      }
                      style={{
                        padding: "9px 14px",
                        borderRadius: 20,
                        border: active
                          ? "2px solid #166534"
                          : "1px solid #d1d5db",
                        background: active
                          ? "#dcfce7"
                          : "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      {subcategory}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}
      </section>

      {/* LISTINGS */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px 24px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              fontSize: 30,
              margin: 0,
            }}
          >
            Latest Listings
          </h2>

          {filtersActive && (
            <span
              style={{
                color: "#4b5563",
                fontSize: 14,
              }}
            >
              {visibleListings.length} result
              {visibleListings.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {visibleListings.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 40,
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            No listings match your current search or filters.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 18,
            }}
          >
            {visibleListings.map((listing) => (
              <article
                key={listing.id}
                onClick={() =>
                  router.push(`/listing/${listing.id}`)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    router.push(`/listing/${listing.id}`);
                  }
                }}
                role="button"
                tabIndex={0}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 20,
                  cursor: "pointer",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "transform 0.15s ease",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#166534",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {listing.categoryName ||
                    "Local Listing"}
                </div>

                <h3
                  style={{
                    margin: "0 0 10px",
                    fontSize: 20,
                  }}
                >
                  {listing.title}
                </h3>

                {listing.description && (
                  <p
                    style={{
                      margin: "0 0 12px",
                      color: "#4b5563",
                      lineHeight: 1.5,
                    }}
                  >
                    {listing.description}
                  </p>
                )}

                <p
                  style={{
                    margin: "8px 0",
                    color: "#374151",
                  }}
                >
                  Quantity:{" "}
                  {listing.quantity ?? "—"}{" "}
                  {listing.unit || ""}
                </p>

                <p
                  style={{
                    margin: "8px 0",
                    color: "#374151",
                  }}
                >
                  Price: ₹
                  {listing.budget_min ??
                    listing.budget_max ??
                    "—"}
                </p>

                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#6b7280",
                    fontSize: 14,
                  }}
                >
                  📍 {listing.location}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          background: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
          padding: "55px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: 30,
              textAlign: "center",
              marginBottom: 35,
            }}
          >
            How NagaSphere Works
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            <div
              style={{
                padding: 24,
                borderRadius: 12,
                background: "#f8fafc",
              }}
            >
              <h3>1. Discover</h3>
              <p>
                Search and browse products, services and
                businesses available across Nagaland.
              </p>
            </div>

            <div
              style={{
                padding: 24,
                borderRadius: 12,
                background: "#f8fafc",
              }}
            >
              <h3>2. Connect</h3>
              <p>
                Find sellers and connect directly through
                NagaSphere.
              </p>
            </div>

            <div
              style={{
                padding: 24,
                borderRadius: 12,
                background: "#f8fafc",
              }}
            >
              <h3>3. Trade</h3>
              <p>
                Discuss requirements and complete your
                transaction with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "60px 24px",
          textAlign: "center",
          background: "#f0fdf4",
        }}
      >
        <h2
          style={{
            fontSize: 32,
            marginBottom: 14,
          }}
        >
          Have something to sell?
        </h2>

        <p
          style={{
            color: "#4b5563",
            marginBottom: 25,
          }}
        >
          Create your NagaSphere listing and reach
          customers across Nagaland.
        </p>

        <button
          onClick={() => router.push("/create-listing")}
          style={{
            background: "#166534",
            color: "#ffffff",
            border: "none",
            borderRadius: 9,
            padding: "13px 22px",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Create a Listing
        </button>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#111827",
          color: "#d1d5db",
          padding: "35px 24px",
          textAlign: "center",
        }}
      >
        <strong
          style={{
            color: "#ffffff",
            fontSize: 20,
          }}
        >
          NagaSphere
        </strong>

        <p
          style={{
            marginBottom: 0,
            fontSize: 14,
          }}
        >
          A local marketplace connecting Nagaland.
        </p>
      </footer>
    </main>
  );
}
