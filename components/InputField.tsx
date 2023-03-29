import {
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  RefObject,
  useRef,
} from "react";

export default function InputField({
  label,
  placeholder,
  type,
  refv,
  onChange
}: {
  label: string;
  placeholder: string;
  type: HTMLInputTypeAttribute;
  refv: RefObject<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <>
      <label className="text-xl font-bold">
        {label}
        <input
          ref={refv}
          className="p-3 text-base font-normal w-full mt-3 border-2 outline-none focus:border-blue-500"
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          required
        />
      </label>
    </>
  );
}
