export default function StatTile({ label, value, hint, tone = 'bg-green-50 text-green-700' }) {
  return (
    <div className={`rounded-[22px] border border-green-100 p-4 shadow-sm ${tone}`}>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
    </div>
  );
}
