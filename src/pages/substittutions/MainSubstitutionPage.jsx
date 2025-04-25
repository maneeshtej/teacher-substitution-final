import React, { useEffect, useState } from 'react'
import { BackLogo } from '../../components/Logos'
import TypeSelector from './components/TypeSelector';
import useTeachStore from '../../context/useTeachStore';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNavigate } from 'react-router-dom';

const useSubStore = create(
    persist(
        (set) => ({
            typeState: {
            type: null,
            visible: false,
            filled: false
          },
          allowSteps: {
            step1: true,
            step2: false
          },

          settypestate: (newTypeState) => set({typeState: newTypeState}),
          setallowsteps: (newAllowSteps) => set({allowSteps: newAllowSteps}),
          resetstate: () => set({
            typeState: {
              type: null,
              visible: false,
              filled: false
            },
            allowSteps: {
              step1: true,
              step2: false
            }
          })
        }),
        {name: 'sub-store'}
    )
)

function MainSubstitutionPage() {
  const [stage, setStage] = useState(0);
  const navigate = useNavigate();
  const [typeState, setTypeState] = useState(useSubStore((state) => state.typeState))
  const [allowSteps, setAllowSteps] = useState(useSubStore((state) => state.allowSteps))
  const {settypestate, setallowsteps, resetstate} = useSubStore();
  const teacherID = useTeachStore((state) => state.teacherid);
  const teachersubstitutionsToSend = useTeachStore((state) => state.teachersubstitutionstosend);

  const updateType = (type) => {
    setTypeState(prev => ({
      ...prev,
      type,
      visible: false,  
      filled:true
    }));
    setAllowSteps(prev => ({
        ...prev,
        step2: true
    }))
  };

  const toggleTypeSelector = () => {
    setTypeState(prev => ({
      ...prev,
      visible: !prev.visible
    }));
  };

  useEffect(() => {
    settypestate(typeState);
  }, [typeState])

  useEffect(() => {
    setallowsteps(allowSteps);
  }, [allowSteps])

  return (
    <div className='fixed h-[100dvh] w-[100vw] bg-backgroundc text-textc'>
      <TypeSelector visible={typeState.visible} type={typeState.type} setType={updateType} />
      
      <div className='h-[10dvh] w-[100%] flex items-center gap-[10px] px-[min(3vw,50px)] cursor-pointer'>
        <div onClick={() => {
            localStorage.removeItem('sub-store');
            resetstate();
            navigate('/home');
        }}>
            <BackLogo size='min(3rem,7vw)'/>
        </div>
        <h1 className='text-[min(3rem,7vw)] font-bold lg:font-normal'>Add Substitutions</h1>
      </div>

      <div className='h-[90dvh] w-[100%] p-[min(3vw,50px)] overflow-scroll'>
        <div className='px-[min(3vw,50px)]'>
          <h1 className='text-[min(2rem,5vw)] font-bold lg:font-normal'>Select Type</h1>
          <div className='h-[2vh]'></div>
          <span
            className='flex bg-textc text-backgroundc p-[min(3vw,30px)] rounded-md cursor-pointer'
            onClick={toggleTypeSelector}
          >
            {
            typeState.type == 0 ? "Give Class" :
            typeState.type == 1 ? "Take Class" :
            typeState.type == 2 ? "Swap Class" :
            "Tap to select"}
          </span>
        </div>
        <div className='h-[min(5vw,20px)]'></div>
        <div className={`${allowSteps.step2 == false ? 'opacity-30 pointer-events-none' : 'opacity-100'} px-[min(3vw,50px)] z-0`}>
          <h1 className='text-[min(2rem,5vw)] font-bold lg:font-normal'>Select Classes</h1>
          <div className='h-[100dvh] w-[100%] bg-red-300'></div>
        </div>
      </div>
      <div className='fixed h-[10dvh] w-[100%] z-20 bottom-0 flex justify-center items-center bg-gradient-to-b from-[rgba(30,30,30,0)] via-[rgba(30,30,30,0.4)] to-[rgba(30,30,30,1)]'>
        <span className='bg-textc flex items-center justify-center text-backgroundc font-bold tracking-wide p-[min(3vw,20px)] rounded-md cursor-pointer w-[min(60%,300px)]'>Send</span>
      </div>
    </div>
  );
}

export default MainSubstitutionPage;
