import { Headphones, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const benefits = [
  {
    title: 'Fast Delivery',
    description: 'Quick and reliable delivery.',
    Icon: Truck,
  },
  {
    title: 'Secure Payment',
    description: 'A safe checkout, every time.',
    Icon: ShieldCheck,
  },
  {
    title: 'Easy Returns',
    description: 'Simple, no-fuss returns.',
    Icon: RotateCcw,
  },
  {
    title: 'Customer Support',
    description: "We're here when you need us.",
    Icon: Headphones,
  },
];

export const WhyShopWithUs: React.FC = () => (
  <section className="border-y border-gray-100 bg-white py-17" aria-labelledby="why-shop-heading">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <h2 id="why-shop-heading" className="mb-6 text-center text-2xl font-extrabold text-gray-900 sm:mb-8">
        Why Shop With Us
      </h2>

      <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-4">
        {benefits.map(({ title, description, Icon}) => (
          <div id={title === 'Customer Support' ? 'contact' : undefined} key={title} className="flex scroll-mt-20 items-center gap-4 border-b border-gray-100 px-2 py-4 last:border-b-0 sm:justify-center sm:border-b-0 sm:px-3 sm:py-2">
            <span className={`grid size-11 shrink-0 place-items-center rounded-full`}>
              <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="text-left">
              <h3 className="text-sm font-bold text-gray-900">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);