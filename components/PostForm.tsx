import { dateFormat } from "helper/utils";
import { FC, forwardRef, LegacyRef, MouseEvent, PropsWithRef } from "react"

type FormProps = {
  targetPost: PostData;
  onPostSubmit: (ev: MouseEvent) => void;
  btnText: string;
}

const PostForm = forwardRef(( {targetPost, onPostSubmit, btnText }: FormProps, ref: React.Ref<HTMLFormElement>) => {
  return <>
    <form className="grid grid-cols-1 gap-4" ref={ref }>
      <input type="text" name="username" id="username" maxLength={4} 
        className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
        placeholder="내 이름"
        defaultValue={targetPost?.name ?? ''}
      />
      <textarea name="message" id="message" rows={8}
        className="block w-full py-3 px-6 border border-solid border-gray-300 focus:border-yellow-500 rounded-md shadow-md outline-none" 
        placeholder="메시지를 남겨줘!"
        defaultValue={targetPost?.message ?? ''}
      />
      <button
        onClick={onPostSubmit}
        className="py-3 px-6 text-center text-white bg-yellow-500 rounded-md shadow-md"
      >{btnText}</button>
    </form>
    {targetPost && <div className="text-right mt-6">
      <div className='text-sm'>처음 등록일: {dateFormat(targetPost.initDate)}</div>
      <div className='text-sm'>마지막 수정일: {dateFormat(targetPost.updateDate)}</div>
    </div>}
  </>
});

PostForm.displayName = "PostForm";

export default PostForm