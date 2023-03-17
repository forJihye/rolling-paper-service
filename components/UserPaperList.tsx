import { NextPage } from "next";
import Link from "next/link";
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { removeTimeFromDate } from "helper/utils";
import { differenceInDays, setYear } from 'date-fns';
import { MyPapersData } from "pages/mypaper";

const UserPaperList: NextPage<{
  papers: MyPapersData;
  setPapers: Dispatch<SetStateAction<MyPapersData>>;
  onPaperReMake: (uid: string) => (ev: MouseEvent) => void;
  onPaperComplete: (uid: string) => (ev: MouseEvent) => void;
  onPaperListDelete: (papers: MyPapersData) => Promise<void>;
}> = ({papers, setPapers, onPaperReMake, onPaperComplete, onPaperListDelete}) => {
  // console.log(papers)

  const [isDelete, setIsDelete] = useState(false);

  const handlerIsDelete = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setIsDelete(!isDelete);
    setPapers(prevState => prevState && prevState.map((paper) => ({...paper, checked: false})))
  }

  const handlerPaperCheck = (uid: string) => (ev: ChangeEvent<HTMLInputElement>) => {
    setPapers(prevState => prevState && prevState.map((paper) => paper.uid === uid ? ({...paper, checked: !paper.checked}) : paper))
  }

  const handlerDeleteCancel = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setIsDelete(false);
    setPapers(prevState => prevState && prevState.map((paper) => ({...paper, checked: false})))
  }

  const handlerDeleteConfirm = async (ev: MouseEvent<HTMLButtonElement>) => {
    const confirm = window.confirm('선택한 롤링페이퍼를 삭제할까요?\n남겨진 메시지도 모두 삭제되어요 T_T');
    if (!confirm) return;
    onPaperListDelete(papers).then(() => {
      setIsDelete(false);
      setPapers(prevState => prevState && prevState.map((paper) => ({...paper, checked: false})))
    });
  }

  return <div className="w-full relative">
    <div className={`flex items-center ${!papers.length ? 'justify-center' : 'justify-start'}`}>
      <div className="text-2xl text-pink tracking-tight">내가 만든 내 친구 롤링페이퍼</div>
      {papers.length ? <button className={`block w-12 h-12 ml-auto rounded-full bg-neumorphism ${!isDelete ? 'shadow-insetthin' : 'shadow-drop-insetthin'}`} onClick={handlerIsDelete}>
        {!isDelete 
        ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 mx-auto">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-pink mx-auto">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>      
        }
      </button> : null}
    </div>

    {!papers.length 
    ? <div className="py-12 text-center">
        <div className="text-xl text-gray-500 mb-4">만든 롤링페이퍼가 없어요 T_T</div>
        <Link href="paper">
          <a className="block w-full py-5 px-12 mx-auto text-center rounded-full text-gray-500 neumorphism hover:shadow-inset">만들러 가기 🤸🏻</a>
        </Link>
      </div> 
    : <div className="mt-6 mb-14">
      {papers.map((paper, i) => {
        const currentBirthDay = setYear(new Date(paper.friendBirth), new Date().getFullYear());
        const betweenDate = differenceInDays(removeTimeFromDate(currentBirthDay), removeTimeFromDate(new Date()));

        return <div key={`paper-${i}`} className='mt-5 p-4 text-gray-500 text-lg bg-neumorphism shadow-insetthin rounded-lg'>
          <div className="w-full relative overflow-hidden pl-3 py-4">
            <div className={`absolute top-0 ${!isDelete ? '-left-1/2' : 'left-0'} transition-all`}>
              <input type="checkbox" id={`checkbox-${i}`} className="hidden" checked={paper.checked} value={paper.uid} onChange={handlerPaperCheck(paper.uid)} />
              <label htmlFor={`checkbox-${i}`} className={`w-8 h-8 flex justify-center items-center rounded-full bg-neumorphism ${!paper.checked ? 'shadow-insetthin' : 'shadow-drop-insetthin'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${!paper.checked ? 'text-gray-500' : 'text-pink'}`}>
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              </label>
            </div>
            <p className={`absolute top-1/2 ${!isDelete ? 'left-0' : 'left-10'} -translate-y-1/2 transition-all text-gray-500 text-lg`}>내 친구 {paper.friendName} ({paper.friendBirth.split('T')[0]})</p>
            <Link href={`paper/${paper.uid}`}>
              <a className='absolute top-1/2 right-0 -translate-y-1/2 text-gray-500 text-lg z-10'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </a>
            </Link>
          </div>
          {!paper.isCompleted 
          ? <div className="flex flex-row justify-between items-center mt-4">
              {betweenDate < 7 ? <button onClick={onPaperComplete(paper.uid)} className='flex-1 mr-3 block py-3 px-4 rounded-3xl text-center text-base text-gray-500 bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin'>
                완성하기
              </button> : null}
              <Link href={`mypaper/${paper.uid}`}>
                <a className='flex-1 mr-3 block py-3 px-4 rounded-3xl text-center text-base text-gray-500 bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin'>메시지 관리</a>
              </Link>
              <button onClick={onPaperReMake(paper.uid)} className='flex-1 block py-3 px-4 rounded-3xl text-center text-base text-gray-500 bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin'>다시 만들기</button>
            </div>
          : <Link href={{ pathname: `complete/[uid]`, query: { uid: paper.completedUid } }}>
              <a className='w-full block mt-4 py-3 px-4 rounded-3xl text-center text-base text-pink bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin'>💌 롤링페이퍼 완성!</a>
            </Link>
          }
        </div>
      })}
    </div>}

    <div className={`fixed left-1/2 ${!isDelete ? '-bottom-full' : 'bottom-0'} -translate-x-1/2 w-[480px] mx-auto py-5 flex items-center justify-between transition-all`}>
      <button onClick={(ev) => handlerDeleteCancel(ev)} className="block flex-1 py-3 text-center text-lg text-gray-500 bg-neumorphism shadow-insetthin rounded-md mr-2">취소</button>
      <button onClick={(ev) => handlerDeleteConfirm(ev)} className="block flex-1 py-3 text-center text-lg text-pink bg-neumorphism shadow-insetthin rounded-md ml-2">삭제</button>
    </div>
  </div>
}

export default UserPaperList;