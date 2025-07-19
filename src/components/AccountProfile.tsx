import React from 'react'

export default function AccountProfile({name}:{name:string}) {
  return (
    <div className='text-xs font-semibold h-[32px] w-[32px] flex justify-center items-center rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500'>
        A{name[name.length-1]}
    </div>
  )
}
