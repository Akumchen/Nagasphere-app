"use client";

import Image from "next/image";

const categories = [
  { name: "Farm & Fresh", icon: "🌱" },
  { name: "Food & Grocery", icon: "🛒" },
  { name: "Fashion", icon: "👕" },
  { name: "Home & Living", icon: "🏠" },
  { name: "Services", icon: "🛠️" },
  { name: "Local Businesses", icon: "🏪" },
];

export default function HomePage() {
  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        minHeight: "100vh",
        background: "#f7f5ee",
        color: "#19352d",
        fontFamily: "Arial, Helvetica, sans-serif",
        overflowX: "hidden",
      }}
    >
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .nav {
          background: #fff;
          border-bottom: 1px solid #e8e5dc;
        }

        .navInner {
          width: min(1120px, calc(100% - 32px));
          min-height: 70px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #17382f;
          text-decoration: none;
          font-weight: 800;
          font-size: 20px;
        }

        .brand img {
          width: 46px;
          height: 46px;
          object-fit: contain;
        }

        .navLinks {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .navLinks a {
          text-decoration: none;
          color: #31574b;
          font-size: 14px;
          font-weight: 600;
        }

        .login {
          background: #1e5948 !important;
          color: white !important;
          padding: 10px 17px;
          border-radius: 22px;
        }

        .hero {
          background: linear-gradient(135deg, #edf5ed, #f8f4e8);
        }

        .heroInner {
          width: min(1120px, calc(100% - 32px));
          margin: auto;
          min-height: 540px;
          padding: 65px 0;
          display: grid;
          grid-template-columns: 1fr 0.85fr;
          gap: 45px;
          align-items: center;
        }

        .welcome {
          color: #b87832;
          font-weight: 800;
          letter-spacing: 2px;
          font-size: 13px;
          margin-bottom: 12px;
        }

        h1 {
          margin: 0;
          font-size: clamp(50px, 7vw, 78px);
          line-height: 0.98;
          letter-spacing: -3px;
        }

        h1 span {
          color: #c38335;
        }

        .tagline {
          margin-top: 20px;
          font-size: 21px;
          font-weight: 700;
          color: #31574b;
        }

        .description {
          max-width: 580px;
          color: #64766f;
          line-height: 1.7;
          font-size: 15px;
        }

        .search {
          display: flex;
          max-width: 580px;
          margin-top: 25px;
          background: white;
          border: 1px solid #e0ddd2;
          border-radius: 14px;
          padding: 6px;
          box-shadow: 0 12px 35px rgba(31, 63, 51, 0.08);
        }

        .search input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          padding: 12px;
          font-size: 14px;
        }

        .search button {
          border: 0;
          border-radius: 10px;
          padding: 0 20px;
          background: #1e5948;
          color: white;
          font-weight: 700;
        }

        .heroCards {
          display: grid;
          gap: 15px;
        }

        .heroCard {
          background: rgba(255,255,255,.85);
          border: 1px solid #e3e5d9;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 15px 40px rgba(39,69,58,.07);
        }

        .heroCard h3 {
          margin: 0 0 7px;
          color: #1e5948;
          font-size: 19px;
        }

        .heroCard p {
          margin: 0;
          color: #718078;
          line-height: 1.6;
          font-size: 14px;
        }

        .section {
          width: min(1120px, calc(100% - 32px));
          margin: auto;
          padding: 65px 0;
        }

        .section h2 {
          margin: 0 0 8px;
          font-size: 32px;
          color: #19352d;
        }

        .sectionIntro {
          margin: 0 0 25px;
          color: #718078;
          font-size: 14px;
        }

        .categories {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 13px;
        }

        .category {
          background: white;
          border: 1px solid #e6e3da;
          border-radius: 17px;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 700;
          color: #31574b;
          padding: 12px;
        }

        .icon {
          font-size: 29px;
        }

        .benefits {
          background: #e9f1e9;
        }

        .benefitGrid {
          width: min(1120px, calc(100% - 32px));
          margin: auto;
          padding-bottom: 65px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .benefit {
          background: rgba(255,255,255,.7);
          border-radius: 20px;
          padding: 27px;
        }

        .benefit strong {
          display: block;
          color: #1e5948;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .benefit p {
          margin: 0;
          color: #687970;
          line-height: 1.6;
          font-size: 14px;
        }

        .cta {
          width: min(1120px, calc(100% - 32px));
          margin: 0 auto 65px;
          padding: 50px 25px;
          background: #1e5948;
          border-radius: 25px;
          text-align: center;
          color: white;
        }

        .cta h2 {
          margin: 0 0 12px;
          font-size: 34px;
        }

        .cta p {
          max-width: 600px;
          margin: 0 auto 24px;
          color: #dbe9e1;
          line-height: 1.7;
        }

        .cta a {
          display: inline-block;
          padding: 12px 23px;
          border-radius: 24px;
          background: #d89a50;
          color: white;
          text-decoration: none;
          font-weight: 800;
        }

        footer {
          padding: 32px 20px;
          background: #163d32;
          color: #c8d8d1;
          text-align: center;
          font-size: 13px;
        }

        @media (max-width: 760px) {
          .navInner {
            min-height: 62px;
          }

          .brand {
            font-size: 17px;
          }

          .brand img {
            width: 39px;
            height: 39px;
          }

          .navLinks a:not(.login) {
            display: none;
          }

          .heroInner {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 45px 0 48px;
            gap: 30px;
          }

          h1 {
            font-size: 52px;
            letter-spacing: -2px;
          }

          .tagline {
            font-size: 18px;
          }

          .description {
            font-size: 14px;
          }

          .search {
            height: 51px;
          }

          .search input {
            font-size: 13px;
          }

          .search button {
            padding: 0 15px;
            font-size: 12px;
          }

          .section {
            padding: 45px 0;
          }

          .section h2 {
            font-size: 27px;
          }

          .categories {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .category {
            min-height: 105px;
          }

          .benefitGrid {
            grid-template-columns: 1fr;
            padding-bottom: 45px;
            gap: 12px;
          }

          .benefit {
            padding: 22px;
          }

          .cta {
            margin-bottom: 45px;
            padding: 38px 20px;
          }

          .cta h2 {
            font-size: 28px;
          }
        }
      `}</style>

      <nav className="nav">
        <div className="navInner">
          <a href="/" className="brand">
            <Image
              src="/nagasphere-logo.png"
              alt="NagaSphere"
              width={46}
              height={46}
            />
            <span>NagaSphere</span>
          </a>

          <div className="navLinks">
            <a href="/my-listings">My Listings</a>
            <a href="/messages">Messages</a>
            <a href="/login" className="login">
              Login
            </a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="heroInner">
          <div>
            <div className="welcome">WELCOME TO</div>

            <h1>
              Naga<span>Sphere</span>
            </h1>

            <div className="tagline">
              Buy • Sell • Support Local
            </div>

            <p className="description">
              A local marketplace connecting the people, products and
              businesses of Nagaland. Discover what is around you, support
              local sellers and grow together.
            </p>

            <div className="search">
              <input
                type="text"
                placeholder="What are you looking for?"
              />
              <button>Search</button>
            </div>
          </div>

          <div className="heroCards">
            <div className="heroCard">
              <h3>Local Products</h3>
              <p>
                Discover products made, grown and sold by people in Nagaland.
              </p>
            </div>

            <div className="heroCard">
              <h3>Local People</h3>
              <p>
                Connect directly with sellers, businesses and service
                providers.
              </p>
            </div>

            <div className="heroCard">
              <h3>Stronger Together</h3>
              <p>
                Every local purchase helps strengthen our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Explore Categories</h2>
        <p className="sectionIntro">
          Find what you need from local sellers.
        </p>

        <div className="categories">
          {categories.map((category) => (
            <div className="category" key={category.name}>
              <div className="icon">{category.icon}</div>
              <div>{category.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="benefits">
        <div className="section" style={{ paddingBottom: 25 }}>
          <h2>Why NagaSphere?</h2>
          <p className="sectionIntro">
            Built around our local community.
          </p>
        </div>

        <div className="benefitGrid">
          <div className="benefit">
            <strong>Support Local</strong>
            <p>
              Keep more value within Nagaland by buying from local people and
              businesses.
            </p>
          </div>

          <div className="benefit">
            <strong>Simple & Convenient</strong>
            <p>
              Find products and services in one place without unnecessary
              complexity.
            </p>
          </div>

          <div className="benefit">
            <strong>Grow Together</strong>
            <p>
              Give local entrepreneurs, farmers and sellers more opportunities
              to reach customers.
            </p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Support Local. Grow Together.</h2>
        <p>
          Join NagaSphere and become part of a marketplace built for the
          people and businesses of Nagaland.
        </p>
        <a href="/create-listing">Start Selling</a>
      </section>

      <footer>
        © {new Date().getFullYear()} NagaSphere · Buy • Sell • Support Local
      </footer>
    </main>
  );
}
