import Head from 'next/head';
import styles from '../styles/Home.module.css';

const steps = [
  ['01', 'Crea la aplicación', 'En Discord Developer Portal, crea una aplicación y copia su Public Key.'],
  ['02', 'Configura Vercel', 'Importa este proyecto y guarda DISCORD_PUBLIC_KEY en Environment Variables.'],
  ['03', 'Publica /ping', 'Añade la URL /api/interactions a Discord y ejecuta el registro del comando.'],
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Ping Bot — un bot, un comando</title>
        <meta name="description" content="Un bot de Discord sencillo: responde Pong al comando /ping." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#101216" />
      </Head>
      <main className={styles.page}>
        <nav className={styles.nav}>
          <a className={styles.brand} href="#top"><span className={styles.brandIcon}>↗</span> ping<span className={styles.brandDim}>bot</span></a>
          <a className={styles.navLink} href="#como-funciona">Cómo funciona <span aria-hidden="true">↘</span></a>
        </nav>

        <section className={styles.hero} id="top">
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}><span className={styles.liveDot} /> BOT DE DISCORD · VERCEL</div>
            <h1>Una pregunta.<br /><span>Un pong.</span></h1>
            <p className={styles.lead}>Un bot pequeño que hace exactamente una cosa: responder cuando alguien escribe <code>/ping</code>.</p>
            <a className={styles.cta} href="#como-funciona">Ponerlo en marcha <span aria-hidden="true">↗</span></a>
            <p className={styles.note}>Sin servidor permanente. Las interacciones llegan por HTTPS.</p>
          </div>

          <div className={styles.preview} aria-label="Vista previa de respuesta del bot">
            <div className={styles.windowBar}><div className={styles.windowDots}><i /><i /><i /></div><span># general</span><span className={styles.windowMenu}>···</span></div>
            <div className={styles.chat}>
              <div className={styles.message}>
                <div className={styles.avatar}>T</div>
                <div><div className={styles.messageMeta}>tú <span>ahora</span></div><div className={styles.command}><span className={styles.slash}>/</span> ping</div></div>
              </div>
              <div className={`${styles.message} ${styles.reply}`}>
                <div className={`${styles.avatar} ${styles.botAvatar}`}>↗</div>
                <div><div className={styles.messageMeta}>pingbot <b>APP</b> <span>ahora</span></div><div className={styles.response}><span>🏓</span> ¡Pong! El bot está en línea.</div></div>
              </div>
            </div>
            <div className={styles.composer}><span>Enviar mensaje a #general</span><span className={styles.sendIcon}>↑</span></div>
            <div className={styles.previewFoot}><span className={styles.liveDot} /> RESPUESTA EN TIEMPO REAL</div>
          </div>
          <div className={styles.heroIndex}>01 <span>/</span> 01</div>
        </section>

        <section className={styles.how} id="como-funciona">
          <div className={styles.sectionHead}><div><div className={styles.eyebrow}>DIRECTO AL PUNTO</div><h2>Listo en tres pasos.</h2></div><p>Vercel recibe el comando y Discord muestra la respuesta. La firma se valida en cada solicitud.</p></div>
          <div className={styles.steps}>{steps.map(([number, title, detail]) => <article className={styles.step} key={number}><span className={styles.stepNumber}>{number}</span><h3>{title}</h3><p>{detail}</p></article>)}</div>
        </section>

        <footer className={styles.footer}><a className={styles.brand} href="#top"><span className={styles.brandIcon}>↗</span> ping<span className={styles.brandDim}>bot</span></a><span>Hecho para responder: Pong.</span><a href="https://vercel.com" target="_blank" rel="noreferrer">Desplegado con Vercel ↗</a></footer>
      </main>
    </>
  );
}
