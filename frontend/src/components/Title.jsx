import React from 'react'

const Title = ({text1, text2}) => {
  return (
    <div className='inline-flex items-center gap-3 mb-3'>
        <p className='text-slate-500'>
            {text1}
            &nbsp;
            <span className='font-semibold text-slate-800'>{text2}</span>
        </p>
        <p className='w-8 sm:w-12 h-[2px] bg-violet-600 rounded-full'></p>
    </div>
  )
}

export default Title
