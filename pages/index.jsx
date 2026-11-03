import Head from 'next/head';

const columns = [
  { duration: '54s', images: ['ascopa-mexico.jpg', 'dragon.jpg', 'century.jpg', 'mountain.jpg', 'w-zzrd.jpg', 'matchday.jpg'] },
  { duration: '63s', images: ['mountain.jpg', 'w-zzrd.jpg', 'matchday.jpg', 'xslazuri.jpg', 'keeper.jpg', 'killzoneshade.jpg'] },
  { duration: '72s', images: ['xslazuri.jpg', 'keeper.jpg', 'killzoneshade.jpg', 'manga-gw1.jpg', 'neon-street.jpg', 'ascopa-mexico.jpg'] },
  { duration: '54s', images: ['manga-gw1.jpg', 'neon-street.jpg', 'ascopa-mexico.jpg', 'dragon.jpg', 'century.jpg', 'mountain.jpg'] },
  { duration: '63s', images: ['dragon.jpg', 'century.jpg', 'mountain.jpg', 'w-zzrd.jpg', 'matchday.jpg', 'xslazuri.jpg'] },
  { duration: '72s', images: ['w-zzrd.jpg', 'matchday.jpg', 'xslazuri.jpg', 'keeper.jpg', 'killzoneshade.jpg', 'manga-gw1.jpg'] },
  { duration: '54s', images: ['keeper.jpg', 'killzoneshade.jpg', 'manga-gw1.jpg', 'neon-street.jpg', 'ascopa-mexico.jpg', 'dragon.jpg'] },
  { duration: '63s', images: ['neon-street.jpg', 'ascopa-mexico.jpg', 'dragon.jpg', 'century.jpg', 'mountain.jpg', 'w-zzrd.jpg'] },
];

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function Wallpaper() {
  return (
    <div className="wall" aria-hidden="true">
      <div className="wallrot">
        {columns.map((column, columnIndex) => (
          <div className="wcol" key={columnIndex} style={{ '--d': column.duration }}>
            {[...column.images, ...column.images].map((image, imageIndex) => (
              <div className="wtile" key={`${columnIndex}-${imageIndex}`} style={{ backgroundImage: `url(/static/gfx/${image})` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome · Virtual Football</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Connect your Discord and Roblox accounts with Virtual Football." />
        <meta name="theme-color" content="#08080d" />
        <link rel="icon" href="/static/vf-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Barlow+Condensed:wght@500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <Wallpaper />
      <header>
        <a className="brand" href="#home">
          <img src="/static/vf-icon.png" alt="" />
          <span>Virtual Football</span>
        </a>
      </header>

      <main id="home">
        <section className="onboard" aria-labelledby="welcome-title">
          <img className="mark" src="/static/vf-icon.png" alt="Virtual Football" />
          <span className="kicker">Account linking</span>
          <h1 id="welcome-title">Welcome to Virtual Football</h1>
          <p className="sub">Connect your Discord and Roblox accounts. It takes about 30 seconds.</p>

          <div className="steps" aria-label="Account linking steps">
            <div className="step now"><div className="n">1</div><div className="l">Discord</div></div>
            <div className="bar" />
            <div className="step"><div className="n">2</div><div className="l">Roblox</div></div>
            <div className="bar" />
            <div className="step"><div className="n">3</div><div className="l">Done</div></div>
          </div>

          <ul className="perks">
            <li><i>★</i><span>Your Discord roles match your in-game rank, automatically</span></li>
            <li><i>✎</i><span>Your server nickname is set to your Roblox username</span></li>
            <li><i>⚽</i><span>See your club, level and progress in one place</span></li>
          </ul>

          <div className="btns">
            <button className="btn discord" type="button"><DiscordIcon />Continue with Discord</button>
          </div>

          <div className="trust">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            You log in on Discord&apos;s own site. We never see your password.
          </div>
        </section>
      </main>

      <footer>Virtual Football · <span>Terms &amp; Privacy</span></footer>
    </>
  );
}
