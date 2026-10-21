import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function C2CShortRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/c2c-register");
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirecting to C2C Registration | CSI KKWIEER</title>
        <meta httpEquiv="refresh" content="0; url=/c2c-register" />
      </Head>
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans p-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-300">Redirecting to C2C 5.0 Registration...</p>
        <a href="/c2c-register" className="mt-4 text-xs text-blue-400 underline">
          Click here if not redirected automatically
        </a>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/c2c-register",
      permanent: false,
    },
  };
}
