import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Login from "../LoginPage/Login";
import Signup from "../SignupPage/Signup.tsx";
import { InstagramLogoIcon, FacebookLogoIcon, XLogoIcon, LinkedInLogoIcon, RedditLogoIcon } from "../../components/Logos";
import BBNLogo from "../../assets/BBNLogo.svg";

type SectionId = "about" | "gallery" | "blog";

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

const footerLinks: { href: string, icon: React.ReactNode }[] = [
    { href: "#facebook", icon: <FacebookLogoIcon /> },
    { href: "#x", icon: <XLogoIcon /> },
    { href: "#linkedin", icon: <LinkedInLogoIcon /> },
    { href: "#reddit", icon: <RedditLogoIcon /> },
    { href: "#instagram", icon: <InstagramLogoIcon /> },
];

const year = new Date().getFullYear();

export default function LandingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [showSignUp, setShowSignUp] = useState<boolean>(false);
    const [hideButtons, setHideButtons] = useState<boolean>(false);
    const openLogin = () => navigate("/login");
    const openSignup = () => navigate("/signup");
    const closePopup = () => navigate("/");
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

    return (
        <div className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-white pt-16 font-sans text-BBNDarkGreen md:pt-[84px]">
            {/* NAVBAR */}
            <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:h-[84px] md:px-10">
                    {/* Brand */}
                    <a href="#top" className="flex items-center gap-3 no-underline">
                        <img src={BBNLogo} alt="BBN Logo" className="w-16 h-16" />

                        <div className="text-sm font-medium leading-tight md:text-base">
                            <span className="block text-BBNDarkGreen">Black</span>
                            <span className="block text-BBNBrightGreen">Brilliance</span>
                        </div>
                    </a>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="mx-auto grid min-h-[calc(100dvh-64px)] w-full max-w-7xl grid-cols-1 items-center gap-8 px-5 py-8 md:min-h-[calc(100dvh-84px)] md:px-10 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:py-16">                {!hideButtons && (<div className="order-2 flex flex-col md:order-1">
                {/* Main title with L-brackets */}
                <div className={"relative w-fit inline-block p-4"}>
                    {/* Top-Left Corner Line */}
                    <div className="absolute top-0 left-0 w-18 h-12 border-t-[5px] border-l-[5px] border-BBNBrightGreen" />

                    {/* Bottom-Right Corner Line */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[5px] border-r-[5px] border-BBNBrightGreen" />

                    {/* Text Content */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-BBNDarkGreen">
                        The Black<br />Brilliance Network.
                    </h1>
                </div>
                <p className="mb-8 mt-8 text-base leading-relaxed text-BBNDarkGreen sm:text-sm md:text-lg">
                    Bridging black undergraduate and graduate students in STEM with
                    industry professionals, alumni, and advanced-degree mentors, a
                    mentorship initiative by{" "}
                    <strong>the National Society of Black Engineers.</strong>
                </p>

                <p className="mb-8 text-base leading-relaxed text-BBNDarkGreen sm:text-sm md:text-lg">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit.
                    Quisque faucibus ex sapien vitae pellentesque sem placerat.
                    In id cursus mi pretium tellus duis convallis.
                    Lorem ipsum dolor sit amet consectetur adipiscing elit.
                    Quisque faucibus ex sapien vitae pellentesque sem placerat.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={openSignup}
                        type="button"
                        className="cursor-pointer rounded-full bg-BBNLightGreen px-7 py-3 font-bold text-[#2d3a1f] transition-colors hover:bg-[#c5dbb0]"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={openLogin}
                        type="button"
                        className="cursor-pointer rounded-full bg-BBNLightGreen px-7 py-3 font-bold text-[#2d3a1f] transition-colors hover:bg-[#d4e5c3]"
                    >
                        Log In
                    </button>
                </div>
            </div>


            )}

                {/* Show login/signup when hero is hidden */}
                {showLogin && (<Login onBack={closePopup} />)}
                {showSignUp && (<Signup onBack={closePopup} />)}

                <div className="order-1 mx-auto flex h-[250px] w-full max-w-[700px] items-center justify-center overflow-hidden rounded-3xl bg-BBNLightGreen sm:h-[320px] md:h-[400px] lg:order-2">
                    Image Placeholder...
                </div>
            </section>


            {/* ABOUT SECTION */}
            <section id="about" className="mx-auto my-20 grid w-[calc(100%-80px)] max-w-[1200px] scroll-mt-[100px] grid-cols-1 gap-[60px] rounded-3xl bg-[#e8f3dd] p-[60px] shadow-md md:my-20 md:w-full md:gap-10 md:px-6 sm:my-20 sm:gap-[30px] sm:p-5 lg:grid-cols-[400px_1fr] lg:gap-[60px] lg:p-[60px]">
                <div id="gallery" className="scroll-mt-[100px] flex flex-col">
                    <button
                        type="button"
                        className="flex h-[280px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-[#d4e5c3] transition-opacity hover:opacity-95 sm:h-[200px]"
                        onClick={() => setLightboxIndex(0)}
                        aria-label="View group photo"
                    >
                        <img
                            src={GALLERY_IMAGES[0]}
                            alt="Group photo"
                            className="h-full w-full object-cover"
                        />
                    </button>
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="Previous images"
                            className="flex h-[60px] w-8 shrink-0 items-center justify-center rounded-lg bg-[#c5dbb0] text-xl font-bold text-[#2d3a1f] transition-colors hover:bg-[#b5cb90] leading-none"
                            onClick={() => scrollCarousel("prev")}
                        >
                            <span className="flex items-center justify-center leading-none -translate-y-0.5" aria-hidden>‹</span>
                        </button>
                        <div
                            ref={carouselRef}
                            className="flex w-full gap-2 overflow-x-auto scroll-smooth rounded-lg py-1 [scroll-snap-type:x_mandatory] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {Array.from({ length: CAROUSEL_ITEMS }, (_, i) => (
                                <button
                                    type="button"
                                    key={i}
                                    className="h-[60px] w-[120px] shrink-0 cursor-pointer overflow-hidden rounded-lg bg-[#c5dbb0] transition-opacity hover:opacity-90 snap-start"
                                    style={{ minWidth: CAROUSEL_ITEM_WIDTH }}
                                    onClick={() => setLightboxIndex(i + 1)}
                                    aria-label={`View image ${i + 1}`}
                                >
                                    <img
                                        src={GALLERY_IMAGES[i + 1]}
                                        alt={`Gallery image ${i + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            aria-label="Next images"
                            className="flex h-[60px] w-8 shrink-0 items-center justify-center rounded-lg bg-[#c5dbb0] text-xl font-bold text-[#2d3a1f] transition-colors hover:bg-[#b5cb90] leading-none"
                            onClick={() => scrollCarousel("next")}
                        >
                            <span className="flex items-center justify-center leading-none -translate-y-0.5" aria-hidden>›</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <h2 className="mb-4 text-3xl font-semibold text-gray-800 md:text-4xl">About Us</h2>
                    <h1 className="mb-5 text-3xl font-bold tracking-tight md:text-5xl">
                        NSBE UCalgary
                    </h1>
                    <p className="mb-4 leading-relaxed text-sm md:text-base">
                        The University of Calgary chapter of the National Society of Black
                        Engineers is committed to increasing the number of culturally
                        responsible Black engineers who excel academically, succeed
                        professionally, and positively impact the community.
                    </p>
                    <p className="mb-4 leading-relaxed text-sm md:text-base">
                        Through mentorship, professional development, and community
                        building, we create pathways for Black students to thrive in STEM
                        fields and become the next generation of engineering leaders.
                    </p>
                </div>
            </section>

            {/* LIGHTBOX */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-1100 flex items-center justify-center bg-black/70 p-4"
                    onClick={() => setLightboxIndex(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image viewer"
                >
                    <div
                        className="relative flex max-h-[90vh] max-w-4xl items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            aria-label="Previous image"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/90 text-3xl font-bold text-[#2d3a1f] transition-colors hover:bg-white leading-none"
                            onClick={() => goLightbox("prev")}
                        >
                            <span className="flex items-center justify-center leading-none -translate-y-0.5" aria-hidden>‹</span>
                        </button>
                        <div className="flex max-h-[90vh] min-h-[200px] min-w-[200px] items-center justify-center overflow-hidden rounded-xl bg-[#d4e5c3] shadow-xl">
                            <img
                                src={
                                    lightboxIndex === 0
                                        ? GALLERY_IMAGES[0]
                                        : `https://picsum.photos/seed/bbn-${lightboxIndex}/800/400`
                                }
                                alt={lightboxIndex === 0 ? "Group photo" : `Gallery image ${lightboxIndex}`}
                                className="max-h-[90vh] max-w-full object-contain"
                            />
                        </div>
                        <button
                            type="button"
                            aria-label="Next image"
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/90 text-3xl font-bold text-[#2d3a1f] transition-colors hover:bg-white leading-none"
                            onClick={() => goLightbox("next")}
                        >
                            <span className="flex items-center justify-center leading-none -translate-y-0.5" aria-hidden>›</span>
                        </button>
                        <button
                            type="button"
                            aria-label="Close"
                            className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-2xl font-bold text-gray-600 transition-colors hover:bg-white hover:text-gray-900 leading-none"
                            onClick={() => setLightboxIndex(null)}
                        >
                            <span className="flex items-center justify-center leading-none -translate-y-0.5" aria-hidden>×</span>
                        </button>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="mt-auto w-full bg-BBNDarkGreen px-5 py-8">
                <div className="flex flex-col justify-center items-center gap-5 text-white">
                    <div className="flex justify-center gap-8 md:gap-4">
                        {footerLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="flex h-6 w-6 md:h-8 md:w-8 items-center justify-center text-white no-underline transition-colors hover:text-BBNBrightGreen"
                                aria-label={link.href.replace("#", "")}
                            >
                                {link.icon}
                            </a>
                        ))}
                    </div>
                    <span className="text-sm md:text-base text-center">
                        © Black Brilliance Network {year}. All rights reserved.
                    </span>
                </div>
            </footer>
        </div>
    );
}

