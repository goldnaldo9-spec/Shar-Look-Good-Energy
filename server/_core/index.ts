import "dotenv/config";
import express from "express";
import Stripe from "stripe";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

const serviceCatalog = {
  "classic-cut": { name: "Classic Cut", price: 24 },
  "skin-fade": { name: "Skin Fade", price: 29 },
  "beard-sculpt": { name: "Beard Sculpt", price: 16 },
  "cut-and-beard": { name: "Cut + Beard", price: 39 },
} as const;

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const depositAmount = 1000;

function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Stripe must receive the unparsed request bytes for signature verification.
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (req, res) => {
    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(503).json({ received: false, message: "Stripe webhook is not configured." });
    }

    const signature = req.headers["stripe-signature"];
    if (typeof signature !== "string") {
      return res.status(400).send("Missing Stripe signature");
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
      console.error("[Stripe] Webhook signature verification failed:", error instanceof Error ? error.message : error);
      return res.status(400).send("Webhook signature verification failed");
    }

    switch (event.type) {
      case "checkout.session.completed":
      case "payment_intent.succeeded":
      case "payment_intent.payment_failed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        console.log(`[Stripe] Received ${event.type}`);
        break;
      default:
        break;
    }

    return res.json({ received: true });
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });

  app.post("/api/checkout", async (req, res) => {
    const { serviceId, name, email, phone, date, time } = req.body as Record<string, unknown>;
    const service = typeof serviceId === "string" ? serviceCatalog[serviceId as keyof typeof serviceCatalog] : undefined;

    if (!service || typeof name !== "string" || name.trim().length < 2 || !isEmail(email) || typeof phone !== "string" || phone.trim().length < 5 || typeof date !== "string" || typeof time !== "string") {
      return res.status(400).json({ message: "Please complete all booking details before continuing." });
    }

    if (!stripe) {
      return res.status(503).json({
        code: "payment_not_configured",
        message: "Your booking details are ready, but the salon’s payment account is still being connected.",
      });
    }

    try {
      const origin = req.get("origin") || `${req.protocol}://${req.get("host")}`;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        client_reference_id: `trimhaus-${Date.now()}`,
        allow_promotion_codes: true,
        line_items: [{
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: depositAmount,
            product_data: { name: `${service.name} booking deposit` },
          },
        }],
        metadata: {
          service_id: serviceId as string,
          service_name: service.name,
          service_price_eur: String(service.price),
          customer_name: name.trim(),
          customer_email: email,
          customer_phone: phone.trim(),
          booking_date: date,
          booking_time: time,
        },
        success_url: `${origin}/?payment=success`,
        cancel_url: `${origin}/?payment=cancelled`,
      });

      return res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error("[Stripe] Checkout session failed:", error);
      return res.status(500).json({ message: "We could not open secure checkout. Please call the shop instead." });
    }
  });

  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
}

startServer().catch(error => { console.error(error); process.exit(1); });
