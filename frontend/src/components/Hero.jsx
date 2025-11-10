import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden'>
        {/* Hero left side */}
        <div className='flex items-center justify-center w-full py-10 sm:w-1/2 sm:py-0 px-6 sm:px-10'>
            <div className='text-slate-800'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-slate-700'></p>
                    <p className='text-sm font-medium md:text-base text-slate-600'>OUR BEST SELLERS</p>
                </div>
                <h1 className='text-3xl leading-relaxed sm:py-3 lg:text-5xl prata-regular text-slate-900'>Affordable. Adorable. Absolutely you.</h1>
                <div className='flex items-center gap-3 mt-3'>
                    <p className='text-sm font-medium md:text-base text-slate-600'>SHOP NOW</p>
                    <p className='w-8 md:w-11 h-[1px] bg-slate-600'></p>
                </div>
            </div>
        </div>
        {/* Hero right side */}
        <img className='w-full sm:w-1/2 object-cover' src={assets.hero_img} alt="Hero" />
    </div>
  )
}

export default Hero
