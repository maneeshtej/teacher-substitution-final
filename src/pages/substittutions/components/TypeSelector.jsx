import React from 'react';

function TypeSelector({ visible, type, setType }) {

  if (!visible) return null;

  return (
    <div className='fixed h-[100dvh] w-[100vw] bg-backgroundc text-textc z-10'>
    <div className='h-[10dvh] flex items-center px-[min(3vw,50px)]'>
      <h1 className='text-[min(3rem,6vw)] font-normal'>Select Type</h1>
    </div>
    <div className='h-[90dvh] w-[100%] p-[min(3vw,50px)] flex flex-col items-center gap-[10px]'>
  
      {['Give Class', 'Take Class', 'Swap Class'].map((label, i) => (
        <span
          key={i}
          className={`
            p-[min(3vw,20px)] w-[90%] md:w-[40%] rounded-md flex items-center justify-center cursor-pointer
            ${type === i ? 'bg-textc text-backgroundc' : 'bg-backgroundc text-textc border border-borderc border-[0.5px]'}
          `}
          onClick={() => setType(i)}
        >
          {label}
        </span>
      ))}
  
    </div>
  </div>
  
  );
}

export default TypeSelector;
