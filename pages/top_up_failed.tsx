import InputField from "@/components/InputField";
import TitleBar from "@/components/TitleBar";
import authService from "@/services/AuthService";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function TopUpFailed() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!router.isReady) return;

      await supabase
        .from("transaction")
        .update({ status: "failed" })
        .eq("tid", router.query.tid);

      setTimeout(() => {
        router.replace("/customer");
      }, 2000);
    })();
  }, [router.isReady]);

  return (
    <>
      <TitleBar title="Top up status" />

      <h1 className="text-2xl text-center mt-3 text-red-500">
        Your payment was failed : (
      </h1>
      <p className="text-lg text-center mt-3 text-red-500">
        wait, we are redirecting you to the home page ...
      </p>
    </>
  );
}
