"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Navbar.module.css";

const NAV_ITEMS = [
    { label: "About", href: "#about" },
    { label: "Team", href: "#team" },
    { label: "Events", href: "#events" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
                <div className={styles.navContainer}>
                    <a href="#" className={styles.logo}>
                        <div className={styles.logoIcon}>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/media/logo.png`}
                                alt="Robotics Club Logo"
                                width={32}
                                height={32}
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                        Robotics Club
                    </a>

                    <div className={styles.navLinks}>
                        {NAV_ITEMS.map((item) => (
                            <a key={item.href} href={item.href} className={styles.navLink}>
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <div className={styles.navActions}>
                        <a href="/login" className={styles.btnSecondary}>
                            Login
                        </a>
                        <a href="/join-us" className={styles.btnPrimary}>
                            Join Us
                        </a>
                    </div>

                    <button
                        className={styles.hamburger}
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <span className={styles.hamburgerLine} />
                        <span className={styles.hamburgerLine} />
                        <span className={styles.hamburgerLine} />
                    </button>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ""}`}>
                <button
                    className={styles.closeBtn}
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                >
                    ✕
                </button>
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className={styles.mobileLink}
                        onClick={() => setMobileOpen(false)}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </>
    );
}
