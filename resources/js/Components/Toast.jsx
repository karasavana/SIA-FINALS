export default function Toast({ icon, title, msg }) {
    return (
        <div style={{
            background: 'var(--blue-900)',
            color: 'var(--white)',
            padding: '14px 20px',
            borderRadius: 12,
            boxShadow: 'var(--shadow-lg)',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderLeft: '3px solid var(--blue-400)',
            animation: 'toastIn .3s ease',
            minWidth: 260,
        }}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <div>
                <b style={{ display: 'block', fontWeight: 700, marginBottom: 2 }}>{title}</b>
                <span style={{ fontSize: 12, color: 'var(--blue-300)' }}>{msg}</span>
            </div>
            <style>{`@keyframes toastIn { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }`}</style>
        </div>
    );
}
