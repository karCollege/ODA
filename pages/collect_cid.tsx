import InputField from "@/components/InputField";
import TitleBar from "@/components/TitleBar";
import authService from "@/services/AuthService";
import customerService from "@/services/CustomerService";
import merchantService from "@/services/MerchantService";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function CollectCid() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const usernameRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const next = async () => {
    setError("");

    const isExist = await customerService.checkCustomerExists(
      supabase,
      usernameRef.current?.value ?? ""
    );
    if (!isExist) {
      setError("Username not found! check the customer's username");
      return;
    }

    router.push(`/collect_pin?username=${usernameRef.current?.value}&amount=${amountRef.current?.value}`)
  };

  return (
    <>
      <TitleBar title="Collecting payment with ODA" />

      <form
        className="px-5 py-3 w-full max-w-2xl m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        <div className="mt-3">
          <InputField
            label="# Username (customer's username)"
            placeholder="xyz"
            type="text"
            refv={usernameRef}
          />
        </div>
        <div className="mt-3">
          <InputField
            label="# Amount"
            placeholder="000"
            type="number"
            refv={amountRef}
          />
        </div>
        {error != "" && (
          <div className="mt-3">
            <p className="text-center text-red-400">{error}</p>
          </div>
        )}
        <div className="mt-7">
          <input
            type="submit"
            value="Next"
            className="block w-full rounded-md p-2 hover:bg-blue-600 text-lg bg-blue-500 text-white"
          />
        </div>
      </form>
    </>
  );
}
