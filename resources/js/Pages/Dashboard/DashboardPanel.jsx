const deptClass = { BSCS: 'cs', BSIT: 'it', BSED: 'eng', BSN: 'nur', BSBA: 'bus' };
const deptColors = { BSCS: '#1976d2', BSIT: '#6d28d9', BSED: '#22c55e', BSN: '#f59e0b', BSBA: '#ef4444' };
const badgeBg   = { cs: '#e0f2fe', it: '#ede9fe', eng: '#dcfce7', nur: '#ffe4e6', bus: '#fef9c3' };
const badgeFg   = { cs: '#0369a1', it: '#6d28d9', eng: '#166534', nur: '#9f1239', bus: '#854d0e' };

export default function DashboardPanel({ stats, liveFeed, weekChart, deptStats }) {
    const maxBar = Math.max(...(weekChart || []).map(d => d.count), 1);

    return (
        <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 24 }}>
                <StatCard label="Today's Visits"   value={stats.today}       sub="+3 in last hour" />
                <StatCard label="Currently Inside" value={stats.inside}      sub="Occupancy"        accent="green" />
                <StatCard label="Weekly Total"     value={stats.weekly}      sub="↑ 12% vs last week" accent="amber" />
                <StatCard label="Departments"      value={stats.departments} sub="Active today" />
            </div>

            {/* Main grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
                {/* Live Feed */}
                <div style={card}>
                    <div style={cardHeader}>
                        <div>
                            <div style={cardTitle}>Live Entry Feed</div>
                            <div style={cardSub}>Auto-updates on scan</div>
                        </div>
                        <span>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', marginRight: 6, animation: 'pulse 1.5s infinite' }} />
                            <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>LIVE</span>
                        </span>
                    </div>
                    <div>
                        {liveFeed?.length
                            ? liveFeed.map((l, i) => <LogItem key={i} log={l} />)
                            : <Empty />}
                    </div>
                </div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* Week Chart */}
                    <div style={card}>
                        <div style={cardHeader}><div style={cardTitle}>Visits This Week</div></div>
                        <div style={{ padding: '18px 22px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 70, paddingTop: 10 }}>
                                {(weekChart || []).map((d, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4 }}>
                                        <div style={{
                                            width: '100%', borderRadius: '4px 4px 0 0',
                                            height: Math.round((d.count / maxBar) * 55) + 4,
                                            background: i === 6 ? 'var(--blue-600)' : 'var(--blue-300)',
                                            transition: 'height .5s ease', minHeight: 4,
                                        }} />
                                        <span style={{ fontSize: 9, color: 'var(--gray-400)' }}>{d.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Dept Ring */}
                    <div style={card}>
                        <div style={cardHeader}><div style={cardTitle}>By Department</div></div>
                        <div style={{ padding: '18px 22px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                <svg width="100" height="100" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="14"/>
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#1976d2" strokeWidth="14" strokeDasharray="75 176" strokeDashoffset="25" strokeLinecap="round"/>
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#6d28d9" strokeWidth="14" strokeDasharray="45 176" strokeDashoffset="-50" strokeLinecap="round"/>
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="14" strokeDasharray="30 176" strokeDashoffset="-95" strokeLinecap="round"/>
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="14" strokeDasharray="26 176" strokeDashoffset="-125" strokeLinecap="round"/>
                                    <text x="50" y="55" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0a3578" fontFamily="Space Mono">100%</text>
                                </svg>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {['BSCS — 30%','BSIT — 18%','BSED — 12%','BSN — 10%','Others — 30%'].map((label, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--gray-600)' }}>
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: Object.values(deptColors)[i] || '#94a3b8', flexShrink: 0 }} />
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }`}</style>
        </div>
    );
}

function StatCard({ label, value, sub, accent }) {
    const accentColor = { green: 'var(--success)', amber: 'var(--warning)' }[accent] || 'var(--blue-500)';
    return (
        <div style={{
            background: 'var(--white)', borderRadius: 'var(--radius)',
            padding: '20px 22px', boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--gray-200)', position: 'relative', overflow: 'hidden',
            transition: 'all .2s',
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentColor, borderRadius: '0 0 3px 3px' }} />
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--gray-400)', marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: accentColor === 'var(--blue-500)' ? 'var(--blue-900)' : accentColor, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>{value ?? 0}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 6 }}>{sub}</div>
        </div>
    );
}

function LogItem({ log }) {
    const cls = deptClass[log.dept] || '';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 22px', borderBottom: '1px solid var(--gray-100)', animation: 'slideIn .4s ease' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--blue-700)', flexShrink: 0 }}>
                {log.initials}
            </div>
            <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{log.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {log.student_id} ·
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: badgeBg[cls] || 'var(--blue-100)', color: badgeFg[cls] || 'var(--blue-700)' }}>
                        {log.dept}
                    </span>
                </div>
            </div>
            <div style={{ marginLeft: 'auto', fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--blue-500)', flexShrink: 0 }}>{log.timeOnly}</div>
        </div>
    );
}

function Empty() {
    return <div style={{ padding: 24, textAlign: 'center', color: 'var(--gray-400)', fontSize: 13 }}>No entries yet today.</div>;
}

const card = { background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-200)', overflow: 'hidden' };
const cardHeader = { padding: '18px 22px 14px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const cardTitle = { fontSize: 15, fontWeight: 700, color: 'var(--blue-900)' };
const cardSub = { fontSize: 12, color: 'var(--gray-400)', marginTop: 1 };
