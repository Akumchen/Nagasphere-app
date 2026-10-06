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

  /*
   * Load the complete category hierarchy from Supabase.
   */
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

  /*
   * Load marketplace listings.
   */
  let query = supabase
    .from("posts")
    .select(
      `
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
      `
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  /*
   * Search.
   */
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%`
    );
  }

  /*
   * Category filtering.
   *
   * Selecting a top-level category includes:
   * - the top-level category itself
   * - all of its direct subcategories
   *
   * Selecting a subcategory filters to that exact category only.
   */
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

      const ids = [
        selectedTop.id,
        ...childIds,
      ];

      query = query.in("category_id", ids);
    }
  }

  const { data, error } = await query.limit(60);

  const listings = (data ?? []) as Listing[];

  /*
   * Determine the heading shown above results.
   */
  const selectedCategoryName =
    selectedSubcategory?.name ??
    selectedTop?.name ??
    "";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7faf6",
        color: "#12302b",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          background: "#063f35",
          color: "#fff",
          padding: "14px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <Link href="/" style={{ display: "block" }}>
            <img
              src="/nagasphere-logo.png"
              alt="NagaSphere"
              style={{
                width: "155px",
                height: "auto",
                display: "block",
              }}
            />
          </Link>

          <nav
            style={{
              display: "flex",
              gap: "18px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Home
            </Link>

            <Link
              href="/listing"
              style={{
                color: "#59e26f",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              Marketplace
            </Link>

            <Link
              href="/my-listings"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              My Listings
            </Link>

            <Link
              href="/messages"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Messages
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "28px 18px 50px",
        }}
      >
        {/* TITLE */}
        <div style={{ marginBottom: "22px" }}>
          <p
            style={{
              margin: 0,
              color: "#16863d",
              fontWeight: 800,
              fontSize: "13px",
              letterSpacing: ".5px",
              textTransform: "uppercase",
            }}
          >
            NagaSphere Marketplace
          </p>

          <h1
            style={{
              margin: "6px 0 5px",
              fontSize: "32px",
              lineHeight: 1.15,
            }}
          >
            Discover Local Products & Services
          </h1>

          <p
            style={{
              margin: 0,
              color: "#68736f",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            Buy, sell and connect with people and businesses
            across Nagaland.
          </p>
        </div>

        {/* SEARCH */}
        <form
          method="get"
          action="/listing"
          style={{
            display: "flex",
            gap: "8px",
            background: "#fff",
            border: "1px solid #dfe6df",
            borderRadius: "14px",
            padding: "8px",
            marginBottom: "22px",
            boxShadow: "0 3px 14px rgba(0,0,0,.06)",
          }}
        >
          <input
            name="search"
            defaultValue={search}
            placeholder="Search products, services or locations..."
            style={{
              flex: 1,
              minWidth: 0,
              border: 0,
              outline: 0,
              padding: "12px 14px",
              fontSize: "14px",
              background: "transparent",
            }}
          />

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
              border: 0,
              borderRadius: "10px",
              background: "#2dbd62",
              color: "#fff",
              padding: "0 22px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        {/* TOP-LEVEL CATEGORY FILTERS */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "8px",
            marginBottom: "10px",
          }}
        >
          <Link
            href="/listing"
            style={{
              whiteSpace: "nowrap",
              textDecoration: "none",
              padding: "9px 14px",
              borderRadius: "22px",
              background:
                !category && !subcategory
                  ? "#063f35"
                  : "#fff",
              color:
                !category && !subcategory
                  ? "#fff"
                  : "#31534c",
              border: "1px solid #dfe6df",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            All
          </Link>

          {topCategories.map((item) => {
            const active = category === item.slug;

            return (
              <Link
                key={item.id}
                href={`/listing?category=${encodeURIComponent(
                  item.slug
                )}`}
                style={{
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  padding: "9px 14px",
                  borderRadius: "22px",
                  background: active ? "#063f35" : "#fff",
                  color: active ? "#fff" : "#31534c",
                  border: "1px solid #dfe6df",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* SUBCATEGORY FILTERS */}
        {selectedTop && subcategories.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "7px",
              overflowX: "auto",
              paddingBottom: "10px",
              marginBottom: "18px",
              paddingLeft: "4px",
            }}
          >
            {subcategories.map((item) => {
              const active =
                subcategory === item.slug;

              return (
                <Link
                  key={item.id}
                  href={`/listing?category=${encodeURIComponent(
                    selectedTop.slug
                  )}&subcategory=${encodeURIComponent(
                    item.slug
                  )}`}
                  style={{
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                    padding: "7px 12px",
                    borderRadius: "18px",
                    background: active
                      ? "#2dbd62"
                      : "#edf7ef",
                    color: active
                      ? "#fff"
                      : "#31534c",
                    border: "1px solid #d7e9da",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* RESULTS HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "15px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "21px",
              }}
            >
              {search
                ? `Results for "${search}"`
                : selectedCategoryName
                  ? selectedCategoryName
                  : "All Listings"}
            </h2>

            <p
              style={{
                margin: "4px 0 0",
                color: "#74807b",
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
              background: "#063f35",
              color: "#fff",
              textDecoration: "none",
              padding: "10px 15px",
              borderRadius: "9px",
              fontSize: "12px",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            + Post Listing
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "#fff4f2",
              border: "1px solid #f0c9c3",
              color: "#a33a2b",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "18px",
              fontSize: "13px",
            }}
          >
            Unable to load marketplace listings right now.
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && listings.length === 0 && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e1e7e1",
              borderRadius: "16px",
              padding: "45px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "38px",
                marginBottom: "10px",
              }}
            >
              🔎
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "20px",
              }}
            >
              No listings found
            </h2>

            <p
              style={{
                margin: "0 auto 18px",
                maxWidth: "480px",
                color: "#71807b",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              Try another search or category. You can also
              be the first person to post what you are
              looking for.
            </p>

            <Link
              href="/create-listing"
              style={{
                display: "inline-block",
                background: "#2dbd62",
                color: "#fff",
                textDecoration: "none",
                padding: "11px 18px",
                borderRadius: "9px",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              Create a Listing
            </Link>
          </div>
        )}

        {/* LISTINGS */}
        {listings.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "14px",
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

              return (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  style={{
                    background: "#fff",
                    border: "1px solid #e1e7e1",
                    borderRadius: "14px",
                    padding: "17px",
                    textDecoration: "none",
                    color: "#12302b",
                    boxShadow:
                      "0 3px 12px rgba(0,0,0,.05)",
                    display: "block",
                  }}
                >
                  {/* TYPE + CATEGORY */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        background: "#eaf7ed",
                        color: "#16863d",
                        borderRadius: "20px",
                        padding: "5px 9px",
                        fontSize: "10px",
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      {listing.type}
                    </span>

                    {categoryName && (
                      <span
                        style={{
                          color: "#77817d",
                          fontSize: "10px",
                        }}
                      >
                        {categoryName}
                      </span>
                    )}
                  </div>

                  {/* TITLE */}
                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: "17px",
                      lineHeight: 1.3,
                    }}
                  >
                    {listing.title}
                  </h3>

                  {/* DESCRIPTION */}
                  {listing.description && (
                    <p
                      style={{
                        margin: "0 0 13px",
                        color: "#6d7975",
                        fontSize: "12px",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {listing.description}
                    </p>
                  )}

                  {/* PRICE / BUDGET */}
                  {budget && (
                    <div
                      style={{
                        color: "#08783e",
                        fontSize: "16px",
                        fontWeight: 800,
                        marginBottom: "10px",
                      }}
                    >
                      {budget}
                    </div>
                  )}

                  {/* DETAILS */}
                  <div
                    style={{
                      display: "grid",
                      gap: "6px",
                      color: "#6f7a76",
                      fontSize: "11px",
                    }}
                  >
                    {listing.quantity !== null && (
                      <span>
                        📦 {listing.quantity}{" "}
                        {listing.unit ?? ""}
                      </span>
                    )}

                    {(listing.city || listing.state) && (
                      <span>
                        📍{" "}
                        {[listing.city, listing.state]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                  </div>

                  {/* VIEW */}
                  <div
                    style={{
                      marginTop: "15px",
                      paddingTop: "11px",
                      borderTop: "1px solid #edf0ed",
                      color: "#16863d",
                      fontSize: "11px",
                      fontWeight: 800,
                    }}
                  >
                    View Listing →
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: "#002e2a",
          color: "#d5e0dc",
          padding: "25px 18px",
          textAlign: "center",
          fontSize: "11px",
        }}
      >
        <p style={{ margin: 0 }}>
          © 2026 NagaSphere. All rights reserved.
        </p>

        <p
          style={{
            margin: "7px 0 0",
            color: "#aebfba",
          }}
        >
          Buy · Sell · Support Local
        </p>
      </footer>
    </main>
  );
}
