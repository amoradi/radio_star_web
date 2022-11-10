import { useEffect, useState } from "react";
import Head from "next/head";
// import { create } from 'ipfs-core'
import { create } from 'ipfs-http-client';

// connect to the default API address http://localhost:5001
// const client = create()

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

const radioStarAddress = process.env.NEXT_PUBLIC_RADIO_STAR_ADDRESS;

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState({
    radioStar: null,
  });

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
  }, []);

  // IPFS 
  const [id, setId] = useState(null);
  const [ipfs, setIpfs] = useState(null);
  const [version, setVersion] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (ipfs) return

      const auth = 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_INFURA_PROJECT_ID + ':' + process.env.NEXT_PUBLIC_INFURA_SECRET).toString('base64');
      const node = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          'Authorization': auth
        }
      });
      // timeout: 10000

      setIpfs(node);

      // console.log(node)
      // const c = await node.add('Hello world!')
      // console.log(c);
      // // const r = await node.get(c.path);
      // // console.log(r);

      // const stream = node.cat(c.path);
      // const decoder = new TextDecoder();
      // let data = ''

      // console.log('GET >>> 4', stream);
      // for await (const chunk of stream) {
      //     // chunks of data are returned as a Uint8Array, convert it back to a string
      //     console.log('GET >>> 5');
      //     data += decoder.decode(chunk, { stream: true });
      // }

      //console.log('data', data);
      //const nodeId = await node.id();
      // const nodeVersion = await node.version();
      // const nodeIsOnline = node.isOnline();

      // setIpfs(node);
      // setId(nodeId.id);
      // setVersion(nodeVersion.version);
      // setIsOnline(nodeIsOnline);
    }

    init()
  }, [ipfs]);

 return (
    <>
      <Head>
        <title>Radio Star</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {isOnline &&
      <AccountContext.Provider value={account}>
        <IpfsContext.Provider value={{ node: ipfs }}>
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
      </AccountContext.Provider>}
    </>
  );
}

export default MyApp;
