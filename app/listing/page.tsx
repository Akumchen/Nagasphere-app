
import Link from "next/link";
import { createClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    subcategory?: string;
  }>;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
};

type Listing = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  quantity: number | string | null;
  unit: string | null;
  budget_min: number | string | null;
  budget_max: number | string | null;
  city: string | null;
  state: string | null;
  category_id: string | null;
  categories:
    | {
        name: string;
        parent_id: string | null;
      }
    | {
        name: string;
        parent_id: string | null;
      }[]
    | null;
};

const colors = {
  green: "#173b2b",
  deepGreen: "#10291e",
  forest: "#0c241a",
  ivory: "#faf8ef",
  muted: "#637267",
  gold: "#c7a96b",
  border: "rgba(255,255,255,0.72)",
};

function getCategoryName(
  categories: Listing["categories"]
): string {
  if (!categories) return "";

  if (Array.isArray(categories)) {
    return categories[0]?.name ?? "";
  }

  return categories.name ?? "";
}

function formatBudget(
  min: number | string | null,
  max: number | string | null
) {
  if (min !== null && max !== null) {
    return `₹${min} – ₹${max}`;
  }

  if (min !== null) {
    return `From ₹${min}`;
  }

  if (max !== null) {
    return `Up to ₹${max}`;
  }

  return "";
}

export default async function MarketplacePage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const search = (params.search ?? "").trim();
  const category = (params.category ?? "").trim();
  const subcategory = (params.subcategory ?? "").trim();

  const supabase = await createClient();

  // Load the complete category hierarchy.
  const { data: categoryData } = await supabase
    .from("categories")
    .select("id,name,slug,parent_id")
    .order("name");

  const categories = (categoryData ?? []) as Category[];

  const topCategories = categories.filter(
    (item) => !item.parent_id
  );

  const selectedTop = topCategories.find(
    (item) => item.slug === category
  );

  const subcategories = categories.filter(
    (item) => item.parent_id === selectedTop?.id
  );

  const selectedSubcategory = categories.find(
    (item) => item.slug === subcategory
  );

  // Load active marketplace listings.
  let query = supabase
    .from("posts")
    .select(`
      id,
      title,
      description,
      type,
      quantity,
      unit,
      budget_min,
      budget_max,
      city,
      state,
      category_id,
      categories(name,parent_id)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Preserve existing search behavior.
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%`
    );
  }

  // Preserve parent-category and subcategory filtering.
  if (subcategory) {
    if (selectedSubcategory?.id) {
      query = query.eq(
        "category_id",
        selectedSubcategory.id
      );
    }
  } else if (category) {
    if (selectedTop?.id) {
      const childIds = subcategories.map(
        (child) => child.id
      );

      query = query.in("category_id", [
        selectedTop.id,
        ...childIds,
      ]);
    }
  }

  const { data, error } = await query.limit(60);
  const listings = (data ?? []) as Listing[];

  const selectedCategoryName =
    selectedSubcategory?.name ??
    selectedTop?.name ??
    "";

  const panelStyle = {
    border: `1px solid ${colors.border}`,
    background:
      "linear-gradient(140deg, rgba(250,249,241,0.96), rgba(238,241,225,0.91))",
    boxShadow: "0 16px 40px rgba(5,25,15,0.17)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  } as const;

  const chipBase = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    whiteSpace: "nowrap" as const,
    textDecoration: "none",
    borderRadius: "999px",
    padding: "10px 15px",
    fontSize: "12px",
    fontWeight: 700,
    transition: "background 160ms ease",
  };

  return (
    <main
      className="nagasphere-inner-page"
      style={{
        minHeight: "100vh",
        padding:
          "clamp(14px, 3.5vw, 34px) clamp(12px, 3vw, 24px) 0",
        boxSizing: "border-box",
        color: colors.deepGreen,
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1160px",
          margin: "0 auto",
        }}
      >
        {/* COMPACT BRAND HEADER */}
        <header
          style={{
            ...panelStyle,
            borderRadius: "22px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            border: "1px solid rgba(207,176,105,0.48)",
background:
  "linear-gradient(135deg, rgba(255,253,246,0.97), rgba(237,241,226,0.94))",
boxShadow:
  "0 12px 30px rgba(5,25,15,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          <Link
            href="/"
            aria-label="NagaSphere home"
            style={{
              display: "inline-flex",
alignItems: "center",
justifyContent: "center",
flexShrink: 0,
padding: "6px 12px",
              borderRadius: "15px",
border: "1px solid rgba(207,176,105,0.38)",
background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(245,241,225,0.9))",
boxShadow: "0 4px 12px rgba(16,41,30,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
            }}
          >
            <img
              src="/nagasphere-logo.png"
              alt="NagaSphere"
              style={{
                width: "clamp(108px, 27vw, 142px)",
                maxWidth: "100%",
                height: "auto",
               maxHeight: "48px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          <nav
            aria-label="Main navigation"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <Link
              href="/"
              style={{
                ...chipBase,
                color: colors.green,
              }}
            >
              Home
            </Link>

            <Link
              href="/listing"
              aria-current="page"
              style={{
                ...chipBase,
                color: colors.ivory,
                background: colors.green,
                boxShadow:
                  "0 5px 13px rgba(16,41,30,0.17)",
              }}
            >
              Marketplace
            </Link>

            <Link
              href="/my-listings"
              style={{
                ...chipBase,
                color: colors.green,
                background: "rgba(255,255,255,0.55)",
              }}
            >
              My Listings
            </Link>

            <Link
              href="/messages"
              style={{
                ...chipBase,
                color: colors.green,
                background: "rgba(255,255,255,0.55)",
              }}
            >
              Messages
            </Link>
          </nav>
        </header>

        {/* PREMIUM MARKETPLACE HERO */}
        <section
          style={{
            position: "relative",
            isolation: "isolate",
            overflow: "hidden",
            marginTop: "22px",
            borderRadius: "24px",
            padding: "clamp(25px, 5vw, 48px)",
            color: colors.ivory,
            background:
              "radial-gradient(ellipse at 88% 12%, rgba(199,169,107,0.20), transparent 35%), linear-gradient(135deg, #214b35 0%, #10291e 56%, #091d15 100%)",
            border: "1px solid rgba(255,255,255,0.17)",
            boxShadow: "0 20px 46px rgba(5,25,15,0.27)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              zIndex: -1,
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              border: "1px solid rgba(199,169,107,0.23)",
              right: "-85px",
              top: "-115px",
              boxShadow:
                "0 0 0 24px rgba(199,169,107,0.035), 0 0 0 50px rgba(199,169,107,0.025)",
            }}
          />

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "9px",
              border: "1px solid rgba(199,169,107,0.42)",
              background: "rgba(255,255,255,0.055)",
              borderRadius: "999px",
              padding: "8px 13px",
              color: "#e5d2a4",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "1.7px",
              textTransform: "uppercase",
            }}
          >
            <span aria-hidden="true">✦</span>
            NagaSphere Marketplace
          </div>

          <h1
            style={{
              position: "relative",
              maxWidth: "760px",
              margin: "19px 0 12px",
              fontSize: "clamp(31px, 6vw, 51px)",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              fontWeight: 750,
              color: "#fffdf4",
            }}
          >
            Discover what
            <br />
            Nagaland has to offer.
          </h1>

          <p
            style={{
              position: "relative",
              maxWidth: "590px",
              margin: 0,
              color: "rgba(250,248,239,0.78)",
              fontSize: "clamp(14px, 2.5vw, 16px)",
              lineHeight: 1.8,
            }}
          >
            Explore products, services and local businesses.
            Find what you need and connect with people in
            your community.
          </p>

          <div
            aria-hidden="true"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "26px",
              color: "#d6bd83",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                display: "block",
                width: "35px",
                height: "1px",
                background: colors.gold,
              }}
            />
            Buy · Sell · Support Local
          </div>
        </section>

        {/* SEARCH PANEL */}
        <section
          aria-label="Search the marketplace"
          style={{
            ...panelStyle,
            position: "relative",
            marginTop: "18px",
            padding: "clamp(14px, 3vw, 22px)",
            borderRadius: "20px",
          }}
        >
          <form
            method="get"
            action="/listing"
            style={{
              display: "flex",
              alignItems: "stretch",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div
              style={{
                flex: "1 1 260px",
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                gap: "11px",
                padding: "0 14px",
                border: "1px solid rgba(31,65,47,0.17)",
                borderRadius: "13px",
                background: "rgba(255,255,255,0.76)",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: "20px",
                  color: colors.muted,
                }}
              >
                ⌕
              </span>

              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search products, services or locations..."
                aria-label="Search products, services or locations"
                style={{
                  flex: 1,
                  width: "100%",
                  minWidth: 0,
                  border: 0,
                  outline: 0,
                  padding: "15px 0",
                  fontSize: "14px",
                  color: colors.deepGreen,
                  background: "transparent",
                }}
              />
            </div>

            {category && (
              <input
                type="hidden"
                name="category"
                value={category}
              />
            )}

            {subcategory && (
              <input
                type="hidden"
                name="subcategory"
                value={subcategory}
              />
            )}

            <button
              type="submit"
              style={{
                border: "1px solid #173b2b",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, #214c36, #10291e)",
                color: "#fffdf4",
                padding: "0 25px",
                minHeight: "50px",
                fontSize: "13px",
                fontWeight: 750,
                cursor: "pointer",
                boxShadow:
                  "0 6px 15px rgba(23,59,43,0.18)",
              }}
            >
              Search Marketplace →
            </button>
          </form>
        </section>

        {/* CATEGORY FILTERS */}
        <section
          aria-label="Browse by category"
          style={{
            marginTop: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
                color: colors.ivory,
                letterSpacing: "-0.3px",
              }}
            >
              Explore categories
            </h2>

            <span
              style={{
                fontSize: "11px",
                color: "rgba(250,248,239,0.76)",
              }}
            >
              Find your next discovery
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: "9px",
              overflowX: "auto",
              padding: "2px 2px 12px",
              scrollbarWidth: "thin",
            }}
          >
            <Link
              href="/listing"
              style={{
                ...chipBase,
                color:
                  !category && !subcategory
                    ? colors.ivory
                    : colors.green,
                background:
                  !category && !subcategory
                    ? colors.green
                    : "rgba(250,249,241,0.94)",
                border:
                  "1px solid rgba(255,255,255,0.48)",
                boxShadow:
                  !category && !subcategory
                    ? "0 6px 15px rgba(5,25,15,0.17)"
                    : "0 4px 12px rgba(5,25,15,0.08)",
              }}
            >
              All listings
            </Link>

            {topCategories.map((item) => {
              const active = category === item.slug;

              return (
                <Link
                  key={item.id}
                  href={`/listing?category=${encodeURIComponent(
                    item.slug
                  )}`}
                  aria-current={active ? "page" : undefined}
                  style={{
                    ...chipBase,
                    color: active
                      ? colors.ivory
                      : colors.green,
                    background: active
                      ? colors.green
                      : "rgba(250,249,241,0.94)",
                    border:
                      "1px solid rgba(255,255,255,0.48)",
                    boxShadow: active
                      ? "0 6px 15px rgba(5,25,15,0.17)"
                      : "0 4px 12px rgba(5,25,15,0.08)",
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {selectedTop && subcategories.length > 0 && (
            <div
              style={{
                ...panelStyle,
                borderRadius: "16px",
                padding: "15px",
                marginTop: "2px",
              }}
            >
              <p
                style={{
                  margin: "0 0 11px",
                  fontSize: "10px",
                  color: colors.muted,
                  fontWeight: 800,
                  letterSpacing: "1.4px",
                  textTransform: "uppercase",
                }}
              >
                Explore {selectedTop.name}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {subcategories.map((item) => {
                  const active = subcategory === item.slug;

                  return (
                    <Link
                      key={item.id}
                      href={`/listing?category=${encodeURIComponent(
                        selectedTop.slug
                      )}&subcategory=${encodeURIComponent(
                        item.slug
                      )}`}
                      aria-current={active ? "page" : undefined}
                      style={{
                        ...chipBase,
                        padding: "8px 12px",
                        fontSize: "11px",
                        color: active
                          ? "#fffdf4"
                          : colors.green,
                        background: active
                          ? colors.green
                          : "rgba(255,255,255,0.68)",
                        border: active
                          ? `1px solid ${colors.green}`
                          : "1px solid rgba(31,65,47,0.15)",
                      }}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* RESULTS HEADER */}
        <section
          style={{
            marginTop: "29px",
            marginBottom: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 6px",
                color: "#e0c993",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Your next discovery
            </p>

            <h2
              style={{
                margin: 0,
                color: "#fffdf4",
                fontSize: "clamp(22px, 4vw, 29px)",
                lineHeight: 1.2,
                letterSpacing: "-0.6px",
              }}
            >
              {search
                ? `Results for "${search}"`
                : selectedCategoryName
                  ? selectedCategoryName
                  : "Latest listings"}
            </h2>

            <p
              style={{
                margin: "7px 0 0",
                color: "rgba(250,248,239,0.76)",
                fontSize: "12px",
              }}
            >
              {listings.length} active{" "}
              {listings.length === 1
                ? "listing"
                : "listings"}
            </p>
          </div>

          <Link
            href="/create-listing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background:
                "linear-gradient(135deg, #e2ce9d, #c7a96b)",
              color: colors.deepGreen,
              textDecoration: "none",
              padding: "13px 18px",
              minHeight: "44px",
              boxSizing: "border-box",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 800,
              boxShadow:
                "0 7px 18px rgba(5,25,15,0.17)",
            }}
          >
            + Post Listing
          </Link>
        </section>

        {/* ERROR STATE */}
        {error && (
          <div
            role="alert"
            style={{
              background: "rgba(255,244,239,0.97)",
              border: "1px solid rgba(160,60,42,0.25)",
              color: "#762b22",
              borderRadius: "15px",
              padding: "18px",
              marginBottom: "18px",
              fontSize: "13px",
              boxShadow: "0 8px 22px rgba(5,25,15,0.12)",
            }}
          >
            Unable to load marketplace listings right now.
            Please try again shortly.
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && listings.length === 0 && (
          <section
            style={{
              ...panelStyle,
              borderRadius: "22px",
              padding: "clamp(27px, 5vw, 48px) 22px",
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: "58px",
                height: "58px",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 17px",
                borderRadius: "19px",
                background: "rgba(31,65,47,0.09)",
                color: colors.green,
                fontSize: "28px",
              }}
            >
              ◇
            </div>

            <h3
              style={{
                margin: "0 0 9px",
                fontSize: "23px",
                color: colors.deepGreen,
              }}
            >
              No listings found
            </h3>

            <p
              style={{
                maxWidth: "460px",
                margin: "0 auto 21px",
                color: colors.muted,
                fontSize: "13px",
                lineHeight: 1.8,
              }}
            >
              Try a different search or category. You can
              also post a listing and help someone in
              Nagaland find what they need.
            </p>

            <Link
              href="/create-listing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: colors.green,
                color: "#fffdf4",
                textDecoration: "none",
                padding: "13px 19px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 750,
              }}
            >
              Create a Listing →
            </Link>
          </section>
        )}

        {/* LISTING CARDS */}
        {listings.length > 0 && (
          <section
            aria-label="Marketplace listings"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 265px), 1fr))",
              gap: "16px",
              marginBottom: "36px",
            }}
          >
            {listings.map((listing) => {
              const categoryName = getCategoryName(
                listing.categories
              );

              const budget = formatBudget(
                listing.budget_min,
                listing.budget_max
              );

              const isRequest =
                listing.type?.toLowerCase() === "request";

              return (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    boxSizing: "border-box",
                    padding: "21px",
                    borderRadius: "19px",
                    border:
                      "1px solid rgba(255,255,255,0.76)",
                    background:
                      "linear-gradient(145deg, rgba(250,249,242,0.97), rgba(239,242,229,0.93))",
                    boxShadow:
                      "0 12px 30px rgba(5,25,15,0.16)",
                    color: colors.deepGreen,
                    textDecoration: "none",
                    overflowWrap: "anywhere",
                  }}
                >
                  {/* TYPE AND CATEGORY */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        border: isRequest
                          ? "1px solid rgba(150,102,36,0.22)"
                          : "1px solid rgba(37,112,66,0.19)",
                        background: isRequest
                          ? "rgba(199,169,107,0.15)"
                          : "rgba(37,112,66,0.09)",
                        color: isRequest
                          ? "#805714"
                          : "#21643a",
                        borderRadius: "999px",
                        padding: "6px 10px",
                        fontSize: "10px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                      }}
                    >
                      <span aria-hidden="true">
                        {isRequest ? "◇" : "✦"}
                      </span>
                      {listing.type}
                    </span>

                    {categoryName && (
                      <span
                        style={{
                          color: colors.muted,
                          fontSize: "10px",
                          fontWeight: 650,
                          textAlign: "right",
                          paddingTop: "6px",
                        }}
                      >
                        {categoryName}
                      </span>
                    )}
                  </div>

                  {/* TITLE */}
                  <h3
                    style={{
                      margin: "0 0 9px",
                      fontSize: "19px",
                      lineHeight: 1.35,
                      letterSpacing: "-0.35px",
                      fontWeight: 750,
                      color: colors.deepGreen,
                    }}
                  >
                    {listing.title}
                  </h3>

                  {/* DESCRIPTION */}
                  {listing.description && (
                    <p
                      style={{
                        margin: "0 0 17px",
                        color: colors.muted,
                        fontSize: "12px",
                        lineHeight: 1.75,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {listing.description}
                    </p>
                  )}

                  {/* PRICE OR BUDGET */}
                  {budget && (
                    <div
                      style={{
                        marginTop: listing.description
                          ? "0"
                          : "2px",
                        marginBottom: "17px",
                        padding: "12px 13px",
                        borderRadius: "12px",
                        border:
                          "1px solid rgba(31,65,47,0.10)",
                        background:
                          "rgba(255,255,255,0.64)",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 4px",
                          color: colors.muted,
                          fontSize: "9px",
                          fontWeight: 800,
                          letterSpacing: "1.1px",
                          textTransform: "uppercase",
                        }}
                      >
                        {isRequest ? "Budget" : "Price"}
                      </p>

                      <p
                        style={{
                          margin: 0,
                          color: colors.green,
                          fontSize: "19px",
                          lineHeight: 1.3,
                          fontWeight: 800,
                        }}
                      >
                        {budget}
                      </p>
                    </div>
                  )}

                  {/* QUANTITY AND LOCATION */}
                  <div
                    style={{
                      display: "grid",
                      gap: "9px",
                      color: colors.muted,
                      fontSize: "11px",
                      lineHeight: 1.5,
                      marginTop: "auto",
                      paddingTop: "12px",
                    }}
                  >
                    {listing.quantity !== null && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            color: colors.gold,
                            fontSize: "14px",
                          }}
                        >
                          ▤
                        </span>
                        <span>
                          {listing.quantity}{" "}
                          {listing.unit ?? ""}
                        </span>
                      </div>
                    )}

                    {(listing.city || listing.state) && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            color: colors.gold,
                            fontSize: "14px",
                          }}
                        >
                          ⌖
                        </span>
                        <span>
                          {[listing.city, listing.state]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* VIEW LISTING */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "19px",
                      paddingTop: "14px",
                      borderTop:
                        "1px solid rgba(31,65,47,0.13)",
                      color: colors.green,
                      fontSize: "12px",
                      fontWeight: 800,
                    }}
                  >
                    <span>View listing</span>
                    <span
                      aria-hidden="true"
                      style={{
                        color: "#a08043",
                        fontSize: "17px",
                      }}
                    >
                      →
                    </span>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "8px",
          marginLeft: "calc(-1 * clamp(12px, 3vw, 24px))",
          marginRight: "calc(-1 * clamp(12px, 3vw, 24px))",
          padding: "27px 18px",
          textAlign: "center",
          color: "rgba(250,248,239,0.78)",
          background:
            "linear-gradient(135deg, #10291e, #071a12)",
          borderTop:
            "1px solid rgba(199,169,107,0.34)",
          fontSize: "11px",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#fffdf4",
            fontWeight: 700,
            letterSpacing: "0.4px",
          }}
        >
          NagaSphere
        </p>

        <p
          style={{
            margin: "7px 0 0",
            lineHeight: 1.7,
          }}
        >
          © 2026 NagaSphere. All rights reserved.
        </p>

        <p
          style={{
            margin: "5px 0 0",
            color: "#d6bd83",
            letterSpacing: "0.5px",
          }}
        >
          Buy · Sell · Support Local
        </p>
      </footer>
    </main>
  );
}
