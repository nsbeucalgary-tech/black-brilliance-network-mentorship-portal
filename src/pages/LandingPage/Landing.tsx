import "./Landing.css";
import { useNavigate,useLocation  } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "../LoginPage/Login";
import Signup from "../SignupPage/Signup.tsx";



import { useEffect, useRef, useState } from "react";

const navLinkBase =
    "relative inline-flex items-center px-1 text-sm font-medium tracking-tight transition-colors duration-150 sm:text-xs whitespace-nowrap shrink-0";
const navLinkActive =
    "text-[#2d3a1f] no-underline after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-[#2d3a1f] after:content-[''] after:transition-transform after:duration-200";
const navLinkInactive =
    "text-gray-500 no-underline hover:text-[#2d3a1f]";

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

  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSignUp, setShowSignUp] = useState<boolean>(false);
  const [hideButtons, setHideButtons] = useState<boolean>(false);

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


  return (
      <div className="landing">
        {/* NAVBAR */}
        <header className="nav">
          <div className="nav-left">
            <div className="logo-mark">
              <div className="logo-dot" />
              <div className="logo-dot" />
            </div>
            <div className="logo-text">
              <span className="logo-text-black">Black </span>
              <span className="logo-text-green">Brilliance</span>
            </div>
          </div>
    const [activeSection, setActiveSection] = useState<"about" | "gallery" | "blog">("about");
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
            <header className="fixed inset-x-0 top-0 z-[1000] flex flex-col items-start gap-1 border-b border-gray-200 bg-white/95 px-4 py-2 backdrop-blur sm:h-[84px] sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-0 md:px-6">
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

          <nav className="nav-links">
            <a href="#about" className="active">
              About
            </a>
            <a href="#gallery">Gallery</a>
            <a href="#blog">Blog</a>
            <button
                className="register-button"
                onClick={openSignup}
            >
              Register
            </button>
          </nav>
        </header>
                <nav className="mt-1 flex w-full flex-wrap items-center justify-start gap-3 text-xs sm:mt-0 sm:flex-1 sm:justify-end sm:gap-6 sm:text-[11px] md:gap-6">
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
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveSection("blog");
                        }}
                    >
                        Blog
                    </a>
                    <button
                        type="button"
                        className="ml-4 cursor-pointer rounded-full border-none bg-[#3d4a2b] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2d3a1f] md:px-5 md:py-2 md:text-sm sm:px-3 sm:py-1.5 sm:text-xs whitespace-nowrap shrink-0"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        <span className="hidden sm:inline md:hidden">Reg</span>
                        <span className="sm:hidden md:inline">Register</span>
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
                  <button
                      className="sign-up-button"
                      onClick={openSignup}
                  >
                    Sign Up
                  </button>

                  <button
                      className="log-in-button"
                      onClick={openLogin}
                  >
                    Log In
                  </button>
                </div>
              </div>
          )}

          {/* Show login/signup when hero is hidden */}
          {showLogin && (
              <Login
                  onBack={closePopup} embedded
              />
          )}

          {showSignUp && (
              <Signup
                  onBack={closePopup} embedded />
          )}

          <div className="hero-image">
            <div className="hero-image-box">
              <div className="hero-image-placeholder">[Image Placeholder...]</div>
            </div>
          </div>
        </section>


        {/* ABOUT SECTION */}
        <section className="about">
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
            <p></p>
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
            <p className="footer-text">
              ©Black Brilliance Network 2025. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
  );
}
