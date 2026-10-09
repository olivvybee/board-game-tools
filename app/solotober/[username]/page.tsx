import { redirect } from 'next/navigation';

const SolotoberUsernameRedirect = async ({
  params,
}: PageProps<'/solotober/[username]'>) => {
  const { username } = await params;

  const year = new Date().getUTCFullYear();

  return redirect(`/solotober/${username}/${year}`);
};

export default SolotoberUsernameRedirect;
