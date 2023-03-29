export default function TitleBar({ title }: { title: string }) {
  return (
    <div className="border-b-2 border-b-gray-200 px-5 py-3">
      <p className="text-2xl text-center font-bold">{title}</p>
    </div>
  );
}
