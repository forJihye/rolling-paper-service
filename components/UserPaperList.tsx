import { NextPage } from "next";
import Link from "next/link";
import { MouseEvent } from "react";
import { dateFormat, removeTimeFromDate } from "helper/utils";
import { differenceInDays, setYear } from 'date-fns';

const UserPaperList: NextPage<{
  papers: UserPapers;
  onPaperDelete: (uid: string) => (ev: MouseEvent) => void;
  onPaperComplete: (uid: string) => (ev: MouseEvent) => void;
}> = ({papers, onPaperDelete, onPaperComplete}) => {
  return <div className="mt-5">
    {!papers ? <div>만든 롤링페이퍼 없음.</div> 
    : <ul>
      {papers.map((paper, i) => {
        const currentBirthDay = setYear(new Date(paper.friendBirth), new Date().getFullYear());
        const betweenDate = differenceInDays(removeTimeFromDate(currentBirthDay), removeTimeFromDate(new Date()));

        return <li key={`paper-${i}`} className='py-5 border-t border-gray-300 border-solid text-sm'>
          <div>친구 이름: <Link href={`paper/${paper.uid}`}><a className=''>{paper.friendName}</a></Link></div>
          <div>친구 생일: {paper.friendBirth && dateFormat(paper.friendBirth, 'yyyy-MM-dd')}</div>
          {!paper.isCompleted 
          ?  <div className="mt-3">
            <Link href={`mypaper/${paper.uid}`}>
              <a className='inline-block py-2 px-3 mr-3 text-xs text-center text-white bg-yellow-500 rounded-md shadow-md'>메시지 관리</a>
            </Link>
            <button 
              onClick={onPaperDelete(paper.uid)}
              className='inline-block py-2 px-3 mr-3 text-xs text-center text-white bg-slate-400 rounded-md shadow-md'
            >롤링페이퍼 삭제</button>
            <button 
              onClick={onPaperComplete(paper.uid)}
              className='inline-block py-2 px-3 text-xs text-center text-white bg-lime-500 rounded-md shadow-md'
            >롤링페이퍼 완성</button> 
          </div>
          : <Link href={{
              pathname: `complete/[uid]`,
              query: { 
                uid: paper.completedUid 
              },
            }}>
              <a className='inline-block py-2 px-3 text-xs text-center text-white bg-lime-500 rounded-md shadow-md'>롤링페이퍼 보기</a>
            </Link>
          }
        </li>
      })}
    </ul>}
  </div>
}

export default UserPaperList;