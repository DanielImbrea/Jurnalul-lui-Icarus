"use client";

import { useEffect, useState } from "react";
import { fetchAdminJson } from "@/lib/admin-fetch";

type PaymentMethod = "card" | "cod";
type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

interface Order {
  id: string;
  email: string;
  customerName: string | null;
  phone: string | null;
  productTitle: string;
  formattedAddress: string | null;
  amountTotal: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  stripeSessionId: string | null;
  createdAt: string;
}

type Filter =
  | "ALL"
  | "CARD"
  | "COD"
  | "COD_PENDING";

const filters: { id: Filter; label: string }[] = [
  { id: "ALL", label: "Toate" },
  { id: "CARD", label: "Card (Stripe)" },
  { id: "COD", label: "Ramburs" },
  { id: "COD_PENDING", label: "De expediat" }
];

function paymentLabel(method: PaymentMethod) {
  return method === "card" ? "Card" : "Ramburs";
}

function statusLabel(status: OrderStatus, method: PaymentMethod) {
  if (method === "cod" && status === "PENDING") return "De expediat";
  if (status === "COMPLETED") return method === "card" ? "Plătită" : "Finalizată";
  if (status === "CANCELLED") return "Anulată";
  return status;
}

function stripeSessionUrl(sessionId: string) {
  return `https://dashboard.stripe.com/checkout/sessions/${sessionId}`;
}

export default function AdminOrdersPanel() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();

    if (filter === "CARD") params.set("paymentMethod", "card");
    if (filter === "COD") params.set("paymentMethod", "cod");
    if (filter === "COD_PENDING") {
      params.set("paymentMethod", "cod");
      params.set("status", "PENDING");
    }

    const query = params.toString();
    const { data, error: fetchError } = await fetchAdminJson<Order[]>(
      `/api/admin/orders${query ? `?${query}` : ""}`
    );

    setOrders(Array.isArray(data) ? data : []);
    setError(fetchError);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function updateStatus(id: string, status: OrderStatus) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    await load();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`px-3 py-1.5 font-sans text-[12px] ${
              filter === item.id
                ? "bg-bone/10 text-bone"
                : "text-ash hover:text-bone"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 font-sans text-sm text-ash">Se încarcă...</p>
      ) : error ? (
        <p className="mt-10 font-sans text-sm text-wine-light">{error}</p>
      ) : orders.length === 0 ? (
        <p className="mt-10 font-sans text-sm text-ash">Nicio comandă.</p>
      ) : (
        <div className="mt-8 space-y-5">
          {orders.map((order) => {
            const address = order.formattedAddress;
            const products = order.productTitle;

            return (
              <article
                key={order.id}
                className="border border-bone/10 bg-charcoal/30 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-serif text-xl text-bone">
                        {order.customerName || order.email}
                      </p>
                      <span className="rounded-full border border-bone/15 bg-ink/40 px-2 py-0.5 font-sans text-[10px] uppercase tracking-wide text-mist">
                        {paymentLabel(order.paymentMethod)}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 font-sans text-[10px] uppercase tracking-wide ${
                          order.status === "PENDING"
                            ? "border-ember/30 bg-ember/10 text-ember"
                            : order.status === "CANCELLED"
                              ? "border-bone/10 bg-bone/5 text-ash"
                              : "border-bone/15 bg-bone/5 text-mist"
                        }`}
                      >
                        {statusLabel(order.status, order.paymentMethod)}
                      </span>
                    </div>

                    <p className="mt-2 font-sans text-[13px] text-bone">
                      {products}
                    </p>

                    <p className="mt-3 font-sans text-[12px] leading-relaxed text-ash">
                      <span className="text-mist">{order.email}</span>
                      {order.phone ? ` · ${order.phone}` : ""}
                    </p>

                    <p className="mt-2 font-sans text-[12px] leading-relaxed text-ash">
                      <span className="text-[11px] uppercase tracking-wide text-ash">
                        Data comenzii:{" "}
                      </span>
                      <span className="text-mist">
                        {new Date(order.createdAt).toLocaleString("ro-RO", {
                          dateStyle: "short",
                          timeStyle: "medium"
                        })}
                      </span>
                      {" · "}
                      <span className="text-[11px] uppercase tracking-wide text-ash">
                        Sumă:{" "}
                      </span>
                      <span className="text-bone">
                        {(order.amountTotal / 100).toFixed(0)} {order.currency.toUpperCase()}
                      </span>
                      {order.paymentMethod === "cod" ? " (ramburs)" : ""}
                    </p>

                    {address ? (
                      <p className="mt-3 max-w-xl font-sans text-[13px] leading-relaxed text-mist">
                        <span className="text-[11px] uppercase tracking-wide text-ash">
                          Livrare:{" "}
                        </span>
                        {address}
                      </p>
                    ) : (
                      <p className="mt-3 font-sans text-[12px] italic text-ash/70">
                        Adresa nu e salvată (comandă veche Stripe). Vezi în
                        Stripe Dashboard.
                      </p>
                    )}

                    <p
                      className="mt-2 font-sans text-[11px] text-ash/60"
                      title="Identificator intern din baza de date — folosit de site pentru a urmări comanda."
                    >
                      ID comandă: {order.id}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {order.stripeSessionId && (
                      <a
                        href={stripeSessionUrl(order.stripeSessionId)}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-bone hover:border-ember hover:text-ember"
                      >
                        Deschide în Stripe →
                      </a>
                    )}

                    {order.paymentMethod === "cod" && order.status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateStatus(order.id, "COMPLETED")}
                          className="border border-bone/20 px-3 py-1 font-sans text-[11px] text-bone hover:border-ember"
                        >
                          Marchează finalizată
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(order.id, "CANCELLED")}
                          className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash hover:text-ember"
                        >
                          Anulează
                        </button>
                      </>
                    )}

                    {order.paymentMethod === "cod" && order.status !== "PENDING" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(order.id, "PENDING")}
                        className="border border-bone/10 px-3 py-1 font-sans text-[11px] text-ash hover:text-bone"
                      >
                        Revino la de expediat
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
