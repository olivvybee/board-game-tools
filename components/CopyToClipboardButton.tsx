import { useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

export interface CopyToClipboardButtonProps {
  value: string;
  text?: string;
}

export const CopyToClipboardButton = ({
  value,
  text = 'Copy',
}: CopyToClipboardButtonProps) => {
  const [_, copyToClipboard] = useCopyToClipboard();
  const [hasCopied, setHasCopied] = useState(false);

  const onClick = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setHasCopied(true);
    }
    setTimeout(() => {
      setHasCopied(false);
    }, 3000);
  };

  return <button onClick={onClick}>{hasCopied ? 'Copied' : text}</button>;
};
