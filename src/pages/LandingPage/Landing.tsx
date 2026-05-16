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
        <div className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-white pt-16 font-sans text-BBNDarkGreen md:pt-[84px]">
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
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-BBNDarkGreen transition-colors hover:bg-BBNLightGreen md:hidden"
                        onClick={() => setMobileNavOpen((prev) => !prev)}
                        aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={mobileNavOpen}
                    >
                        {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile menu panel */}
                {mobileNavOpen && (
                    <nav className="flex flex-col gap-1 border-t border-gray-200 bg-white px-4 py-3 md:hidden">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.id}
                                href={link.href}
                                onClick={() => handleNavClick(link.id)}
                                className={`rounded-lg px-3 py-2.5 text-base font-medium no-underline transition-colors w-fit ${activeSection === link.id
                                    ? "bg-BBNLightGreen text-BBNDarkGreen"
                                    : "text-gray-600 hover:bg-BBNLightGreen hover:text-BBNDarkGreen"
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                        <button
                            type="button"
                            onClick={handleRegisterClick}
                            className="w-fit mt-2 cursor-pointer rounded-full bg-BBNDarkAvocadoGreen px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-BBNDarkGreen"
                        >
                            Register
                        </button>
                    </nav>
                )}
            </header>

            {/* HERO SECTION */}
            <section className="grid min-h-[calc(100dvh-84px)] grid-cols-1 items-center gap-20 bg-white p-[60px] md:min-h-0 md:gap-10 md:p-6 sm:gap-6 sm:p-5 sm:min-h-0 lg:grid-cols-2 lg:gap-20 lg:p-[60px]">
                <div className="hero-text">
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
                            type="button"
                            className="cursor-pointer rounded-full bg-BBNLightGreen px-7 py-3 font-bold text-[#2d3a1f] transition-colors hover:bg-[#c5dbb0]"
                        >
                            Sign Up
                        </button>
                        <button
                            type="button"
                            className="cursor-pointer rounded-full bg-BBNLightGreen px-7 py-3 font-bold text-[#2d3a1f] transition-colors hover:bg-[#d4e5c3]"
                        >
                            Log In
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="flex h-[400px] w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#e8f3dd] to-[#d9e8c9] sm:h-[300px]">
                        <div className="flex h-[90%] w-[90%] items-center justify-center rounded-2xl bg-white/70 text-lg font-medium text-gray-400">
                            [Image Placeholder...]
                        </div>
                    </div>
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
                                    className="h-[60px] w-[120px] shrink-0 cursor-pointer overflow-hidden rounded-lg bg-[#c5dbb0] transition-opacity hover:opacity-90 [scroll-snap-align:start]"
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
                    className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4"
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
