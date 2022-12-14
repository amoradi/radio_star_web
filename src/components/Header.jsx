import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image'
import classNames from 'classnames';
import { toastSuccessMessage, toastErrorMessage } from "utils/toast";

import Address from "components/Address";
import Balance from "components/Balance";

import { connectWallet } from "utils/common";
import { useAccount, useContracts } from "contexts";

export default function Header() {
  const account = useAccount();
  //const isMetamaskConnected = !!account;
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(!!account);
  const { radioStarContract } = useContracts();
  const [isWithdrawalable, setIsWithdrawalable] = useState(false);

  useEffect(() => {
    setIsMetamaskConnected(!!account);
  },[account]);

  useEffect(() => {
    if (radioStarContract) {
      (async () => {
        const isContractOwner = account == 0x63A62b6D6f88C8f7fF559Be451A9eE3Cef51125C;
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
        const hasCreatedANft = tokenIds.length > 0;

        setIsWithdrawalable(isContractOwner || hasCreatedANft)
      })();
    }
  }, [account, radioStarContract]);

  return (
    <header className="body-font mx-auto max-w-7xl p-4 text-gray-600">
      <div className="container mx-auto flex flex-col flex-wrap justify-between items-center gap-4 p-5 md:flex-row lg:gap-0">
        <Link href="/"><a className="title-font flex items-center font-medium text-gray-900 md:mb-0">
          {/* RADIO STAR<Image src="/radio_star_logo.png" alt="me" width="137.5" height="50" /> */}
          <strong className="pl-0 p-2">RADIO STAR</strong>

        </a>
        </Link>  
          <div className="flex gap-6 items-baseline">
            {isWithdrawalable && 
              <Link
                  href={""}
                >
                  <a onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const t = await radioStarContract?.withdraw();
                      toastSuccessMessage('Withdraw success');
                    } catch(e) {
                      console.error(e);
                      toastErrorMessage('Withdraw error');
                    }
                  }} 
                  className={classNames("font-semibold text-sm mt-4 inline-flex items-center rounded text-gray-900 border-2 border-gray-900 py-1 px-6 focus:outline-none md:mt-0",{ "opacity-25 cursor-not-allowed": !isMetamaskConnected, "hover:bg-gray-200": isMetamaskConnected} )}>Withdraw</a>
                </Link>
            }
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
