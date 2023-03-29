import TitleBar from "@/components/TitleBar";
import { Merchant } from "@/data/Merchant";
import { Transaction } from "@/data/Transaction";
import { User } from "@/data/User";
import authService from "@/services/AuthService";
import merchantService from "@/services/MerchantService";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home({
  merchant,
  merchantProfile,
  isOnboarded,
}: {
  merchant: Merchant;
  merchantProfile: User;
  isOnboarded: boolean;
}) {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const getOnboardingLink = async () => {
    const response = await axios.get("/api/get_onboarding_link");
    if (response.status == 200) {
      router.push(response.data.url);
    }
  };

  const collectPayment = () => {
    if (!isOnboarded) {
      getOnboardingLink();
      return;
    }

    router.push("/collect_cid");
  };

  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [balance, setBalance] = useState(0);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    merchantService
      .getBalance(transactions, merchantProfile.uid)
      .then(setBalance);
  }, [transactions]);

  useEffect(() => {
    merchantService.getAllTransactions(supabase).then(setTransactions);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <TitleBar title={`# ${merchantProfile.userName}'s business wallet`} />

      {!isOnboarded && (
        <div className="mx-5 p-5 border-2 rounded-md border-gray-200 flex flex-wrap text-center items-center justify-center gap-2">
          <p className="text-base text-red-500">
            You are not completed the onboarding proccess yet, In order to
            receive payments you need to complete the onboarding.
          </p>
          <button
            className="bg-red-100 px-3 py-1 rounded-md"
            onClick={getOnboardingLink}
          >
            start onboarding
          </button>
        </div>
      )}

      <p className="text-2xl font-bold px-5"># Balance</p>

      <div className="mx-5 p-5 border-2 rounded-md border-gray-200 flex justify-between">
        <p className="text-xl">&#8377; {balance}</p>
        <button
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
          onClick={collectPayment}
        >
          Collect payment
        </button>
      </div>

      <p className="text-2xl font-bold px-5"># Payments</p>
      <div className="overflow-auto px-5">
        <table className="w-full text-left">
          <tr className="border-2 border-gray-200">
            <th className="border-2 border-gray-200 p-3">From</th>
            <th className="border-2 border-gray-200 p-3">Amount</th>
            <th className="border-2 border-gray-200 p-3">Tid</th>
          </tr>
          {transactions.map((tr, i) => {
            return (
              <tr className={i % 2 == 0 ? "bg-gray-100" : ""}>
                <td className="border-2 border-gray-200 p-3">
                  <GetName toId={tr.fromId ?? ""} uid={merchantProfile.uid} />
                </td>
                <td
                  className={
                    "border-2 border-gray-200 p-3 " +
                    (tr.toId == merchantProfile.uid
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

  return <> {toId == uid ? "(moved to your account)" : name}</>;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const session = (await supabase.auth.getSession()).data.session;

  const currentMerchant = await merchantService.getMerchantFromDB(supabase);
  const profile = await authService.getProfile(supabase);

  if (!session || !currentMerchant || !profile) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      merchant: currentMerchant,
      merchantProfile: profile,
      isOnboarded: await merchantService.isOnboardCompleted(currentMerchant),
    },
  };
};
