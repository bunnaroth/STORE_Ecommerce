import { Link } from 'react-router-dom';

const values = [
  {
    number: '01',
    title: 'Everyday wear',
    description: 'Useful pieces chosen to fit naturally into your day.',
  },
  {
    number: '02',
    title: 'Considered selection',
    description: 'A focused range of clothing and accessories, easy to browse.',
  },
  {
    number: '03',
    title: 'Straightforward service',
    description: 'Clear product details, secure checkout, and help when you need it.',
  },
];

export const AboutUs: React.FC = () => (
  <main>
    <section className="flex min-h-[58vh] items-end overflow-hidden bg-black sm:min-h-[66vh] lg:min-h-[76vh]">
      <div className="mx-auto w-full max-w-7xl px-5 pb-12 pt-28 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <h1 className="mt-5 max-w-5xl text-5xl font-black uppercase leading-[0.98] text-white sm:text-7xl lg:text-8xl">
          Everyday style,<br className="hidden sm:block" /> chosen well.
        </h1>
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-24">
      <div className="relative">
        <img
          src="/about-us.jpg"
          alt="Clothing and everyday essentials from the STORE collection"
          className="aspect-4/3 w-full object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-3 left-3 bg-white px-3 py-2 text-xs font-bold uppercase text-gray-900 sm:bottom-5 sm:left-5">
          STORE — Everyday collection
        </span>
      </div>
      <div className="max-w-xl text-left lg:py-8">
        <p className="text-sm font-bold uppercase text-indigo-600">Our story</p>
        <h2 className="mt-4 text-3xl font-black leading-tight text-gray-900 sm:text-4xl">
          A good wardrobe starts with the pieces you reach for.
        </h2>
        <p className="mt-5 text-base leading-7 text-gray-600">
          STORE brings together clothing and accessories for everyday wear. We keep the collection easy to explore, with the details you need to choose what feels right.
        </p>
        
      </div>
    </section>

    <section className="bg-gray-950 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:px-8 lg:py-20">
        <p className="text-sm font-bold uppercase text-indigo-300">What We Offer</p>
        <div className="max-w-3xl">
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">A considered everyday collection.</h2>
          <p className="mt-5 text-base leading-7 text-gray-300">
            Explore apparel and accessories across the categories you reach for most, from shirts and denim to jackets and finishing touches.
          </p>
          <Link to="/products" className="mt-7 inline-flex border-b border-white pb-1 text-sm font-bold text-white transition-colors hover:border-indigo-300 hover:text-indigo-300">
            Shop STORE <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-indigo-600">Our Values</p>
          <h2 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">The details matter.</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {values.map((value) => (
          <article key={value.number} className="border-b border-gray-200 py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0 lg:py-9">
            <span className="text-sm font-bold text-indigo-600">{value.number}</span>
            <h3 className="mt-5 text-lg font-extrabold text-gray-900">{value.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{value.description}</p>
          </article>
        ))}
      </div>
    </section>
  </main>
);