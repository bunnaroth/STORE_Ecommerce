import React from 'react';
import { useState } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '../components/common/Button.js';
import { Input } from '../components/common/Input.js';
import { clientFetch } from '../api/client.js';

const contactDetails = [
  {
    label: 'Email',
    value: 'support@example.com',
    Icon: Mail,
  },
  {
    label: 'Phone',
    value: '+855',
    Icon: Phone,
  },
  {
    label: 'Address',
    value: '18 Marine Parade, Bicheno, TAS 7215, Australia',
    Icon: MapPin,
  },
  {
    label: 'Business Hours',
    value: '8 AM - 5 PM',
    Icon: Clock,
  },
];

export const Contact: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const topic = String(formData.get('topic') ?? 'Other');
    const message = String(formData.get('message') ?? '');

    setIsSending(true);
    setStatus(null);

    try {
      await clientFetch('/contact', {
        method: 'POST',
        body: { name, email, topic, message },
      });
      form.reset();
      setStatus({ type: 'success', message: 'Your message has been sent. We will get back to you soon.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Your message could not be sent. Please try again.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main>
      <header className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-sm font-bold uppercase text-indigo-300">We can help</p>
          <h1 className="mt-4 text-4xl font-black sm:text-6xl">Contact Us</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-300">
            Questions about an item or an order? Send us a note and we’ll point you in the right direction.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:px-8 lg:py-20">
        <section aria-labelledby="contact-form-heading" className="text-left">
          <p className="text-sm font-bold uppercase text-indigo-600">Write to us</p>
          <h2 id="contact-form-heading" className="mt-3 text-2xl font-extrabold text-gray-900">What can we help with?</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">Send us a message and we will get back to you by email.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="Your name" name="name" id="contactName" autoComplete="name" placeholder="Your name" maxLength={100} required />
              <Input label="Email address" name="email" id="contactEmail" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required />
            </div>

            <div className="w-full text-left">
              <label htmlFor="contactTopic" className="mb-1.5 block text-sm font-semibold text-gray-700">Topic</label>
              <select
                id="contactTopic"
                name="topic"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                <option>Order question</option>
                <option>Product question</option>
                <option>Returns</option>
                <option>Other</option>
              </select>
            </div>

            <div className="w-full text-left">
              <label htmlFor="contactMessage" className="mb-1.5 block text-sm font-semibold text-gray-700">Message</label>
              <textarea
                id="contactMessage"
                name="message"
                rows={5}
                required
                maxLength={5000}
                className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200"
                placeholder="Tell us a little more..."
              />
            </div>

            <Button type="submit" isLoading={isSending} className="w-full px-6 py-3 text-sm font-bold sm:w-auto">
              {isSending ? 'Sending...' : 'Send message'}
            </Button>
            {status && (
              <p
                role={status.type === 'error' ? 'alert' : 'status'}
                className={`text-sm ${status.type === 'error' ? 'text-red-600' : 'text-green-700'}`}
              >
                {status.message}
              </p>
            )}
          </form>
        </section>

        <aside aria-labelledby="contact-details-heading" className="border-t border-gray-200 pt-8 text-left lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="text-sm font-bold uppercase text-indigo-600">The details</p>
          <h2 id="contact-details-heading" className="mt-3 text-2xl font-extrabold text-gray-900">Reach STORE</h2>

          <dl className="mt-6 divide-y divide-gray-100 border-y border-gray-100">
            {contactDetails.map(({ label, value, Icon }) => (
              <div key={label} className="flex items-start gap-4 py-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-900">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-sm font-bold text-gray-900">{label}</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-600">
                    {value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </main>
  );
};