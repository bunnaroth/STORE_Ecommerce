import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart.js';
import { paymentApi } from '../../api/paymentApi.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';

export const CheckoutForm: React.FC = () => {
    const { cartItems, totalItemCount, formattedCartTotal, isLoading: isCartLoading } = useCart();

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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 font-sans">
                
                <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-left">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        Shipping Address
                    </h2>

                    {error && (
                        <div className="mb-4 rounded-xl bg-red-50 p-4 border border-red-100 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <Input
                            label="Street Address"
                            type="text"
                            id="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="123 Main St, Sihanouk Blvd"
                            required
                            disabled={isProcessing}
                        />

                        <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="City"
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Phnom Penh"
                            required
                            disabled={isProcessing}
                        />
                        <Input
                            label="Postal Code"
                            type="text"
                            id="postalCode"
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
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Cambodia"
                            required
                            disabled={isProcessing}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isProcessing}
                            disabled={isCartLoading || cartItems.length === 0}
                            className="w-full mt-6 py-3.5 text-sm font-bold tracking-wide shadow-md transition-all duration-200 active:scale-95"
                        >
                            Checkout
                        </Button>
                    </form>
                </div>

                <div className="lg:col-span-1 flex max-h-100 flex-col rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h3>
                    <div className="max-h-60 overflow-y-auto">
                        <table className="w-full table-fixed border-collapse text-sm">
                            <thead className="sticky top-0 bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                                <tr>
                                    <th scope="col" className="w-[55%] py-2 pl-3 text-left">Product</th>
                                    <th scope="col" className="w-[17%] py-2 text-right">Qty</th>
                                    <th scope="col" className="w-[28%] py-2 pr-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <tr key={item.cartItemId}>
                                        <td className="truncate py-3 pl-3 font-medium text-gray-700" title={item.name}>
                                            {item.name}
                                        </td>
                                        <td className="py-3 text-right tabular-nums text-gray-600">x{item.quantity}</td>
                                        <td className="py-3 pr-3 text-right font-semibold tabular-nums text-gray-900">
                                            {item.formattedSubtotal}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-4">
                        <span className="text-sm font-bold text-gray-700">Total</span>
                        <span className="text-xl font-black tabular-nums text-indigo-600">{formattedCartTotal}</span>
                    </div>
                </div>
            </div>
        );
    };