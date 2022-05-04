import useSWR from "swr";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { fetcher } from "lib/fetcher";
import Layout from "@/components/layout";

// 예시링크: http://localhost:3000/complete/acaf971b-9d43-42f8-ac60-5ccda1a33202
const PaperDetail: NextPage<{}> = () => {
  const router = useRouter();
  const {data, error} = useSWR<{data: PostsData}>(`/api/complete/${router.query.uid}`, fetcher);
  
  if (error) return <div>401</div>
  if (!data) return <div>loading...</div>
  return <Layout>
    <h1>완성 롤링페이퍼</h1>
    {data.data.posts.map((post, i) => {
      return <div key={`post-${i}`}>
        <div>{post.name}</div>
        <div>{post.message}</div>
      </div>
    })}
  </Layout>
}

export default PaperDetail;