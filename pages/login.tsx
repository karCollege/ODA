import InputField from "@/components/InputField";
import TitleBar from "@/components/TitleBar";
import authService from "@/services/AuthService";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function Login() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const retypedPasswordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const logInUser = async () => {
    setError("");

    if (
      emailRef.current?.value == undefined ||
      passwordRef.current?.value == undefined
    ) {
      return;
    }

    try {
      const currentUser = await authService.logIn(
        supabase,
        emailRef.current?.value,
        passwordRef.current?.value
      );

      if(currentUser?.role == "customer") {
        router.push("/customer")
      } else if(currentUser?.role == "merchant") {
        router.push("/merchant")
      }

    } catch (error: any) {
      setError(error);
      return;
    }
  };

  return (
    <>
      <TitleBar title="Login" />

      <form
        className="px-5 py-3 w-full max-w-2xl m-auto"
        onSubmit={(e) => {
          e.preventDefault();
          logInUser();
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
        {error != "" && (
          <div className="mt-3">
            <p className="text-center text-red-400">{error}</p>
          </div>
        )}
        <div className="mt-7">
          <input
            type="submit"
            value="Login"
            className="block w-full rounded-md p-2 hover:bg-blue-600 text-lg bg-blue-500 text-white"
          />
        </div>
      </form>
    </>
  );
}
