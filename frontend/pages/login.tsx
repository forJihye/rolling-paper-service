import Layout from "@/components/layout"
import { NextPage } from "next";
import { signIn } from "next-auth/react";

const Login: NextPage<{}> = ({}) => {
  return <Layout>
    <h1>로그인 하기</h1>
    <a onClick={(ev) => {
      ev.preventDefault();
      signIn('google', {callbackUrl: '/main'});
    }} 
    className="p-2 lg:px-4 md:mx-2 text-indigo-600 text-center rounded first:border border-solid border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300"
    >구글로 로그인 하기</a> 
    <a onClick={(ev) => {
      ev.preventDefault();
      signIn('kakao', {callbackUrl: '/main'});
    }} 
    className="p-2 lg:px-4 md:mx-2 text-indigo-600 text-center rounded first:border border-solid border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300"
    >카카오로 로그인 하기</a> 
  </Layout>
}

export default Login;