import InputField from "@/components/InputField";
import TitleBar from "@/components/TitleBar";
import { Role } from "@/data/Role";
import authService from "@/services/AuthService";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

export default function Setup() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const [searched, setSearched] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const usernameRegEx = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
  const checkIfUsernameValid = (username: string) => {
    return username.search(/[ ]+/) == -1 && usernameRegEx.test(username);
  };

  const checkUsernameAvailablity = async () => {
    let lastUsername = usernameInputRef.current?.value ?? "";
    setSearched(false);

    setTimeout(async () => {
      console.log("called ...");
      if (usernameInputRef.current?.value == lastUsername) {
        if (!checkIfUsernameValid(usernameInputRef.current.value.trim())) {
          setIsAvailable(false);
          setSearched(true);
          return;
        }

        const isUsernameAvailable = await authService.isUsernameAvailable(
          supabase,
          usernameInputRef.current.value.trim()
        );

        setIsAvailable(isUsernameAvailable);
        setSearched(true);
      }
    }, 2000);
  };

  return (
    <>
      <TitleBar title="Pick a unique username" />

      <form
        className="px-5 py-3 w-full max-w-2xl m-auto"
        onSubmit={async (e) => {
          e.preventDefault();

          if (isAvailable) {
            await authService.createProfile(
              supabase,
              usernameInputRef.current?.value ?? "",
              (router.query.role ?? "customer") as Role
            );

            router.push("/home")
          }
        }}
      >
        <div className="mt-3">
          <InputField
            label="# Username"
            placeholder="xyz"
            type="text"
            refv={usernameInputRef}
            onChange={checkUsernameAvailablity}
          />
        </div>
        {searched && (
          <div className="mt-3">
            <p
              className={
                isAvailable
                  ? "text-center text-green-400"
                  : "text-center text-red-400"
              }
            >{`${usernameInputRef.current?.value} ${
              isAvailable ? "is available" : "is not available"
            }`}</p>
          </div>
        )}
        <div className="mt-5">
          <input
            type="submit"
            value="Register"
            className="block w-full p-2 hover:bg-gray-200 text-lg bg-gray-100"
          />
        </div>
      </form>
    </>
  );
}
