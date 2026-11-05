"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

type Order = {
  id: string;
  buyer_id: string;
  seller_id: string;
  subtotal: number | string;
  platform_fee: number | string;
  tax: number | string;
  delivery_fee: number | string;
  total: number | string;
  status: string;
  created_at: string;
};

type Payment = {
  order_id: string;
  status: string;
  provider: string | null;
  paid_at: string | null;
};

type Delivery = {
  order_id: string;
  status: string;
  provider: string | null;
  tracking_reference: string | null;
};

const supabase = createClient();

const money = (value: number | string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value));

const dateLabel = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const pretty = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function OrdersPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Record<string, Payment>>({});
  const [deliveries, setDeliveries] = useState<Record<string, Delivery>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      router.replace("/auth");
      return;
    }

    setUserId(user.id);

    const { data, error: orderError } = await supabase
      .from("orders")
      .select(
        "id, buyer_id, seller_id, subtotal, platform_fee, tax, delivery_fee, total, status, created_at"
      )
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (orderError) {
      setError("Your orders could not be loaded. " + orderError.message);
      setOrders([]);
      setLoading(false);
      return;
    }

    const loadedOrders = (data ?? []) as Order[];
    setOrders(loadedOrders);

    const ids = loadedOrders.map((order) => order.id);

    if (ids.length === 0) {
      setPayments({});
      setDeliveries({});
      setLoading(false);
      return;
    }

    const [paymentResult, deliveryResult] = await Promise.all([
      supabase
        .from("payments")
        .select("order_id, status, provider, paid_at")
        .in("order_id", ids),

      supabase
        .from("delivery_jobs")
        .select("order_id, status, provider, tracking_reference")
        .in("order_id", ids),
    ]);

    const paymentMap: Record<string, Payment> = {};
    (paymentResult.data ?? []).forEach((item) => {
      paymentMap[item.order_id] = item as Payment;
    });

    const deliveryMap: Record<string, Delivery> = {};
    (deliveryResult.data ?? []).forEach((item) => {
      deliveryMap[item.order_id] = item as Delivery;
    });

    setPayments(paymentMap);
    setDeliveries(deliveryMap);

    if (paymentResult.error || deliveryResult.error) {
      setError(
        "Order information loaded, but some payment or delivery details are not available yet."
      );
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "clamp(16px, 4vw, 34px) 14px 42px",
    color: "#173c2a",
  };

  const shellStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 850,
    margin: "0 auto",
  };

  const cardStyle: React.CSSProperties = {
    padding: "18px",
    borderRadius: 17,
    border: "1px solid rgba(255,255,255,0.8)",
    background:
      "linear-gradient(145deg, rgba(252,250,241,0.97), rgba(233,239,222,0.94))",
    boxShadow: "0 13px 34px rgba(3,20,12,0.18)",
    marginBottom: 14,
  };

  const labelStyle: React.CSSProperties = {
    color: "#687568",
    fontSize: 12,
  };

  if (loading) {
    return (
      <main
        className="nagasphere-inner-page"
        style={{ ...pageStyle, display: "grid", placeItems: "center" }}
      >
        <p style={{ color: "#fffdf5", fontWeight: 700 }}>
          Loading your orders...
        </p>
      </main>
    );
  }

  return (
    <main className="nagasphere-inner-page" style={pageStyle}>
      <div style={shellStyle}>
        <header
          style={{
            ...cardStyle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <img
            src="/nagasphere-logo.png"
            alt="NagaSphere"
            style={{ width: 145, maxWidth: "55%", height: "auto" }}
          />

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            style={secondaryButton}
          >
            Back to dashboard
          </button>
        </header>

        <section
          style={{
            ...cardStyle,
            background:
              "linear-gradient(125deg, #102b1e, #173d2a 60%, #0a2118)",
            color: "#fffdf5",
            padding: "27px 22px",
          }}
        >
          <p
            style={{
              color: "#e3c989",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 2,
              margin: "0 0 9px",
            }}
          >
            YOUR TRANSACTIONS
          </p>
          <h1 style={{ margin: 0, fontSize: 31 }}>My Orders</h1>
          <p
            style={{
              margin: "10px 0 0",
              color: "rgba(255,253,245,0.8)",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            Follow the orders where you are the buyer or seller.
          </p>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            margin: "20px 2px 14px",
          }}
        >
          <h2 style={{ color: "#fffdf5", fontSize: 21, margin: 0 }}>
            Order history
          </h2>

          <button
            type="button"
            onClick={() => void loadOrders()}
            style={secondaryButton}
          >
            Refresh orders
          </button>
        </div>

        {error && (
          <p
            role="status"
            style={{
              ...cardStyle,
              color: "#7b3d25",
              fontSize: 13,
              overflowWrap: "anywhere",
            }}
          >
            {error}
          </p>
        )}

        {orders.length === 0 ? (
          <section style={cardStyle}>
            <h3 style={{ marginTop: 0 }}>No orders yet</h3>
            <p style={{ color: "#66746a", lineHeight: 1.7, fontSize: 13 }}>
              When an offer is accepted and an order is created, it will
              appear here.
            </p>
            <button
              type="button"
              onClick={() => router.push("/listing")}
              style={primaryButton}
            >
              Explore marketplace
            </button>
          </section>
        ) : (
          orders.map((order) => {
            const isBuyer = order.buyer_id === userId;
            const payment = payments[order.id];
            const delivery = deliveries[order.id];

            return (
              <article key={order.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p style={{ ...labelStyle, margin: "0 0 5px" }}>
                      ORDER REFERENCE
                    </p>
                    <strong style={{ fontSize: 17 }}>
                      {order.id.slice(0, 8).toUpperCase()}
                    </strong>
                  </div>

                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 20,
                      background: "#e8efdf",
                      color: "#285b39",
                      fontSize: 12,
                      fontWeight: 750,
                    }}
                  >
                    {pretty(order.status)}
                  </span>
                </div>

                <p
                  style={{
                    color: "#687568",
                    fontSize: 12,
                    margin: "10px 0 15px",
                  }}
                >
                  {isBuyer ? "You are the buyer" : "You are the seller"}
                  {" · "}
                  {dateLabel(order.created_at)}
                </p>

                <div style={{ display: "grid", gap: 9 }}>
                  <AmountRow label="Agreed amount" value={money(order.subtotal)} />
                  <AmountRow label="Platform fee" value={money(order.platform_fee)} />
                  <AmountRow label="Tax" value={money(order.tax)} />
                  <AmountRow label="Delivery fee" value={money(order.delivery_fee)} />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #cbdcc6",
                      paddingTop: 12,
                      fontSize: 16,
                    }}
                  >
                    <strong>Order total</strong>
                    <strong>{money(order.total)}</strong>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    padding: 13,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.65)",
                    border: "1px solid #e0e3d4",
                  }}
                >
                  <h3 style={{ fontSize: 14, margin: "0 0 9px" }}>
                    Payment
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: "#526456" }}>
                    {payment
                      ? `Status: ${pretty(payment.status)}`
                      : "No payment record yet. Payment has not been collected through NagaSphere."}
                  </p>
                  {payment?.paid_at && (
                    <p style={{ ...labelStyle, marginBottom: 0 }}>
                      Paid: {dateLabel(payment.paid_at)}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    padding: 13,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.65)",
                    border: "1px solid #e0e3d4",
                  }}
                >
                  <h3 style={{ fontSize: 14, margin: "0 0 9px" }}>
                    Delivery
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: "#526456" }}>
                    {delivery
                      ? `Status: ${pretty(delivery.status)}`
                      : "Delivery tracking has not been set up for this order."}
                  </p>
                  {delivery?.tracking_reference && (
                    <p style={{ ...labelStyle, marginBottom: 0 }}>
                      Tracking reference: {delivery.tracking_reference}
                    </p>
                  )}
                  {delivery?.provider && (
                    <p style={{ ...labelStyle, marginBottom: 0 }}>
                      Provider: {delivery.provider}
                    </p>
                  )}
                </div>
              </article>
            );
          })
        )}

        <p
          style={{
            color: "rgba(255,253,245,0.85)",
            fontSize: 12,
            lineHeight: 1.7,
            margin: "18px 3px 0",
          }}
        >
          This page currently displays order information only. Payments and
          delivery updates are not yet processed through NagaSphere.
        </p>
      </div>
    </main>
  );
}

function AmountRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        fontSize: 13,
      }}
    >
      <span style={{ color: "#66746a" }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  border: "none",
  borderRadius: 10,
  padding: "11px 15px",
  background: "#173c2a",
  color: "#fffdf5",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  border: "1px solid #b9c8b8",
  borderRadius: 10,
  padding: "10px 13px",
  background: "#fffdf5",
  color: "#173c2a",
  fontWeight: 650,
  cursor: "pointer",
};
