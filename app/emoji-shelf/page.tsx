import { EmojiShelfBuilder } from './EmojiShelfBuilder';

const EmojiShelfPage = () => (
  <>
    <h1>Emoji shelf builder</h1>

    <p>
      An easy way to generate a shelf for{' '}
      <a href="https://boardgamegeek.com/geeklist/344710/solitaire-games-on-your-table-november-2024">
        SGOYT November 2024
      </a>
      . Simply choose the size of your shelf, enter an emoji into each section,
      and copy the BGG code generated below.
    </p>

    <p>
      If you use the same device each time you want to update your shelf, the
      previous layout of your shelf will be saved when you come back.
    </p>

    <p>
      If you're unsure how to enter emojis, you could either copy and paste them
      from a website like <a href="https://emojipedia.org">Emojipedia</a>, or
      you could enter letters as placeholders and then replace them in the BGG
      interface using the emoji picker there.
    </p>

    <EmojiShelfBuilder />
  </>
);

export default EmojiShelfPage;

export const metadata = {
  title: 'Emoji shelf builder',
  description: 'Build a shelf for the November 2024 SGOYT thread.',
};
