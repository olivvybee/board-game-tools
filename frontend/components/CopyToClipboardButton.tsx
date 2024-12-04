import { useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { IoCheckmark, IoCopyOutline } from 'react-icons/io5';

import { Button } from './Button';

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

  return (
    <Button icon={hasCopied ? IoCheckmark : IoCopyOutline} onClick={onClick}>
      {hasCopied ? 'Copied' : text}
    </Button>
  );
};
