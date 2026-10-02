"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

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

type DatabasePost = {
  id: string;
  title: string;
  description: string | null;
  quantity: number | string | null;
  unit: string | null;
  budget_min: number | string | null;
  budget_max: number | string | null;
  city: string | null;
  state: string | null;
  category_id: string | null;
};

type DatabaseCategory = {
  id: string;
  name: string;
};

type Listing = {
  id: string;
  name: string;
  location: string;
  price: string;
  category: Category;
  subcategory: string;
};

const supabase = createClient();

function mapCategory(categoryName: string | null): Category {
  const name = (categoryName ?? "").toLowerCase();

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

function formatPrice(
  budgetMin: number | string | null,
  budgetMax: number | string | null,
  unit: string | null
) {
  if (budgetMin == null && budgetMax == null) {
    return "Price on request";
  }

  const min = budgetMin == null ? null : Number(budgetMin);
  const max = budgetMax == null ? null : Number(budgetMax);

  if (min == null || Number.isNaN(min)) {
    return "Price on request";
  }

  let price = "";

  if (max != null && !Number.isNaN(max) && max !== min) {
    price = `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString(
      "en-IN"
    )}`;
  } else {
    price = `₹${min.toLocaleString("en-IN")}`;
  }

  return unit ? `${price} / ${unit}` : price;
}

export default function Home() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [selectedSubcategory, setSelectedSubcategory] =
    useState<string | null>(null);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [listingError, setListingError] = useState("");

  useEffect(() => {
    async function loadListings() {
      setLoadingListings(true);
      setListingError("");

      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select(
          "id,title,description,quantity,unit,budget_min,budget_max,city,state,category_id"
        )
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error(postsError);
        setListingError("Unable to load listings right now.");
        setLoadingListings(false);
        return;
      }

      const databasePosts = (posts ?? []) as DatabasePost[];

      const categoryIds = [
        ...new Set(
          databasePosts
            .map((post) => post.category_id)
            .filter((id): id is string => Boolean(id))
        ),
      ];

      let databaseCategories: DatabaseCategory[] = [];

      if (categoryIds.length > 0) {
        const { data: categoriesData, error: categoriesError } =
          await supabase
            .from("categories")
            .select("id,name")
            .in("id", categoryIds);

        if (categoriesError) {
          console.error(categoriesError);
        } else {
          databaseCategories = (categoriesData ?? []) as DatabaseCategory[];
        }
      }

      const categoryMap = new Map(
        databaseCategories.map((category) => [category.id, category.name])
      );

      const liveListings: Listing[] = databasePosts.map((post) => {
        const categoryName = post.category_id
          ? categoryMap.get(post.category_id) ?? null
          : null;

        const category = mapCategory(categoryName);

        return {
          id: post.id,
          name: post.title,
          location:
            post.city && post.state
              ? `${post.city}, ${post.state}`
              : post.city || post.state || "Nagaland",
          price: formatPrice(
            post.budget_min,
            post.budget_max,
            post.unit
          ),
          category,
          subcategory: categoryName ?? "Other Local Offers",
        };
      });

      setListings(liveListings);
      setLoadingListings(false);
    }

    loadListings();
  }, []);

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
            Find products, services and local businesses around Nagaland —
            or tell people what you have to offer.
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
            Connect buyers and sellers without the noise of a generic
            social feed.
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
            {loadingListings ? (
              <p style={{ color: "#697067" }}>
                Loading local listings...
              </p>
            ) : listingError ? (
              <p style={{ color: "#b42318" }}>{listingError}</p>
            ) : visibleListings.length > 0 ? (
              visibleListings.map((listing) => (
                <article className="listing" key={listing.id}>
                  <div className="photo">
                    {listing.name.charAt(0).toUpperCase()}
                  </div>

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
            Create a listing, receive enquiries and grow your local
            business.
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
