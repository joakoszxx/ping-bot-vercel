import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

function BrandMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M9 6h25l6 7H16l-7-7Z" fill="currentColor" />
      <path d="m7 14 7-4 17 27-7 5L7 14Z" fill="currentColor" />
      <path d="m22 17 19 1-17 24-5-7 10-14-11 1 4-5Z" fill="currentColor" />
    </svg>
  );
}

function DiscordMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.7 5.3a18 18 0 0 0-4.4-1.4l-.6 1.2a16.7 16.7 0 0 0-5.4 0l-.6-1.2a18 18 0 0 0-4.4 1.4C1.5 9.4.8 13.4 1.2 17.3a18 18 0 0 0 5.4 2.7l1.2-2a11.6 11.6 0 0 1-1.9-.9l.5-.4a12.8 12.8 0 0 0 11.2 0l.5.4a11.6 11.6 0 0 1-1.9.9l1.2 2a18 18 0 0 0 5.4-2.7c.5-4.5-.8-8.5-3.1-12Zm-11.3 9.9c-1.1 0-2-.9-2-2.1s.9-2.1 2-2.1 2 .9 2 2.1-.9 2.1-2 2.1Zm7.2 0c-1.1 0-2-.9-2-2.1s.9-2.1 2-2.1 2 .9 2 2.1-.9 2.1-2 2.1Z" />
    </svg>
  );
}

export default function Home() {
  const [notice, setNotice] = useState('');

  return (
    <>
      <Head>
        <title>Virtual Football — Account Linking</title>
        <meta name="description" content="Connect your Discord and Roblox accounts with Virtual Football." />
        <meta name="theme-color" content="#000000" />
      </Head>

      <main className={styles.page}>
        <header className={styles.header}>
          <a className={styles.brand} href="#home" aria-label="Virtual Football home">
            <BrandMark className={styles.brandMark} />
            <span>Virtual Football</span>
          </a>
        </header>

        <section className={styles.content} id="home" aria-labelledby="welcome-title">
          <div className={styles.card}>
            <div className={styles.cardGlow} aria-hidden="true" />
            <BrandMark className={styles.heroMark} />

            <p className={styles.eyebrow}>ACCOUNT LINKING</p>
            <h1 id="welcome-title">Welcome to Virtual Football</h1>
            <p className={styles.subtitle}>
              Connect your Discord and Roblox accounts. It takes about 30 seconds.
            </p>

            <div className={styles.steps} aria-label="Account linking progress">
              <div className={`${styles.step} ${styles.activeStep}`}>
                <span className={styles.stepNumber}>1</span>
                <span className={styles.stepName}>Discord</span>
              </div>
              <span className={styles.connector} />
              <div className={styles.step}>
                <span className={styles.stepNumber}>2</span>
                <span className={styles.stepName}>Roblox</span>
              </div>
              <span className={styles.connector} />
              <div className={styles.step}>
                <span className={styles.stepNumber}>3</span>
                <span className={styles.stepName}>Done</span>
              </div>
            </div>

            <ul className={styles.benefits}>
              <li><span className={styles.benefitIcon}>✦</span><span>Your Discord roles match your in-game rank, automatically</span></li>
              <li><span className={styles.benefitIcon}>⌁</span><span>Your server nickname is set to your Roblox username</span></li>
              <li><span className={styles.benefitIcon}>◉</span><span>See your club, level and progress in one place</span></li>
            </ul>

            <button
              className={styles.discordButton}
              type="button"
              onClick={() => setNotice('Discord sign-in will be connected when OAuth is configured.')}
            >
              <DiscordMark />
              Continue with Discord
            </button>
            {notice && <p className={styles.notice} role="status">{notice}</p>}

            <p className={styles.privacy}><span aria-hidden="true">♙</span> You log in on Discord&apos;s own site. We never see your password.</p>
          </div>
        </section>

        <footer className={styles.footer}>Virtual Football <span>·</span> Terms &amp; Privacy</footer>
      </main>
    </>
  );
}
