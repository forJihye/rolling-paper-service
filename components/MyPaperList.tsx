import { NextPage } from "next";
import Link from "next/link";
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { removeTimeFromDate } from "helper/utils";
import { differenceInDays, setYear } from 'date-fns';
import { MyPapersData } from "pages/mypaper";

const MyPaperList: NextPage<{
  papers: MyPapersData;
  setPapers: Dispatch<SetStateAction<MyPapersData>>;
  onPaperReMake: (uid: string) => (ev: MouseEvent) => void;
  onPaperComplete: (uid: string) => (ev: MouseEvent) => void;
  onPaperListDelete: (papers: MyPapersData) => Promise<void>;
}> = ({papers, setPapers, onPaperReMake, onPaperComplete, onPaperListDelete}) => {
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
    const checkedPapers = papers.filter(({checked}) => checked)
    if (!checkedPapers.length) return;
    onPaperListDelete(checkedPapers).then(() => {
      setIsDelete(false);
      setPapers(prevState => prevState && prevState.map((paper) => ({...paper, checked: false})))
    });
  }

  return <div className="w-full h-full mt-4 relative">
    <button className={`block ml-auto px-4 py-1 rounded-lg text-base bg-neumorphism ${!isDelete ? 'shadow-insetthin text-gray-400' : 'shadow-drop-insetthin text-pink'}`} onClick={handlerIsDelete}>선택</button>
    {papers.map((paper, i) => {
      const currentBirthDay = setYear(new Date(paper.friendBirth), new Date().getFullYear());
      const betweenDate = differenceInDays(removeTimeFromDate(currentBirthDay), removeTimeFromDate(new Date()));
      return <div key={`paper-${i}`} className='mt-5 p-5 text-gray-500 text-lg bg-neumorphism shadow-insetthin rounded-lg'>
        <div className="w-full relative overflow-hidden pl-3 py-4">
          <div className={`absolute top-0 ${!isDelete ? '-left-1/2' : 'left-0'} transition-all`}>
            <input type="checkbox" id={`checkbox-${i}`} className="hidden" checked={paper.checked} value={paper.uid} onChange={handlerPaperCheck(paper.uid)} />
            <label htmlFor={`checkbox-${i}`} className={`w-8 h-8 flex justify-center items-center rounded-full bg-neumorphism relative z-10 cursor-pointer ${!paper.checked ? 'shadow-insetthin' : 'shadow-drop-insetthin'}`}>
              <svg className={`w-5 h-5 ${!paper.checked ? 'text-gray-500' : 'text-pink'}`}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </label>
          </div>
          <p className={`absolute top-1/2 ${!isDelete ? 'left-0' : 'left-10'} -translate-y-1/2 transition-all text-gray-500 text-lg`}>
            내 친구 {paper.friendName} ({paper.friendBirth.split('T')[0]})
          </p>
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
            {betweenDate < 7 
            ? <button onClick={onPaperComplete(paper.uid)} className='flex-1 mr-3 block py-3 px-4 rounded-3xl text-center bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin'>
              <span className="text-base text-pink animate-pulse">완성하기</span>
            </button>
            : null}
            <Link href={`mypaper/${paper.uid}`}>
              <a className='flex-1 mr-3 block py-3 px-4 rounded-3xl text-center text-base text-gray-500 bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin'>메시지 관리</a>
            </Link>
            <button onClick={onPaperReMake(paper.uid)} className='flex-1 block py-3 px-4 rounded-3xl text-center text-base text-gray-500 bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin'>다시 만들기</button>
          </div>
        : <Link href={{ pathname: `complete/[uid]`, query: { uid: paper.completedUid } }}>
            <a className='w-full block mt-4 py-3 px-4 rounded-3xl text-center text-base text-gray-500 bg-neumorphism shadow-insetthin hover:shadow-drop-insetthin'><span className="text-pink">💌 롤링페이퍼</span> 보러가기</a>
          </Link>
        }
      </div>
    })}
    <div className="mt-3 text-gray-400 text-sm text-right">롤링페이퍼는 친구 생일 일주일 전부터 완성할 수 있습니다.</div>
    <div className={`fixed left-1/2 ${!isDelete ? '-bottom-full' : 'bottom-0'} -translate-x-1/2 z-50 w-[480px] mx-auto flex items-center justify-between transition-all bg-neumorphism`}>
      <button onClick={(ev) => handlerDeleteCancel(ev)} className="block flex-1 py-3 text-center text-lg text-gray-500 bg-neumorphism shadow-insetthin rounded-md mr-2">취소</button>
      <button onClick={(ev) => handlerDeleteConfirm(ev)} className="block flex-1 py-3 text-center text-lg text-pink bg-neumorphism shadow-insetthin rounded-md ml-2">삭제</button>
    </div>
  </div>
}

export default MyPaperList;