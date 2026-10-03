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

const categoryGroups: Record<string, string[]> = {
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

  if (name.includes("fashion") || name.includes("cloth")) {
    return "Fashion";
  }

  if (
    name.includes("home") ||
    name.includes("living") ||
    name.includes("furniture")
  ) {
    return "Home & Living";
  }

  if (name.includes("electronic")) {
    return "Electronics";
  }

  if (name.includes("service")) {
    return "Services";
  }

  if (
    name.includes("business") ||
    name.includes("shop") ||
    name.includes("restaurant")
  ) {
    return "Local Businesses";
  }

  return "Other";
}

/* -------------------------------------------------------
   INLINE NAGASPHERE LOGO
------------------------------------------------------- */

function NagaSphereLogo({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  const textColor = light ? "#ffffff" : "#173f2a";
  const accent = "#d4a84f";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 8 : 11,
        cursor: "pointer",
      }}
    >
      <svg
        width={compact ? 38 : 46}
        height={compact ? 38 : 46}
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r="29"
          fill="none"
          stroke={accent}
          strokeWidth="2"
        />

        <path
          d="M13 38 C20 28, 27 28, 32 34 C37 40, 44 39, 51 26"
          fill="none"
          stroke={light ? "#ffffff" : "#236b45"}
          strokeWidth="4"
          strokeLinecap="round"
        />

        <path
          d="M17 42 C23 37, 29 38, 34 43 C39 48, 45 46, 49 40"
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
        />

        <circle
          cx="32"
          cy="18"
          r="5"
          fill={accent}
        />
      </svg>

      <div>
        <div
          style={{
            fontSize: compact ? 19 : 23,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: textColor,
          }}
        >
          NagaSphere
        </div>

        {!compact && (
          <div
            style={{
              fontSize: 9,
              marginTop: 4,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: light ? "rgba(255,255,255,.72)" : "#6b7f70",
              fontWeight: 700,
            }}
          >
            Connect • Discover • Grow
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   SCENIC INLINE HERO
------------------------------------------------------- */

function HeroLandscape() {
  return (
    <svg
      viewBox="0 0 1200 520"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.48,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#103f2b" />
          <stop offset="55%" stopColor="#17613e" />
          <stop offset="100%" stopColor="#26744a" />
        </linearGradient>

        <linearGradient id="mountain" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2d7651" />
          <stop offset="100%" stopColor="#0c3826" />
        </linearGradient>
      </defs>

      <rect width="1200" height="520" fill="url(#sky)" />

      <circle
        cx="925"
        cy="110"
        r="55"
        fill="#f5d88d"
        opacity=".32"
      />

      <path
        d="M0 330 L140 205 L260 315 L390 160 L535 310 L670 190 L815 330 L965 175 L1200 335 V520 H0Z"
        fill="url(#mountain)"
        opacity=".9"
      />

      <path
        d="M0 375 C145 330 205 365 315 335 C430 300 520 375 650 335 C790 292 900 370 1030 330 C1110 305 1160 320 1200 305 V520 H0Z"
        fill="#092d20"
        opacity=".78"
      />

      <path
        d="M0 420 C150 370 260 440 410 400 C560 360 690 430 820 395 C970 355 1080 420 1200 380 V520 H0Z"
        fill="#061f16"
        opacity=".72"
      />

      <g opacity=".45" fill="#d4a84f">
        <circle cx="150" cy="365" r="3" />
        <circle cx="180" cy="390" r="2" />
        <circle cx="225" cy="375" r="3" />
        <circle cx="980" cy="350" r="2" />
        <circle cx="1030" cy="375" r="3" />
        <circle cx="1080" cy="360" r="2" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------
   HOME PAGE
------------------------------------------------------- */

export default function HomePage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const [selectedSubcategory, setSelectedSubcategory] =
    useState<string | null>(null);

  const [listings, setListings] = useState<Listing[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserId(user?.id ?? null);
      setCheckingAuth(false);
    }

    loadUser();
  }, [supabase]);

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

      if (selectedCategory && mappedCategory !== selectedCategory) {
        return false;
      }

      if (
        selectedSubcategory &&
        listing.subcategory !== selectedSubcategory
      ) {
        return false;
      }

      if (locationFilter && listing.location !== locationFilter) {
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

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserId(null);
    router.refresh();
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
        background: "#f6f7f3",
        color: "#173126",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "13px 20px",
          background: "rgba(255,255,255,.88)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(23,49,38,.09)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
          }}
        >
          <div onClick={() => router.push("/")}>
            <NagaSphereLogo />
          </div>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {checkingAuth ? null : userId ? (
              <>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="navButton"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleSignOut}
                  className="navButton navPrimary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/auth")}
                  className="navButton"
                >
                  Login
                </button>

                <button
                  onClick={() => router.push("/auth?mode=signup")}
                  className="navButton navPrimary"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* =================================================
          HERO
      ================================================= */}

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: 560,
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #0b3021 0%, #155d3a 52%, #28744b 100%)",
        }}
      >
        <HeroLandscape />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 80% 20%, rgba(212,168,79,.20), transparent 28%), linear-gradient(90deg, rgba(4,25,17,.28), rgba(4,25,17,.02))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 1160,
            margin: "0 auto",
            padding: "78px 24px 90px",
          }}
        >
          <div
            style={{
              maxWidth: 820,
              color: "#fff",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 13px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,.20)",
                background: "rgba(255,255,255,.09)",
                backdropFilter: "blur(10px)",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              <span style={{ color: "#e2bb69" }}>✦</span>
              Built for Nagaland
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(42px, 7vw, 76px)",
                lineHeight: 1.02,
                letterSpacing: "-3px",
                fontWeight: 850,
              }}
            >
              Discover what
              <br />
              Nagaland has to offer.
            </h1>

            <p
              style={{
                maxWidth: 700,
                margin: "24px 0 32px",
                fontSize: "clamp(17px, 2vw, 21px)",
                lineHeight: 1.65,
                color: "rgba(255,255,255,.84)",
              }}
            >
              A local marketplace connecting people, products, services and
              businesses across Nagaland — all in one place.
            </p>

            {/* SEARCH PANEL */}

            <div
              style={{
                maxWidth: 940,
                padding: 8,
                borderRadius: 18,
                background: "rgba(255,255,255,.14)",
                border: "1px solid rgba(255,255,255,.18)",
                backdropFilter: "blur(18px)",
                boxShadow: "0 20px 60px rgba(0,0,0,.18)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    flex: "1 1 350px",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 18,
                      opacity: 0.55,
                    }}
                  >
                    ⌕
                  </span>

                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products, services, businesses..."
                    className="heroInput"
                  />
                </div>

                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="heroSelect"
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
                    className="clearButton"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 18,
                flexWrap: "wrap",
                marginTop: 22,
                fontSize: 13,
                color: "rgba(255,255,255,.66)",
              }}
            >
              <span>✓ Local sellers</span>
              <span>✓ Local services</span>
              <span>✓ Local businesses</span>
              <span>✓ One local marketplace</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CATEGORY SECTION
      ================================================= */}

      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "58px 24px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: 20,
            marginBottom: 22,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="sectionEyebrow">
              EXPLORE THE SPHERE
            </div>

            <h2 className="sectionTitle">
              Everything local,
              <br />
              beautifully connected.
            </h2>
          </div>

          <p className="sectionIntro">
            Browse the things people buy, sell,
            <br />
            need and offer across Nagaland.
          </p>
        </div>

        <div className="categoryGrid">
          {Object.keys(categoryGroups).map((category, index) => {
            const active = selectedCategory === category;

            const icons = [
              "🌾",
              "🥬",
              "🧵",
              "🏡",
              "🛠",
              "📱",
              "🏪",
              "✦",
            ];

            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(active ? null : category);
                  setSelectedSubcategory(null);
                }}
                className={`categoryCard ${
                  active ? "categoryCardActive" : ""
                }`}
              >
                <span className="categoryIcon">
                  {icons[index]}
                </span>

                <span className="categoryName">
                  {category}
                </span>

                <span className="categoryArrow">
                  →
                </span>
              </button>
            );
          })}
        </div>

        {selectedCategory && (
          <div
            style={{
              marginTop: 18,
              padding: 20,
              borderRadius: 18,
              background: "#ffffff",
              border: "1px solid rgba(23,49,38,.09)",
              boxShadow: "0 12px 35px rgba(23,49,38,.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <strong>{selectedCategory}</strong>

              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#64746a",
                }}
              >
                Close
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: 9,
                flexWrap: "wrap",
              }}
            >
              {categoryGroups[selectedCategory].map(
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
                        borderRadius: 999,
                        border: active
                          ? "1px solid #236b45"
                          : "1px solid #dce4de",
                        background: active
                          ? "#e7f2eb"
                          : "#ffffff",
                        color: "#274536",
                        cursor: "pointer",
                        fontWeight: 650,
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

      {/* =================================================
          BENEFITS STRIP
      ================================================= */}

      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "30px 24px 48px",
        }}
      >
        <div className="benefitStrip">
          <div className="benefitItem">
            <div className="benefitIcon">◈</div>
            <div>
              <strong>Made for Nagaland</strong>
              <span>Local-first marketplace</span>
            </div>
          </div>

          <div className="benefitDivider" />

          <div className="benefitItem">
            <div className="benefitIcon">⌁</div>
            <div>
              <strong>Connect directly</strong>
              <span>Talk to local sellers</span>
            </div>
          </div>

          <div className="benefitDivider" />

          <div className="benefitItem">
            <div className="benefitIcon">✦</div>
            <div>
              <strong>Discover opportunities</strong>
              <span>Products, needs and services</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          LISTINGS
      ================================================= */}

      <section
        style={{
          background:
            "linear-gradient(180deg, #edf3ee 0%, #f7f8f5 100%)",
          borderTop: "1px solid rgba(23,49,38,.06)",
          borderBottom: "1px solid rgba(23,49,38,.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "60px 24px 75px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 20,
              marginBottom: 28,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div className="sectionEyebrow">
                THE MARKETPLACE
              </div>

              <h2 className="sectionTitle">
                Fresh from around
                <br />
                the community.
              </h2>
            </div>

            <div
              style={{
                color: "#65756a",
                fontSize: 14,
              }}
            >
              {visibleListings.length}{" "}
              {visibleListings.length === 1
                ? "listing"
                : "listings"}
            </div>
          </div>

          {visibleListings.length === 0 ? (
            <div className="emptyState">
              <div
                style={{
                  fontSize: 42,
                  marginBottom: 12,
                }}
              >
                ◌
              </div>

              <h3>
                Nothing matching those filters yet.
              </h3>

              <p>
                Try another search or explore a different
                category.
              </p>

              {filtersActive && (
                <button
                  onClick={clearFilters}
                  className="greenButton"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="listingGrid">
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
                      router.push(
                        `/listing/${listing.id}`
                      );
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="listingCard"
                >
                  <div className="listingImage">
                    <div className="listingPattern" />

                    <span>
                      {listing.type === "need"
                        ? "NEED"
                        : "OFFER"}
                    </span>
                  </div>

                  <div className="listingBody">
                    <div className="listingMeta">
                      {listing.categoryName ||
                        "Local Listing"}
                    </div>

                    <h3>{listing.title}</h3>

                    {listing.description && (
                      <p className="listingDescription">
                        {listing.description}
                      </p>
                    )}

                    <div className="listingInfo">
                      <span>
                        Qty:{" "}
                        {listing.quantity ?? "—"}{" "}
                        {listing.unit || ""}
                      </span>

                      <span>
                        ₹
                        {listing.budget_min ??
                          listing.budget_max ??
                          "—"}
                      </span>
                    </div>

                    <div className="listingLocation">
                      <span>⌖</span>
                      {listing.location}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          BUILT FOR NAGALAND
      ================================================= */}

      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "75px 24px",
        }}
      >
        <div className="storyPanel">
          <div className="storyDecoration">
            <div />
            <div />
            <div />
          </div>

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: 720,
            }}
          >
            <div
              className="sectionEyebrow"
              style={{ color: "#d4a84f" }}
            >
              MORE THAN A MARKETPLACE
            </div>

            <h2
              style={{
                margin: "10px 0 20px",
                color: "#fff",
                fontSize: "clamp(32px, 5vw, 54px)",
                lineHeight: 1.08,
                letterSpacing: "-2px",
              }}
            >
              Built around the people
              <br />
              and businesses of Nagaland.
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,.76)",
                fontSize: 17,
                lineHeight: 1.75,
                maxWidth: 650,
                margin: 0,
              }}
            >
              NagaSphere brings local commerce into one
              connected space — helping people discover
              what is available nearby while giving local
              sellers, farmers, entrepreneurs and businesses
              a place to be discovered.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          HOW IT WORKS
      ================================================= */}

      <section
        style={{
          background: "#fff",
          borderTop: "1px solid rgba(23,49,38,.07)",
          borderBottom: "1px solid rgba(23,49,38,.07)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "68px 24px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div className="sectionEyebrow">
              SIMPLE BY DESIGN
            </div>

            <h2 className="sectionTitle">
              From discovery to connection.
            </h2>

            <p
              style={{
                maxWidth: 620,
                margin: "14px auto 42px",
                color: "#65756a",
                lineHeight: 1.7,
              }}
            >
              NagaSphere keeps local buying, selling and
              connecting simple.
            </p>
          </div>

          <div className="stepsGrid">
            <div className="stepCard">
              <div className="stepNumber">01</div>

              <h3>Discover</h3>

              <p>
                Explore products, services, businesses and
                opportunities available across Nagaland.
              </p>
            </div>

            <div className="stepCard">
              <div className="stepNumber">02</div>

              <h3>Connect</h3>

              <p>
                Find the right person or business and
                communicate directly through NagaSphere.
              </p>
            </div>

            <div className="stepCard">
              <div className="stepNumber">03</div>

              <h3>Grow</h3>

              <p>
                Build relationships, reach customers and
                participate in a stronger local marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CREATE LISTING CTA
      ================================================= */}

      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "70px 24px",
        }}
      >
        <div className="ctaPanel">
          <div>
            <div
              className="sectionEyebrow"
              style={{ color: "#d4a84f" }}
            >
              YOUR TURN
            </div>

            <h2>
              Have something to offer?
            </h2>

            <p>
              Put your product, service or business in front
              of people looking for it.
            </p>
          </div>

          <button
            onClick={() => router.push("/create-listing")}
            className="goldButton"
          >
            Create a Listing
            <span>→</span>
          </button>
        </div>
      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer
        style={{
          background: "#10271d",
          color: "#fff",
          padding: "48px 24px 28px",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 30,
              flexWrap: "wrap",
              paddingBottom: 35,
              borderBottom:
                "1px solid rgba(255,255,255,.10)",
            }}
          >
            <div>
              <NagaSphereLogo light />

              <p
                style={{
                  maxWidth: 360,
                  color: "rgba(255,255,255,.58)",
                  lineHeight: 1.7,
                  marginTop: 18,
                  fontSize: 14,
                }}
              >
                Connecting people, products, services and
                businesses across Nagaland.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 30,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => router.push("/")}
                className="footerLink"
              >
                Home
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="footerLink"
              >
                Dashboard
              </button>

              <button
                onClick={() => router.push("/create-listing")}
                className="footerLink"
              >
                Create Listing
              </button>
            </div>
          </div>

          <div
            style={{
              paddingTop: 22,
              color: "rgba(255,255,255,.40)",
              fontSize: 12,
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <span>
              © {new Date().getFullYear()} NagaSphere
            </span>

            <span>
              Built for Nagaland
            </span>
          </div>
        </div>
      </footer>

      {/* =================================================
          PAGE STYLES
      ================================================= */}

      <style jsx>{`
        .navButton {
          border: 1px solid rgba(23, 63, 42, 0.14);
          background: rgba(255, 255, 255, 0.75);
          color: #244b37;
          padding: 10px 15px;
          border-radius: 11px;
          cursor: pointer;
          font-weight: 700;
          font-size: 13px;
          transition: all 0.2s ease;
        }

        .navButton:hover {
          transform: translateY(-1px);
          border-color: rgba(35, 107, 69, 0.35);
        }

        .navPrimary {
          color: #fff;
          background: #236b45;
          border-color: #236b45;
        }

        .heroInput {
          width: 100%;
          box-sizing: border-box;
          border: none;
          outline: none;
          border-radius: 12px;
          padding: 17px 18px 17px 46px;
          background: #fff;
          color: #173126;
          font-size: 15px;
        }

        .heroSelect {
          flex: 0 1 220px;
          min-width: 180px;
          box-sizing: border-box;
          border: none;
          outline: none;
          border-radius: 12px;
          padding: 17px 15px;
          background: #fff;
          color: #173126;
          font-size: 15px;
        }

        .clearButton {
          border: none;
          background: #d4a84f;
          color: #173126;
          padding: 17px 18px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 800;
        }

        .sectionEyebrow {
          color: #3e7657;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .sectionTitle {
          margin: 8px 0 0;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.08;
          letter-spacing: -1.8px;
          color: #173126;
        }

        .sectionIntro {
          margin: 0;
          color: #69786e;
          line-height: 1.65;
          font-size: 14px;
        }

        .categoryGrid {
          display: grid;
          grid-template-columns: repeat(
            4,
            minmax(0, 1fr)
          );
          gap: 13px;
        }

        .categoryCard {
          position: relative;
          text-align: left;
          border: 1px solid rgba(23, 49, 38, 0.09);
          background: rgba(255, 255, 255, 0.82);
          border-radius: 18px;
          padding: 21px;
          min-height: 132px;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(23, 49, 38, 0.035);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .categoryCard:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 35px rgba(23, 49, 38, 0.09);
          border-color: rgba(35, 107, 69, 0.24);
        }

        .categoryCardActive {
          background: #edf6f0;
          border-color: rgba(35, 107, 69, 0.4);
        }

        .categoryIcon {
          display: block;
          font-size: 25px;
          margin-bottom: 24px;
        }

        .categoryName {
          display: block;
          color: #234735;
          font-size: 15px;
          font-weight: 800;
        }

        .categoryArrow {
          position: absolute;
          right: 17px;
          bottom: 17px;
          color: #7b8d82;
        }

        .benefitStrip {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 24px;
          padding: 24px 28px;
          background: #fff;
          border: 1px solid rgba(23, 49, 38, 0.08);
          border-radius: 20px;
          box-shadow: 0 10px 35px rgba(23, 49, 38, 0.045);
        }

        .benefitItem {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .benefitItem strong,
        .benefitItem span {
          display: block;
        }

        .benefitItem strong {
          font-size: 14px;
          color: #294b39;
        }

        .benefitItem span {
          color: #7a887f;
          font-size: 12px;
          margin-top: 4px;
        }

        .benefitIcon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #edf5ef;
          color: #286a47;
          font-size: 18px;
          flex-shrink: 0;
        }

        .benefitDivider {
          width: 1px;
          height: 40px;
          background: #e3e9e4;
        }

        .listingGrid {
          display: grid;
          grid-template-columns: repeat(
            4,
            minmax(0, 1fr)
          );
          gap: 18px;
        }

        .listingCard {
          overflow: hidden;
          background: #fff;
          border: 1px solid rgba(23, 49, 38, 0.08);
          border-radius: 18px;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(23, 49, 38, 0.045);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .listingCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 38px rgba(23, 49, 38, 0.10);
        }

        .listingImage {
          height: 150px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          padding: 15px;
          background:
            radial-gradient(
              circle at 75% 25%,
              rgba(212, 168, 79, 0.34),
              transparent 26%
            ),
            linear-gradient(
              135deg,
              #b8d1bd,
              #477b5b
            );
        }

        .listingPattern {
          position: absolute;
          inset: 0;
          opacity: 0.23;
          background-image:
            linear-gradient(
              135deg,
              transparent 25%,
              rgba(255, 255, 255, 0.55) 25%,
              rgba(255, 255, 255, 0.55) 27%,
              transparent 27%
            );
          background-size: 28px 28px;
        }

        .listingImage span {
          position: relative;
          z-index: 2;
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.86);
          color: #315c42;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .listingBody {
          padding: 18px;
        }

        .listingMeta {
          color: #4c815f;
          font-size: 11px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .listingBody h3 {
          margin: 0 0 9px;
          color: #1d382a;
          font-size: 18px;
          line-height: 1.25;
        }

        .listingDescription {
          margin: 0 0 14px;
          color: #6c7971;
          font-size: 13px;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .listingInfo {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: #45594b;
          font-size: 12px;
          font-weight: 700;
          padding-top: 12px;
          border-top: 1px solid #edf0ed;
        }

        .listingLocation {
          margin-top: 12px;
          color: #7a877f;
          font-size: 12px;
        }

        .listingLocation span {
          color: #c09336;
          margin-right: 5px;
        }

        .emptyState {
          text-align: center;
          padding: 65px 25px;
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(23, 49, 38, 0.08);
        }

        .emptyState h3 {
          margin: 0;
          font-size: 20px;
        }

        .emptyState p {
          color: #728078;
          margin: 8px 0 20px;
        }

        .greenButton {
          border: none;
          border-radius: 10px;
          padding: 12px 18px;
          background: #236b45;
          color: #fff;
          font-weight: 750;
          cursor: pointer;
        }

        .storyPanel {
          position: relative;
          overflow: hidden;
          min-height: 390px;
          display: flex;
          align-items: center;
          padding: 65px;
          border-radius: 30px;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(212, 168, 79, 0.16),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #0e3022,
              #1a5939
            );
          box-shadow: 0 25px 70px rgba(16, 49, 34, 0.14);
        }

        .storyDecoration {
          position: absolute;
          right: -80px;
          bottom: -100px;
          width: 450px;
          height: 450px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 50%;
        }

        .storyDecoration div {
          position: absolute;
          border: 1px solid rgba(212,168,79,.18);
          border-radius: 50%;
          inset: 45px;
        }

        .storyDecoration div:nth-child(2) {
          inset: 95px;
        }

        .storyDecoration div:nth-child(3) {
          inset: 145px;
        }

        .stepsGrid {
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 18px;
        }

        .stepCard {
          padding: 30px;
          border-radius: 20px;
          background: #f7f9f7;
          border: 1px solid #e5ebe6;
        }

        .stepNumber {
          color: #c09336;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
          margin-bottom: 22px;
        }

        .stepCard h3 {
          margin: 0 0 10px;
          font-size: 21px;
          color: #214532;
        }

        .stepCard p {
          margin: 0;
          color: #68766d;
          line-height: 1.7;
          font-size: 14px;
        }

        .ctaPanel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          padding: 45px 50px;
          border-radius: 26px;
          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(212,168,79,.13),
              transparent 28%
            ),
            #173c29;
          color: #fff;
        }

        .ctaPanel h2 {
          margin: 8px 0 8px;
          font-size: clamp(30px, 4vw, 43px);
          letter-spacing: -1.5px;
        }

        .ctaPanel p {
          margin: 0;
          color: rgba(255,255,255,.67);
          line-height: 1.6;
        }

        .goldButton {
          display: inline-flex;
          align-items: center;
          gap: 20px;
          border: none;
          border-radius: 12px;
          padding: 15px 20px;
          background: #d4a84f;
          color: #183627;
          font-weight: 850;
          cursor: pointer;
          white-space: nowrap;
        }

        .goldButton span {
          font-size: 20px;
        }

        .footerLink {
          border: none;
          background: transparent;
          color: rgba(255,255,255,.65);
          cursor: pointer;
          font-size: 13px;
        }

        .footerLink:hover {
          color: #fff;
        }

        @media (max-width: 900px) {
          .categoryGrid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .listingGrid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .benefitStrip {
            grid-template-columns: 1fr;
          }

          .benefitDivider {
            display: none;
          }

          .stepsGrid {
            grid-template-columns: 1fr;
          }

          .storyPanel {
            padding: 42px 30px;
          }
        }

        @media (max-width: 620px) {
          .navButton {
            padding: 9px 10px;
            font-size: 12px;
          }

          .categoryGrid {
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }

          .categoryCard {
            min-height: 112px;
            padding: 16px;
          }

          .categoryIcon {
            margin-bottom: 18px;
          }

          .listingGrid {
            grid-template-columns: 1fr;
          }

          .heroSelect {
            flex: 1 1 100%;
          }

          .clearButton {
            flex: 1 1 100%;
          }

          .storyPanel {
            min-height: 360px;
            padding: 35px 25px;
          }

          .ctaPanel {
            padding: 35px 25px;
            flex-direction: column;
            align-items: flex-start;
          }

          .goldButton {
            width: 100%;
            justify-content: space-between;
          }

          .sectionTitle {
            font-size: 32px;
          }
        }
      `}</style>
    </main>
  );
}
