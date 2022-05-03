import useSWR from "swr";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { fetcher } from "lib/fetcher";
import Layout from "@/components/layout";

// http://localhost:3000/paper/completed/2eefa54d-c2a8-4810-96fe-83df83794ef2
const PaperDetail: NextPage<{}> = () => {
  const router = useRouter();
  const {data, error} = useSWR<any>(`/api/completed/${router.query.uid}`, fetcher);
  
  if (error) return <div>401</div>
  if (!data) return <div>loading...</div>
  return <Layout>
    <h1>완성 롤링페이퍼</h1>
  </Layout>
}

export default PaperDetail;