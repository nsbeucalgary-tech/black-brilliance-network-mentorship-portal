import "./Landing.css";

export default function LandingPage() {
    return (
        <div className="landing">
            {/* NAVBAR */}
            <header className="nav">
                <div className="nav-left">
                    <div className="logo-mark">
                        <div className="logo-dot"/>
                        <div className="logo-dot"/>
                    </div>
                    <div className="logo-text">
                        <span className="logo-text-black">Black </span>
                        <span className="logo-text-green">Brilliance</span>
                    </div>
                </div>

                <nav className="nav-links">
                    <a href="#about" className="active">About</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#blog">Blog</a> 
                    <button className="register-button">Register</button> 
                </nav>
            </header>

            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-text"> 
                    <h1>The Black</h1> 
                    <h1>Brilliance Network.</h1>
                    <p>
                        Bridging black undergraduate and graduate students in STEM with 
                        industry professionals, alumni, and advanced-degree mentors — a 
                        mentorship initiative by <strong>the National Society of Black Engineers.</strong>
                    </p>

                    <div className="hero-buttons">
                        <button className="sign-up-button">Sign Up</button>
                        <button className="log-in-button">Log In</button>
                    </div>
                </div>

                <div className="hero-image"> 
                    <div className="hero-image-box">
                        <div className="hero-image-placeholder">
                            [Image Placeholder...]
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className="about">
                <div className="about-left">
                    <div className="about-image">
                        <div className="about-image-placeholder">
                            [Group photo]
                        </div>
                    </div>
                    <div className="about-gallery">
                        <div className="gallery-item" />
                        <div className="gallery-item" />
                        <div className="gallery-item" />
                        <div className="gallery-item" />
                        <div className="gallery-item" />
                        <div className="gallery-item" />
                    </div>
                </div>

                <div className="about-content">
                    <h2>About Us</h2>
                    <h1><strong>NSBE UCalgary</strong></h1>
                    <p></p>
                    <p>
                        Paragraph.
                    </p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="social-links">
                        <a href="#reddit">r</a>
                        <a href="#facebook">f</a>
                        <a href="#twitter">𝕏</a>
                        <a href="#linkedin">in</a>
                    </div>
                    <p className="footer-text">©Black Brilliance Network 2025. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}