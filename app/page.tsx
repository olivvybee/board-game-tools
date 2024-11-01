import Link from 'next/link';

const Homepage = () => (
  <div>
    <h1>Board game tools</h1>

    <p>
      A better homepage is coming soon, but in the meantime here are the tools:
    </p>

    <ul>
      <li>
        <a href="https://yibg.boardgametools.app">Year in board games</a>
      </li>
      <li>
        <Link href="/emoji-shelf">Emoji shelf builder</Link>
      </li>
    </ul>
  </div>
);

export default Homepage;
