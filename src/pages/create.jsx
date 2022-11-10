import React, { useEffect, useRef, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';

import { useRouter } from 'next/router'
import Head from "next/head";

import * as ipfs from 'utils/ipfs';
import Layout from "components/Layout";
import Spinner from "components/Spinner";

import { useAccount, useContracts, useIpfs } from "contexts";
// TODO: Could use these toasts instead of the custom ones.
import { toastSuccessMessage, toastErrorMessage } from "utils/toast";

const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

export default function Create({ }) {
  const account = useAccount();
  const { node } = useIpfs();
  const [cidCreationSuccess, setCidCreationSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(null);

  // artist refs
  const artistAddress = useRef(null);
  const artistName = useRef(null);
  // song refs
  const name = useRef(null);
  const description = useRef(null);
  const image = useRef(null);
  const animation = useRef(null);
  // preview
  const imagePrev = useRef(null);
  const titlePrev = useRef(null);
  const filePrev = useRef(null);
  
  const onSubmit = async (e) => {
    setIsSubmitting(true);

    // Stop default form submission
    e.preventDefault();

    // Encode cover art and song files
    const file = image.current.files[0];
    const base64 = await convertBase64(file);
    const songFile = animation.current.files[0];
    const songBase64 = await convertBase64(songFile);

    // Set preview
    imagePrev.current.style.backgroundImage = `url(${base64})`;
    titlePrev.current.innerHTML = name.current.value;
    filePrev.current.innerHTML = animation.current.files[0].name;

    const cid = await ipfs.add(node, {
      // tokenId: 'foo_bar',
      artistAddress: artistAddress.current.value,
      artistName: artistName.current.value,
      name: name.current.value,
      description: description.current.value,
      image: base64,
      animation: songBase64
    });

    console.log('CID >>', cid);
    // TODO:
    // call smart contract, send metadata CID
    // createRadioStar(uint256 supply, uint256 priceInGwei, string cid ???? )

    // capture contract event to determine success
    setCidCreationSuccess(!!cid);
    setIsSubmitting(false);
  }

    return (
        <div className="container mx-auto p-5">
           <h1 className="text-center text-lg font-bold">Create</h1>

            <div className="py-12 flex justify-evenly items-start flex-wrap">
                <form onSubmit={onSubmit}>
                  {/* TODO addd supply andd price fields */}

                    <input ref={artistAddress}  type="text" name="artistAddress" hidden readOnly value={account.toLowerCase()} />
                    <label className="block font-semibold text-sm text-gray-900">
                        Artist Name
                        <input ref={artistName} required type="text" name="artistName" placeholder="ex. Buddy Holly" className="w-96 mt-2 block rounded border-solid border-2 border-gray-900 p-4 focus:outline-none" />
                    </label>

                        <label className="block font-semibold text-sm text-gray-900 mt-6">
                            Song Title
                            <input ref={name} required type="text" name="name" placeholder="ex. That'll Be the Day" className="w-96 mt-2 block rounded border-solid border-2 border-gray-900 p-4 focus:outline-none" />
                        </label>
                        <label className="block font-semibold text-sm text-gray-900 mt-6">
                            Song Description
                            <textarea ref={description} required maxLength="200" rows="3" type="text" name="description" placeholder="ex. Recorded in Clovis, New Mexico, in February 1957..." className="w-96 mt-2 block rounded border-solid border-2 border-gray-900 p-4 focus:outline-none" />
                        </label>
                        <label className="block font-semibold text-sm text-gray-900 mt-6">
                            Cover Art (png, jpg)
                            <input ref={image} required type="file" name="image" accept="image/png, image/jpeg" className="cursor-pointer w-96 mt-2 block rounded border-solid border-2 border-gray-900 p-4 focus:outline-none" />
                        </label>
                        <label className="block font-semibold text-sm text-gray-900 mt-6">
                            File (mp3)
                            <input ref={animation} required type="file" name="animation" className="cursor-pointer w-96 mt-2 block rounded border-solid border-2 border-gray-900 p-4 focus:outline-none" />
                        </label>



                    <input type="submit" value="Create NFT" className="mt-8 mb-8 w-96 cursor-pointer mt-2 block text-white rounded border-solid border-2 bg-gray-900 border-gray-900 p-4 focus:outline-none" />
                </form>

                <div>
                    <span className="block font-semibold text-sm text-gray-900">Preview</span>
                    <div className="border-2 mt-2 border-gray-900 rounded">
                      <div className="w-96 h-72 bg-gray-100 bg-contain" ref={imagePrev}></div>
                      <div className="border-t-2 border-gray-900 p-4">
                          <div ref={titlePrev}>{`<title>`}</div>
                          <div ref={filePrev}>{`<filename>`}</div>
                      </div>
                    </div>
                    {isSubmitting && <div className="bg-gray-100 text-gray-400 border-dashed border-gray-300 border-4 my-8 text-center font-bold py-8 p-4">...Creating...</div>}
                    {cidCreationSuccess && <div className="bg-emerald-100 text-emerald-400 border-dashed border-emerald-300 border-4 my-8 text-center font-bold py-8 p-4">NFT Created</div>}
                    {cidCreationSuccess !== null && !cidCreationSuccess && <div className="max-w-sm bg-red-100 text-red-400 border-dashed border-red-300 border-4 my-8 text-center font-bold py-8 p-4">Error</div>}
                </div>
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
        <title>Create | Radio Star</title>
      </Head>
      <div className="body-font mx-auto max-w-7xl p-4 text-gray-600">
        {page}
        </div>
    </Layout>
  );
};
