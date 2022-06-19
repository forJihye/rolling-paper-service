import { NextPage } from "next";
import Link from "next/link";
import { MouseEvent } from "react";
import { dateFormat, removeTimeFromDate } from "helper/utils";
import { differenceInDays, setYear } from 'date-fns';

const UserPaperList: NextPage<{
  papers: UserPapers;
  onPaperReMake: (uid: string) => (ev: MouseEvent) => void;
  onPaperDelete: (uid: string) => (ev: MouseEvent) => void;
  onPaperComplete: (uid: string) => (ev: MouseEvent) => void;
}> = ({papers, onPaperReMake, onPaperDelete, onPaperComplete}) => {
  return <div className="mt-5">
    {!papers ? <div>만든 롤링페이퍼 없음.</div> 
    : <ul>
      {papers.map((paper, i) => {
        const currentBirthDay = setYear(new Date(paper.friendBirth), new Date().getFullYear());
        const betweenDate = differenceInDays(removeTimeFromDate(currentBirthDay), removeTimeFromDate(new Date()));
        
        return <li key={`paper-${i}`} className='py-5 border-t border-gray-300 border-solid text-sm'>
          <div><Link href={`paper/${paper.uid}`}><a className=''>{paper.friendName}</a></Link> ({paper.friendBirth.split('T')[0]})</div>
          {!paper.isCompleted 
          ?  <div className="mt-3">
            <Link href={`mypaper/${paper.uid}`}>
              <a className='inline-block py-2 px-3 mr-3 text-xs text-center text-white bg-yellow-500 rounded-md shadow-md'>메시지 관리</a>
            </Link>
            <button 
              onClick={onPaperReMake(paper.uid)}
              className='inline-block py-2 px-3 mr-3 text-xs text-center text-white bg-slate-400 rounded-md shadow-md'
            >재발급</button>
            {betweenDate < 7 && <button 
              onClick={onPaperComplete(paper.uid)}
              className='inline-block py-2 px-3 mr-3 text-xs text-center text-white bg-lime-500 rounded-md shadow-md'
            >완성</button> }
            <button 
              onClick={onPaperDelete(paper.uid)}
              className='inline-block py-2 px-3 mr-3 text-xs text-center text-white bg-slate-400 rounded-md shadow-md'
            >삭제</button>
          </div>
          : <Link href={{
              pathname: `complete/[uid]`,
              query: { 
                uid: paper.completedUid 
              },
            }}>
              <a className='inline-block py-2 px-3 text-xs text-center text-white bg-lime-500 rounded-md shadow-md'>롤링페이퍼 보러가기</a>
            </Link>
          }
        </li>
      })}
    </ul>}
  </div>
}

export default UserPaperList;