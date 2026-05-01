import './globals.css';

export const metadata = {
    title: 'N. Harish Vidyarth — Cybersecurity Researcher & Developer',
    description: 'Portfolio of N. Harish Vidyarth — B.E. CSE (Cyber Security), emerging parallel computing researcher, SCI-published author, musician, and 2nd Dan Black Belt.',
    icons: {
        icon: 'https://cdn.prod.website-files.com/683703490bc01e1b8c052e06/68381362603d6402ee03c00e_favicon.png',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <script dangerouslySetInnerHTML={{ __html: "if('scrollRestoration'in history)history.scrollRestoration='manual';" }} />
            </head>
            <body>{children}</body>
        </html>
    );
}
