import { useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

export default function QRGeneratorPanel({ showToast }) {
    const [form, setForm] = useState({
        student_id: '',
        name: '',
        course: '',
        dept: '',
        year: '',
    });
    const [loading, setLoading] = useState(false);
    const [student, setStudent] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/students', form);
            setStudent(data.student);
            showToast('✅', 'QR Generated', `QR code created for ${form.name}`);
        } catch (error) {
            showToast('❌', 'Error', 'Failed to generate QR code.');
        } finally {
            setLoading(false);
        }
    };

    const downloadQR = () => {
        if (!student) return;
        const svg = document.getElementById('qr-code-svg-manual');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngFile;
            link.download = `qr-${student.student_id}.png`;
            link.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    const resetForm = () => {
        setForm({
            student_id: '',
            name: '',
            course: '',
            dept: '',
            year: '',
        });
        setStudent(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Manual QR Generation */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue-900)' }}>Generate QR Code</div>
                    <div style={{ fontSize: 14, color: 'var(--gray-600)', marginTop: 4 }}>Manually create a QR code for a new student.</div>
                </div>
                <div style={{ padding: '24px' }}>
                    {!student ? (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 6 }}>
                                        Student ID
                                    </label>
                                    <input
                                        type="text"
                                        value={form.student_id}
                                        onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                                        style={{
                                            width: '100%', padding: '10px 12px', borderRadius: 8,
                                            border: '1px solid var(--gray-300)', fontSize: 14,
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 6 }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        style={{
                                            width: '100%', padding: '10px 12px', borderRadius: 8,
                                            border: '1px solid var(--gray-300)', fontSize: 14,
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 6 }}>
                                        Department
                                    </label>
                                    <select
                                        value={form.dept}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setForm({
                                                ...form,
                                                dept: value,
                                                ...(value === 'Highschool' || value === 'Undergraduate'
                                                    ? { year: '', course: '' }
                                                    : {}),
                                            });
                                        }}
                                        style={{
                                            width: '100%', padding: '10px 12px', borderRadius: 8,
                                            border: '1px solid var(--gray-300)', fontSize: 14,
                                        }}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="CAST">CAST</option>
                                        <option value="COE">COE</option>
                                        <option value="CON">CON</option>
                                        <option value="CCJ">CCJ</option>
                                        <option value="CABM-H">CABM-H</option>
                                        <option value="CABM-B">CABM-B</option>
                                        <option value="Highschool">Highschool</option>
                                        <option value="Undergraduate">Undergraduate</option>
                                    </select>
                                </div>
                                {(form.dept !== 'Highschool' && form.dept !== 'Undergraduate') && (
                                    <>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 6 }}>
                                                Year Level
                                            </label>
                                            <select
                                                value={form.year}
                                                onChange={(e) => setForm({ ...form, year: e.target.value })}
                                                style={{
                                                    width: '100%', padding: '10px 12px', borderRadius: 8,
                                                    border: '1px solid var(--gray-300)', fontSize: 14,
                                                }}
                                                required
                                            >
                                                <option value="">Select Year</option>
                                                <option value="1st Year">1st Year</option>
                                                <option value="2nd Year">2nd Year</option>
                                                <option value="3rd Year">3rd Year</option>
                                                <option value="4th Year">4th Year</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 6 }}>
                                                Course
                                            </label>
                                            <input
                                                type="text"
                                                value={form.course}
                                                onChange={(e) => setForm({ ...form, course: e.target.value })}
                                                style={{
                                                    width: '100%', padding: '10px 12px', borderRadius: 8,
                                                    border: '1px solid var(--gray-300)', fontSize: 14,
                                                }}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div style={{ marginTop: 24 }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: 8,
                                        border: 'none', background: 'var(--blue-600)',
                                        color: 'var(--white)', fontWeight: 600, cursor: 'pointer',
                                    }}
                                >
                                    {loading ? 'Generating...' : 'Generate QR Code'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue-900)', marginBottom: 16 }}>
                                QR Code Generated!
                            </h4>
                            <p style={{ color: 'var(--gray-600)', marginBottom: 20 }}>
                                Download the QR code image below and print it for the student.
                            </p>
                            <div style={{ marginBottom: 20 }}>
                                <QRCode id="qr-code-svg-manual" value={student.student_id} size={200} />
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button
                                    onClick={downloadQR}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: 8,
                                        border: 'none', background: 'var(--success)',
                                        color: 'var(--white)', fontWeight: 600, cursor: 'pointer',
                                    }}
                                >
                                    Download QR
                                </button>
                                <button
                                    onClick={resetForm}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: 8,
                                        border: '1px solid var(--gray-300)', background: 'var(--white)',
                                        color: 'var(--gray-800)', fontWeight: 600, cursor: 'pointer',
                                    }}
                                >
                                    Create Another
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Instructions */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue-900)' }}>How to Use</div>
                </div>
                <div style={{ padding: '24px' }}>
                    <ul style={{ listStyle: 'disc', paddingLeft: 20, color: 'var(--gray-700)' }}>
                        <li>Use this form to manually create QR codes for new students.</li>
                        <li>Alternatively, when scanning an unregistered QR code, a registration modal will appear.</li>
                        <li>Download the generated QR code image and print it for distribution.</li>
                        <li>The QR code contains the student's ID for scanning at the library entrance.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}