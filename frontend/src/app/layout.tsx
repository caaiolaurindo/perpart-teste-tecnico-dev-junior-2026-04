import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { UiProvider, LayoutProvider } from '@uigovpe/components';
import '@uigovpe/styles';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sistema de Gestão',
  description: 'Desafio Técnico PerPart',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body 
        className={inter.className} 
        style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <LayoutProvider>
          <UiProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </UiProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}