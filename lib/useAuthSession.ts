import { NextApiRequest, NextApiResponse } from "next";
import { getSession, useSession } from "next-auth/react";
import Router from 'next/router';
import { useEffect } from "react";

const useAuthSession = () => {
  const { data: session, status } = useSession(); 
  useEffect(() => {
    if (status === 'unauthenticated') Router.push('/login');
  }, []);
  return [session, status];
}

export default useAuthSession;