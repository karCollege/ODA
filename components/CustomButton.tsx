export default function CustomButton({
  type = "button",
  value,
}: {
  type: "button" | "submit";
  value: string;
}) {
  return (
    <input
      type={type}
      value={value}
      className="block w-full rounded-md p-2 hover:bg-blue-600 text-lg bg-blue-500 text-white"
    />
  );
}
