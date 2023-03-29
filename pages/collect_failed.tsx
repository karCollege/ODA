import InputField from "@/components/InputField";
import TitleBar from "@/components/TitleBar";
import authService from "@/services/AuthService";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CollectFailed() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/merchant");
    }, 2000);
  }, []);

  return (
    <>
      <TitleBar title="Transfer status" />

      <h1 className="text-2xl text-center mt-3 text-red-500">
        Your payment was failed : (
      </h1>
      <p className="text-lg text-center mt-3 text-red-500">
        wait, we are redirecting you to the home page ...
      </p>
    </>
  );
}
