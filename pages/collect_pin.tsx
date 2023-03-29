import InputField from "@/components/InputField";
import TitleBar from "@/components/TitleBar";
import customerService from "@/services/CustomerService";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function CollectPin() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const pinRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (router.isReady) {
      if (!("username" in router.query) || !("amount" in router.query)) {
        router.back();
        return;
      }
    }
  }, [router.isReady]);

  const next = async () => {
    const res = await axios.get(
      `/api/transfer_fund?username=${router.query.username}&amount=${router.query.amount}&pin=${pinRef.current?.value}`
    );

    if(res.status == 200) {
      router.replace("/collect_success");
    } else if(res.status == 400) {
      router.replace("/collect_failed");
    }
  };

  return (
    <>
      <TitleBar title="# Enter your PIN" />

      <h1 className="text-2xl font-bold text-center mt-5">
        &#8377; {router.query.amount}
      </h1>

      <form
        className="px-5 py-3 w-full max-w-2xl m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        <div className="mt-3">
          <InputField
            label="# PIN"
            placeholder="xyz"
            type="password"
            refv={pinRef}
          />
        </div>
        <div className="mt-7">
          <input
            type="submit"
            value="Approve"
            className="block w-full rounded-md p-2 hover:bg-blue-600 text-lg bg-blue-500 text-white"
          />
        </div>
      </form>
    </>
  );
}
