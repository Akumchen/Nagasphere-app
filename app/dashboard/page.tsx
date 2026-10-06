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
      icon: "◇",
    },
    {
      title: "My Requests",
      description: "Manage the products and services you are looking for.",
      path: "/my-requests",
      icon: "⌁",
    },
    {
      title: "Messages",
      description: "View and reply to buyers and sellers.",
      path: "/messages",
      icon: "◌",
    },
    {
      title: "Profile",
      description: "Complete and manage your NagaSphere profile.",
      path: "/profile",
      icon: "○",
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
            className="text-sm font-semibold text-white/90 transition hover:text-white"
          >
            Sign out
          </button>
        </header>

        <section className="mt-10 sm:mt-12">

          <h1 className="text-[40px] font-bold leading-none tracking-tight text-white sm:text-[44px]">
            Welcome to NagaSphere
          </h1>

          <p className="mt-3 text-base text-white/80">
            {email}
          </p>

          <div className="mt-7 min-h-[915px] w-[746px] max-w-full rounded-2xl border border-[#dfe8e5] bg-[#f8fbfa]/95 p-7 shadow-2xl backdrop-blur-[2px] sm:p-8">

            <div className="mb-7">
              <h2 className="text-2xl font-bold tracking-tight text-[#143b34]">
                Your NagaSphere
              </h2>

              <p className="mt-1 text-sm text-[#60736e]">
                Everything you need to manage your marketplace activity.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {cards.map((card) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={() => router.push(card.path)}
                  className="group relative min-h-[190px] overflow-hidden rounded-2xl border border-[#b8d8c4] bg-[#e8f3eb] p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-[#deeee3] hover:shadow-xl"
                >

                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#d4e9da] transition duration-300 group-hover:scale-125" />

                  <div className="relative">

                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#8fc5a0] bg-[#f0f8f2] text-xl text-[#27634f]">
                      {card.icon}
                    </div>

                    <h3 className="text-xl font-bold text-[#173d35]">
                      {card.title}
                    </h3>

                    <p className="mt-3 max-w-[260px] text-sm leading-6 text-[#687a75]">
                      {card.description}
                    </p>

                    <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-[1.2px] text-[#39755e]">
                      Open →
                    </span>

                  </div>
                </button>
              ))}

            </div>

            <div className="mt-10 rounded-2xl border border-[#c8ded0] bg-[#e1f0e5] px-6 py-5">
              <p className="text-sm font-semibold text-[#285b4b]">
                NagaSphere Marketplace
              </p>

              <p className="mt-1 text-sm leading-6 text-[#657873]">
                Connect with people across Nagaland, discover local products
                and services, and manage your marketplace activity in one place.
              </p>
            </div>

            <div className="min-h-[270px]" />

          </div>
        </section>
      </div>
    </main>
  );
}
