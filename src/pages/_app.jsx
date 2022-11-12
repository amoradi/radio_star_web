import { useEffect, useState } from "react";
import Head from "next/head";
import { create } from 'ipfs-http-client';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AccountContext, ContractsContext, IpfsContext } from "contexts.js";
import {
  networkName,
  getEthereumObject,
  setupEthereumEventListeners,
  getSignedContract,
  getCurrentAccount,
} from "utils/common";

import radioStarContractMetadata from "data/abis/RadioStar.metadata.json";

import "../styles/globals.css";

/* 

  I apologize for the poor code quality. This is an MVP =).

*/

const radioStarAddress = process.env.NEXT_PUBLIC_RADIO_STAR_ADDRESS;

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState({
    radioStarContract: null,
  });
  const [ipfsClient, setIpfsClient] = useState(null);

  const load = async () => {
    const ethereum = getEthereumObject();
    if (!ethereum) return;

    setupEthereumEventListeners(ethereum);

    const radioStarContract = getSignedContract(
      radioStarAddress,
      radioStarContractMetadata.output.abi
    );

    if (!radioStarContract) return;

    const currentAccount = await getCurrentAccount();

    setContracts({ radioStarContract });
    setAccount(currentAccount);
  };

  useEffect(() => {
    load();
  }, [account]);

  useEffect(() => {
    const initIpfsClient = async () => {
      if (ipfsClient) return

      const auth = 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_INFURA_PROJECT_ID + ':' + process.env.NEXT_PUBLIC_INFURA_SECRET).toString('base64');
      const client = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          'Authorization': auth
        }
      });
      // timeout: 10000

      setIpfsClient(client);
    }

    initIpfsClient()
  }, [ipfsClient]);

 return (
    <>
      <Head>
        <title>Radio Star</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {ipfsClient &&
        <AccountContext.Provider value={account}>
          <IpfsContext.Provider value={{ ipfsClient }}>
            <ContractsContext.Provider value={contracts}>
              <ToastContainer
                position="bottom-center"
                autoClose={5000}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              {getLayout(<Component {...pageProps} />)}
            </ContractsContext.Provider>
          </IpfsContext.Provider>
        </AccountContext.Provider>
        }
    </>
  );
}

export default MyApp;
