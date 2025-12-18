import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LuPanelRightClose, LuPanelLeftClose } from 'react-icons/lu';
import { RiComputerLine } from 'react-icons/ri';
import { GiCalendar } from 'react-icons/gi';
import { FaPeopleArrows } from 'react-icons/fa';
import { IoNewspaperOutline, IoHome } from 'react-icons/io5';
import { MdSettings, MdLogout } from 'react-icons/md';

import BBNLogo from '../assets/BBNLogo.svg';
import BBNLogoWhite from '../assets/BBNLogoWhite.svg';

const NavLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: RiComputerLine },
    { to: '/calendar', label: 'Calendar', icon: GiCalendar },
    { to: '/matching', label: 'Matchmaking', icon: FaPeopleArrows },
    { to: '/newsletter', label: 'Newsletter', icon: IoNewspaperOutline },
    { to: '/home', label: 'Home', icon: IoHome },
];

const NavFooterLinks = [
    { to: '/settings', label: 'Settings', icon: MdSettings },
    { to: '/logout', label: 'Log Out', icon: MdLogout },
];


interface NavItemProps {
    to: string;
    label: string;
    icon: React.ElementType;
    isOpen: boolean;
};

function NavItem({ to, label, icon: Icon, isOpen }: NavItemProps) {
    return (
        <NavLink
            to={to}
            title={isOpen ? undefined : label}
            aria-label={label}
            className="flex items-center h-12 rounded-lg transition-all"
        >
            {({ isActive }) => (
                <>
                    <div className={`flex items-center gap-4 px-4 py-3 rounded-xs transition-colors duration-300
                    ${isActive ? 'bg-white text-BBNDarkGreen' : 'text-white hover:bg-[#3b4823]'}`}>
                        <Icon size={24} />
                    </div>

                    <div className={`flex items-center gap-4 px-4 py-3 rounded-xs whitespace-nowrap font-medium ml-8 transition-colors duration-300
                    ${isOpen ? 'opacity-100 ' : 'opacity-0 pointer-events-none'}
                    ${isActive ? 'bg-BBNDarkGreen text-white' : 'text-BBNDarkGreen hover:bg-[#3b4823] hover:text-white'} w-full`}
                    >
                        <span>{label}</span>
                    </div>
                </>
            )}
        </NavLink>
    );
}


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(true);
    const ToggleIcon = isOpen ? LuPanelLeftClose : LuPanelRightClose;

    return (
        <aside
            aria-expanded={isOpen}
            className={`h-screen flex flex-col bg-gray-200
        transition-all duration-300 will-change-[width]
        ${isOpen ? 'w-72' : 'w-20'}`}
        >
            {/* Green Background Stripe */}
            <div className="absolute top-0 left-0 bottom-0 w-20 bg-BBNDarkGreen rounded-r-lg z-0" />

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

                {/* ---------------------------------------------------------------- */}
                {/* Main Navigation                                                  */}
                {/* ---------------------------------------------------------------- */}
                <nav className="flex-1 px-2 space-y-2" aria-label="Main Navigation">
                    {NavLinks.map(item => (
                        <NavItem key={item.to} {...item} isOpen={isOpen} />
                    ))}
                </nav>

                {/* ---------------------------------------------------------------- */}
                {/* Footer                                                           */}
                {/* ---------------------------------------------------------------- */}
                <div className="px-2 pb-2 space-y-2 shrink-0">
                    {NavFooterLinks.map(item => (
                        <NavItem key={item.to} {...item} isOpen={isOpen} />
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
    );
}
