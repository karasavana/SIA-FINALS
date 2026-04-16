import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Landing({ auth }) {
    return (
        <>
            <Head title="Library QR Monitoring System" />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
                
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4)), url('/images/mdc.jpg')` }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                MDC Library
                                <span className="text-blue-600"> QR Monitoring System</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                Streamline student library access with QR code scanning, real-time analytics, 
                                and comprehensive reporting. Track attendance, generate insights, and manage 
                                your library efficiently.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route('login')}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Powerful Features for Modern Libraries
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Everything you need to manage library access and track student attendance
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* QR Code Scanning */}
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    QR Code Scanning
                                </h3>
                                <p className="text-gray-600">
                                    Fast and secure student check-in/out using QR codes. 
                                    No manual entry required, reducing errors and saving time.
                                </p>
                            </div>

                            {/* Real-time Analytics */}
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Real-time Analytics
                                </h3>
                                <p className="text-gray-600">
                                    Live dashboard with visitor statistics, department breakdowns, 
                                    and weekly trends to make data-driven decisions.
                                </p>
                            </div>

                            {/* PDF Reports */}
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    PDF Reports
                                </h3>
                                <p className="text-gray-600">
                                    Generate comprehensive reports with customizable filters. 
                                    Export data for meetings, analysis, and record keeping.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                
                
                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center mb-4">
                                    <ApplicationLogo className="h-8 w-8 fill-current text-white" />
                                    <span className="ml-2 text-xl font-bold">MDC LibraryLog</span>
                                </div>
                                <p className="text-gray-400">
                                    MDC Library QR Monitoring System for educational institutions.
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold mb-4">Features</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>QR Code Scanning</li>
                                    <li>Real-time Analytics</li>
                                    <li>PDF Reports</li>
                                    <li>Student Management</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold mb-4">Support</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>Documentation</li>
                                    <li>Help Center</li>
                                    <li>Contact Us</li>
                                    <li>System Status</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold mb-4">Legal</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>Privacy Policy</li>
                                    <li>Terms of Service</li>
                                    <li>Cookie Policy</li>
                                    <li>GDPR Compliance</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 MDC Library QR Monitoring System. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
