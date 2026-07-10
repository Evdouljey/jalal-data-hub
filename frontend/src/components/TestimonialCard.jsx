export default function TestimonialCard({ name, role, quote }) {
  return (
    <div className="rounded-[24px] border border-green-100 bg-white p-5 shadow-sm">
      <p className="text-sm leading-7 text-slate-600">“{quote}”</p>
      <div className="mt-4">
        <p className="font-semibold text-slate-900">{name}</p>
        <p className="text-sm text-slate-500">{role}</p>
      </div>
    </div>
  );
}
