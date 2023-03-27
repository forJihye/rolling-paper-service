import { NextPage } from "next";
import { signIn } from "next-auth/react";
import Layout from "@/components/Layout"

const Login: NextPage<{}> = ({}) => {
  return <Layout>    
    <div className="pt-14 text-center">
      <h1 className='text-3xl text-pink tracking-tighter mb-7'>Login</h1>
      <div className='w-full text-center px-10'>
        <a onClick={(ev) => signIn('google', {callbackUrl: '/paper'})} className="mb-5 block w-full py-4 px-12 mx-auto text-center rounded-full text-gray-500 hover:text-pink neumorphism hover:shadow-inset cursor-pointer">Google 계정 로그인</a>
        <a onClick={(ev) => signIn('kakao', {callbackUrl: '/paper'})}  className="block w-full py-4 px-12 mx-auto text-center rounded-full text-gray-500 hover:text-pink neumorphism hover:shadow-inset cursor-pointer">카카오 계정 로그인</a>
      </div>
    </div>
  </Layout>
}

export default Login;