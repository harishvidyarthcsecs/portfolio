'use client';

export default function Showreel() {
    return (
        <section className="showreel-section" id="showreel-section">
            <div className="showreel__content">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem 8rem' }}>
                    <div>
                        <h2 className="showreel__title">1</h2>
                        <p className="showreel__subtitle">SCI Q1 Journal · Impact Factor 3.9</p>
                    </div>
                    <div>
                        <h2 className="showreel__title">4</h2>
                        <p className="showreel__subtitle">Conference Papers Presented</p>
                    </div>
                    <div>
                        <h2 className="showreel__title">#4</h2>
                        <p className="showreel__subtitle">Bebras National · College Rank #1</p>
                    </div>
                    <div>
                        <h2 className="showreel__title">9.01</h2>
                        <p className="showreel__subtitle">CGPA · B.E. CSE Cyber Security</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
