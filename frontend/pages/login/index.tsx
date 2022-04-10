import Link from "next/link";
import useSWR from "swr";
import Layout from "../../components/layout";

export default function Login() {
  const {data, mutate} = useSWR('/api/user', url => fetch(url).then(resolve => resolve.json()));
  const user = data?.user;

  return <Layout title="로그인">
    <h1>Sing in</h1>
    {/* /login/federated/google */}
    {/* <button onClick={handleSubmit}>Sign in with Google</button> */}
  </Layout>
}

const handleSubmit = async () => {
  try {
    const res = await fetch('/api/signin/google', {
      method: 'GET',
    });
  } catch (error) {
    console.error('An unexpected error happened occurred:', error)
  }
}