import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppProviders } from '@/components/app-providers'
import './globals.css'

/** Chỉ subset cần cho UI tiếng Việt — bớt file preload so với latin-ext thừa. */
const interSans = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-ui-sans',
  adjustFontFallback: true,
  display: 'swap',
})

/**
 * Mono chỉ dùng chỗ ít (mã lệnh, v.v.) — `preload: false` tránh cảnh báo
 * “preloaded but not used” vì trình duyệt preload trước khi có node `font-mono`.
 */
const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-ui-mono',
  adjustFontFallback: true,
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: 'Báo cáo sản lượng & chi phí kiểm đếm | Hệ thống Kiểm Đếm',
  description:
    'Báo cáo sản lượng (SL) và chi phí (CP) theo tuần/tháng, chi nhánh — tổng hợp từ Báo cáo tuần / Báo cáo tháng',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${interSans.variable} ${jbMono.variable} bg-background`}>
      <body className="font-sans font-normal antialiased">
        <AppProviders>{children}</AppProviders>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
