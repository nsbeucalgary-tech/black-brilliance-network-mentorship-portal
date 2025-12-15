import "./Landing.css";


export default function LandingPage() {
    return (
        <div className="landing">
            <h1>Welcome to the Landing Page</h1>

            {/* NAVBAR */}
            <header className="nav">
                <div className="nav-left">
                    <div className="logo-mark" />
                    <div className="logo-text">
                    </div>
                </div>

                <nav className="nav-links">
                    <a href="#about">About</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#blog">Blog</a> 
                    <button className="register-button">Register</button> 
                </nav>
            </header>

            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-text"> 
                    <h1>The Black Brilliance Network.</h1>
                    <p>
                        Bridging Black undergraduate and graduate students in STEM with
                        industry professionals, alumni, and advanced-degree mentors
                        through a structured mentorship ecosystem.
                    </p>

                    <div className="hero-buttons">
                        <button className="sign-up-button">Sign Up</button>
                        <button className="log-in-button">Log In</button>
                    </div>
                </div>

                <div className="hero-image"> 
                    <div className="hero-image-box">Image</div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className="about">
                <h2>NSBE UCalgary</h2>
                <p>
                    The Black Brilliance Network is a flagship mentorship initiative designed to
                    foster academic success, professional growth, and authentic connection.

                </p>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <p>&copy;Black Brilliance Network 2025. All rights reserved.</p>
            </footer>
        </div>
    );
}