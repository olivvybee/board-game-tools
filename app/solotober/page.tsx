import { ConfigForm } from './ConfigForm/ConfigForm';

const SolotoberPage = () => {
  return (
    <>
      <p>
        Enter your BGG username to generate stats and daily logs for Solotober
        using your logged plays. The tool will generate markup that can be
        pasted into a post on BGG with the correct formatting.
      </p>

      <ConfigForm />
    </>
  );
};

export default SolotoberPage;
