"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth");
        return;
      }

      setEmail(user.email ?? "");
      setLoading(false);
    }

    loadUser();
  }, [router, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  const cards = [
    {
      title: "My Listings",
      description: "Manage the products and services you offer.",
      path: "/my-listings",
    },
    {
      title: "My Requests",
      description: "Manage the products and services you are looking for.",
      path: "/my-requests",
    },
    {
      title: "Messages",
      description: "View and reply to buyers and sellers.",
      path: "/messages",
    },
    {
      title: "Profile",
      description: "Complete and manage your NagaSphere profile.",
      path: "/profile",
    },
  ];

  const pageStyle = {
    backgroundImage: "url('/messages-scenic-bg.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center calc(-100vw)",
    backgroundSize: "100% auto",
    backgroundAttachment: "scroll",
  };

  if (loading) {
    return (
      <main
        className="min-h-screen bg-[#082623]"
        style={pageStyle}
      >
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-white/80">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#082623]"
      style={pageStyle}
    >
      <div className="min-h-screen w-full px-5 py-7 sm:px-9 sm:py-9 lg:px-[47px] lg:py-[46px]">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex shrink-0 items-center gap-[6px]"
            aria-label="Go to NagaSphere home"
          >
            <img
              src="/nagasphere-logo.png"
              alt=""
              className="h-8 w-8 object-contain"
            />

            <span className="flex flex-col">
              <b className="text-[15px] leading-none text-white">
                NagaSphere
              </b>

              <small className="mt-[2px] text-[5.5px] uppercase tracking-[1px] text-white/85">
                Local Needs · Global Reach
              </small>
            </span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-[#80c996]/70 bg-[#082623]/55 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-[#082623]/80"
          >
            Sign out
          </button>
        </header>

        <section className="mt-10 sm:mt-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#a8e69b] text-[#a8e69b]">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-6 4v-4.5a2.5 2.5 0 0 1 0-1.5v-8.5Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M8 8h8M8 11h5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h1 className="text-[40px] font-bold leading-none tracking-tight text-white sm:text-[44px]">
              Welcome to NagaSphere
            </h1>
          </div>

          <p className="ml-14 mt-3 text-base text-white/80">
            {email}
          </p>

          <div className="mt-7 min-h-[915px] w-[746px] max-w-full rounded-2xl border border-[#dfe8e5] bg-[#f8fbfa] p-7 shadow-2xl sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {cards.map((card) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => router.push(card.path)}
                  className="min-h-[190px] rounded-2xl border border-[#dce6e2] bg-white p-6 text-left shadow-sm transition hover:bg-[#fbfdfc] hover:shadow-md"
                >
                  <h2 className="text-xl font-bold text-gray-900">
                    {card.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {card.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="min-h-[500px] bg-[#f8fbfa]" />
          </div>
        </section>
      </div>
    </main>
  );
}
