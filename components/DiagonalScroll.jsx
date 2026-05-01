'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../app/styles/diagonal-scroll.css';

const CARDS = [
    {
        num: '01', tag: 'Parallel & distributed', tagClass: 'card-tag--blue',
        titleLines: [
            { text: 'graph theory.', italic: false },
            { text: 'peer-reviewed.', italic: true },
            { text: 'production-grade.', italic: false },
        ],
        desc: 'published research on how processors talk to each other — modelled as graphs, proven with mathematics.',
        label1: 'networks have structure.', label2: 'we prove it.',
        visual: 'dots', stat1: 'IF 3.9 · Q1', stat2: 'Springer Nature',
        paperUrl: 'https://doi.org/10.1038/s41598-025-29965-5',
    },
    {
        num: '02', tag: 'Networks', tagClass: 'card-tag--orange',
        titleLines: [
            { text: 'find the crack.', italic: false },
            { text: 'seal it.', italic: true },
            { text: 'repeat.', italic: false },
        ],
        desc: 'breaking into systems legally — then writing the tools that stop others from doing the same.',
        label1: 'most miss the flaw.', label2: 'we document it.',
        visual: 'squares', stat1: 'Top 25 CTF', stat2: 'NFSU · 2026',
    },
    {
        num: '03', tag: 'Competitive', tagClass: 'card-tag--green',
        titleLines: [
            { text: '650+ teams.', italic: false },
            { text: 'one shot.', italic: true },
            { text: 'runner-up.', italic: false },
        ],
        desc: 'built real solutions under real pressure — the kind that gets you to the national stage.',
        label1: 'pressure is just', label2: 'another variable.',
        visual: 'podium', stat1: 'SIH 2024', stat2: 'National · Runner-up',
    },
    {
        num: '04', tag: 'Hands-on', tagClass: 'card-tag--pink',
        titleLines: [
            { text: 'developer by day.', italic: false },
            { text: 'investigator by context.', italic: true },
            { text: 'always shipping.', italic: false },
        ],
        desc: 'from writing backend logic to working alongside investigators — code with real-world consequence.',
        label1: 'code that runs', label2: 'where it matters.',
        visual: 'bars', stat1: 'Full Stack', stat2: 'Cyber Crime · 3Dots',
    },
    {
        num: '05', tag: 'Attitude', tagClass: 'card-tag--dark',
        titleLines: [
            { text: 'focus.', italic: false },
            { text: 'discipline.', italic: true },
            { text: 'no shortcuts.', italic: false },
        ],
        desc: 'the same mindset that earns a black belt shows up in every commit, every paper, every deadline.',
        label1: 'the mat teaches', label2: "what classrooms don't.",
        visual: 'target', stat1: '2nd Dan · WKF-B', stat2: 'discipline is a weapon',
    },
];

export default function DiagonalScroll() {
    const trackRef = useRef(null);
    const stageRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const VH = window.innerHeight;
            const N  = CARDS.length;
            const PER_CARD = VH * 1.4;
            const INTRO    = VH * 0.6;
            const TOTAL    = INTRO + N * PER_CARD + VH * 0.5;

            trackRef.current.style.height = TOTAL + 'px';
            const T = trackRef.current;

            const isMobile = window.innerWidth < 600;
            const diagX = isMobile ? '32vw' : '40vw';
            const diagY = isMobile ? '28vh' : '36vh';

            // ── Heading words fly up ──────────────────────────────────────
            const words = stageRef.current.querySelectorAll('.ds-heading-word');
            gsap.set(words, { yPercent: 110 });
            ScrollTrigger.create({
                animation: gsap.to(words, { yPercent: 0, stagger: 0.06, ease: 'none' }),
                trigger: T,
                start: () => `top+=0 top`,
                end:   () => `top+=${INTRO * 0.4} top`,
                scrub: 1, invalidateOnRefresh: true,
            });

            // ── Sub-label fade in ─────────────────────────────────────────
            const subLabel = stageRef.current.querySelector('.ds-sublabel');
            gsap.set(subLabel, { opacity: 0 });
            ScrollTrigger.create({
                animation: gsap.to(subLabel, { opacity: 1, ease: 'none' }),
                trigger: T,
                start: () => `top+=0 top`,
                end:   () => `top+=${INTRO * 0.3} top`,
                scrub: 1, invalidateOnRefresh: true,
            });

            // ── Heading fade out as first card begins ─────────────────────
            const headingEl = stageRef.current.querySelector('.ds-heading');
            ScrollTrigger.create({
                animation: gsap.to(headingEl, { opacity: 0, y: -24, ease: 'none' }),
                trigger: T,
                start: () => `top+=${INTRO * 0.65} top`,
                end:   () => `top+=${INTRO * 0.95} top`,
                scrub: 1, invalidateOnRefresh: true,
            });

            // ── Cards ─────────────────────────────────────────────────────
            const cardEls  = stageRef.current.querySelectorAll('.ds-card');
            const bgLabels = stageRef.current.querySelectorAll('.ds-bg-label');

            // Card 0 starts fully visible — no enter scroll needed
            gsap.set(cardEls[0], {
                x: 0, y: 0, scale: 1, rotation: 0,
                opacity: 1, visibility: 'visible',
                zIndex: CARDS.length,
            });
            gsap.set(bgLabels[0], { opacity: 1 });

            CARDS.forEach((c, i) => {
                const enterS = INTRO + i * PER_CARD;
                const enterE = enterS + PER_CARD * 0.46;
                const holdE  = enterS + PER_CARD * 0.54;
                const exitE  = enterS + PER_CARD;

                // Card 0 is already set visible above — skip its init/enter
                if (i > 0) {
                    gsap.set(cardEls[i], {
                        x: diagX, y: diagY, scale: 0.15, rotation: 8,
                        opacity: 0, visibility: 'hidden',
                        zIndex: N - i,
                    });

                    ScrollTrigger.create({
                        trigger: T,
                        start: () => `top+=${Math.max(0, enterS - 10)} top`,
                        onEnter:     () => gsap.set(cardEls[i], { visibility: 'visible' }),
                        onLeaveBack: () => gsap.set(cardEls[i], { visibility: 'hidden'  }),
                    });

                    ScrollTrigger.create({
                        animation: gsap.fromTo(cardEls[i],
                            { x: diagX, y: diagY, scale: 0.15, rotation: 8, opacity: 0 },
                            { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, ease: 'none' }
                        ),
                        trigger: T,
                        start: () => `top+=${enterS} top`,
                        end:   () => `top+=${enterE} top`,
                        scrub: 1,
                    });
                }

                // Sync bg label
                ScrollTrigger.create({
                    trigger: T,
                    start: () => `top+=${enterE} top`,
                    end:   () => `top+=${exitE}  top`,
                    onEnter:     () => bgLabels.forEach((lbl, li) => gsap.to(lbl, { opacity: li === i ? 1 : 0, duration: 0.3, overwrite: true })),
                    onEnterBack: () => bgLabels.forEach((lbl, li) => gsap.to(lbl, { opacity: li === i ? 1 : 0, duration: 0.3, overwrite: true })),
                });

                // Exit
                if (i < N - 1) {
                    ScrollTrigger.create({
                        animation: gsap.fromTo(cardEls[i],
                            { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, immediateRender: false },
                            { x: '-30vw', y: '-26vh', scale: 0.82, rotation: -5, opacity: 0, ease: 'none' }
                        ),
                        trigger: T,
                        start: () => `top+=${holdE} top`,
                        end:   () => `top+=${exitE} top`,
                        scrub: 1,
                    });
                }
            });

            // ── Bg label fades out after last card ────────────────────────
            const lastExit = INTRO + (N - 1) * PER_CARD + PER_CARD * 0.7;
            ScrollTrigger.create({
                animation: gsap.to(bgLabels, { opacity: 0, ease: 'none' }),
                trigger: T,
                start: () => `top+=${lastExit} top`,
                end:   () => `top+=${lastExit + VH * 0.3} top`,
                scrub: 1, invalidateOnRefresh: true,
            });

        }, trackRef);

        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener('load', onLoad);

        const t1 = setTimeout(() => ScrollTrigger.refresh(), 200);
        const t2 = setTimeout(() => ScrollTrigger.refresh(), 600);
        const t3 = setTimeout(() => ScrollTrigger.refresh(), 1200);

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    ScrollTrigger.refresh();
                    observer.disconnect();
                }
            },
            { rootMargin: '300px 0px' }
        );
        observer.observe(trackRef.current);

        return () => {
            ctx.revert();
            window.removeEventListener('load', onLoad);
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            observer.disconnect();
        };
    }, []);

    return (
        <div ref={trackRef} className="ds-track">
            <div ref={stageRef} className="ds-stage">

                {/* Heading */}
                <div className="ds-heading">
                    {['a researcher', 'built for', 'the future.'].map((line, i) => (
                        <div key={i} className="ds-heading-line">
                            <span className="ds-heading-word">{line}</span>
                        </div>
                    ))}
                    <p className="ds-sublabel">scroll to explore ↓</p>
                </div>

                {/* Cards */}
                <div className="ds-cards-stage">
                    {CARDS.map((card, i) => (
                        <div key={i} className="ds-card">
                            <div className="ds-card__bg"><CardBg index={i} /></div>
                            <div className="ds-card__top">
                                <span className="ds-card__num">{card.num}</span>
                                <span className={`ds-card__tag ${card.tagClass}`}>{card.tag}</span>
                            </div>
                            <div className="ds-card__body">
                                <h3 className="ds-card__title">
                                    {card.titleLines.map((line, li) => (
                                        <span key={li} className="ds-card__title-line">
                                            {line.italic ? <em>{line.text}</em> : line.text}
                                        </span>
                                    ))}
                                </h3>
                                <p className="ds-card__desc">{card.desc}</p>
                                {card.paperUrl && (
                                    <a href={card.paperUrl} target="_blank" rel="noopener noreferrer" className="ds-card__paper-link">
                                        Read Article
                                    </a>
                                )}
                            </div>
                            {/* Footer: tagline left, visual+stats right */}
                            <div className="ds-card__footer">
                                <div className="ds-bg-label">
                                    <div className="ds-bg-label__l1">{card.label1}</div>
                                    <div className="ds-bg-label__l2">{card.label2}</div>
                                </div>
                                <div className="ds-card__visual-wrap">
                                    <CardVisual type={card.visual} tagClass={card.tagClass} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

function CardBg({ index }) {
    if (index === 0) return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="bg0a" cx="25%" cy="75%" r="70%">
                    <stop offset="0%" stopColor="#1e0b5e"/>
                    <stop offset="100%" stopColor="#04050f"/>
                </radialGradient>
                <radialGradient id="bg0b" cx="80%" cy="20%" r="50%">
                    <stop offset="0%" stopColor="#2d1b8a" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#04050f" stopOpacity="0"/>
                </radialGradient>
                <filter id="glow0"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <rect width="1200" height="800" fill="url(#bg0a)"/>
            <rect width="1200" height="800" fill="url(#bg0b)"/>
            <circle cx="950" cy="120" r="320" fill="none" stroke="#4b69f0" strokeWidth="1" opacity="0.12"/>
            <circle cx="950" cy="120" r="220" fill="none" stroke="#6b89f0" strokeWidth="1" opacity="0.16"/>
            <circle cx="950" cy="120" r="120" fill="none" stroke="#82a0ff" strokeWidth="1.5" opacity="0.2"/>
            <line x1="900" y1="80" x2="1050" y2="200" stroke="#4b69f0" strokeWidth="1" opacity="0.35"/>
            <line x1="1050" y1="200" x2="980" y2="340" stroke="#4b69f0" strokeWidth="1" opacity="0.3"/>
            <line x1="980" y1="340" x2="1100" y2="380" stroke="#6b89f0" strokeWidth="1" opacity="0.3"/>
            <line x1="900" y1="80" x2="800" y2="160" stroke="#4b69f0" strokeWidth="1" opacity="0.25"/>
            <line x1="800" y1="160" x2="840" y2="280" stroke="#82a0ff" strokeWidth="1" opacity="0.25"/>
            <line x1="840" y1="280" x2="980" y2="340" stroke="#4b69f0" strokeWidth="1" opacity="0.2"/>
            <line x1="1050" y1="200" x2="1130" y2="150" stroke="#c4b5fd" strokeWidth="1" opacity="0.2"/>
            <line x1="1100" y1="380" x2="1180" y2="450" stroke="#4b69f0" strokeWidth="1" opacity="0.2"/>
            <line x1="800" y1="160" x2="700" y2="100" stroke="#82a0ff" strokeWidth="1" opacity="0.2"/>
            <circle cx="900" cy="80" r="7" fill="#82a0ff" opacity="0.9" filter="url(#glow0)"/>
            <circle cx="1050" cy="200" r="5" fill="#4b69f0" opacity="0.85"/>
            <circle cx="980" cy="340" r="6" fill="#a78bfa" opacity="0.8"/>
            <circle cx="1100" cy="380" r="4" fill="#82a0ff" opacity="0.7"/>
            <circle cx="800" cy="160" r="5" fill="#c4b5fd" opacity="0.75"/>
            <circle cx="840" cy="280" r="4" fill="#4b69f0" opacity="0.65"/>
            <circle cx="1130" cy="150" r="4" fill="#82a0ff" opacity="0.6"/>
            <circle cx="1180" cy="450" r="3" fill="#4b69f0" opacity="0.5"/>
            <circle cx="700" cy="100" r="5" fill="#a78bfa" opacity="0.6"/>
            <circle cx="660" cy="230" r="3" fill="#4b69f0" opacity="0.4"/>
            {[[1060,480,3],[920,550,2],[1150,520,3],[750,400,2],[620,350,2],[1050,640,3]].map(([x,y,r],i)=>(
                <circle key={i} cx={x} cy={y} r={r} fill="#82a0ff" opacity={0.25+i*0.05}/>
            ))}
            <ellipse cx="200" cy="700" rx="300" ry="150" fill="#3730a3" opacity="0.18"/>
        </svg>
    );
    if (index === 1) return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="bg1a" cx="70%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#3d1500"/>
                    <stop offset="100%" stopColor="#0a0500"/>
                </radialGradient>
                <radialGradient id="bg1b" cx="10%" cy="90%" r="50%">
                    <stop offset="0%" stopColor="#7c2d00" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#0a0500" stopOpacity="0"/>
                </radialGradient>
                <filter id="glow1"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <rect width="1200" height="800" fill="url(#bg1a)"/>
            <rect width="1200" height="800" fill="url(#bg1b)"/>
            {[
                [900,100],[970,143],[900,186],[830,143],
                [1040,186],[970,229],[1040,272],
                [1110,143],[1110,229],[1180,186],
                [830,229],[760,186],[760,272],[830,315],
                [970,315],[1040,358],[970,401],
            ].map(([x,y],i)=>{
                const pts=[0,1,2,3,4,5].map(k=>{const a=Math.PI/180*(60*k-30);return`${x+40*Math.cos(a)},${y+40*Math.sin(a)}`;}).join(' ');
                const filled=[0,2,5,8,12].includes(i);
                return <polygon key={i} points={pts} fill={filled?'#f4825c':'none'} fillOpacity={filled?0.18:0} stroke="#f4825c" strokeWidth="1" strokeOpacity={0.25+(i%3)*0.1}/>;
            })}
            <path d="M 100 600 L 300 600 L 300 500 L 500 500 L 500 550 L 650 550" fill="none" stroke="#fb923c" strokeWidth="1.5" opacity="0.25"/>
            <path d="M 200 700 L 200 640 L 380 640 L 380 580 L 550 580" fill="none" stroke="#f4825c" strokeWidth="1.5" opacity="0.2"/>
            <path d="M 50 500 L 150 500 L 150 420 L 350 420" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.15"/>
            {[[300,600],[300,500],[500,500],[650,550],[200,640],[380,640],[380,580],[150,500],[350,420]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r="4" fill="#fb923c" opacity="0.45"/>
            ))}
            <ellipse cx="1050" cy="150" rx="200" ry="160" fill="#f4825c" opacity="0.12" filter="url(#glow1)"/>
            {[[600,200,8],[700,350,5],[550,450,6],[650,150,4],[750,250,7]].map(([x,y,r],i)=>(
                <circle key={i} cx={x} cy={y} r={r} fill="#fbbf24" opacity={0.15+i*0.04}/>
            ))}
        </svg>
    );
    if (index === 2) return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="bg2a" cx="80%" cy="10%" r="70%">
                    <stop offset="0%" stopColor="#064e1a"/>
                    <stop offset="100%" stopColor="#030d06"/>
                </radialGradient>
                <radialGradient id="bg2b" cx="20%" cy="85%" r="50%">
                    <stop offset="0%" stopColor="#15803d" stopOpacity="0.35"/>
                    <stop offset="100%" stopColor="#030d06" stopOpacity="0"/>
                </radialGradient>
                <filter id="glow2"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <rect width="1200" height="800" fill="url(#bg2a)"/>
            <rect width="1200" height="800" fill="url(#bg2b)"/>
            {Array.from({length:18},(_,i)=>{
                const angle=(i/18)*Math.PI*2;
                return <line key={i} x1="1100" y1="80" x2={1100+Math.cos(angle)*700} y2={80+Math.sin(angle)*700} stroke="#4ade80" strokeWidth="1" opacity={0.06+(i%3)*0.03}/>;
            })}
            {[[750,200,12,8],[820,320,8,8],[680,410,14,8],[900,250,10,45],[600,280,7,20],[750,450,10,30],[840,180,6,60],[700,350,12,15],[880,380,8,0]].map(([x,y,w,rot],i)=>(
                <rect key={i} x={x-w/2} y={y-4} width={w} height={7} fill={['#4ade80','#b7f0b1','#a3e635','#fde047','#86efac'][i%5]} opacity={0.35+i*0.03} transform={`rotate(${rot},${x},${y})`} rx="2"/>
            ))}
            <polygon points="980,550 1020,460 1060,550" fill="none" stroke="#4ade80" strokeWidth="1.5" opacity="0.3"/>
            <polygon points="1020,460 1060,380 1100,460" fill="none" stroke="#a3e635" strokeWidth="1.5" opacity="0.25"/>
            {[[620,160,4],[700,200,3],[780,140,5],[860,220,3],[940,160,4],[680,280,3],[820,290,4]].map(([x,y,r],i)=>(
                <circle key={i} cx={x} cy={y} r={r} fill="#b7f0b1" opacity={0.3+i*0.04}/>
            ))}
            <ellipse cx="150" cy="680" rx="250" ry="130" fill="#15803d" opacity="0.2" filter="url(#glow2)"/>
            <rect x="1020" y="680" width="60" height="90" fill="#4ade80" opacity="0.08"/>
            <rect x="960" y="710" width="55" height="60" fill="#4ade80" opacity="0.06"/>
            <rect x="1085" y="730" width="55" height="40" fill="#4ade80" opacity="0.05"/>
        </svg>
    );
    if (index === 3) return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="bg3a" cx="60%" cy="40%" r="70%">
                    <stop offset="0%" stopColor="#3b0a4a"/>
                    <stop offset="100%" stopColor="#0a0010"/>
                </radialGradient>
                <radialGradient id="bg3b" cx="15%" cy="80%" r="55%">
                    <stop offset="0%" stopColor="#701a75" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#0a0010" stopOpacity="0"/>
                </radialGradient>
                <filter id="glow3"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <rect width="1200" height="800" fill="url(#bg3a)"/>
            <rect width="1200" height="800" fill="url(#bg3b)"/>
            {[[820,100,'{',28],[940,160,'}',24],[1060,80,'<',30],[880,260,'/>',20],[1000,220,'=',32],[1100,160,';',36],[800,360,'()',22],[950,400,'&&',18],[1080,340,'[]',24],[1150,240,'fn',20],[820,480,'///',16],[700,300,'*',30]].map(([x,y,sym,size],i)=>(
                <text key={i} x={x} y={y} fontSize={size} fill={['#f0abfc','#e879f9','#d946ef','#f5b8d4','#c026d3'][i%5]} opacity={0.15+i*0.02} fontFamily="monospace" fontWeight="700">{sym}</text>
            ))}
            <line x1="600" y1="0" x2="1200" y2="600" stroke="#d946ef" strokeWidth="80" strokeOpacity="0.04"/>
            <line x1="750" y1="0" x2="1200" y2="450" stroke="#a21caf" strokeWidth="40" strokeOpacity="0.05"/>
            <ellipse cx="1000" cy="150" rx="180" ry="140" fill="#d946ef" opacity="0.1" filter="url(#glow3)"/>
            <ellipse cx="700" cy="650" rx="200" ry="100" fill="#7e22ce" opacity="0.18" filter="url(#glow3)"/>
            {[[870,200,4],[960,300,3],[1050,250,5],[800,420,3],[920,500,4],[1100,420,3],[750,560,4]].map(([x,y,r],i)=>(
                <circle key={i} cx={x} cy={y} r={r} fill="#f0abfc" opacity={0.2+i*0.04}/>
            ))}
            <rect x="1100" y="600" width="120" height="200" fill="#9333ea" opacity="0.06" transform="rotate(-15,1150,700)"/>
        </svg>
    );
    if (index === 4) return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="bg4a" cx="30%" cy="60%" r="75%">
                    <stop offset="0%" stopColor="#3d0a0a"/>
                    <stop offset="100%" stopColor="#0a0303"/>
                </radialGradient>
                <radialGradient id="bg4b" cx="85%" cy="20%" r="50%">
                    <stop offset="0%" stopColor="#92400e" stopOpacity="0.45"/>
                    <stop offset="100%" stopColor="#0a0303" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="bg4c" cx="50%" cy="50%" r="35%">
                    <stop offset="0%" stopColor="#991b1b" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#0a0303" stopOpacity="0"/>
                </radialGradient>
                <filter id="glow4a"><feGaussianBlur stdDeviation="10" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow4b"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <rect width="1200" height="800" fill="url(#bg4a)"/>
            <rect width="1200" height="800" fill="url(#bg4b)"/>
            <rect width="1200" height="800" fill="url(#bg4c)"/>
            <line x1="600" y1="-50" x2="1350" y2="500" stroke="#ef4444" strokeWidth="80" strokeOpacity="0.07"/>
            <line x1="500" y1="-50" x2="1250" y2="500" stroke="#dc2626" strokeWidth="40" strokeOpacity="0.06"/>
            <line x1="750" y1="-50" x2="1400" y2="450" stroke="#fbbf24" strokeWidth="20" strokeOpacity="0.05"/>
            <line x1="700" y1="0" x2="1200" y2="350" stroke="#f87171" strokeWidth="2" strokeOpacity="0.35"/>
            <line x1="650" y1="0" x2="1150" y2="380" stroke="#fca5a5" strokeWidth="1" strokeOpacity="0.25"/>
            <line x1="800" y1="50" x2="1200" y2="300" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.2"/>
            <line x1="-50" y1="400" x2="450" y2="850" stroke="#ef4444" strokeWidth="60" strokeOpacity="0.06"/>
            <line x1="-50" y1="500" x2="400" y2="900" stroke="#dc2626" strokeWidth="1.5" strokeOpacity="0.2"/>
            {Array.from({length:12},(_,i)=>{
                const angle=(i/12)*Math.PI*2-Math.PI/4;
                return <line key={i} x1="960" y1="400" x2={960+Math.cos(angle)*500} y2={400+Math.sin(angle)*500} stroke="#ef4444" strokeWidth="1" opacity={0.08+(i%4)*0.03}/>;
            })}
            <circle cx="960" cy="400" r="8" fill="#fbbf24" opacity="0.9" filter="url(#glow4b)"/>
            <circle cx="960" cy="400" r="40" fill="none" stroke="#f87171" strokeWidth="1.5" opacity="0.3"/>
            <circle cx="960" cy="400" r="100" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.18"/>
            <circle cx="960" cy="400" r="200" fill="none" stroke="#dc2626" strokeWidth="0.8" opacity="0.1"/>
            {[[820,280,5],[1080,320,4],[900,480,6],[1050,500,3],[780,440,4],[1120,260,5],[870,200,3],[1000,600,4]].map(([x,y,r],i)=>(
                <circle key={i} cx={x} cy={y} r={r} fill={i%2===0?'#fbbf24':'#f87171'} opacity={0.4+i*0.05} filter="url(#glow4b)"/>
            ))}
            <ellipse cx="1100" cy="120" rx="220" ry="160" fill="#f97316" opacity="0.14" filter="url(#glow4a)"/>
            <ellipse cx="1100" cy="120" rx="100" ry="80" fill="#fbbf24" opacity="0.1" filter="url(#glow4a)"/>
            <ellipse cx="150" cy="680" rx="280" ry="150" fill="#991b1b" opacity="0.22" filter="url(#glow4a)"/>
            <polyline points="0,80 0,0 80,0" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.35"/>
            <polyline points="1120,0 1200,0 1200,80" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.35"/>
            <polyline points="1200,720 1200,800 1120,800" fill="none" stroke="#f87171" strokeWidth="1.5" opacity="0.25"/>
            <polyline points="80,800 0,800 0,720" fill="none" stroke="#f87171" strokeWidth="1.5" opacity="0.25"/>
        </svg>
    );
    return null;
}

function CardVisual({ type, tagClass }) {
    if (type === 'dots') {
        const palette = ['#4b69f0','#29725f','#a0325a','#c8c4be','#82a0ff','#4b69f0','#c8c4be','#29725f','#c8c4be','#82a0ff','#4b69f0','#c8c4be'];
        return (
            <div className="ds-visual ds-visual--dots">
                {palette.map((bg, i) => <span key={i} className="ds-dot" style={{ background: bg }} />)}
            </div>
        );
    }
    if (type === 'squares') {
        const on = [true, true, true, false, true, true, true, true, false];
        return (
            <div className="ds-visual ds-visual--squares">
                {on.map((filled, i) => (
                    <span key={i} className={`ds-sq ${filled ? 'ds-sq--on' : ''}`} />
                ))}
            </div>
        );
    }
    if (type === 'podium') {
        return (
            <div className="ds-visual ds-visual--podium">
                <span className="ds-podium ds-podium--2" />
                <span className="ds-podium ds-podium--1" />
                <span className="ds-podium ds-podium--3" />
            </div>
        );
    }
    if (type === 'bars') {
        return (
            <div className="ds-visual ds-visual--bars">
                {['100%','76%','52%','30%'].map((w, i) => (
                    <span key={i} className="ds-bar" style={{ width: w, opacity: 1 - i * 0.2 }} />
                ))}
            </div>
        );
    }
    if (type === 'target') {
        return (
            <div className="ds-visual ds-visual--target">
                <svg viewBox="0 0 72 72" width="130" height="130" aria-hidden="true">
                    <circle cx="36" cy="36" r="32" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="36" cy="36" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="36" cy="36" r="9"  fill="none" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="36" cy="36" r="3.5" fill="currentColor"/>
                </svg>
            </div>
        );
    }
    return null;
}
