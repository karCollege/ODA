import merchantService from "@/services/MerchantService";
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

  const merchant = await merchantService.getMerchantFromDB(supabase);
  if (!merchant)
    return res.status(500).json({ error: "merchant is not in DB" });

  const returnUrl = (req.headers["x-forwarded-proto"] ? "https" : "http") + "://" + req.headers.host + "/merchant";

  const url = await merchantService.generateMerchantOnboardLink(
    merchant,
    returnUrl
  );

  res.status(200).json({ url });
}
