export const metadata = {
  title: "Notion to RSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={process.env.N2R_LANGUAGE || "zh-CN"}>
      <body>{children}</body>
    </html>
  );
}
