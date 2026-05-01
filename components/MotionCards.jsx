"use client";

import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(InertiaPlugin, ScrollTrigger);

export default function MotionCards() {
    const sectionRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Inertia on cards
            const cards = document.querySelectorAll(".motion-card__card");
            cards.forEach((card) => {
                let lastX = 0;
                let lastY = 0;
                let speedX = 0;
                let speedY = 0;

                const startRotation = gsap.getProperty(card, "rotation");
                const startX = gsap.getProperty(card, "x");
                const startY = gsap.getProperty(card, "y");

                const onMove = (e) => {
                    speedX = e.clientX - lastX;
                    speedY = e.clientY - lastY;
                    lastX = e.clientX;
                    lastY = e.clientY;
                };

                const onEnter = (e) => {
                    speedX = 0;
                    speedY = 0;
                    lastX = e.clientX;
                    lastY = e.clientY;
                };

                const onLeave = () => {
                    gsap.to(card, {
                        inertia: {
                            x: { velocity: speedX * 20, end: startX },
                            y: { velocity: speedY * 20, end: startY },
                            rotation: { velocity: speedX * 1.5, end: startRotation },
                        },
                    });
                };

                card.addEventListener("mousemove", onMove);
                card.addEventListener("mouseenter", onEnter);
                card.addEventListener("mouseleave", onLeave);
            });

            // Project popout — hover on desktop, tap on mobile
            const cardEls = sectionRef.current.querySelectorAll(".motion-card__card");
            const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;

            const openPopout = (card) => {
                const popout = card.querySelector(".card-popout");
                const items  = card.querySelectorAll(".pop-item");
                gsap.set(card, { zIndex: 100 });
                gsap.set(popout, { visibility: "visible", pointerEvents: "auto" });
                gsap.fromTo(popout,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.55, ease: "expo.out", transformOrigin: "top center" }
                );
                gsap.fromTo(items,
                    { y: 10, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: "power3.out", delay: 0.15 }
                );
                popout.classList.add("card-popout--visible");
            };

            const closePopout = (card) => {
                const popout = card.querySelector(".card-popout");
                const items  = card.querySelectorAll(".pop-item");
                gsap.set(card, { zIndex: "" });
                gsap.to(items,  { y: 8, opacity: 0, duration: 0.1, ease: "power2.in" });
                gsap.to(popout, {
                    scale: 0, opacity: 0, duration: 0.2, ease: "expo.in",
                    transformOrigin: "top center",
                    onComplete: () => {
                        gsap.set(popout, { visibility: "hidden", pointerEvents: "none" });
                        popout.classList.remove("card-popout--visible");
                    }
                });
            };

            cardEls.forEach((card) => {
                if (isMobileDevice) {
                    // Tap to toggle on mobile
                    card.addEventListener("click", () => {
                        const isOpen = card.querySelector(".card-popout").classList.contains("card-popout--visible");
                        // Close all first
                        cardEls.forEach(c => {
                            if (c.querySelector(".card-popout").classList.contains("card-popout--visible")) closePopout(c);
                        });
                        if (!isOpen) openPopout(card);
                    });
                } else {
                    card.addEventListener("mouseenter", () => openPopout(card));
                    card.addEventListener("mouseleave", () => closePopout(card));
                }
            });

            // Inertia on floating labels
            const labels = document.querySelectorAll(".motion-card__floating-label");
            labels.forEach((label) => {
                let lastX = 0;
                let lastY = 0;
                let speedX = 0;
                let speedY = 0;

                const startRotation = gsap.getProperty(label, "rotation");
                const startX = gsap.getProperty(label, "x");
                const startY = gsap.getProperty(label, "y");

                const onMove = (e) => {
                    speedX = e.clientX - lastX;
                    speedY = e.clientY - lastY;
                    lastX = e.clientX;
                    lastY = e.clientY;
                };

                const onEnter = (e) => {
                    speedX = 0;
                    speedY = 0;
                    lastX = e.clientX;
                    lastY = e.clientY;
                };

                const onLeave = () => {
                    gsap.to(label, {
                        inertia: {
                            x: { velocity: speedX * 25, end: startX },
                            y: { velocity: speedY * 25, end: startY },
                            rotation: { velocity: speedX * 2, end: startRotation },
                        },
                    });
                };

                label.addEventListener("mousemove", onMove);
                label.addEventListener("mouseenter", onEnter);
                label.addEventListener("mouseleave", onLeave);
            });

            // Entry Animations: Sticker Pop & Underline Draw
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            });

            const topStickerImg = sectionRef.current.querySelector(".motion-card__sticker--top img");
            if (topStickerImg) {
                gsap.set(topStickerImg, { scale: 0, opacity: 0, rotation: -30 });
                tl.to(topStickerImg, { scale: 1, opacity: 1, rotation: 0, duration: 1.7, ease: "elastic.out(1, 0.4)" }, 0);
            }

            const underlinePath = sectionRef.current.querySelector(".motion-card__underline-path");
            if (underlinePath) {
                const pathLen = underlinePath.getTotalLength();
                gsap.set(underlinePath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
                tl.to(underlinePath, { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }, 0.2);
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="motion-card-section" id="motion-card-section">
            {/* ─── Part 1: Bold Heading Text with SVG Sticker Placeholders ─── */}
            <div className="motion-card__heading">
                <h2 className="motion-card__title">
                    a researcher built
                    <br />
                    for the future.
                </h2>
                <p className="motion-card__subtitle">
                    the math checks out. the system doesn't.
                    {/* SVG sticker placeholder — top-right area */}
                    <span className="motion-card__sticker motion-card__sticker--top">
                        <img
                            src="/assets/Footer-Sticker SVG/footer-sticker-hands.svg"
                            alt="Green heart hands sticker"
                            className="motion-card__sticker-img"
                        />
                    </span>
                </p>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 634 28" fill="none" className="motion-card__underline-svg">
                    <path className="motion-card__underline-path" d="M2 26C41.0237 23.1556 79.9927 19.9419 118.634 15.5521C169.106 9.98633 227.314 2.42393 275.206 2C280.46 2.57436 264.768 4.99488 262.462 5.55556C257.837 6.43078 252.529 7.47009 247.317 8.59146C239.594 10.3556 212.496 15.8393 226.932 19.8051C239.594 22.6359 263.663 21.9521 280.978 21.3504C314.817 19.9829 349.311 16.7419 383.204 14.7863C465.931 9.5077 549.191 10.547 632 14.1436" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {/* ─── Part 2: Cards with Colorful Bars & Blue Blob ─── */}
            <div className="motion-card__cards-area">
                {/* Blue SVG blob behind everything */}
                <div className="motion-card__blob">
                    <img
                        src="/assets/MotionCard SVG/motion-card-blob.svg"
                        alt=""
                        className="motion-card__blob-svg"
                    />
                </div>


                {/* 4 Photo Cards */}
                <div ref={containerRef} className="motion-card__cards">
                    <div className="motion-card__card motion-card__card--1">
                        <div className="motion-card__card-image">
                            <img
                                src="/assets/Image1.png"
                                loading="lazy"
                                width={1000}
                                height={1000}
                                alt=""
                                className="cover-image"
                            />
                        </div>
                        <div className="card-popout">
                            <div className="card-popout__icon">
                                <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            </div>
                            <div className="card-popout-inner">
                                <h4 className="card-popout__title pop-item">WiperX</h4>
                                <p className="card-popout__desc pop-item">Python CLI/GUI tool implementing DoD 5220.22-M multi-pass erasure. Wipes HDDs &amp; SSDs across Windows/Linux with verification — solves the gap between expensive enterprise tools and no real alternative.</p>
                                <a className="card-popout__link pop-item" href="https://github.com/harishvidyarthcsecs/WiperX" target="_blank" rel="noopener">
                                    @WiperX
                                    <svg className="card-popout__link-svg" viewBox="0 0 169 10" fill="none">
                                        <path d="M1 6.5661C56.3941 3.06082 112.187 1.20095 168 0.999878" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/>
                                        <path d="M32.1313 8.63371C68.2147 6.92799 104.462 6.13378 140.695 6.25107" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="motion-card__card motion-card__card--2">
                        <div className="motion-card__card-image">
                            <img
                                src="/assets/Image2.png"
                                loading="lazy"
                                width={1000}
                                height={1000}
                                alt=""
                                className="cover-image"
                            />
                        </div>
                        <div className="card-popout">
                            <div className="card-popout__icon">
                                <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            </div>
                            <div className="card-popout-inner">
                                <h4 className="card-popout__title pop-item">QUARTET</h4>
                                <p className="card-popout__desc pop-item">Python research toolkit computing Wiener index &amp; topological properties of biswapped networks — directly underpins the SCI Q1 paper published in Springer Nature (IF 3.9).</p>
                                <a className="card-popout__link pop-item" href="https://github.com/harishvidyarthcsecs/QUARTET" target="_blank" rel="noopener">
                                    @QUARTET
                                    <svg className="card-popout__link-svg" viewBox="0 0 169 10" fill="none">
                                        <path d="M1 6.5661C56.3941 3.06082 112.187 1.20095 168 0.999878" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/>
                                        <path d="M32.1313 8.63371C68.2147 6.92799 104.462 6.13378 140.695 6.25107" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="motion-card__card motion-card__card--3">
                        <div className="motion-card__card-image">
                            <img
                                src="/assets/Image3.png"
                                loading="lazy"
                                width={1000}
                                height={1000}
                                alt=""
                                className="cover-image"
                            />
                        </div>
                        <div className="card-popout">
                            <div className="card-popout__icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                            </div>
                            <div className="card-popout-inner">
                                <h4 className="card-popout__title pop-item">Proelium Academy</h4>
                                <p className="card-popout__desc pop-item">Live edtech platform for competitive exam prep &amp; skill development</p>
                                <a className="card-popout__link pop-item" href="https://proeliumacademy.in" target="_blank" rel="noopener">
                                    proeliumacademy.in
                                    <svg className="card-popout__link-svg" viewBox="0 0 169 10" fill="none">
                                        <path d="M1 6.5661C56.3941 3.06082 112.187 1.20095 168 0.999878" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/>
                                        <path d="M32.1313 8.63371C68.2147 6.92799 104.462 6.13378 140.695 6.25107" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="motion-card__card motion-card__card--4">
                        <div className="motion-card__card-image">
                            <img
                                src="/assets/Image4.png"
                                loading="lazy"
                                width={1000}
                                height={1000}
                                alt=""
                                className="cover-image"
                            />
                        </div>
                        <div className="card-popout">
                            <div className="card-popout__icon">
                                <svg viewBox="0 0 24 24" fill="white" width="28" height="28"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            </div>
                            <div className="card-popout-inner">
                                <h4 className="card-popout__title pop-item">check my repos</h4>
                                <p className="card-popout__desc pop-item">Open-source work in security, parallel computing &amp; more</p>
                                <a className="card-popout__link pop-item" href="https://github.com/harishvidyarthcsecs" target="_blank" rel="noopener">
                                    @harishvidyarthcsecs
                                    <svg className="card-popout__link-svg" viewBox="0 0 169 10" fill="none">
                                        <path d="M1 6.5661C56.3941 3.06082 112.187 1.20095 168 0.999878" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/>
                                        <path d="M32.1313 8.63371C68.2147 6.92799 104.462 6.13378 140.695 6.25107" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating labels — positioned freely over the cards area */}
                <div ref={containerRef} className="motion-card__floating-labels">
                    <div className="motion-card__floating-label motion-card__floating-label--pink">
                        <p className="motion-card__floating-text">security is not optional</p>
                    </div>
                    <div className="motion-card__floating-label motion-card__floating-label--orange">
                        <p className="motion-card__floating-text">graph theory is elegant</p>
                    </div>
                    <div className="motion-card__floating-label motion-card__floating-label--red">
                        <p className="motion-card__floating-text">secure wipe tool built</p>
                    </div>
                </div>
            </div>

        </section>
    );
}
