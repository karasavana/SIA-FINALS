import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8)), url('/images/mdc.jpg')` }}>
            <div className="flex min-h-screen flex-col items-center justify-center px-4">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
