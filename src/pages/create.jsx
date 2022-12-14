import React, { useRef, useState } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import * as ipfs from 'utils/ipfs';
import Layout from "components/Layout";

import { useAccount, useContracts, useIpfs } from "contexts";
// TODO: Perhaps use Spinneer and toasts instead of the homespun statuses.
// import Spinner from "components/Spinner";
import { toastSuccessMessage, toastErrorMessage } from "utils/toast";

/* 

  I apologize for the poor code quality. This is an MVP =).

*/

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
  const { ipfsClient } = useIpfs();
  const { radioStarContract } = useContracts();

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
  const price = useRef(null);
  const supply = useRef(null);
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

    const cid = await ipfs.add(ipfsClient, {
      // tokenId: 'foo_bar',
      artistAddress: artistAddress.current.value,
      artistName: artistName.current.value,
      name: name.current.value,
      description: description.current.value,
      image: base64,
      animation: songBase64,
      price: price.current.value,
      supply: supply.current.value,
    });
    
    if (cid) {
      try {
        // QUESTION: 
        // Make radioStarContract return a success/token/predicate for "success"?
        // Does not failing mean success? (I've witnessed this throwing and entering the catch block from passing extra args.)
        
        // Convert user's input price, in gwei to wei
        const inGwei = ethers.BigNumber.from(price.current.value);
        const p = ethers.BigNumber.from(1000000000);
        const inWei = inGwei.mul(p);
        const success = await radioStarContract.createSong(supply.current.value, inWei, cid);

        toastSuccessMessage(`${name.current.value} NFT successfully created!`);
      } catch (e) {
        console.error(e);
        toastErrorMessage(
          `Could not create NFT. Please check the address or try again later.`
        );
      }

      // capture contract event to determine success
      setCidCreationSuccess(!!cid);
      setIsSubmitting(false);
    }
  }

  return (
      <div className="container mx-auto p-5">
          <h1 className="text-center text-lg font-bold">Create</h1>

          <div className="py-12 flex justify-evenly items-start flex-wrap">
              <form onSubmit={onSubmit}>

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
                      <label className="block font-semibold text-sm text-gray-900 mt-6">
                          Supply
                          <input ref={supply} required type="number" max="100000" name="supply" placeholder="ex. 10" className="w-96 mt-2 block rounded border-solid border-2 border-gray-900 p-4 focus:outline-none" />
                      </label>
                      <label className="block font-semibold text-sm text-gray-900 mt-6">
                          Price (Gwei)
                          <input ref={price} required type="number" min="10000000" name="price" placeholder="ex. 10000000" className="w-96 mt-2 block rounded border-solid border-2 border-gray-900 p-4 focus:outline-none" />
                      </label>



                  <input type="submit" value="Create NFT" className="mt-8 mb-8 w-96 cursor-pointer mt-2 block text-white rounded border-solid border-2 bg-gray-900 border-gray-900 p-4 focus:outline-none" />
              </form>

              <div>
                  <span className="block font-semibold text-sm text-gray-900">Preview</span>
                  <div className="border-2 mt-2 border-gray-900 rounded">
                    <div className="w-96 h-72 bg-gray-100 bg-cover" ref={imagePrev}></div>
                    <div className="border-t-2 border-gray-900 p-4">
                        <div ref={titlePrev}>{`<title>`}</div>
                        <div ref={filePrev}>{`<filename>`}</div>
                    </div>
                  </div>
                  {isSubmitting && <div className="bg-gray-100 text-gray-400 border-dashed border-gray-300 border-4 my-8 text-center font-bold py-8 p-4">Creating...</div>}
                  {cidCreationSuccess && <div className="bg-emerald-100 text-emerald-400 border-dashed border-emerald-300 border-4 my-8 text-center font-bold py-8 p-4">NFT Created</div>}
                  {cidCreationSuccess !== null && !cidCreationSuccess && <div className="max-w-sm bg-red-100 text-red-400 border-dashed border-red-300 border-4 my-8 text-center font-bold py-8 p-4">Error</div>}
              </div>
              </div>  
      
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
