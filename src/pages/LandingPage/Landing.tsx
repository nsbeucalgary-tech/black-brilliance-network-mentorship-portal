import { useEffect, useRef } from "react";
import "./Landing.css";

export default function LandingPage() {
    const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const updateNavHeight = () => {
      const h = navRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--nav-h", `${h}px`);
    };

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);
    return () => window.removeEventListener("resize", updateNavHeight);
  }, []);


    return (
        <div className="landing">
            {/* NAVBAR */}
            <header ref={navRef} className="nav">
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

                    <p>
                        Random text.
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
                        The University of Calgary chapter of the National Society of Black Engineers 
                        is committed to increasing the number of culturally responsible Black engineers 
                        who excel academically, succeed professionally, and positively impact the community.
                    </p>
                    <p>
                        Through mentorship, professional development, and community building, we create 
                        pathways for Black students to thrive in STEM fields and become the next generation 
                        of engineering leaders.
                    </p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="social-links">
                        <a href="#facebook">Facebook</a>
                        <a href="#X">X</a>
                        <a href="#linkedin">LinkedIn</a>
                        <a href="#email">Email</a>
                        <a href="#discord">Discord</a>
                    </div>
                    <p className="footer-text">©Black Brilliance Network 2025. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}