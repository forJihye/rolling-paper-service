import { NextPage } from "next";
import { PaperPostData } from "pages/mypaper/[uid]";
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useState } from "react";

const PostAdmin: NextPage<{
  posts: PaperPostData["posts"];
  setPosts: Dispatch<SetStateAction<PaperPostData["posts"]>>;
  onPostDelete: (posts: PaperPostData["posts"]) => Promise<void>;
}> = ({posts, setPosts, onPostDelete }) => {
  const [isDelete, setIsDelete] = useState(false);

  const handlerPaperCheck = (postKey: string) => (ev: ChangeEvent<HTMLInputElement>) => {
    setPosts(prevState => prevState && prevState.map((post) => post.key === postKey ? ({...post, checked: !post.checked}) : post))
  }

  const handlerIsDelete = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setIsDelete(!isDelete);
    setPosts(prevState => prevState && prevState.map((post) => ({...post, checked: false})));
  }

  const handlerDeleteCancel = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setIsDelete(false);
    setPosts(prevState => prevState && prevState.map((post) => ({...post, checked: false})));
  }

  const handlerDeleteConfirm = async (ev: MouseEvent<HTMLButtonElement>) => {
    const checkedPosts = posts.filter(({checked}) => checked);
    if (!checkedPosts.length) return;
    onPostDelete(checkedPosts).then(() => {
      setIsDelete(false);
      setPosts(prevState => prevState && prevState.map((post) => ({...post, checked: false})));
    });
  }

  return <div className="w-full h-full mt-4 relative">
    <button className={`block ml-auto px-4 py-1 rounded-lg text-base bg-neumorphism ${!isDelete ? 'shadow-insetthin text-gray-400' : 'shadow-drop-insetthin text-pink'}`} onClick={handlerIsDelete}>선택</button>
    {posts.map((post, i) => {
      return <div key={`post-${i}`} className='mt-5 p-5 text-gray-500 text-lg bg-neumorphism shadow-insetthin rounded-lg'>
        <div className="w-full relative overflow-hidden">
          <div className={`absolute top-0 ${!isDelete ? '-right-1/2' : 'right-0'} transition-all`}>
            <input type="checkbox" id={`checkbox-${i}`} className="hidden" checked={post.checked} value={post.key} onChange={handlerPaperCheck(post.key)} />
            <label htmlFor={`checkbox-${i}`} className={`w-8 h-8 flex justify-center items-center rounded-full bg-neumorphism relative z-10 cursor-pointer ${!post.checked ? 'shadow-insetthin' : 'shadow-drop-insetthin'}`}>
              <svg className={`w-5 h-5 ${!post.checked ? 'text-gray-500' : 'text-pink'}`}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </label>
          </div>
          <div className={`text-gray-500 text-lg pr-8`}>
            <p className="text-gray-800">{post.name}</p>
            <p className="whitespace-pre-line">{post.message}</p>
          </div>
        </div>
      </div>
    })}  
    
    <div className={`fixed left-1/2 ${!isDelete ? '-bottom-full' : 'bottom-0'} -translate-x-1/2 z-50 w-[480px] mx-auto flex items-center justify-between transition-all bg-neumorphism`}>
      <button onClick={(ev) => handlerDeleteCancel(ev)} className="block flex-1 py-3 text-center text-lg text-gray-500 bg-neumorphism shadow-insetthin rounded-md mr-2">취소</button>
      <button onClick={(ev) => handlerDeleteConfirm(ev)} className="block flex-1 py-3 text-center text-lg text-pink bg-neumorphism shadow-insetthin rounded-md ml-2">삭제</button>
    </div>
  </div>
}

export default PostAdmin;