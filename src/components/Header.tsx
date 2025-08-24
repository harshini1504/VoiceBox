"use client";

import Link from "next/link";

export default function Header() {
    return (
        <header className="header">
            <nav className="nav">
                <Link href="/" className="brand">🎤 VoiceBox</Link>
                <Link href="/analytics">Analytics</Link>
                <span className="spacer" />
                <a href="/api/auth/signin">Sign in</a>
                <a href="/api/auth/signout">Sign out</a>
            </nav>
        </header>
    );
}
