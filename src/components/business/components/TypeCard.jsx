import { QrCode, ImageIcon, Tag, Star } from "lucide-react";

const TypeCard = ({ id, title, desc, icon }) => (
  <button
    onClick={() => setQrType(id)}
    className={`w-full text-left rounded-xl border px-4 sm:px-5 py-4 sm:py-5 transition ${
      qrType === id
        ? "border-blue-600 ring-2 ring-blue-100 bg-white"
        : "border-slate-200 hover:border-slate-300 bg-white"
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${
          qrType === id ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600"
        }`}
      >
        {icon}
      </div>
      <div>
        <div className="text-[15px] sm:text-base font-semibold text-slate-800">{title}</div>
        <div className="text-[13px] sm:text-sm text-slate-500">{desc}</div>
      </div>
    </div>
  </button>
);

export default TypeCard;