import { FiGlobe, FiSmartphone, FiZap, FiTv } from 'react-icons/fi';

const icons = {
  data: FiGlobe,
  airtime: FiSmartphone,
  electricity: FiZap,
  cable: FiTv,
};

export default function ServiceCard({ title, description, icon, accent }) {
  const Icon = icons[icon] || FiGlobe;

  return (
    <div className="rounded-[24px] border border-green-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className={`inline-flex rounded-2xl p-3 text-white ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
