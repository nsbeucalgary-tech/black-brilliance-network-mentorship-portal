import "./Landing.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Login from "../LoginPage/Login";
import Signup from "../SignupPage/Signup";

const navLinkBase =
    "relative inline-flex items-center px-1 text-sm font-medium tracking-tight transition-colors duration-150 sm:text-xs whitespace-nowrap shrink-0";
const navLinkActive =
    "text-[#2d3a1f] no-underline after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-[#2d3a1f] after:content-[''] after:transition-transform after:duration-200";
const navLinkInactive = "text-gray-500 no-underline hover:text-[#2d3a1f]";

const CAROUSEL_ITEMS = 6;
const LIGHTBOX_ITEMS = 1 + CAROUSEL_ITEMS; // main photo + carousel thumbnails
const CAROUSEL_ITEM_WIDTH = 120;
const CAROUSEL_GAP = 8;

// Mock gallery images: index 0 = main group photo, 1–6 = carousel thumbnails
const GALLERY_IMAGES = [
  "https://picsum.photos/seed/bbn-main/560/280",
  "https://picsum.photos/seed/bbn-1/120/60",
  "https://picsum.photos/seed/bbn-2/120/60",
  "https://picsum.photos/seed/bbn-3/120/60",
  "https://picsum.photos/seed/bbn-4/120/60",
  "https://picsum.photos/seed/bbn-5/120/60",
  "https://picsum.photos/seed/bbn-6/120/60",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);

  useEffect(() => {
    if (location.pathname === "/login") {
      setShowLogin(true);
      setShowSignUp(false);
      setHideButtons(true);
    } else if (location.pathname === "/signup") {
      setShowSignUp(true);
      setShowLogin(false);
      setHideButtons(true);
    } else {
      setShowLogin(false);
      setShowSignUp(false);
      setHideButtons(false);
    }
  }, [location.pathname]);

  const openLogin = () => navigate("/login");
  const openSignup = () => navigate("/signup");
  const closePopup = () => navigate("/");

  const [activeSection, setActiveSection] =
      useState<"about" | "gallery" | "blog">("about");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "prev" | "next") => {
    const el = carouselRef.current;
    if (!el) return;
    const step = CAROUSEL_ITEM_WIDTH + CAROUSEL_GAP;
    el.scrollBy({ left: direction === "prev" ? -step : step, behavior: "smooth" });
  };

  const goLightbox = (direction: "prev" | "next") => {
    setLightboxIndex((prev) => {
      if (prev === null) return 0;
      const next = direction === "prev" ? prev - 1 : prev + 1;
      if (next < 0) return LIGHTBOX_ITEMS - 1;
      if (next >= LIGHTBOX_ITEMS) return 0;
      return next;
    });
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") goLightbox("prev");
      if (e.key === "ArrowRight") goLightbox("next");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  return (
      <div className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-white pt-[84px] font-sans text-gray-800">
        {/* NAVBAR */}
        <header className="fixed inset-x-0 top-0 z-[1000] flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-2 backdrop-blur sm:h-[84px] sm:px-10 sm:py-0 md:px-6">
          <div className="flex items-center gap-3 sm:gap-2 shrink-0">
            <div className="flex h-8 w-8 gap-1 sm:h-7 sm:w-7 sm:gap-[3px]">
              <div className="h-2 w-2 rounded-full bg-[#2d3a1f]" />
              <div className="mt-2 h-2 w-2 rounded-full bg-[#2d3a1f]" />
            </div>
            <div className="text-base font-medium leading-tight sm:text-xs">
              <span className="block text-[#2d3a1f]">Black </span>
              <span className="block text-[#7a9b5c]">Brilliance</span>
            </div>
          </div>

          <nav className="flex items-center gap-4 sm:gap-6">
            <a
                href="#about"
                className={`${navLinkBase} ${activeSection === "about" ? navLinkActive : navLinkInactive}`}
                onClick={() => setActiveSection("about")}
            >
              About
            </a>
            <a
                href="#gallery"
                className={`${navLinkBase} ${activeSection === "gallery" ? navLinkActive : navLinkInactive}`}
                onClick={() => setActiveSection("gallery")}
            >
              Gallery
            </a>
            <a
                href="#blog"
                className={`${navLinkBase} ${activeSection === "blog" ? navLinkActive : navLinkInactive}`}
                onClick={() => setActiveSection("blog")}
            >
              Blog
            </a>

            <button
                type="button"
                className="ml-2 cursor-pointer rounded-full border-none bg-[#3d4a2b] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2d3a1f] sm:px-3 sm:py-1.5 sm:text-xs whitespace-nowrap shrink-0"
                onClick={openSignup}
            >
              Register
            </button>
          </nav>
        </header>

        {/* HERO SECTION */}
        <section className="hero">
          {!hideButtons && (
              <div className="hero-text">
                <h1>The Black</h1>
                <h1>Brilliance Network.</h1>

                <p>
                  Bridging black undergraduate and graduate students in STEM with
                  industry professionals, alumni, and advanced-degree mentors — a
                  mentorship initiative by{" "}
                  <strong>the National Society of Black Engineers.</strong>
                </p>

                <p>Random text.</p>

                <div className="hero-buttons">
                  <button className="sign-up-button" onClick={openSignup}>
                    Sign Up
                  </button>

                  <button className="log-in-button" onClick={openLogin}>
                    Log In
                  </button>
                </div>
              </div>
          )}

          {/* Embedded auth */}
          {showLogin && <Login onBack={closePopup} embedded />}
          {showSignUp && <Signup onBack={closePopup} embedded />}

          <div className="hero-image">
            <div className="hero-image-box">
              <div className="hero-image-placeholder">[Image Placeholder...]</div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="about">
          <div className="about-left">
            <div className="about-image">
              <div className="about-image-placeholder">[Group photo]</div>
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
            <h1>
              <strong>NSBE UCalgary</strong>
            </h1>
            <p>
              The University of Calgary chapter of the National Society of Black
              Engineers is committed to increasing the number of culturally
              responsible Black engineers who excel academically, succeed
              professionally, and positively impact the community.
            </p>
            <p>
              Through mentorship, professional development, and community
              building, we create pathways for Black students to thrive in STEM
              fields and become the next generation of engineering leaders.
            </p>
          </div>
        </section>

        {/* GALLERY SECTION (placeholder so anchors resolve) */}
        <section id="gallery" className="py-16 px-6">
          <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => scrollCarousel("prev")} className="px-3 py-2 border rounded">
              Prev
            </button>
            <div ref={carouselRef} className="flex gap-2 overflow-x-auto max-w-full">
              {GALLERY_IMAGES.slice(1).map((src) => (
                  <img
                      key={src}
                      src={src}
                      alt="Gallery thumbnail"
                      className="h-[60px] w-[120px] object-cover rounded"
                      onClick={() => setLightboxIndex(0)}
                  />
              ))}
            </div>
            <button onClick={() => scrollCarousel("next")} className="px-3 py-2 border rounded">
              Next
            </button>
          </div>
        </section>

        {/* BLOG SECTION (placeholder so anchors resolve) */}
        <section id="blog" className="py-16 px-6">
          <h2 className="text-2xl font-semibold mb-2">Blog</h2>
          <p className="text-gray-600">Coming soon.</p>
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

        {/* Lightbox (optional minimal) */}
        {lightboxIndex !== null && (
            <div
                className="fixed inset-0 z-[2000] bg-black/60 flex items-center justify-center p-6"
                onClick={() => setLightboxIndex(null)}
            >
              <div className="bg-white rounded-xl p-4 max-w-[700px] w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => goLightbox("prev")} className="px-3 py-2 border rounded">
                    Prev
                  </button>
                  <button onClick={() => setLightboxIndex(null)} className="px-3 py-2 border rounded">
                    Close
                  </button>
                  <button onClick={() => goLightbox("next")} className="px-3 py-2 border rounded">
                    Next
                  </button>
                </div>
                <img
                    src={GALLERY_IMAGES[Math.min(lightboxIndex, GALLERY_IMAGES.length - 1)]}
                    alt="Gallery preview"
                    className="w-full h-auto rounded"
                />
              </div>
            </div>
        )}
      </div>
  );
}
