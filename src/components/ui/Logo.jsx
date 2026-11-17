import { Dumbbell } from "lucide-react";

function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-marca-500 to-marca-700 text-white shadow-marca"
      >
        <Dumbbell size={18} strokeWidth={2.4} />
      </span>
      <span className="font-titulo text-xl font-extrabold tracking-tight text-texto">
        Mente<span className="text-marca-500">Forte</span>
      </span>
    </span>
  );
}

export default Logo;
