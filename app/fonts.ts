import localFont from "next/font/local";

export const codeNext = localFont({
    src: [
        { path: "./../public/fonts/CodeNext-Light.woff2",     weight: "300", style: "normal" },
        { path: "./../public/fonts/CodeNext-Regular.woff2",   weight: "400", style: "normal" },
        { path: "./../public/fonts/CodeNext-Bold.woff2", weight: "700", style: "normal" },
        { path: "./../public/fonts/CodeNext-ExtraBold.woff2", weight: "800", style: "normal" },
    ],
    display: "swap",
    variable: "--font-codenext",
});

export const onest = localFont({
    src: './../public/fonts/Onest.woff2',
    display: 'swap',
    variable: '--font-onest',
});