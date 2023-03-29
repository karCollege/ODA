import InputField from "@/components/InputField";
import TitleBar from "@/components/TitleBar";
import authService from "@/services/AuthService";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function Signup() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const retypedPasswordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const signInUser = async () => {
    setError("");

    if (
      emailRef.current?.value == undefined ||
      passwordRef.current?.value == undefined
    ) {
      return;
    }

    if (passwordRef.current?.value != retypedPasswordRef.current?.value) {
      setError("passwords are not matching.");
      return;
    }

    try {
      await authService.signUp(
        supabase,
        emailRef.current?.value,
        passwordRef.current?.value
      );
      router.push("/chooseRole")
    } catch (error: any) {
      setError(error);
      return;
    }
  };

  return (
    <>
      <TitleBar title="Registration" />

      <form
        className="px-5 py-3 w-full max-w-2xl m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          signInUser();
        }}
      >
        <div className="mt-3">
          <InputField
            label="# Email"
            placeholder="xyz@abc.com"
            type="text"
            refv={emailRef}
          />
        </div>
        <div className="mt-3">
          <InputField
            label="# Password"
            placeholder="******"
            type="password"
            refv={passwordRef}
          />
        </div>
        <div className="mt-3">
          <InputField
            label="# Retype Password"
            placeholder="******"
            type="password"
            refv={retypedPasswordRef}
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
            value="Register"
            className="block w-full rounded-md p-2 hover:bg-blue-600 text-lg bg-blue-500 text-white"
          />
        </div>
      </form>
    </>
  );
}
