import React, { useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { useCart } from '../../hooks/useCart.js';
import { paymentApi } from '../../api/paymentApi.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';

export const CheckoutForm: React.FC = () => {
    const { cartItems, formattedCartTotal, isLoading: isCartLoading } = useCart();

    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('Cambodia');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (cartItems.length === 0) {
            setError('Your shopping cart is completely empty.');
            return;
        }

        if (!street || !city || !postalCode || !country) {
            setError('Please populate all required shipping fields.');
            return;
        }

        try {
            setIsProcessing(true);

            const itemsPayload = cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            const shippingAddressId = 1;

            const sessionResult = await paymentApi.createCheckoutSession({
                shippingAddressId,
                items: itemsPayload
            });

            sessionResult.redirectToStripe();

        } catch (err: any) {
            setError(err.message || 'Payment initiation failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-12 text-left lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)] lg:gap-20">
            <form onSubmit={handlePaymentSubmit} className="min-w-0">
                <div className="border-b border-gray-200 pb-6">
                    <p className="text-sm font-bold uppercase text-indigo-600">Delivery</p>
                    <h2 className="mt-3 text-2xl font-black text-gray-950 sm:text-3xl">Where should it go?</h2>
            </div>

                {error && (
                    <div role="alert" className="mt-6 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="space-y-5 py-7">
                    <Input
                        label="Street address"
                        type="text"
                        id="street"
                        autoComplete="street-address"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="123 Main St, Sihanouk Blvd"
                        required
                        disabled={isProcessing}
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Input
                            label="City"
                            type="text"
                            id="city"
                            autoComplete="address-level2"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Phnom Penh"
                            required
                            disabled={isProcessing}
                        />
                        <Input
                            label="Postal code"
                            type="text"
                            id="postalCode"
                            autoComplete="postal-code"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="12000"
                            required
                            disabled={isProcessing}
                        />
                    </div>

                    <Input
                        label="Country"
                        type="text"
                        id="country"
                        autoComplete="country-name"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Cambodia"
                        required
                        disabled={isProcessing}
                    />
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isProcessing}
                        disabled={isCartLoading || cartItems.length === 0}
                        className="w-full px-6 py-3.5 text-sm font-bold sm:w-auto"
                    >
                        {isProcessing ? 'Opening secure payment...' : 'Continue to payment'}
                    </Button>
                </div>
            </form>

            <aside aria-labelledby="order-summary-heading" className="h-fit overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
                    <p className="text-xs font-bold uppercase text-indigo-600">Invoice</p>
                    <h2 id="order-summary-heading" className="mt-1 text-xl font-black text-gray-950">Order summary</h2>
                </div>

                <div className="p-4 sm:p-6">
                    {cartItems.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto">
                            <table className="w-full table-fixed border-collapse text-sm">
                                <caption className="sr-only">Items in your order</caption>
                                <thead className="sticky top-0 bg-white text-xs font-bold uppercase text-gray-500">
                                    <tr className="border-b border-gray-200">
                                        <th scope="col" className="w-[52%] py-3 text-left">Product</th>
                                        <th scope="col" className="w-[16%] py-3 text-center">Qty</th>
                                        <th scope="col" className="w-[32%] py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <tr key={item.cartItemId}>
                                            <td className="break-words py-3 pr-2 font-medium leading-5 text-gray-800">
                                                {item.name}
                                            </td>
                                            <td className="py-3 text-center tabular-nums text-gray-600">{item.quantity}</td>
                                            <td className="py-3 text-right font-semibold tabular-nums text-gray-900">
                                                {item.formattedSubtotal}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="py-5 text-sm text-gray-500">Your bag is empty.</p>
                    )}

                    <dl className="mt-4 space-y-3 border-t border-dashed border-gray-300 pt-4 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <dt>Shipping</dt>
                            <dd className="font-semibold text-emerald-700">Free</dd>
                        </div>
                        <div className="flex items-baseline justify-between gap-4 border-t border-gray-100 pt-3 text-gray-950">
                            <dt className="font-bold">Total</dt>
                            <dd className="text-xl font-black tabular-nums">{formattedCartTotal}</dd>
                        </div>
                    </dl>
                </div>
            </aside>
        </div>
    );
};