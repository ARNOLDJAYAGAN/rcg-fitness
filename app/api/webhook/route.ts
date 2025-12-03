import { NextResponse } from "next/server";
import Stripe from "stripe";
import { pool } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-11-17.clover" });

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!; // from Stripe Dashboard

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id; // optional, if you pass metadata

      if (userId) {
        await pool.query(
          "UPDATE subscriptions SET active = TRUE WHERE user_id = $1",
          [userId]
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }
}
