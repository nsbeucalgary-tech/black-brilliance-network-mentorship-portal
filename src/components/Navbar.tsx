import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LuPanelRightClose, LuPanelLeftClose } from "react-icons/lu";
import { RiComputerLine } from "react-icons/ri";
import { GiCalendar } from "react-icons/gi";
import { FaPeopleArrows } from "react-icons/fa";
import { IoNewspaperOutline, IoHome } from "react-icons/io5";
import {
    MdSettings,
    MdLogout
} from 'react-icons/md';
import BBNLogo from "../assets/BBNLogo.svg"
import BBNLogoWhite from "../assets/BBNLogoWhite.svg"


export default function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const navBehaviour = () => {
        setIsOpen(!isOpen);
    };

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: RiComputerLine },
        { to: '/calendar', label: 'Calendar', icon: GiCalendar },
        { to: '/matching', label: 'Matchmaking', icon: FaPeopleArrows },
        { to: '/newsletter', label: 'Newsletter', icon: IoNewspaperOutline },
        { to: '/home', label: 'Home', icon: IoHome },
    ]

    return (
        <aside
            className={`transition-all duration-300 min-h-screen flex flex-col`}
        >
            <div className='h-full flex flex-row'>
                <div className='h-full flex flex-col w-20 items-center text-white bg-BBNDarkGreen'> {/*  Green section. Always shown*/}
                    <div className='h-40'> {/*  Div to keep this and the 'Black Brilliance' title div level, and also allow nav links to be level in both seperate divs.*/}
                        <div className='w-15 h-15 mt-3'>
                            <img src={BBNLogoWhite} className={`${isOpen ? 'hidden' : 'inline'} w-full h-full object-contain`} />
                        </div>
                    </div>

                    <nav className="flex-col flex-1 px-4 py-6 space-y-2">
                        {navLinks.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                aria-label={item.label}
                                title={item.label}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-white text-BBNDarkGreen'
                                        : 'text-white hover:bg-[#3b4823]'
                                    }`
                                }
                            >
                                <item.icon size={24} />
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 space-y-2 text-white">
                        <NavLink
                            to='/'
                            type="button"
                            className="w-full px-4 py-3 rounded-lg flex items-center gap-4 transition-colors hover:text-BBNDarkGreen hover:bg-white"
                        >
                            <MdSettings size={24} className="shrink-0" />
                        </NavLink>

                        <NavLink
                            to="/"
                            className="w-full px-4 py-3 rounded-lg flex items-center gap-4 transition-colors hover:text-BBNDarkGreen hover:bg-white"
                        >
                            <MdLogout size={24} className="shrink-0" />
                        </NavLink>
                    </div>


                    <div className='flex items-center justify-center mt-auto mb-2'> {/*  Dynamic button to open and close Navbar*/}
                        <button aria-label={isOpen ? "Close Menu" : "Open Menu"}
                            title={isOpen ? "Close Menu" : "Open Menu"}
                            className='inline-flex items-center p-2 justify-center hover:bg-white hover:text-BBNDarkGreen rounded-xs' onClick={navBehaviour}>
                            {isOpen ? (
                                <LuPanelLeftClose className="h-6 w-6" aria-label="true" />
                            ) : (
                                <LuPanelRightClose className="h-6 w-6" aria-label="true" />
                            )}
                        </button>

                    </div>
                </div>
                <div className={`${isOpen ? 'w-64 flex' : 'w-0 hidden'} bg-gray-200 h-full flex-col`}> {/*  White section. Can hide and show based on isOpen */}
                    <div className='flex justify-center h-40'>
                        <div className='flex flex-row justify-center items-center'>
                            <img src={BBNLogo} className='w-16 h-16' />
                            <div className='flex flex-col text-xl font-semibold'>
                                <span className='text-BBNDarkGreen'>Black</span>
                                <span className='text-[#aad576]'>Brilliance</span>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-col flex-1 px-4 py-6 space-y-2">
                        {navLinks.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                aria-label={item.label}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-BBNDarkGreen text-white'
                                        : 'text-BBNDarkGreen hover:bg-[#3b4823] hover:text-white'
                                    }`
                                }
                            >
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 space-y-2 text-BBNDarkGreen">
                        <NavLink
                            to='/'
                            type="button"
                            className="w-full px-4 py-3 hover:bg-[#3d4e2f] rounded-lg flex items-center gap-4 transition-colors hover:text-white"
                        >
                            <span className="font-medium">Settings</span>
                        </NavLink>

                        <NavLink
                            to="/"
                            className="w-full px-4 py-3 hover:bg-[#3b4823] rounded-lg flex items-center gap-4 transition-colors hover:text-white"
                        >
                            <span className="font-medium">LogOut</span>
                        </NavLink>
                    </div>
                        <div className='mt-auto h-10 mb-2'></div>
                </div>
            </div>


        </aside>
    );
}