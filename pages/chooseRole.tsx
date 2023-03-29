import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import TitleBar from "@/components/TitleBar";
import authService from "@/services/AuthService";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function ChooseRole() {
  const router = useRouter();
  const customerRoleRef = useRef<HTMLInputElement>(null);
  const merchantRoleRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <TitleBar title="How you want to use this platform ?" />

      <form
        className="px-5 py-3 w-full max-w-2xl m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          router.push({
            pathname: "/username",
            query: {
              role: customerRoleRef.current?.checked
                ? customerRoleRef.current.value
                : merchantRoleRef.current?.value,
            },
          });
        }}
      >
        <div className="mt-3 flex flex-col justify-center items-center gap-4 text-xl">
          <span>
            <input
              ref={customerRoleRef}
              type="radio"
              id="customer"
              name="role"
              value="customer"
              checked
              required
            />
            <label htmlFor="customer" className="ml-3">
              Wallet (store funds)
            </label>
          </span>
          <span>
            <input
              ref={merchantRoleRef}
              type="radio"
              id="merchant"
              name="role"
              value="merchant"
              required
            />
            <label htmlFor="merchant" className="ml-3">
              Bussiness (collect Payments)
            </label>
          </span>
        </div>

        <div className="mt-5">
          <CustomButton value="Next" type="submit" />
        </div>
      </form>
    </>
  );
}
