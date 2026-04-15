import { useState, useEffect } from 'react';

export default function SettingsPanel({ showToast, selectedDevice, onDeviceChange }) {
    const [deviceList, setDeviceList] = useState([]);
    const [loading, setLoading] = useState(false);

    const isUSBSupported = typeof navigator !== 'undefined' && 'usb' in navigator;

    useEffect(() => {
        const initDevices = async () => {
            if (!isUSBSupported) return;
            try {
                const supportedDevices = await navigator.usb.getDevices();
                setDeviceList(supportedDevices);
            } catch (error) {
                console.error('USB getDevices error:', error);
            }
        };
        initDevices();
    }, [isUSBSupported]);

    const requestUsbDevice = async () => {
        if (!isUSBSupported) {
            showToast('❌', 'Not Supported', 'WebUSB is not available in this browser.');
            return;
        }

        setLoading(true);
        try {
            const devices = await navigator.usb.requestDevice({ filters: [] });
            setDeviceList(prev => [...prev, devices]);

            showToast('✅', 'Device Connected', `${devices.productName || 'USB Device'} added`);
            onDeviceChange('keyboard-scanner');
        } catch (error) {
            if (error.name !== 'NotFoundError') {
                showToast('❌', 'Error', `Unable to add device: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeviceChange = (value) => {
        onDeviceChange && onDeviceChange(value);
        showToast('⚙️', 'Device Selected', `Switched to ${value === 'keyboard-scanner' ? 'QR keyboard scanner' : 'manual/no device'}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Device Selection */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue-900)' }}>Device Configuration</div>
                    <div style={{ fontSize: 14, color: 'var(--gray-600)', marginTop: 4 }}>Select the active scanner input method for the system.</div>
                </div>
                <div style={{ padding: '24px' }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', display: 'block', marginBottom: 12 }}>Active Device</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <select
                            value={selectedDevice}
                            onChange={(e) => handleDeviceChange(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '12px 16px', borderRadius: 8,
                                border: '1.5px solid var(--gray-300)', background: 'var(--white)',
                                fontSize: 14, color: 'var(--gray-800)', outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="keyboard-scanner">USB QR Scanner (Keyboard Mode)</option>
                            <option value="manual-entry">Manual Entry Only</option>
                            <option value="none">No Device</option>
                        </select>
                        <button
                            onClick={requestUsbDevice}
                            disabled={!isUSBSupported || loading}
                            style={{
                                padding: '11px 16px', borderRadius: 8,
                                border: '1px solid var(--blue-300)', background: 'var(--blue-50)',
                                color: 'var(--blue-700)', fontWeight: 600, cursor: 'pointer',
                            }}
                        >
                            {loading ? 'Searching...' : 'Detect USB'}
                        </button>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                        {isUSBSupported
                            ? 'Detected USB devices are shown below; granting permission allows this app to read from the scanner device.'
                            : 'WebUSB is not supported in this browser. Keyboard scanner mode will still work (device must emulate keyboard).'}
                    </div>

                    {deviceList.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                            <div style={{ fontSize: 13, marginBottom: 8, color: 'var(--gray-600)' }}>Connected USB devices</div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {deviceList.map((device) => (
                                    <li key={`${device.vendorId}-${device.productId}`} style={{ fontSize: 13, padding: '8px 10px', border: '1px solid var(--gray-200)', borderRadius: 6, marginBottom: 6 }}>
                                        {device.productName || 'Unknown USB Device'} ({device.vendorId}:{device.productId})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 8 }}>
                        {selectedDevice === 'keyboard-scanner' && 'Device sends keyboard characters as scanned barcode value; press ENTER after scan.'}
                        {selectedDevice === 'manual-entry' && 'Manual entry mode disables automatic keyboard capture; use manual forms.'}
                        {selectedDevice === 'none' && 'Scanning is disabled, no automatic capture occurs.'}
                    </div>
                </div>
            </div>

            {/* Other Settings Placeholder */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--blue-900)' }}>System Preferences</div>
                    <div style={{ fontSize: 14, color: 'var(--gray-600)', marginTop: 4 }}>Additional settings will be available here.</div>
                </div>
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-400)' }}>
                    More settings coming soon...
                </div>
            </div>
        </div>
    );
}