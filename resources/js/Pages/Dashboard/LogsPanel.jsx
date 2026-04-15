import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const deptClass = { CAST: 'cast', COE: 'coe', CON: 'con', CCJ: 'ccj', 'CABM-B': 'cabmB', 'CABM-H': 'cabmH', Highschool: 'hs', Undergraduate: 'ug' };
const badgeBg   = { cast: '#e0f2fe', coe: '#ede9fe', con: '#dcfce7', ccj: '#ffe4e6', cabmB: '#fef9c3', cabmH: '#fce7f3', hs: '#dbeafe', ug: '#fef3c7' };
const badgeFg   = { cast: '#0369a1', coe: '#6d28d9', con: '#166534', ccj: '#9f1239', cabmB: '#854d0e', cabmH: '#831843', hs: '#1e40af', ug: '#78350f' };

export default function LogsPanel({ showToast }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ search: '', dept: '', year: '', course: '' });

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
            const { data } = await axios.get('/logs', { params });
            setLogs(data.data || []);
        } catch {
            showToast('❌', 'Error', 'Could not load logs.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    function exportCSV() {
        window.location.href = '/logs/export';
        showToast('⬇️', 'Exported', 'CSV file downloaded successfully.');
    }

    const set = (key) => (e) => setFilters(prev => ({ ...prev, [key]: e.target.value }));

    return (
        <div>
            {/* Search bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--white)', border: '1.5px solid var(--gray-200)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
                <span>🔍</span>
                <input
                    style={{ flex: 1, border: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--gray-800)', background: 'transparent' }}
                    placeholder="Search by name, ID, department…"
                    value={filters.search}
                    onChange={set('search')}
                />
            </div>

            {/* Filter row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <Select value={filters.dept}   onChange={set('dept')}   options={['All Departments','CAST','COE','CON','CCJ','CABM-B','CABM-H', 'Highschool', 'Undergraduate']} />
                <Select value={filters.year}   onChange={set('year')}   options={['All Year Levels','1st Year','2nd Year','3rd Year','4th Year']} />
                <Select value={filters.course} onChange={set('course')} options={['All Courses','BSCS','BSIT','BSED','BSN','BSBA']} />
                <BtnRow onClick={exportCSV}>⬇ Export CSV</BtnRow>
                <BtnRow primary onClick={fetchLogs}>🔄 Refresh</BtnRow>
            </div>

            {/* Table */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-200)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {['#','Student ID','Name','Course','Department','Year','Timestamp'].map(h => (
                                <th key={h} style={{ textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--gray-400)', fontWeight: 600, padding: '10px 16px', background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)' }}>Loading…</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: 32, color: 'var(--gray-400)' }}>No entries found.</td></tr>
                        ) : logs.map((l, i) => {
                            const cls = deptClass[l.dept] || '';
                            return (
                                <tr key={l.id} style={{ transition: 'background .15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-50)'}
                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                    <td style={td}>{i + 1}</td>
                                    <td style={{ ...td, fontFamily: "'Space Mono', monospace", fontSize: 12 }}>{l.student_id}</td>
                                    <td style={td}><b>{l.name}</b></td>
                                    <td style={td}>{l.course}</td>
                                    <td style={td}>
                                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: badgeBg[cls] || 'var(--blue-100)', color: badgeFg[cls] || 'var(--blue-700)' }}>{l.dept}</span>
                                    </td>
                                    <td style={td}>{l.year}</td>
                                    <td style={{ ...td, fontFamily: "'Space Mono', monospace", fontSize: 11, color: 'var(--blue-600)' }}>{l.timestamp}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Select({ value, onChange, options }) {
    return (
        <select value={value} onChange={onChange} style={{ padding: '8px 14px', borderRadius: 9, border: '1.5px solid var(--gray-200)', background: 'var(--white)', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'var(--gray-600)', outline: 'none', cursor: 'pointer' }}>
            {options.map(o => <option key={o} value={o.startsWith('All') ? '' : o}>{o}</option>)}
        </select>
    );
}

function BtnRow({ children, onClick, primary }) {
    return (
        <button onClick={onClick} style={{ padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", background: primary ? 'var(--blue-600)' : 'var(--white)', color: primary ? 'var(--white)' : 'var(--blue-600)', border: primary ? 'none' : '1.5px solid var(--blue-300)', transition: 'all .2s' }}>
            {children}
        </button>
    );
}

const td = { padding: '13px 16px', fontSize: 13, borderBottom: '1px solid var(--gray-100)', color: 'var(--gray-800)' };
