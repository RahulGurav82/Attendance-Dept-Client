import React, { useState } from 'react';

const BiometricCapture = ({ onCapture, fingerprintNumber }) => {
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const startFingerprint = async () => {
        try {
            // Check if the browser supports WebAuthn
            if (!window.PublicKeyCredential) {
                throw new Error('WebAuthn is not supported by this browser');
            }

            // Check if biometric authentication is available
            const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            if (!available) {
                throw new Error('Biometric authentication is not available');
            }

            setStatus('Scanning fingerprint...');

            // Create challenge
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            // Create credential options
            const credentialCreationOptions = {
                publicKey: {
                    challenge: challenge,
                    rp: {
                        name: "Department App",
                        id: window.location.hostname
                    },
                    user: {
                        id: Uint8Array.from(
                            "STUDENT_ID", c => c.charCodeAt(0)
                        ),
                        name: "student@example.com",
                        displayName: "Student"
                    },
                    pubKeyCredParams: [{
                        type: "public-key",
                        alg: -7
                    }],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        requireResidentKey: false,
                        userVerification: "required"
                    },
                    timeout: 60000,
                    attestation: "direct"
                }
            };

            // Create credentials
            const credential = await navigator.credentials.create(credentialCreationOptions);
            
            // Convert ArrayBuffer to Base64 string for storage
            const attestationObj = credential.response.attestationObject;
            const attestationBase64 = btoa(String.fromCharCode(...new Uint8Array(attestationObj)));

            setStatus('Fingerprint captured successfully!');
            onCapture(attestationBase64, fingerprintNumber);

        } catch (err) {
            console.error('Fingerprint capture error:', err);
            setError(err.message);
            setStatus('');
        }
    };

    return (
        <div className="mb-4">
            <button
                type="button"
                onClick={startFingerprint}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Capture Fingerprint {fingerprintNumber}
            </button>
            {status && (
                <p className="text-green-600 mt-2 text-sm">
                    {status}
                </p>
            )}
            {error && (
                <p className="text-red-600 mt-2 text-sm">
                    Error: {error}
                </p>
            )}
        </div>
    );
};

export default BiometricCapture;
