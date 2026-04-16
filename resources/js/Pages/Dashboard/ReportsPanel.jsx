import { useState } from 'react';
import axios from 'axios';

const reportTypes = [
    { id: 'Hourly',   icon: '⏰', title: 'Hourly Report',     desc: 'Entries grouped by hour' },
    { id: 'Daily',    icon: '📅', title: 'Daily Report',     desc: 'All library entries for a specific day' },
    { id: 'Weekly',   icon: '📆', title: 'Weekly Report',    desc: 'Aggregated weekly statistics' },
    { id: 'Monthly',  icon: '📊', title: 'Monthly Report',   desc: 'Complete monthly breakdown' },
];

export default function ReportsPanel({ showToast }) {
    const today = new Date().toISOString().slice(0, 10);
    const [selected, setSelected] = useState('Daily');
    const [dateFrom, setDateFrom] = useState(today);
    const [dateTo, setDateTo] = useState(today);
    const [dept, setDept] = useState('');
    const [year, setYear] = useState('');
    const [generating, setGenerating] = useState(false);
    const [reportData, setReportData] = useState(null);

    async function generateReport() {
        setGenerating(true);
        try {
            const { data } = await axios.post('/reports/generate', {
                type: selected,
                date_from: dateFrom,
                date_to: dateTo,
                dept: dept || null,
                year: year || null,
            });
            setReportData(data);
            showToast('✅', 'Report Generated', `${data.total_entries} entries found.`);
        } catch (err) {
            showToast('❌', 'Error', err.response?.data?.message || 'Failed to generate report.');
        } finally {
            setGenerating(false);
        }
    }

    async function downloadReport() {
        try {
            const response = await axios.post('/reports/download', {
                type: selected,
                date_from: dateFrom,
                date_to: dateTo,
                dept: dept || null,
                year: year || null,
            }, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${selected}-Report-${dateFrom}-to-${dateTo}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            showToast('⬇️', 'Downloaded', 'PDF report downloaded successfully.');
        } catch (err) {
            showToast('❌', 'Error', 'Failed to download PDF.');
        }
    }

    return (
        <div>
            {/* Settings card */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: 24, boxShadow: 'var(--shadow-sm)', marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--blue-900)', marginBottom: 20 }}>⚙️ Report Settings</div>

                {/* Report type selector */}
                <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>Report Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                        {reportTypes.map(rt => (
                            <div
                                key={rt.id}
                                onClick={() => setSelected(rt.id)}
                                style={{
                                    padding: 12,
                                    borderRadius: 9,
                                    border: `2px solid ${selected === rt.id ? 'var(--blue-500)' : 'var(--gray-200)'}`,
                                    background: selected === rt.id ? 'var(--blue-50)' : 'var(--white)',
                                    cursor: 'pointer',
                                    transition: 'all .2s',
                                }}
                            >
                                <div style={{ fontSize: 20, marginBottom: 4 }}>{rt.icon}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: selected === rt.id ? 'var(--blue-700)' : 'var(--gray-700)' }}>{rt.title}</div>
                                <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>{rt.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Date range */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <FormGroup label="Date From">
                        <input type="date" style={formControl} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                    </FormGroup>
                    <FormGroup label="Date To">
                        <input type="date" style={formControl} value={dateTo} onChange={e => setDateTo(e.target.value)} />
                    </FormGroup>
                </div>

                {/* Dept + Year filters */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <FormGroup label="Department Filter">
                        <select style={formControl} value={dept} onChange={e => setDept(e.target.value)}>
                            <option value="">All Departments</option>
                            {['CAST', 'COE', 'CON', 'CCJ', 'CABM-B', 'CABM-H'].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </FormGroup>
                    <FormGroup label="Year Level">
                        <select style={formControl} value={year} onChange={e => setYear(e.target.value)}>
                            <option value="">All Year Levels</option>
                            {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Highschool', 'GraduateStudies'].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </FormGroup>
                </div>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button
                                        onClick={generateReport}
                                        disabled={generating}
                                        style={{
                                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                            padding: '10px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                                            cursor: generating ? 'not-allowed' : 'pointer', border: '1.5px solid var(--gray-200)',
                                            background: 'var(--blue-600)', color: 'var(--white)',
                                            fontFamily: "'DM Sans', sans-serif", transition: 'all .2s',
                                            opacity: generating ? 0.7 : 1,
                                        }}
                                    >
                                        {generating ? '⏳ Generating…' : '📊 Generate Report'}
                                    </button>
                                    {reportData && (
                                        <button
                                            onClick={downloadReport}
                                            disabled={generating}
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                padding: '10px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                                                cursor: generating ? 'not-allowed' : 'pointer', border: '1.5px solid var(--gray-200)',
                                                background: 'var(--green-600)', color: 'var(--black)',
                                                fontFamily: "'DM Sans', sans-serif", transition: 'all .2s',
                                                opacity: generating ? 0.7 : 1,
                                            }}
                                        >
                                            📥 Download PDF
                                        </button>
                                    )}
                                </div>
                            </div>

            {/* Report preview */}
            {reportData && (
                <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--blue-900)', marginBottom: 16 }}>📈 Report Preview</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 20 }}>Total Entries: <b>{reportData.total_entries}</b></div>

                    <div style={{ display: 'grid', gap: 12 }}>
                        {reportData.data.map((period, idx) => (
                            <div key={idx} style={{ background: 'var(--gray-50)', padding: 12, borderRadius: 9, border: '1px solid var(--gray-200)' }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue-700)', marginBottom: 8 }}>
                                    {period.period} ({period.count} entries)
                                </div>
                                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                                    {period.entries.slice(0, 5).map((entry, i) => (
                                        <div key={i} style={{ fontSize: 12, color: 'var(--gray-700)', paddingBottom: 4 }}>
                                            {entry.name} ({entry.student_id}) - {entry.timestamp}
                                        </div>
                                    ))}
                                    {period.entries.length > 5 && (
                                        <div style={{ fontSize: 12, color: 'var(--gray-500)', fontStyle: 'italic', paddingTop: 4 }}>
                                            +{period.entries.length - 5} more entries
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function FormGroup({ label, children }) {
    return (
        <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</label>
            {children}
        </div>
    );
}

const formControl = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid var(--gray-200)', borderRadius: 9,
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'var(--gray-800)',
    outline: 'none', transition: 'border-color .2s', background: 'var(--white)',
};
