import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image'
import classNames from 'classnames';

import Address from "components/Address";
import Balance from "components/Balance";

import { connectWallet } from "utils/common";
import { useAccount, useContracts } from "contexts";

export default function Header() {
  const account = useAccount();
  const isMetamaskConnected = !!account;

  const { dcWarriorsContract } = useContracts();

  const [canShowMintPage, setCanShowMintPage] = useState(false);

  const checkMintPermission = async (account) => {
    const currAddress = account.toLowerCase();
    const nftContractOwner = (await dcWarriorsContract.owner()).toLowerCase();
    setCanShowMintPage(currAddress == nftContractOwner);
  };

  useEffect(() => {
    if (!isMetamaskConnected || !dcWarriorsContract) return;
    checkMintPermission(account);
  }, [account, isMetamaskConnected, dcWarriorsContract]);

  return (
    <header className="body-font mx-auto max-w-7xl p-4 text-gray-600">
      <div className="container mx-auto flex flex-col flex-wrap justify-between items-center gap-4 p-5 md:flex-row lg:gap-0">
        <Link href="/"><a className="title-font flex items-center font-medium text-gray-900 md:mb-0">
          {/* RADIO STAR<Image src="/radio_star_logo.png" alt="me" width="137.5" height="50" /> */}
          <strong className="pl-0 p-2">RADIO STAR</strong>

        </a>
        </Link>
        {/* <nav className="flex flex-wrap items-center justify-center text-base md:mr-auto	md:ml-4 md:border-l md:border-gray-400 md:py-1 md:pl-4">
          {canShowMintPage && (
            <Link href="/mint">
              <a className="mr-5 hover:text-gray-900">Mint</a>
            </Link>
          )}
        </nav> */}
       
        
          <div className="flex gap-6 items-baseline">
            <Link
              href={isMetamaskConnected ? "/create" : ""}
            >
              <a className={classNames("font-semibold text-sm mt-4 inline-flex items-center rounded text-gray-900 border-2 border-gray-900 py-1 px-6 focus:outline-none md:mt-0",{ "opacity-25 cursor-not-allowed": !isMetamaskConnected, "hover:bg-gray-200": isMetamaskConnected} )}>Create</a>
            </Link>
            <Link
              href={isMetamaskConnected ? "/profile" : ""}
            >
              <a className={classNames("border-gray-900 font-semibold text-sm mt-4 inline-flex text-gray-900 items-center rounded border-2 py-1 px-6 focus:outline-none md:mt-0",{ "opacity-25 cursor-not-allowed": !isMetamaskConnected, "hover:bg-gray-200": isMetamaskConnected} )}>Profile</a>
            </Link>
            {isMetamaskConnected ? (
              <Address address={account} />
              /* <Balance /> */
            ):  <button
              className="tracking-wide mt-4 inline-flex items-center text-sm font-semibold rounded border-solid border-2 text-white bg-gray-900 border-gray-900 py-1 px-6 hover:text-white hover:bg-gray-900 focus:outline-none md:mt-0"
              onClick={connectWallet}
            >
            Connect Wallet
          </button>}
          </div>

      </div>
    </header>
  );
}
