import type { AppProps } from "next/app";
import { NextComponentType, NextPageContext } from "next";

export interface NextPageAuth {
  loading?: React.ReactNode;
  redirect: string;
}

export type NextPage = NextComponentType<NextPageContext, any, any> & {
  auth?: NextPageAuth;
};

declare module "next/app" {
  interface AppProps {
    Component: NextPage;
    pageProps: any;
  }
}
