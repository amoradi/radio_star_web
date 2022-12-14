import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { useRouter } from 'next/router'
import Head from "next/head";

import * as ipfs from 'utils/ipfs';
import Layout from "components/Layout";
import Spinner from "components/Spinner";

import { useContracts, useIpfs, useAccount } from "contexts";

/* 

  I apologize for the poor code quality. This is an MVP =).

*/

export default function Profile({ }) {
    const router = useRouter();
    const { ipfsClient } = useIpfs();
    const { radioStarContract } = useContracts();
    const account = useAccount();
    const [isLoading, setIsLoading] = useState(false);

    const [tabIndex, setTabIndex] = useState(0);
    const [created, setCreated] = useState([]);
    const [purchased, setPurchased] = useState([]);

    useEffect(() => {
        if ("collected" in router.query) {
            setTabIndex(1);
        } else {
            setTabIndex(0);
        }
    },[router.query]);

    useEffect(() => {
      const getNfts = (async () => {
        setIsLoading(true);
        try {
          // Created
          if (tabIndex === 0) {
            // Looks like you cannot get the entire mapping without creating a getter...
            // https://ethereum.stackexchange.com/questions/121069/how-to-properly-call-solidity-mapping-in-ethers-js
            
            const tokenIds = [];
            let increment = 1;
            let hasReachedZeroAddress = false; // Stinks assumes increment/know about implementation details.

            const pAccount = parseInt(account, 16);
            while(!hasReachedZeroAddress) {
              const artist = await radioStarContract.tokensToArtist(increment);
              const pArtist = parseInt(artist, 16);

              if (pAccount === pArtist) {
                tokenIds.push(increment);
              }
              
              increment++;
              hasReachedZeroAddress = pArtist === 0;
            }

            const cids = [];
            for (let i = 0, ii = tokenIds.length; i < ii; i ++) {
              const cid = await radioStarContract.uri(tokenIds[i]);

              cids.push(cid);
            }

            const songMetadatas = await ipfs.get(ipfsClient, cids);
            let pSongMetadatas = [];
            try {
              pSongMetadatas = songMetadatas.map((m) => JSON.parse(m));
            } catch(e) {
              console.error(e);
              pSongMetadatas = [];
            }

            setCreated(pSongMetadatas);

          } else {
            // Purchased
            const purchasedSongs = await radioStarContract.getPurchasedSongs(account);
            const songIds = purchasedSongs.map((s) => s?.toNumber());
            const songIdsSet = new Set(songIds);
            const songIds_ = Array.from(songIdsSet);
    
            const cids = [];
            for (let i = 0, ii = songIds_.length; i < ii; i ++) {
              const cid = await radioStarContract.uri(songIds_[i]);

              cids.push(cid);
            }

            const songMetadatas = await ipfs.get(ipfsClient, cids);
            let pSongMetadatas = [];
            try {
              pSongMetadatas = songMetadatas.map((m) => JSON.parse(m));
            } catch(e) {
              console.error(e);
              pSongMetadatas = [];
            }

            setPurchased(pSongMetadatas);
          }
        } catch(e) {
          console.error(e);
        }
        setIsLoading(false);
      })();
    }, [tabIndex, account]);

    return (
        <div className="container mx-auto p-5">
          <h1 className="text-center text-lg font-bold">Profile</h1>

          <div className="py-12">
           
          </div>  

            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <TabList>
                <Tab><span className="font-semibold block px-10 py-2">Created</span></Tab>
                <Tab><span className="font-semibold block px-10 py-2">Purchased</span></Tab>
                </TabList>

                <TabPanel>
                <div className="py-6 flex flex-wrap gap-4">
                  {isLoading && <div className="m-auto p-20"><Spinner /></div> }
                {!isLoading && created.map((created, i) => <div className="inline-block">
                    <div className="border-2 mt-2 border-gray-900 rounded" key={i}>
                      <div className="w-48 h-36 bg-gray-100 bg-contain bg-center" style={{ backgroundImage: `url(${created.image})` }}></div>
                      <div className="border-t-2 border-gray-900 p-2">
                          <div>{created.name}</div>
                          <div>{created.attributes[0]?.trait_type}</div>
                      </div>
                    </div>
                </div>)}

                </div>
                </TabPanel>
                <TabPanel>
                  <div className="py-6 flex flex-wrap gap-4">
                    {isLoading && <div className="m-auto p-20"><Spinner /></div> }
                  {!isLoading && purchased.map((purchased, i) => <div className="inline-block">
                      <div className="border-2 mt-2 border-gray-900 rounded" key={i}>
                        <div className="w-48 h-36 bg-gray-100 bg-contain bg-center" style={{ backgroundImage: `url(${purchased.image})` }}></div>
                        <div className="border-t-2 border-gray-900 p-2">
                            <div>{purchased.name}</div>
                            <div>{purchased.attributes[0]?.trait_type}</div>
                        </div>
                      </div>
                  </div>)}
                  </div>
                </TabPanel>
            </Tabs>
        </div>
    );
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
