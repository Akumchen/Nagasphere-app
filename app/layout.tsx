import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'NagaSphere', description: 'A local marketplace for Nagaland — What you need. Someone here has it.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
