import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase:new URL('https://oyasumi-tetsuzuki-navi.kh4yjrzrf8.chatgpt.site'),
  title:'おやすみ手続きナビ｜相続の初期整理を、ひとつずつ。',
  description:'大切な方を亡くされた直後に、今日やること・期限・必要書類・相談先を整理する無料サービスです。',
  openGraph:{title:'おやすみ手続きナビ',description:'相続の初期整理を、ひとつずつ。',type:'website',images:[{url:'/og.png',width:1200,height:630,alt:'おやすみ手続きナビ'}]},
  twitter:{card:'summary_large_image',title:'おやすみ手続きナビ',description:'相続の初期整理を、ひとつずつ。',images:['/og.png']}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}</body></html>}
