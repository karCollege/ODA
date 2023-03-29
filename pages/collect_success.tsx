import InputField from "@/components/InputField";
import TitleBar from "@/components/TitleBar";
import authService from "@/services/AuthService";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function CollectSuccess() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/merchant");
    }, 2000);
  }, []);

  return (
    <>
      <TitleBar title="Transfer status" />

      <h1 className="text-2xl text-center mt-3">
        Your payment was successfull : )
      </h1>
      <p className="text-lg text-center mt-3">
        wait, we are redirecting you to the home page ...
      </p>
    </>
  );
}
