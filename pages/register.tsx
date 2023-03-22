import InputField from "@/components/InputField";
import TitleBar from "@/components/TitleBar";

export default function Register() {
  return (
    <>
      <TitleBar title="# Users portal - Registration" />

      <div className="px-5 py-3">
        <div className="mt-3">
          <InputField label="# Email" placeholder="xyz@abc.com" type="text" />
        </div>
        <div className="mt-3">
          <InputField label="# Password" placeholder="******" type="password" />
        </div>
        <div className="mt-3">
          <InputField
            label="# Retype Password"
            placeholder="******"
            type="password"
          />
        </div>
        <div className="mt-5">
          <input
            type="button"
            value="Register"
            className="block w-full p-2 hover:bg-gray-200 text-lg bg-gray-100"
          />
        </div>
      </div>
    </>
  );
}
