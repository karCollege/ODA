import { HTMLInputTypeAttribute, useRef } from "react";

export default function InputField({
  label,
  placeholder,
  type,
}: {
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <label className="text-xl font-bold">
        {label}
        <input
          ref={ref}
          className="p-3 text-base font-normal w-full mt-3 border-2 outline-none focus:border-blue-500"
          type="text"
          placeholder={placeholder}
        />
      </label>
    </>
  );
}
