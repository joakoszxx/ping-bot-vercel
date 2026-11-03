import Head from 'next/head';
import styles from '../styles/Home.module.css';

const inviteUrl =
  'https://discord.com/oauth2/authorize?client_id=1566159374613872730&permissions=0&scope=bot%20applications.commands';

export default function Home() {
  return (
    <>
      <Head>
        <title>Ping Bot — Discord</title>
        <meta
          name="description"
          content="Un bot simple para comprobar la conexión de tu servidor de Discord."
        />
          <meta name="theme-color" content="#090b10" />
      </Head>

      <main className={styles.page}>
        <nav className={styles.nav} aria-label="Navegación principal">
          <a className={styles.brand} href="#inicio" aria-label="Ping Bot, inicio">
            <span className={styles.brandIcon} aria-hidden="true">P</span>
            <span>ping<span className={styles.brandAccent}>bot</span></span>
          </a>
          <a className={styles.navLink} href="#comando">Comando</a>
          <a className={styles.navInvite} href={inviteUrl} target="_blank" rel="noreferrer">
            Añadir a Discord <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <section className={styles.hero} id="inicio">
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span className={styles.liveDot} />
              BOT DE DISCORD
            </div>
            <h1>Un ping.<br /><span>Y listo.</span></h1>
            <p className={styles.intro}>
              Comprueba que todo esté en marcha con un solo comando. Ligero,
              rápido y sin complicaciones.
            </p>
            <div className={styles.actions}>
              <a className={styles.primaryButton} href={inviteUrl} target="_blank" rel="noreferrer">
                Añadir a mi servidor <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.textButton} href="#comando">Ver el comando <span aria-hidden="true">↓</span></a>
            </div>
            <div className={styles.hostingNote}>
              <span className={styles.hostingMark} aria-hidden="true">▲</span>
              Backend desplegado en Vercel
            </div>
          </div>

          <div className={styles.preview} aria-label="Vista previa del comando ping">
            <div className={styles.previewTop}>
              <div className={styles.windowDots}><i /><i /><i /></div>
              <span>discord · #general</span>
              <span className={styles.lock} aria-hidden="true">⌑</span>
            </div>
            <div className={styles.chat}>
              <div className={styles.userLine}>
                <div className={styles.avatar}>J</div>
                <div><strong>joako</strong><span className={styles.timestamp}>hoy a las 12:34</span></div>
              </div>
              <div className={styles.commandBubble}><span className={styles.slash}>/</span> ping</div>
              <div className={styles.botLine}>
                <div className={styles.botAvatar}>P</div>
                <div className={styles.reply}>
                  <div className={styles.botName}>pingbot <span className={styles.appTag}>APP</span></div>
                  <p>🏓 ¡Pong! El bot está en línea.</p>
                  <div className={styles.latency}><span /> respuesta instantánea</div>
                </div>
              </div>
            </div>
            <div className={styles.previewFoot}><span>●</span> SIMPLE POR DISEÑO <span className={styles.footRight}>01 / 01</span></div>
          </div>
          <div className={styles.heroGlow} aria-hidden="true" />
        </section>

        <section className={styles.commandSection} id="comando">
          <div>
            <div className={styles.sectionLabel}>EL ÚNICO COMANDO</div>
            <h2>Todo en orden,<br />en un instante.</h2>
          </div>
          <div className={styles.commandCard}>
            <div className={styles.commandCardTop}><span>COMANDO</span><span>01</span></div>
            <div className={styles.commandName}><span>/</span> ping</div>
            <p>Úsalo en cualquier canal y recibe una confirmación inmediata.</p>
            <div className={styles.commandDivider} />
            <div className={styles.commandResult}><span className={styles.resultCheck}>✓</span><span>Respuesta</span><strong>¡Pong! El bot está en línea.</strong></div>
          </div>
        </section>

        <footer className={styles.footer}>
          <a className={styles.brand} href="#inicio"><span className={styles.brandIcon} aria-hidden="true">P</span><span>ping<span className={styles.brandAccent}>bot</span></span></a>
          <span>Hecho para responder. Nada más.</span>
          <a href={inviteUrl} target="_blank" rel="noreferrer">Invitar bot ↗</a>
        </footer>
      </main>
    </>
  );
}
