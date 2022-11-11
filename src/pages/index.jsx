import React, { useEffect, useState } from "react";
import Head from "next/head";

import NFT from "components/NFT";
import Layout from "components/Layout";
import Spinner from "components/Spinner";
import * as ipfs from 'utils/ipfs';
import { toastSuccessMessage, toastErrorMessage } from "utils/toast";
import { useAccount, useContracts, useIpfs } from "contexts";

const zeroAddress = "0x0000000000000000000000000000000000000000";
const fallbackImage = "http:///i.imgur.com/hfM1J8s.png";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState([]);
  const { ipfsClient } = useIpfs();
  const { radioStarContract } = useContracts();
  const account = useAccount();

  const fetchNftDetails = async (nftURL) => {
    try {
      const response = await (await fetch(nftURL)).json();
      const { image } = response;
      return { image };
    } catch (e) {
      return { image: fallbackImage };
    }
  };

  // const loadNfts = async () => {
  //   setIsLoading(true);
  //   const baseUri = await dcWarriorsContract.baseURI();

  //   let nfts = [];
  //   for (let i = 0; i < 1000; i++) {
  //     try {
  //       const tokenId = i;
  //       const owner = await dcWarriorsContract.ownerOf(tokenId);
  //       const staked = await stakingContract.staked(tokenId);
  //       const isStaked = staked.owner !== zeroAddress;

  //       const nftURL = `${baseUri}/${tokenId}.json`;
  //       const { image } = await fetchNftDetails(nftURL);

  //       const nft = {
  //         imageUrl: image,
  //         tokenId,
  //         owner: isStaked ? staked.owner : owner,
  //         isStaked,
  //       };
  //       nfts.push(nft);
  //     } catch (e) {
  //       break;
  //     }
  //   }

  //   setNfts(nfts);
  //   setIsLoading(false);
  // };

  useEffect(() => {
    // loadNfts();
  }, [account]);

  useEffect(() => {
    const getNfts = (async () => {
      setIsLoading(true);
      try {
        

          // Looks like you cannot get the entire mapping without creating a getter...
          // https://ethereum.stackexchange.com/questions/121069/how-to-properly-call-solidity-mapping-in-ethers-js
          
          const tokenIds = [];
          let increment = 1;
          let hasReachedZeroAddress = false; // Stinks assumes increment/know about implementation details.

          while(!hasReachedZeroAddress) {
            const artist = await radioStarContract.tokensToArtist(increment);
            const pArtist = parseInt(artist, 16);

            hasReachedZeroAddress = pArtist === 0;
            if (!hasReachedZeroAddress)  tokenIds.push(increment);
            increment++;
          };


          const cids = [];
          for (let i = 0, ii = tokenIds.length; i < ii; i ++) {
            const cid = await radioStarContract.uri(tokenIds[i]);

            cids.push(cid);
          }

          console.log('cids', cids);

          const songMetadatas = await ipfs.get(ipfsClient, cids);
          let pSongMetadatas = [];
          try {
            pSongMetadatas = songMetadatas.map((m) => JSON.parse(m));
          } catch(e) {
            console.error(e);
            pSongMetadatas = [];
          }

          console.log('songMetadatas', pSongMetadatas);

          const withTokenIds = pSongMetadatas.map((m, i) => {
            m.tokenId = tokenIds[i];

            return m
          });

          setNfts(withTokenIds);

       
      } catch(e) {
        console.log(e);
      }
      setIsLoading(false);
    })();
  }, [account]);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <section className="body-font text-gray-600">
        <div className="container mx-auto px-5 pt-12 pb-24">
           <div className="py-6 flex flex-wrap gap-4">
            {!isLoading && nfts.map((nft, i) => <div className="inline-block" key={i} data-token={nft.tokenId}>
                <div className="border-2 mt-2 border-gray-900 rounded" key={i}>
                  <div className="w-48 h-36 bg-gray-100 bg-contain" style={{ backgroundImage: `url(${nft.image})` }}></div>
                  <div className="border-t-2 border-gray-900 p-2 px-3 flex items-center justify-between">
                    <div>
                      <div className="whitespace-nowrap w-16 text-ellipsis overflow-hidden">{nft.name}</div>
                      <div className="whitespace-nowrap w-16 text-ellipsis overflow-hidden">{nft.attributes[0]?.trait_type}</div>
                    </div>
                    <div>
                      <button onClick={async () => {
                        try {
                          const result = await radioStarContract.buySong(nft.tokenId);
                          toastSuccessMessage('Purchased ' + nft.name + '!');
                        } catch(e) {
                          toastErrorMessage('Error in purchasing ' + nft.name + '!');
                          console.error(e);
                        }
                      }} className="rounded font-600 font-semibold text-sm bg-teal-200 p-1 px-3">Buy</button>
                    </div>
                  </div>
                </div>
                </div>
            )}
          
            {isLoading && (
              <div className="w-full text-center">
                <div className="mx-auto mt-32 w-min">
                  <Spinner />
                </div>
              </div>
            )}
        </div>
        </div>
      </section>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return (
    <>
    <Layout>
      <Head>
        <title>Home | Radio Star</title>
      </Head>
      {page}
    </Layout>
    </>
  );
};
