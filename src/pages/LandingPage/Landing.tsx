import { useEffect, useRef, useState } from "react";

const navLinkBase =
    "text-[15px] font-medium transition-colors sm:text-sm";
const navLinkActive =
    "relative text-[#2d3a1f] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-[#2d3a1f] after:content-['']";
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
        <div className="flex min-h-dvh w-full flex-col bg-white pt-[84px]">
            {/* NAVBAR */}
            <header className="fixed left-0 top-0 z-[1000] flex h-[84px] w-full flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-10 md:h-auto md:px-6 md:py-5 sm:gap-3 sm:px-5 sm:py-4 lg:px-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 gap-1">
                        <div className="h-2 w-2 rounded-full bg-[#2d3a1f]" />
                        <div className="mt-2 h-2 w-2 rounded-full bg-[#2d3a1f]" />
                    </div>
                    <div className="text-base font-medium leading-tight">
                        <span className="block text-[#2d3a1f]">Black </span>
                        <span className="block text-[#7a9b5c]">Brilliance</span>
                    </div>
                </div>

                <nav className="flex items-center gap-8 md:gap-4 sm:flex-wrap sm:gap-4">
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
                        className="cursor-pointer rounded-lg border-none bg-[#3d4a2b] px-7 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#2d3a1f] sm:rounded-[10px] sm:px-4 sm:py-2.5"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        Register
                    </button>
                </nav>
            </header>

            {/* HERO SECTION */}
            <section className="grid min-h-[calc(100dvh-84px)] grid-cols-1 items-center gap-20 bg-white p-[60px] md:min-h-0 md:gap-10 md:p-6 sm:gap-6 sm:p-5 sm:min-h-0 lg:grid-cols-2 lg:gap-20 lg:p-[60px]">
                <div className="hero-text">
                    {/* Main title with L-brackets */}
                    <div className="relative inline-block pl-3 pt-3 pr-3 pb-3">
                        {/* Top-left L bracket: horizontal + vertical */}
                        <span
                            className="absolute left-0 top-0 h-1 w-16 bg-[#7a9b5c] sm:w-12"
                            aria-hidden
                        />
                        <span
                            className="absolute left-0 top-0 h-16 w-1 bg-[#7a9b5c] sm:h-12"
                            aria-hidden
                        />
                        {/* Bottom-right L bracket */}
                        <span
                            className="absolute bottom-0 right-0 h-1 w-48 bg-[#7a9b5c] sm:w-36"
                            aria-hidden
                        />
                        <span
                            className="absolute bottom-0 right-0 h-16 w-1 bg-[#7a9b5c] sm:h-12"
                            aria-hidden
                        />
                        <h1 className="text-5xl font-bold leading-tight text-[#2d3a1f] sm:text-3xl">
                            The Black
                        </h1>
                        <h1 className="text-5xl font-bold leading-tight text-[#2d3a1f] sm:text-3xl">
                            Brilliance Network.
                        </h1>
                    </div>
                    <p className="mb-8 mt-8 text-base leading-relaxed text-gray-600 sm:text-sm">
                        Bridging black undergraduate and graduate students in STEM with
                        industry professionals, alumni, and advanced-degree mentors, a
                        mentorship initiative by{" "}
                        <strong>the National Society of Black Engineers.</strong>
                    </p>

                    <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-sm">
                        Random text.
                    </p>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="cursor-pointer rounded-lg border-none bg-[#d4e5c3] px-7 py-3 text-[15px] font-medium text-[#2d3a1f] transition-colors hover:bg-[#c5dbb0]"
                        >
                            Sign Up
                        </button>
                        <button
                            type="button"
                            className="cursor-pointer rounded-lg border-none bg-[#e5ead9] px-7 py-3 text-[15px] font-medium text-[#2d3a1f] transition-colors hover:bg-[#d4e5c3]"
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
            <section id="about" className="mx-auto my-20 grid w-[calc(100%-80px)] max-w-[1200px] grid-cols-1 gap-[60px] rounded-3xl bg-[#e8f3dd] p-[60px] shadow-md md:my-20 md:w-full md:gap-10 md:px-6 sm:my-20 sm:gap-[30px] sm:p-5 lg:grid-cols-[400px_1fr] lg:gap-[60px] lg:p-[60px]">
                <div id="gallery" className="about-left scroll-mt-[100px]">
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
                            className="flex h-[60px] w-8 shrink-0 items-center justify-center rounded-lg bg-[#c5dbb0] text-[#2d3a1f] transition-colors hover:bg-[#b5cb90]"
                            onClick={() => scrollCarousel("prev")}
                        >
                            ‹
                        </button>
                        <div
                            ref={carouselRef}
                            className="flex w-full gap-2 overflow-x-auto scroll-smooth rounded-lg py-1 scrollbar-hide [scroll-snap-type:x_mandatory]"
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
                            className="flex h-[60px] w-8 shrink-0 items-center justify-center rounded-lg bg-[#c5dbb0] text-[#2d3a1f] transition-colors hover:bg-[#b5cb90]"
                            onClick={() => scrollCarousel("next")}
                        >
                            ›
                        </button>
                    </div>
                </div>

                <div className="about-content">
                    <h2 className="mb-5 text-4xl font-semibold text-gray-800">About Us</h2>
                    <h1 className="mb-5 text-5xl font-extrabold tracking-tight text-gray-100 sm:text-4xl">
                        <strong>NSBE UCalgary</strong>
                    </h1>
                    <p className="mb-4 text-[15px] leading-relaxed text-gray-600 sm:text-sm">
                        The University of Calgary chapter of the National Society of Black
                        Engineers is committed to increasing the number of culturally
                        responsible Black engineers who excel academically, succeed
                        professionally, and positively impact the community.
                    </p>
                    <p className="mb-4 text-[15px] leading-relaxed text-gray-600 sm:text-sm">
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
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/90 text-2xl text-[#2d3a1f] transition-colors hover:bg-white"
                            onClick={() => goLightbox("prev")}
                        >
                            ‹
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
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/90 text-2xl text-[#2d3a1f] transition-colors hover:bg-white"
                            onClick={() => goLightbox("next")}
                        >
                            ›
                        </button>
                        <button
                            type="button"
                            aria-label="Close"
                            className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl text-gray-600 transition-colors hover:bg-white hover:text-gray-900"
                            onClick={() => setLightboxIndex(null)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="mt-auto w-full bg-[#3d4a2b] px-5 py-8 text-white/90">
                <div className="flex flex-col items-center gap-5">
                    <div className="flex gap-5">
                        <a
                            href="#facebook"
                            className="text-xl text-white/80 transition-colors hover:text-white"
                        >
                            Facebook
                        </a>
                        <a
                            href="#X"
                            className="text-xl text-white/80 transition-colors hover:text-white"
                        >
                            X
                        </a>
                        <a
                            href="#linkedin"
                            className="text-xl text-white/80 transition-colors hover:text-white"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="#email"
                            className="text-xl text-white/80 transition-colors hover:text-white"
                        >
                            Email
                        </a>
                        <a
                            href="#discord"
                            className="text-xl text-white/80 transition-colors hover:text-white"
                        >
                            Discord
                        </a>
                    </div>
                    <p className="text-[13px] text-white/70">
                        ©Black Brilliance Network 2025. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
