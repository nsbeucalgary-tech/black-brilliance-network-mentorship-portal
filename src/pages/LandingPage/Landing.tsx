export default function LandingPage() {
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
                        className="relative text-[15px] font-medium text-[#2d3a1f] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-[#2d3a1f] after:content-[''] sm:text-sm"
                    >
                        About
                    </a>
                    <a
                        href="#gallery"
                        className="text-[15px] font-medium text-gray-500 no-underline transition-colors hover:text-[#2d3a1f] sm:text-sm"
                    >
                        Gallery
                    </a>
                    <a
                        href="#blog"
                        className="text-[15px] font-medium text-gray-500 no-underline transition-colors hover:text-[#2d3a1f] sm:text-sm"
                    >
                        Blog
                    </a>
                    <button
                        type="button"
                        className="cursor-pointer rounded-lg border-none bg-[#3d4a2b] px-7 py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#2d3a1f] sm:rounded-[10px] sm:px-4 sm:py-2.5"
                    >
                        Register
                    </button>
                </nav>
            </header>

            {/* HERO SECTION */}
            <section className="grid min-h-[calc(100dvh-84px)] grid-cols-1 items-center gap-20 bg-white p-[60px] md:min-h-0 md:gap-10 md:p-6 sm:gap-6 sm:p-5 sm:min-h-0 lg:grid-cols-2 lg:gap-20 lg:p-[60px]">
                <div className="hero-text">
                    <h1 className="mb-6 border-l-4 border-[#a8c78e] pl-4 text-5xl font-semibold leading-tight text-gray-800 sm:text-3xl">
                        The Black
                    </h1>
                    <h1 className="mb-6 border-l-4 border-[#a8c78e] pl-4 text-5xl font-semibold leading-tight text-gray-800 sm:text-3xl">
                        Brilliance Network.
                    </h1>
                    <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-sm">
                        Bridging black undergraduate and graduate students in STEM with
                        industry professionals, alumni, and advanced-degree mentors — a
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
            <section className="mx-auto my-20 grid w-[calc(100%-80px)] max-w-[1200px] grid-cols-1 gap-[60px] rounded-3xl bg-[#e8f3dd] p-[60px] shadow-md md:my-20 md:w-full md:gap-10 md:px-6 sm:my-20 sm:gap-[30px] sm:p-5 lg:grid-cols-[400px_1fr] lg:gap-[60px] lg:p-[60px]">
                <div className="about-left">
                    <div className="flex h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#d4e5c3] sm:h-[200px]">
                        <div className="flex h-full w-full items-center justify-center bg-white/50 text-base text-gray-400">
                            [Group photo]
                        </div>
                    </div>
                    <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-3">
                        <div className="h-[60px] w-full overflow-hidden rounded-lg bg-[#c5dbb0]" />
                        <div className="h-[60px] w-full overflow-hidden rounded-lg bg-[#c5dbb0]" />
                        <div className="h-[60px] w-full overflow-hidden rounded-lg bg-[#c5dbb0]" />
                        <div className="h-[60px] w-full overflow-hidden rounded-lg bg-[#c5dbb0]" />
                        <div className="h-[60px] w-full overflow-hidden rounded-lg bg-[#c5dbb0]" />
                        <div className="h-[60px] w-full overflow-hidden rounded-lg bg-[#c5dbb0]" />
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
