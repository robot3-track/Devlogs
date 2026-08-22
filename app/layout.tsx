import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'DevLogs - Project Journal & Submission Generator',
  description: 'Spacious and straightforward project journaling tool for student developers to generate GitHub READMEs and Devpost stories.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
