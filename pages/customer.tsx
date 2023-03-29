import TitleBar from "@/components/TitleBar";
import { Customer } from "@/data/Customer";
import { Merchant } from "@/data/Merchant";
import { Transaction } from "@/data/Transaction";
import { User } from "@/data/User";
import authService from "@/services/AuthService";
import customerService from "@/services/CustomerService";
import merchantService from "@/services/MerchantService";
import stripe from "@/services/Stripe";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home({
  customerProfile,
  customer,
}: {
  customer: Customer;
  customerProfile: User;
}) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const onAddFund = async () => {
    const amountStr = prompt("Enter the amount");
    if (!amountStr) return;

    const amount = Number(amountStr);

    if (!isNaN(amount)) {
      const response = await axios.get(
        "/api/add_fund_session?amount=" + amount
      );
      if (response.status == 200) {
        router.push(response.data.url);
      }
    }
  };

  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [balance, setBalance] = useState(0);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    customerService
      .getBalance(transactions, customerProfile.uid)
      .then(setBalance);
  }, [transactions]);

  useEffect(() => {
    customerService.getAllTransactions(supabase).then(setTransactions);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <TitleBar title={`# ${customerProfile.userName}'s wallet`} />

      <p className="text-2xl font-bold px-5"># Details</p>

      <div className="mx-5 p-5 border-2 rounded-md border-gray-200 text-lg">
        <p className="">username: {customerProfile.userName}</p>
        <p className="">
          pin: {showPin ? customer.pin : "****"}
          <button
            onClick={() => {
              setShowPin(!showPin);
            }}
            className="ml-5"
          >
            {showPin ? "hide" : "show"}
          </button>
        </p>
      </div>

      <p className="text-2xl font-bold px-5"># Balance</p>

      <div className="mx-5 p-5 border-2 rounded-md border-gray-200 flex justify-between">
        <p className="text-xl">&#8377; {balance}</p>
        <button
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
          onClick={onAddFund}
        >
          Add Fund
        </button>
      </div>

      <p className="text-2xl font-bold px-5"># Payments</p>
      <div className="overflow-auto px-5">
        <table className="w-full text-left">
          <tr className="border-2 border-gray-200">
            <th className="border-2 border-gray-200 p-3">Destination</th>
            <th className="border-2 border-gray-200 p-3">Amount</th>
            <th className="border-2 border-gray-200 p-3">Tid</th>
          </tr>
          {transactions.map((tr, i) => {
            return (
              <tr className={i % 2 == 0 ? "bg-gray-100" : ""}>
                <td className="border-2 border-gray-200 p-3">
                  <GetName toId={tr.toId ?? ""} uid={customerProfile.uid} />
                </td>
                <td
                  className={
                    "border-2 border-gray-200 p-3 " +
                    (tr.toId == customerProfile.uid
                      ? "text-green-500"
                      : "text-red-500")
                  }
                >
                  {tr.amount}
                </td>
                <td className="border-2 border-gray-200 p-3">{tr.tid}</td>
              </tr>
            );
          })}
          {/* <tr className="">
            <td className="border-2 border-gray-200 p-3">MX Efs</td>
            <td className="border-2 border-gray-200 p-3">203</td>
            <td className="border-2 border-gray-200 p-3">
              sfj3yw733gwr3gr3737r3g73r37g3rg
            </td>
          </tr>
          <tr className="bg-gray-100">
            <td className="border-2 border-gray-200 p-3">MX Efs</td>
            <td className="border-2 border-gray-200 p-3">203</td>
            <td className="border-2 border-gray-200 p-3">
              sfj3yw733gwr3gr3737r3g73r37g3rg
            </td>
          </tr> */}
        </table>
      </div>
    </div>
  );
}

function GetName({ uid, toId }: { uid: string; toId: string }) {
  const supabase = useSupabaseClient();

  const [name, setName] = useState(toId);
  authService
    .getProfileOf(supabase, toId)
    .then((u) => setName(u?.userName ?? ""));

  return <> {toId == uid ? "wallet (added fund)" : name}</>;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const profile = await authService.getProfile(supabase);
  const customer = await customerService.getCustomer(supabase);

  if (!profile || profile.role == "merchant") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      customerProfile: profile,
      customer,
    },
  };
};
