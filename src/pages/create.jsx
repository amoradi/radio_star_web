import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { useRouter } from 'next/router'
import Head from "next/head";

import Layout from "components/Layout";
import Spinner from "components/Spinner";

import { useContracts } from "contexts";
import { toastSuccessMessage, toastErrorMessage } from "utils/toast";

export default function Create({ }) {
    const router = useRouter();
    const [tabIndex, setTabIndex] = useState(0);
    
    useEffect(() => {
        if ("list" in router.query) {
            setTabIndex(1);
        } else {
            setTabIndex(0);
        }
    },[router.query]);

    return (
        <div className="container mx-auto p-5">
           <h1 className="text-center text-lg font-bold">Create</h1>

            <div className="py-12">
            NFT creation form here
            </div>  
        </div>
    );

//   const { dcWarriorsContract } = useContracts();
//   const [mintAddress, setMintAddress] = React.useState("");
//   const [isMinting, setIsMinting] = useState(false);

//   const mintNft = async (address) => {
//     setIsMinting(true);
//     try {
//       const txn = await dcWarriorsContract.mint(address);
//       await txn.wait();
//       toastSuccessMessage(`🦄 NFT was successfully minted!`);
//     } catch (e) {
//       toastErrorMessage(
//         `Couldn't mint nft. Please check the address or try again later.`
//       );
//     }
//     setIsMinting(false);
//   };

  return (
    <div className="mx-auto mt-8 max-w-7xl p-4">
      <section className="body-font text-gray-600">
        <div className="border-1 m-auto flex flex-col rounded-lg border-gray-100 p-8 md:w-1/2 lg:w-2/6">
          <h2 className="title-font mb-5 text-lg font-medium ">
            Immortalize your creation
          </h2>
          <div className="relative mb-4">
            <label className="text-sm leading-7">
              Mint new NFT to this address
            </label>
            <input
              type="text"
              className="w-full rounded border border-gray-300 bg-white py-1 px-3 text-base leading-8 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={mintAddress}
              placeholder="0x14dc79964da2c08b23698b3d3cc7ca32193d9955"
              onChange={(e) => setMintAddress(e.target.value)}
            />
          </div>
          {!isMinting && (
            <button
              className="rounded border-0 bg-indigo-500 py-2 px-8 text-lg text-white hover:bg-indigo-600 focus:outline-none"
              onClick={() => mintNft(mintAddress)}
            >
              Mint item
            </button>
          )}
          {isMinting && (
            <div className="mt-1">
              <Spinner />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

Create.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Head>
        <title>Account | Radio Star</title>
      </Head>
      <div className="body-font mx-auto max-w-7xl p-4 text-gray-600">
        {page}
        </div>
    </Layout>
  );
};
