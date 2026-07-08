'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    // Basic E.164 formatting check
    let formattedPhone = phone;
    if (!phone.startsWith('+')) {
      // Default to Syria if no plus, just for UX (adjust as needed)
      formattedPhone = `+963${phone.replace(/^0+/, '')}`;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/whatsapp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setPhone(formattedPhone); // store formatted for next step
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn('whatsapp', {
        phone,
        code,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Invalid or expired code. Please try again.');
      }

      if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/">
            <Image
              src="/logo.svg" // Fallback logo if you don't have one, or make sure /logo.svg exists
              alt="Halahello"
              width={48}
              height={48}
              className={styles.logo}
            />
          </Link>
          <h1 className={styles.title}>
            {step === 'phone' ? t('authLoginTitle') : t('authOTPTitle')}
          </h1>
          <p className={styles.subtitle}>
            {step === 'phone' ? t('authLoginSub') : t('authOTPSub')}
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            <span>⚠️</span>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                {t('authPhoneLabel')}
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('authPhonePlaceholder')}
                className={styles.input}
                required
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              className={styles.button}
              disabled={loading || !phone}
            >
              {loading ? (
                <>
                  <span className={styles.loader}></span> {t('authLoading')}
                </>
              ) : (
                t('authSendOTP')
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className={styles.form}>
            <div className={styles.otpInputContainer} dir="ltr">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`${styles.input} ${styles.otpDigit}`}
                  autoFocus={index === 0}
                  required
                />
              ))}
            </div>
            <button
              type="submit"
              className={styles.button}
              disabled={loading || otp.join('').length !== 6}
            >
              {loading ? (
                <>
                  <span className={styles.loader}></span> {t('authLoading')}
                </>
              ) : (
                t('authVerifyBtn')
              )}
            </button>
            <button
              type="button"
              className={styles.resendBtn}
              onClick={(e) => {
                setOtp(['', '', '', '', '', '']);
                handleSendOTP(e);
              }}
              disabled={loading}
            >
              {t('authResendBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
