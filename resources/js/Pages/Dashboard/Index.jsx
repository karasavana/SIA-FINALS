import { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import DashboardPanel from './DashboardPanel';
import LogsPanel from './LogsPanel';
import ReportsPanel from './ReportsPanel';
import QRGeneratorPanel from './QRGeneratorPanel';
import SettingsPanel from './SettingsPanel';
import RegistrationModal from './RegistrationModal';
import Toast from '@/Components/Toast';

export default function Index({ stats, liveFeed, recentScans, weekChart, deptStats }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [toasts, setToasts] = useState([]);

    // Live feed state (updated after each scan confirmation)
    const [feed, setFeed] = useState(liveFeed || []);
    const [recent, setRecent] = useState(recentScans || []);
    const [currentStats, setCurrentStats] = useState(stats || {});

    // Scanner device mode key-selection persisted
    const [selectedDevice, setSelectedDevice] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('libraryqr_scanner_device') || 'keyboard-scanner';
        }
        return 'keyboard-scanner';
    });

    // QR scanner input buffer
    const [scanBuffer, setScanBuffer] = useState('');

    // Registration modal for unknown students
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [unknownStudentId, setUnknownStudentId] = useState('');

    const showToast = useCallback((icon, title, msg) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, icon, title, msg }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    }, []);

    const onScanConfirmed = useCallback((log) => {
        setFeed(prev => [log, ...prev].slice(0, 8));
        setRecent(prev => [log, ...prev].slice(0, 5));
        setCurrentStats(prev => ({
            ...prev,
            today: (prev.today || 0) + 1,
            inside: (prev.inside || 0) + 1,
        }));
    }, []);

    // Handle QR scanner input (device acts as keyboard)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedDevice !== 'keyboard-scanner') return; // only keyboard scan mode
            // Only process if not typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.key === 'Enter') {
                if (scanBuffer.trim()) {
                    processScan(scanBuffer.trim());
                    setScanBuffer('');
                }
            } else if (e.key.length === 1) { // Only add printable characters
                setScanBuffer(prev => prev + e.key);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [scanBuffer, selectedDevice]);

    const processScan = async (studentId) => {
        try {
            const { data } = await axios.post('/scan/process', { student_id: studentId });
            if (data.success) {
                onScanConfirmed(data.log);
                showToast('✅', 'QR Scanned', `${data.log.name} logged successfully.`);
            } else {
                // Unknown student - show registration modal
                setUnknownStudentId(studentId);
                setShowRegistrationModal(true);
            }
        } catch (error) {
            showToast('❌', 'Error', 'Could not process scan.');
        }
    };

    const pageMeta = {
        dashboard: { title: 'Dashboard',     sub: 'Real-time library monitoring' },
        logs:      { title: 'Student Logs',  sub: 'Search, filter & view all entries' },
        reports:   { title: 'Reports',       sub: 'Generate & download reports' },
        'generate-qr': { title: 'Generate QR', sub: 'Create QR codes for students' },
        settings:  { title: 'Settings',      sub: 'Configure system preferences' },
    };

    return (
        <>
            <Head title="LibraryQR — Monitoring System" />

            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
                rel="stylesheet"
            />

            <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--blue-50)', fontFamily: "'DM Sans', sans-serif" }}>

                <Sidebar
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    logCount={currentStats.today || 0}
                    showToast={showToast}
                />

                <main style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Topbar
                        title={pageMeta[activeTab].title}
                        sub={pageMeta[activeTab].sub}
                        onExportClick={() => setActiveTab('reports')}
                    />

                    <div style={{ padding: '28px 32px', flex: 1 }}>
                        {activeTab === 'dashboard' && (
                            <DashboardPanel
                                stats={currentStats}
                                liveFeed={feed}
                                recentScans={recent}
                                weekChart={weekChart}
                                deptStats={deptStats}
                            />
                        )}
                        {activeTab === 'logs' && (
                            <LogsPanel showToast={showToast} />
                        )}
                        {activeTab === 'reports' && (
                            <ReportsPanel showToast={showToast} />
                        )}
                        {activeTab === 'generate-qr' && (
                            <QRGeneratorPanel showToast={showToast} />
                        )}
                        {activeTab === 'settings' && (
                            <SettingsPanel
                                showToast={showToast}
                                selectedDevice={selectedDevice}
                                onDeviceChange={(device) => {
                                    setSelectedDevice(device);
                                    localStorage.setItem('libraryqr_scanner_device', device);
                                }}
                            />
                        )}
                    </div>
                </main>
            </div>

            {/* Toast container */}
            <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {toasts.map(t => <Toast key={t.id} {...t} />)}
            </div>

            {/* Registration Modal */}
            {showRegistrationModal && (
                <RegistrationModal
                    studentId={unknownStudentId}
                    onClose={() => setShowRegistrationModal(false)}
                    onSuccess={(student) => {
                        setShowRegistrationModal(false);
                        showToast('✅', 'Student Registered', `${student.name} added successfully.`);
                        // Optionally log the entry now
                        // processScan(student.student_id);
                    }}
                    showToast={showToast}
                />
            )}

            <style>{`
                :root {
                    --blue-950: #03152e; --blue-900: #062454; --blue-800: #0a3578;
                    --blue-700: #0d46a0; --blue-600: #1565c0; --blue-500: #1976d2;
                    --blue-400: #42a5f5; --blue-300: #90caf9; --blue-200: #bbdefb;
                    --blue-100: #e3f2fd; --blue-50:  #f0f8ff;
                    --white: #ffffff;
                    --gray-50: #f8fafc; --gray-100: #f1f5f9; --gray-200: #e2e8f0;
                    --gray-400: #94a3b8; --gray-600: #475569; --gray-800: #1e293b;
                    --success: #22c55e; --warning: #f59e0b; --danger: #ef4444;
                    --shadow-sm: 0 1px 3px rgba(6,36,84,.08);
                    --shadow:    0 4px 16px rgba(6,36,84,.12);
                    --shadow-lg: 0 12px 40px rgba(6,36,84,.18);
                    --radius: 12px; --radius-lg: 20px;
                }
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { overflow-x: hidden; }
            `}</style>
        </>
    );
}
