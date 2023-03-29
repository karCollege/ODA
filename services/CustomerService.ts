import { Customer } from "@/data/Customer";
import { Transaction } from "@/data/Transaction";
import { SupabaseClient } from "@supabase/supabase-js";
import stripe from "./Stripe";

class CustomerService {
  async getBalanceOfCustomer(supabase: SupabaseClient, cid: string) {
    return this.getBalance(
      await this.getAllTransactionsOfCustomer(supabase, cid),
      cid
    );
  }

  async getBalance(transactions: Transaction[], uid: string) {
    let balance = 0;

    transactions.forEach((tr) => {
      if (tr.fromId == null && tr.toId == uid) {
        balance += tr.amount;
      } else if (tr.fromId == uid) {
        balance -= tr.amount;
      }
    });

    return balance;
  }

  async getAllTransactions(supabase: SupabaseClient) {
    const uid = (await supabase.auth.getUser()).data.user?.id ?? "";
    return await this.getAllTransactionsOfCustomer(supabase, uid);
  }

  async getAllTransactionsOfCustomer(supabase: SupabaseClient, cid: string) {
    const { data } = await supabase
      .from("transaction")
      .select("*")
      .or(`fromId.eq.${cid},toId.eq.${cid}`)
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

    return transactions;
  }

  async getCustomer(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("customer")
      .select("*")
      .eq("cid", (await supabase.auth.getUser()).data.user?.id)
      .single();

    console.log(data, error);

    if (!data) return null;

    return {
      cid: data.cid,
      pin: data.pin,
    } as Customer;
  }

  async checkCustomerExists(supabase: SupabaseClient, username: string) {
    const { data, error } = await supabase
      .from("profile")
      .select("role")
      .eq("userName", username)
      .single();

    if (error) return false;

    if (!data) return false;

    if (data.role != "customer") return false;

    return true;
  }
}

const customerService = new CustomerService();
export default customerService;
