import useSWR from "swr";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { fetcher } from "lib/fetcher";
import Layout from "@/components/layout";

const PaperDetail: NextPage<{}> = () => {
  const router = useRouter();
  const {data, error} = useSWR<{paper: CompletedPaper}>(`/api/complete/${router.query.uid}`, fetcher);
  
  if (error) return <div>401</div>
  if (!data) return <div>loading...</div>
  return <Layout>
    <h1>완성 롤링페이퍼</h1>
    {data.paper.posts.map((post, i) => {
      return <div key={`post-${i}`}>
        <div>{post.name}</div>
        <div>{post.message}</div>
      </div>
    })}
  </Layout>
}

export default PaperDetail;