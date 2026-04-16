import { useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

export default function RegistrationModal({ studentId, onClose, onSuccess, showToast }) {
    const [form, setForm] = useState({
        student_id: studentId,
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
            onSuccess(data.student);
        } catch (error) {
            showToast('❌', 'Error', 'Failed to register student.');
        } finally {
            setLoading(false);
        }
    };

    const downloadQR = () => {
        if (!student) return;
        const svg = document.getElementById('qr-code-svg');
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

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,.5)', zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div style={{
                background: 'var(--white)', borderRadius: 'var(--radius-lg)',
                padding: 32, maxWidth: 500, width: '100%', margin: 20,
                boxShadow: 'var(--shadow-lg)',
            }}>
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--blue-900)', marginBottom: 8 }}>
                        Register New Student
                    </h3>
                    <p style={{ color: 'var(--gray-600)' }}>
                        Student ID: {studentId} was not found. Please provide the details below.
                    </p>
                </div>

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
                                            ...(value === 'Highschool' || value === 'GraduateStudies'
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
                                    <option value="GraduateStudies">GraduateStudies</option>
                                </select>
                            </div>
                            {(form.dept !== 'Highschool' && form.dept !== 'GraduateStudies') && (
                                <>
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
                                </>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: 8,
                                    border: '1px solid var(--gray-300)', background: 'var(--white)',
                                    color: 'var(--gray-800)', fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: 8,
                                    border: 'none', background: 'var(--blue-600)',
                                    color: 'var(--white)', fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                {loading ? 'Registering...' : 'Register Student'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue-900)', marginBottom: 16 }}>
                            Student Registered Successfully!
                        </h4>
                        <p style={{ color: 'var(--gray-600)', marginBottom: 20 }}>
                            Here is the QR code for {student.name}. Download it and print for the student.
                        </p>
                        <div style={{ marginBottom: 20 }}>
                            <QRCode id="qr-code-svg" value={student.student_id} size={200} />
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
                                onClick={onClose}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: 8,
                                    border: '1px solid var(--gray-300)', background: 'var(--white)',
                                    color: 'var(--gray-800)', fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}