import React, { useState } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../../components/common/Button.js';
import { Input } from '../../components/common/Input.js';

interface ProfileFormProps {
    onSave: (updatedUser: {
        firstName: string;
        lastName: string;
        email: string;
    }) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ onSave }) => {
    const { user } = useAuth();

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();

        // Validate empty fields
        if (!trimmedFirstName || !trimmedLastName || !trimmedEmail) {
            setMessage({
                type: 'error',
                text: 'Add your name and email, then try saving again.',
            });
            return;
        }

        // Check whether anything actually changed
        const hasChanges =
            trimmedFirstName !== (user?.firstName || '') ||
            trimmedLastName !== (user?.lastName || '') ||
            trimmedEmail !== (user?.email || '');

        if (!hasChanges) {
            setMessage({
                type: 'error',
                text: 'Your details are already up to date. Edit a field before saving.',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            await onSave({
                firstName: trimmedFirstName,
                lastName: trimmedLastName,
                email: trimmedEmail,
            });

            setMessage({
                type: 'success',
                text: 'Your profile is up to date.',
            });
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to update personal account information.';

            setMessage({
                type: 'error',
                text: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm">
            <div className="mb-5 border-b border-gray-50 pb-4">
                <h3 className="text-lg font-bold text-gray-900">
                    Personal Details
                </h3>
            </div>

            {message && (
                <div
                    role={message.type === 'success' ? 'status' : 'alert'}
                    aria-atomic="true"
                    className={`mb-5 flex items-start gap-3 rounded-xl border p-4 text-left shadow-xs ${
                        message.type === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                            : 'border-amber-200 bg-amber-50 text-amber-950'
                    }`}
                >
                    <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${
                        message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                        {message.type === 'success'
                            ? <CircleCheck size={18} aria-hidden="true" />
                            : <CircleAlert size={18} aria-hidden="true" />}
                    </span>
                    <div>
                        <p className="text-sm font-bold">
                            {message.type === 'success' ? 'Saved' : 'A quick check'}
                        </p>
                        <p className="mt-0.5 text-sm leading-5 opacity-80">{message.text}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input
                        label="First Name"
                        type="text"
                        id="profileFirstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />

                    <Input
                        label="Last Name"
                        type="text"
                        id="profileLastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <Input
                    label="Email Address"
                    type="email"
                    id="profileEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                />

                <div className="flex justify-end border-t border-gray-50 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                        className="w-full px-6 py-2.5 text-xs font-bold shadow-xs transition-all duration-200 active:scale-95 sm:w-auto"
                    >
                        Update Account Info
                    </Button>
                </div>
            </form>
        </div>
    );
};