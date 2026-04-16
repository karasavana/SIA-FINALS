import { usePage, router } from '@inertiajs/react';

const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', section: 'Main' },
    { id: 'logs',      icon: '📋', label: 'Student Logs', badge: true },
    { id: 'reports',   icon: '📄', label: 'Reports', section: 'Admin' },
    { id: 'generate-qr', icon: '🔗', label: 'Generate QR' },
    { id: 'settings',  icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ activeTab, onTabChange, logCount, showToast }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'A';

    return (
        <aside style={{
            width: 260, minHeight: '100vh',
            background: 'linear-gradient(180deg, var(--blue-900) 0%, var(--blue-950) 100%)',
            display: 'flex', flexDirection: 'column',
            position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
            boxShadow: '4px 0 24px rgba(0,0,0,.2)',
        }}>
            {/* Logo */}
            <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 40, height: 40, background: 'var(--blue-500)',
                        borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>
                        <img src="/images/logo.png" alt="LibraryQR" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ color: 'var(--white)' }}>
                        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.3px' }}>LibraryQR</div>
                        <div style={{ fontSize: 10, fontWeight: 400, color: 'var(--blue-300)', textTransform: 'uppercase', letterSpacing: 1 }}>
                            Monitoring System
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ padding: '20px 12px', flex: 1 }}>
                {navItems.map((item, i) => (
                    <div key={item.id}>
                        {item.section && (
                            <div style={{
                                fontSize: 9, fontWeight: 600, letterSpacing: '1.5px',
                                textTransform: 'uppercase', color: 'var(--blue-400)',
                                padding: '8px 12px 6px', marginTop: i > 0 ? 16 : 0,
                            }}>{item.section}</div>
                        )}
                        <NavItem
                            item={item}
                            active={activeTab === item.id}
                            logCount={logCount}
                            onClick={() => {
                                onTabChange(item.id);
                            }}
                        />
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div style={{ padding: '16px 16px 24px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10,
                    background: 'rgba(255,255,255,.06)',
                }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'var(--blue-500)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: 'var(--white)',
                    }}>{initials}</div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)' }}>
                            {user?.name || 'Admin'}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--blue-300)' }}>Library Staff</div>
                    </div>
                </div>
                <button
                    onClick={() => router.post(route('logout'))}
                    style={{
                        width: '100%', marginTop: 12,
                        padding: '10px 12px', borderRadius: 10,
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        transition: 'all .2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                    }}
                >
                    🚪 Logout
                </button>
            </div>
        </aside>
    );
}

function NavItem({ item, active, logCount, onClick }) {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 10,
                color: active ? 'var(--white)' : 'rgba(255,255,255,.6)',
                cursor: 'pointer', marginBottom: 2,
                fontSize: 14, fontWeight: 500,
                background: active ? 'var(--blue-600)' : 'transparent',
                boxShadow: active ? '0 4px 12px rgba(21,101,192,.4)' : 'none',
                transition: 'all .2s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = 'var(--white)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,.6)'; }}
        >
            <span style={{ fontSize: 17, width: 20, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
            {item.badge && logCount > 0 && (
                <span style={{
                    marginLeft: 'auto', background: 'var(--blue-400)',
                    color: 'var(--blue-950)', fontSize: 10, fontWeight: 700,
                    padding: '2px 7px', borderRadius: 20,
                }}>{logCount}</span>
            )}
        </div>
    );
}
