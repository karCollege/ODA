import { Transaction } from "@/data/Transaction";
import customerService from "@/services/CustomerService";
import stripe from "@/services/Stripe";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  const username = req.query.username;

  const uid = (
    await supabase
      .from("profile")
      .select("uid")
      .eq("userName", username)
      .single()
  ).data?.uid as string;

  if (
    req.query.pin !=
    (await supabase.from("customer").select("pin").eq("cid", uid).single()).data
      ?.pin
  ) {
    return res.status(400).json({ error: "wrong pin" });
  }

  
  const amount = Number(req.query.amount);
  const balance = await customerService.getBalanceOfCustomer(supabase, uid);
  console.log(amount, balance);

  if (balance < amount) {
    return res.status(400).json({ error: "low balance" });
  }

  const desId = (await supabase.auth.getUser()).data.user?.id;

  if (!desId) return res.status(400).json({ error: "wrong destination" });

  await supabase.from("transaction").insert({
    fromId: uid,
    toId: desId,
    amount: ~~amount,
    status: "success",
  } as Transaction);  

  return res.status(200).send("");
}
