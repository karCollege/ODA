import { Merchant } from "@/data/Merchant";
import { Transaction } from "@/data/Transaction";
import { SupabaseClient } from "@supabase/supabase-js";
import stripe from "./Stripe";

class MerchantService {
  async getMerchantFromDB(supabase: SupabaseClient) {
    const { data } = await supabase
      .from("merchant")
      .select("*")
      .eq("mid", (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (!data) return null;

    return {
      mid: data.mid,
      stripeId: data.stripeId,
    } as Merchant;
  }

  async generateMerchantOnboardLink(merchant: Merchant, returnUrl: string) {
    const accountLink = await stripe.accountLinks.create({
      account: merchant.stripeId,
      refresh_url: returnUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    return accountLink.url;
  }

  async isOnboardCompleted(merchant: Merchant) {
    const cAccount = await stripe.accounts.retrieve({
      stripeAccount: merchant.stripeId,
    });

    return cAccount.charges_enabled;
  }

  async getBalance(transactions: Transaction[], uid: string) {
    let balance = 0;

    transactions.forEach((tr) => {
      if (tr.toId == uid) {
        balance += tr.amount;
      } else if (tr.fromId == uid) {
        balance -= tr.amount;
      }
    });

    return balance;
  }

  async getAllTransactions(supabase: SupabaseClient) {
    const mid = (await supabase.auth.getUser()).data.user?.id;

    const { data } = await supabase
      .from("transaction")
      .select("*")
      .or(`fromId.eq.${mid},toId.eq.${mid}`)
      .eq("status", "success");

    const transactions: Transaction[] = [];

    data?.forEach((d) => {
      const tr: Transaction = {
        tid: d.tid,
        fromId: d.fromId,
        toId: d.toId,
        amount: d.amount,
        status: d.status,
        createdAt: d.created_at,
      };

      transactions.push(tr);
    });

    console.log(transactions)

    return transactions;
  }
}

const merchantService = new MerchantService();
export default merchantService;
