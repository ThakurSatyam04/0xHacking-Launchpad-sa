import React from 'react'

const RightSidebar = () => {
  return (
    <aside className='md:fixed top-28 right-5 h-[calc(100vh-135px)] w-[300px] bg-[#FAFAFC] dark:bg-[#161717] shadow-md rounded-xl border border-[#E6EAF0] dark:border-[#343434]'>
      <div className='flex items-center justify-between bg-white dark:bg-[#1E1E1E] rounded-t-xl p-4'>
        <div className='flex flex-col'>
          <span className='font-semibold dark:text-white'>Broadcast Channel</span>
          <span className='text-sm text-gray-500 dark:text-[#9A9A9A]'>online</span>
        </div>
        <button>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7F7F9C" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </div>
      <div className='mt-2 p-2'>
          <div className='bg-[#F0F9F4] dark:bg-[#29292A] rounded-xl pl-2 pr-2 pt-1 pb-1 w-full flex items-center justify-center'>
            <p className='text-[#07C271] dark:text-[#9A9A9A] text-sm text-center'>Messages are end-to-end encrypted. No one outside of this chat, not even 0x.day, can read.</p>
          </div>
      </div>
    </aside>
  )
}

export default RightSidebar
