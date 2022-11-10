import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { useRouter } from 'next/router'
import Head from "next/head";

import * as ipfs from 'utils/ipfs';
import Layout from "components/Layout";
import Spinner from "components/Spinner";

import { useContracts, useIpfs } from "contexts";
import { toastSuccessMessage, toastErrorMessage } from "utils/toast";

export default function Profile({ }) {
    const router = useRouter();
    const { ipfsClient } = useIpfs();
    const [tabIndex, setTabIndex] = useState(0);
    const [created, setCreated] = useState([]);

    useEffect(() => {
        if ("collected" in router.query) {
            setTabIndex(1);
        } else {
            setTabIndex(0);
        }
    },[router.query]);

    useEffect(() => {
      const getNfts = (async () => {
        try {
          // Created
          if (tabIndex === 0) {
            // Call contract, get all token metadata CIDs associated with address.
            console.log('ipfs.get()...', node);
            // const songsMetadata = await ipfs.get(node, ['QmagygrSKgPt6iFbhc8u9s2JmDqLH3iHDNBLVtKtu9Ky7r']);

            //console.log('ipfs.get() ->', songsMetadata);
            // setCreated(songsMetadata.map((n) => JSON.parse(n)));
          } else {
            // Collected

          }
        } catch(e) {
          console.log(e);
        }
      })();
    }, [tabIndex]);

    return (
        <div className="container mx-auto p-5">
          <h1 className="text-center text-lg font-bold">Profile</h1>

          <div className="py-12">
            DASHBOARD/DATA HERE
          </div>  

            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <TabList>
                <Tab><span className="font-semibold block px-10 py-2">Created</span></Tab>
                <Tab><span className="font-semibold block px-10 py-2">Collected</span></Tab>
                </TabList>

                <TabPanel>
                <div className="py-6">
                <h2>Created NFTs content</h2>
                {created.map((created, i) => <div>
                    <div className="border-2 mt-2 border-gray-900 rounded" key={i}>
                      <div className="w-96 h-72 bg-gray-100 bg-contain" style={{ backgroundImage: `url(${created.image})` }}></div>
                      <div className="border-t-2 border-gray-900 p-4">
                          <div>{`<title>`}</div>
                          <div>{`<filename>`}</div>
                      </div>
                    </div>
                </div>)}

                </div>
                </TabPanel>
                <TabPanel>
                <div className="py-6">
                <h2>Collected NFTs content</h2>
                </div>
                </TabPanel>
            </Tabs>
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
}

Profile.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Head>
        <title>Profile | Radio Star</title>
      </Head>
      <div className="body-font mx-auto max-w-7xl p-4 text-gray-600">
        {page}
        </div>
    </Layout>
  );
};
