import { Transaction } from "@/data/Transaction";
import stripe from "@/services/Stripe";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  const baseUrl = (req.headers["x-forwarded-proto"] ? "https" : "http") + "://" + req.headers.host;

  const { data, error } = await supabase.from("transaction").insert({
    fromId: null,
    toId: (await supabase.auth.getUser()).data.user?.id ?? null,
    amount: ~~(Number(req.query.amount) - Number(req.query.amount) * 0.04 - 5),
    status: "pending",    
  } as Transaction).select().single();

  console.log("if error: ", error)

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "inr",
          unit_amount: Number(req.query.amount) * 100,
          product_data: {
            name: "topup",
            description: "Adding balance",            
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: baseUrl + "/top_up_succeed?tid=" + data?.tid,
    cancel_url: baseUrl + "/top_up_failed?tid=" + data?.tid,
  });

  res.status(200).json({url:session.url})
}
