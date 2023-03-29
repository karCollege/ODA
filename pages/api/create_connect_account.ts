import stripe from "@/services/Stripe";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({
    req,
    res,
  });

  const account = await stripe.accounts.create({ type: "standard" });

  await supabase.from("merchant").insert({
    mid: (await supabase.auth.getUser()).data.user?.id,
    stripeId: account.id,
  });
}
