import TitleBar from "@/components/TitleBar";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <TitleBar title="# Keeth's Wallet" />
      <p className="text-2xl font-bold px-5"># Balance</p>
      <div className="mx-5 p-5 border-2 rounded-md border-gray-200 flex justify-between">
        <p className="text-xl">&#8377; 423482394</p>
        <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md">
          Add Fund
        </button>
      </div>
      <p className="text-2xl font-bold px-5"># Payments</p>
      <div className="overflow-auto px-5">
        <table className="w-full text-left">
          <tr className="border-2 border-gray-200">
            <th className="border-2 border-gray-200 p-3">Destination</th>
            <th className="border-2 border-gray-200 p-3">Amount</th>
            <th className="border-2 border-gray-200 p-3">Tid</th>
          </tr>
          <tr className="bg-gray-100">
            <td className="border-2 border-gray-200 p-3">MX Efs</td>
            <td className="border-2 border-gray-200 p-3">203</td>
            <td className="border-2 border-gray-200 p-3">
              sfj3yw733gwr3gr3737r3g73r37g3rg
            </td>
          </tr>
          <tr className="">
            <td className="border-2 border-gray-200 p-3">MX Efs</td>
            <td className="border-2 border-gray-200 p-3">203</td>
            <td className="border-2 border-gray-200 p-3">
              sfj3yw733gwr3gr3737r3g73r37g3rg
            </td>
          </tr>
          <tr className="bg-gray-100">
            <td className="border-2 border-gray-200 p-3">MX Efs</td>
            <td className="border-2 border-gray-200 p-3">203</td>
            <td className="border-2 border-gray-200 p-3">
              sfj3yw733gwr3gr3737r3g73r37g3rg
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}
