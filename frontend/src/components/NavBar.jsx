import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const NavBar = ({ onLogout }) => {
    const [visible, setVisible] = useState(false);
    const {setShowSearch, getCartCount} = useContext(ShopContext);
  return (
    <div className='top-0 left-0 z-50 w-full transition-all duration-300 bg-gray-600 bg-opacity-50 shadow-lg backdrop-blur-md flex items-center justify-between py-4 font-medium px-4 sm:px-[4%]'>
        <Link to='/'>
            <img src={assets.logo} className='w-36' alt="Trendify" />
        </Link>
        <ul className='hidden gap-5 text-sm text-white sm:flex'>
            <NavLink to='/' className='flex flex-col items-center gap-1 hover:opacity-90'>
                <p>HOME</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </NavLink>
            <NavLink to='/collection' className='flex flex-col items-center gap-1 hover:opacity-90'>
                <p>COLLECTION</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </NavLink>
            <NavLink to='/about' className='flex flex-col items-center gap-1 hover:opacity-90'>
                <p>ABOUT</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </NavLink>
            <NavLink to='/contact' className='flex flex-col items-center gap-1 hover:opacity-90'>
                <p>CONTACT</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
            </NavLink>
        </ul>
        <div className='flex items-center gap-6'>
            <Link to='/orders' className='text-sm text-white underline underline-offset-4 hover:opacity-90'>My Orders</Link>
            <div className='relative group'>
                <img src={assets.profile_icon} className='w-5 cursor-pointer' alt="Your Profile" />
                <div className='absolute right-0 hidden pt-4 group-hover:block dropdown-menu'>
                    <div className='flex flex-col gap-2 px-5 py-3 text-slate-600 rounded-md w-44 bg-white border border-slate-200 shadow-md'>
                        <Link to='/profile' className='cursor-pointer hover:text-violet-700'>Edit Profile</Link>
                        <button
                          type='button'
                          onClick={onLogout}
                          className='text-left cursor-pointer hover:text-violet-700'
                        >
                          Logout
                        </button>
                    </div>
                </div>
            </div>
            <Link to='/cart' className='relative'>
                <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart" />
                <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-gray-800 text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
            </Link>
            <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="Menu Icon" />
        </div>
        
        {/* INFO: Sidbar menu for smaller screens */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
            <div className='flex flex-col text-slate-700'>
                <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                    <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="Dropdown" />
                    <p>Back</p>
                </div>
                <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-slate-200 hover:bg-slate-50' to='/'>HOME</NavLink>
                <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-slate-200 hover:bg-slate-50' to='/collection'>COLLECTION</NavLink>
                <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-slate-200 hover:bg-slate-50' to='/about'>ABOUT</NavLink>
                <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border-t border-slate-200 hover:bg-slate-50' to='/contact'>CONTACT</NavLink>
            </div>
        </div>
    </div>
  )
}

export default NavBar

