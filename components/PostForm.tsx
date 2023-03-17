import { dateFormat } from "helper/utils";
import { forwardRef, MouseEvent } from "react"

type FormProps = {
  targetPost: PostData;
  onPostSubmit: (ev: MouseEvent) => void;
  btnText: string;
  userName: string;
}

const PostForm = forwardRef(( {targetPost, onPostSubmit, btnText, userName }: FormProps, ref: React.Ref<HTMLFormElement>) => {
  return <>
    <form className="grid grid-cols-1 gap-4" ref={ref }>
      <input type="text" name="username" id="username" maxLength={4} 
        className="block w-full py-4 px-6 bg-neumorphism shadow-inset rounded-full outline-none text-gray-500" 
        placeholder="내 이름"
        defaultValue={targetPost?.name ?? ''}
      />
      <textarea name="message" id="message" rows={8}
        className="block w-full py-4 px-6 bg-neumorphism shadow-inset rounded-xl outline-none text-gray-500" 
        placeholder="여기에 하고싶은말 작성해줘~"
        defaultValue={targetPost?.message ?? ''}
      />
      <button
        onClick={onPostSubmit}
        className="block w-full py-5 px-12 mx-auto text-center rounded-full text-pink neumorphism hover:shadow-inset"
      >{btnText}</button>
    </form>
    {targetPost && <div className="text-sm text-gray-500 text-right mt-6">
      <div className="tracking-tight">만든 친구: {userName}</div>
      <div className='tracking-tight'>처음 등록일: {dateFormat(targetPost.initDate)}</div>
      <div className='tracking-tight'>마지막 수정일: {dateFormat(targetPost.updateDate)}</div>
    </div>}
  </>
});

PostForm.displayName = "PostForm";

export default PostForm