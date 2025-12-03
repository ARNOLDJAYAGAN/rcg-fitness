import { NextResponse } from "next/server";
import Stripe from "stripe";
import { pool } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});


export async function POST(req: Request) {
  try {
    const { user_id, plan } = await req.json();

    // Define plan prices (in cents)
    const priceLookup: Record<string, number> = {
      Basic: 999,      // $9.99
      Premium: 1999,   // $19.99
    };

    if (!priceLookup[plan]) throw new Error("Invalid plan");

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: plan + " Plan" },
            unit_amount: priceLookup[plan],
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    // Optionally: insert a "pending" subscription in your DB
    await pool.query(
      "INSERT INTO subscriptions (user_id, plan, price) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET plan = EXCLUDED.plan, price = EXCLUDED.price",
      [user_id, plan, priceLookup[plan] / 100]
    );

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
