// Importing global CSS styles.
import "./globals.css";

// Importing the Metadata type from Next.js.
import type { Metadata } from "next";

// Defining metadata for SEO purposes.
export const metadata: Metadata = {
  title: "Nex Digital App", // Application title.
  description: "Full-stack challenge", // Application description.
};

// RootLayout component wraps the app's content and defines the HTML structure.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // Represents the content to be rendered inside the layout.
}) {
  return (
    // Sets the document language to Brazilian Portuguese.
    <html lang="pt-BR"> 
      <body>{children}</body>
    </html>
    // Renders the children passed to the layout.
  );
}