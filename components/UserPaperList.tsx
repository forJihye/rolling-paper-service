import { NextPage } from "next";
import Link from "next/link";
import { MouseEvent } from "react";
import { dateFormat } from "helper/utils";

const UserPaperList: NextPage<{
  papers: UserPapers;
  onPaperDelete: (uid: string) => (ev: MouseEvent) => void;
  onPaperComplete: (uid: string) => (ev: MouseEvent) => void;
}> = ({papers, onPaperDelete, onPaperComplete}) => {
  return <ul>
  {!papers 
  ? <div>만든 롤링페이퍼 없음.</div> 
  : papers.map((paper, i) => {
    return <li key={`paper-${i}`} className='py-5 border-t border-gray-300 border-solid text-sm'>
      <div>친구 이름: {paper.friendName}</div>
      <div>친구 생일: {paper.friendBirth && dateFormat(paper.friendBirth, 'yyyy-MM-dd')}</div>
      <div>내 이름: {paper.userName}</div>
      <div style={{fontSize: 13}}>{paper.uid}</div>
      {!paper.isCompleted 
      ?  <>
        <Link href={`paper/${paper.uid}`}>
          <a className='inline-block py-2 px-4 text-sm text-center text-white bg-yellow-500 rounded-md shadow-md'>메시지 남기기</a>
        </Link>
        <button 
          onClick={onPaperDelete(paper.uid)}
          className='inline-block py-2 px-4 text-sm text-center text-white bg-slate-400 rounded-md shadow-md'
        >롤링페이퍼 삭제</button>
        <button 
          onClick={onPaperComplete(paper.uid)}
          className='inline-block py-2 px-4 text-sm text-center text-white bg-lime-500 rounded-md shadow-md'
        >롤링페이퍼 완성</button> 
      </>
      : <Link href={{
          pathname: `complete/[uid]`,
          query: { 
            uid: paper.completedUid 
          },
        }}>
          <a className='inline-block py-2 px-4 text-sm text-center text-white bg-lime-500 rounded-md shadow-md'>롤링페이퍼 보기</a>
        </Link>
      }
    </li>
  })}
</ul>
}

export default UserPaperList;