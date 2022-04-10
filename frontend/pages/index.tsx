import type { NextPage } from 'next'
import Link from 'next/link'
import Layout from '../components/layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <h1>Wellcom</h1>
      <Link href="/login">Sing in</Link>
    </Layout>
  )
}

export default Home
