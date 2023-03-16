import { NextPage } from "next";
import { signIn } from "next-auth/react";
import Layout from "@/components/Layout"

const Login: NextPage<{}> = ({}) => {
  return <Layout>
    <h1 className="text-center">로그인 하기</h1>
    <a onClick={(ev) => {
      ev.preventDefault();
      signIn('google', {callbackUrl: '/paper'});
    }} 
    className="p-2 lg:px-4 md:mx-2 text-indigo-600 text-center rounded first:border border-solid border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300"
    >Google 계정으로 로그인</a> 
    <a onClick={(ev) => {
      ev.preventDefault();
      signIn('kakao', {callbackUrl: '/paper'});
    }} 
    className="p-2 lg:px-4 md:mx-2 text-indigo-600 text-center rounded first:border border-solid border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300"
    >카카오 계정으로 로그인</a> 
  </Layout>
}

export default Login;