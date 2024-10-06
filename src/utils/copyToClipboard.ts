import { toast } from 'sonner';

export const copyToClipboard = (content: string) => {
  navigator.clipboard.writeText(content);
  toast.success('Copied to clipboard!');
};
