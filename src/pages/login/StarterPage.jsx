import React from 'react'

function StarterPage() {
  return (
    <div className='bg-backgroundc h-[100vh] w-full overflow-hidden flex flex-col items-center'>
      <div className='h-[10dvh] w-[100vw] flex items-center bg-green-300'>
        <div className='px-[10px] text-black text-[min(1.5rem,5vw)] font-bold '>
            <span>Teacher Substitution</span>
            </div>
        <div className='px-[10px] ml-auto'>
            <div className='text-textc bg-black p-[10px] px-[20px] rounded-full'>
                <a href='/login' className='text-[min(1rem,4vw)]'>Login</a>
            </div>
        </div>
      </div>
      <div className='h-[90dvh] w-[85vw] flex flex-row justify-start items-center'>
        <div className='flex'>
            <h1 className='text-textc font-bold text-[min(4rem,10vw)]'>Join us <br /> to make the <br /> Revolution!</h1>
        </div>
        {/* Corrected Sign Up Bar */}
        <div className='absolute bottom-0 left-0 overflow-hidden w-full h-[10dvh] flex items-center justify-center bg-black border-t border-white
                        md:static md:w-auto md:h-auto md:p-[10px] md:px-[30px] md:rounded-full md:bg-green-300 md:border-none md:ml-auto '> {/* Adjust md: styles as needed */}
            <h1 className='text-textc font-bold text-[min(2rem,4.5vw)]'>Sign Up</h1>
        </div>
      </div>

    </div>
  )
}

export default StarterPage
