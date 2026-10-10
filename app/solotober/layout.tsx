import { Metadata } from 'next';

const SolotoberLayout = ({ children }: LayoutProps<'/solotober'>) => (
  <>
    <h1>Solotober entry generator</h1>

    {children}
  </>
);

export default SolotoberLayout;

export const metadata: Metadata = {
  title: 'Solotober entry generator',
};
