import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LuPanelRightClose, LuPanelLeftClose } from 'react-icons/lu';
import { RiComputerLine } from 'react-icons/ri';
import { GiCalendar } from 'react-icons/gi';
import { FaPeopleArrows } from 'react-icons/fa';
import { IoNewspaperOutline, IoHome } from 'react-icons/io5';
import { MdSettings, MdLogout } from 'react-icons/md';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useAuth } from '../auth/useAuthContext';
import { useNavigate } from 'react-router-dom';

import BBNLogo from '../assets/BBNLogo.svg';
import BBNLogoWhite from '../assets/BBNLogoWhite.svg';

const NavLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: RiComputerLine },
    { to: '/calendar', label: 'Calendar', icon: GiCalendar },
    { to: '/matching', label: 'Matchmaking', icon: FaPeopleArrows },
    { to: '/newsletter', label: 'Newsletter', icon: IoNewspaperOutline },
    { to: '/home', label: 'Home', icon: IoHome }
];

const NavFooterLinks = [
    { to: '/settings', label: 'Settings', icon: MdSettings },
    { to: '/', label: 'Log Out', icon: MdLogout }
];

type NavbarVariants = 'desktop' | 'mobile';

interface NavItemProps {
    to: string;
    label: string;
    icon: React.ElementType;
    navType: NavbarVariants;
    desktopOpen?: boolean; //Boolean state for desktop navbar open/close
    mobileOnClick?: () => void; //Function to close mobile navbar on link click

};

function NavItem({ to, label, icon: Icon, navType, desktopOpen, mobileOnClick }: NavItemProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const generalOnClick = () => {
        if (label === 'Log Out') {
            handleLogout();
        }

        if (navType === 'mobile' && mobileOnClick) {
            mobileOnClick();
        }
    };

    if (navType === 'mobile') {
        return (
            <NavLink
                key={to}
                to={to}
                onClick={generalOnClick}
                className="flex items-center gap-4 text-white
                transform transition-all duration-300 ease-in-out
                active:-translate-y-1 active:text-[#aad576]
                active:underline underline-offset-8 decoration-[#aad576]
                active:rounded-md"
            >
                <Icon size={22} />
                <span className="text-lg">{label}</span>
            </NavLink>
        );
    }

    return (
        <NavLink
            to={to}
            title={desktopOpen ? undefined : label}
            aria-label={label}
            className="flex items-center h-12 rounded-lg transition-all"
            onClick={generalOnClick}
        >
            {({ isActive }) => (
                <>
                    <div className={`flex items-center gap-4 px-4 py-3 rounded-xs transition-colors duration-300
                    ${isActive ? 'bg-white text-BBNDarkGreen' : 'text-white hover:bg-[#3b4823]'}`}>
                        <Icon size={24} />
                    </div>

                    {isActive && (<svg height="30" width="30">
                        {/* cx and cy define the center coordinates, r defines the radius (10 for a 20px diameter circle)*/}
                        <circle cx="10" cy="15" r="3" fill="white" />
                    </svg>)}

                    <div className={`flex items-center gap-4 px-4 py-3 rounded-xs whitespace-nowrap font-medium transition-colors duration-300
                    ${desktopOpen ? 'opacity-100 ' : 'opacity-0 pointer-events-none'}
                    ${isActive ? 'bg-BBNDarkGreen text-white font-extrabold' : 'text-BBNDarkGreen hover:bg-[#3b4823] hover:text-white ml-5'} w-full`}
                    >
                        <span>{label}</span>
                    </div>
                </>
            )}
        </NavLink>
    );
}

function MobileMenu() {
    {/*  Function for the mobile navbar to be shown when breakpoint < md*/ }
    const [open, setOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* Hamburger Button */}
            <div className='w-full'>
                <button
                    onClick={() => setOpen(true)}
                    aria-label="Open Menu"
                    className="fixed top-4 right-4 z-50
                p-2 rounded-lg bg-BBNDarkGreen text-white"
                >
                    <HiMenuAlt3 size={26} />
                </button>
            </div>

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Slide-in Menu */}
            <aside
                className={`fixed top-0 right-0 h-full w-64
                bg-BBNDarkGreen z-50 flex flex-col
                transform transition-transform duration-300
                ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-white">
                    <div className="flex items-center gap-3">
                        <img src={BBNLogoWhite} alt="BBN Logo" className="w-14 h-14" />
                        <div className="flex flex-col text-xl font-semibold leading-tight">
                            <span className="text-white">Black</span>
                            <span className="text-[#aad576]">Brilliance</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close Menu"
                        className="text-white"
                    >
                        <HiX size={26} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="px-4 py-6 space-y-4 ">
                    {NavLinks.map(item => (
                        <NavItem key={item.to} {...item} mobileOnClick={() => setOpen(false)} navType='mobile' />
                    ))}
                </nav>

                {/* Footer Links */}
                <div className="mt-auto px-4 pb-6 space-y-4">
                    {NavFooterLinks.map(item => (
                        <NavItem key={item.to} {...item} mobileOnClick={() => setOpen(false)} navType='mobile' />
                    ))}
                </div>
            </aside>
        </div>
    );
}

function DesktopMenu() {
    {/* Function for Desktop Sidebar when window size is 'md' or greater. */ }
    const [isOpen, setIsOpen] = useState(true);
    const ToggleIcon = isOpen ? LuPanelLeftClose : LuPanelRightClose;

    return (
        <>
            <aside
                aria-expanded={isOpen}
                className={`hidden md:h-screen md:flex flex-col bg-gray-200
                transition-all duration-300 will-change-[width] rounded-3xl
                ${isOpen ? 'w-72' : 'w-20'}`}
            >
                {/* Green Background Stripe */}
                <div className="absolute top-0 left-0 bottom-0 w-20 bg-BBNDarkGreen rounded-r-3xl z-0" />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="h-40 flex items-center shrink-0">
                        <div className="w-20 flex justify-center">
                            <img
                                src={BBNLogoWhite}
                                alt="BBN Logo"
                                className={`w-12 h-12 object-contain transition-opacity
                                ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            />
                        </div>

                        {isOpen && (
                            <div className="flex items-center gap-3">
                                <img src={BBNLogo} alt="BBN Logo" className="w-16 h-16" />
                                <div className="flex flex-col text-xl font-semibold leading-tight">
                                    <span className="text-BBNDarkGreen">Black</span>
                                    <span className="text-[#aad576]">Brilliance</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <nav className="flex-1 px-2 space-y-2" aria-label="Main Navigation">
                        {NavLinks.map(item => (
                            <NavItem key={item.to} {...item} desktopOpen={isOpen} navType='desktop' />
                        ))}
                    </nav>

                    <div className="px-2 pb-2 space-y-2 shrink-0">
                        {NavFooterLinks.map(item => (
                            <NavItem key={item.to} {...item} desktopOpen={isOpen} navType='desktop' />
                        ))}

                        {/* Toggle Button */}
                        <div className="w-16 flex justify-center py-4">
                            <button
                                onClick={() => setIsOpen(prev => !prev)}
                                aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
                                title={isOpen ? 'Close Menu' : 'Open Menu'}
                                className="inline-flex items-center justify-center p-2 rounded-lg
                                text-white hover:bg-white hover:text-BBNDarkGreen
                                focus-visible:outline
                                focus-visible:outline-BBNDarkGreen transition-colors"
                            >
                                <ToggleIcon size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}


export default function Navbar() {

    return (
        <>
            <DesktopMenu />
            <MobileMenu />
        </>
    );
}
