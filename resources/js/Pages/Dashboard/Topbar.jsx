import { useState, useEffect } from 'react';

export default function Topbar({ title, sub, onExportClick }) {
    const [clock, setClock] = useState('');

    useEffect(() => {
        const tick = () => setClock(new Date().toLocaleTimeString('en-PH', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
        }));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div style={{
            background: 'var(--white)',
            borderBottom: '1px solid var(--gray-200)',
            padding: '0 32px', height: 64,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, zIndex: 50,
            boxShadow: 'var(--shadow-sm)',
        }}>
            <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue-900)' }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>{sub}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 13, color: 'var(--blue-600)',
                    background: 'var(--blue-50)', padding: '6px 12px', borderRadius: 8,
                    border: '1px solid var(--blue-200)',
                }}>{clock}</div>

                <Btn variant="primary" onClick={onExportClick}>⬇ Export</Btn>
            </div>
        </div>
    );
}

function Btn({ variant, onClick, children }) {
    const base = {
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '9px 18px', borderRadius: 9,
        fontSize: 13, fontWeight: 600,
        cursor: 'pointer', border: 'none', fontFamily: "'DM Sans', sans-serif",
        transition: 'all .2s',
    };
    const styles = {
        primary: { background: 'var(--blue-600)', color: 'var(--white)' },
        outline:  { background: 'var(--white)', color: 'var(--blue-600)', border: '1.5px solid var(--blue-300)' },
    };
    return <button style={{ ...base, ...styles[variant] }} onClick={onClick}>{children}</button>;
}
