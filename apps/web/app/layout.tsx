import './styles/globals.css';
import RootLayoutClient from './RootLayoutClient';

export const metadata = {
  title: 'able',
  description: 'able application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
