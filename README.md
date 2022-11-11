# Radio Star

## Local Dev

```bash
$ npm install
$ npm run dev
```

Runs on port 3000, http://localhost:3000

---


This is the the frontend for our Dapp. It is built with Next.js and ethers.js.

**Structure:**

- **src/pages** - Routes for our app
- **src/components** - React components for our app
- **src/contexts.js** - React contexts to make state available to nested components
- **next.config.js, postcss.config.js, pretter.config.js, tailwind.config.js, tsconfig.json** - Configuration files for Next.js and Tailwind

---

## Note

Be sure to update the [abi folder](frontend/src/data/abis) for smart contract changes.

---

### Deploying on Vercel

1. Click the deploy button below.
1. Complete the **Create Git Repository** step in the Vercel Wizard.
   1. Specify the organisation and the name of the repo to clone it
1. Complete the **Configure Project** step in the Vercel Wizard. In this step, You have to configure the following environment variables:
   1. **NEXT_PUBLIC_NETWORK_ID:** The id of the network on which your contracts are deployed. For example, the value will be **5** if your contracts are on the **Goerli** Testnet.
   1. **NEXT_PUBLIC_CAMP_ADDRESS:** Address of the deployed Camp contract
   1. **NEXT_PUBLIC_WARRIORS_ADDRESS:** Address of the deployed DappCampWarriors contract
   1. **NEXT_PUBLIC_STAKING_ADDRESS:** Address of the deployed Staking contract
   1. The [abis](src/data/abis) are already included in this repo. So, you don't need to update the abis if you don't make any changes to the smart contracts.
1. Click on the deploy button
1. Wait for a few minutes for the deploy to finish.
1. You will be able to visit your new webapp on the generated url.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDappCamp-Cohort-4%2Fdappcamp-warriors-frontend&env=NEXT_PUBLIC_NETWORK_ID,NEXT_PUBLIC_CAMP_ADDRESS,NEXT_PUBLIC_WARRIORS_ADDRESS,NEXT_PUBLIC_STAKING_ADDRESS)

---

### Overview of the steps

#### Step 1: Add frontend boilerplate

- Initialize project with [Next.js + Tailwind CSS Template](https://github.com/vercel/next.js/tree/c3e5caf1109a2eb42801de23fc78e42a08e5da6e/examples/with-tailwindcss)
- Install [prettier-plugin-tailwindcss plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) for automatic class sorting
- Install ethers.js
- Overview of the components:
  - Next.js is a Node.js based framework for building server-side rendered React applications
  - Tailwind is a library that provides utility css classes to style elements
  - Ethers.js is a library for interacting with the Ethereum Blockchain
- Setup meta tags by adding a [\_document.jsx file](https://nextjs.org/docs/advanced-features/custom-document)
- Add utility methods for common operations like fetching connected accounts and signing a contract

**Learning resources**

- [React functional components](https://beta.reactjs.org/)
- [Introduction to Next.js](https://nextjs.org/learn/foundations/about-nextjs)
- [Tailwind](https://tailwindcss.com/docs/utility-first)
- [Ethers.js](https://docs.ethers.io)

#### Step 2: Add Connect Wallet button and Balance counter

- Setup react contexts to share the connected account and contracts across pages in our app
  - [Passing Data Deeply with Context](https://beta.reactjs.org/learn/passing-data-deeply-with-context)
- Add Connect Wallet and Balance counter to the header
  - Clicking on the connect wallet will prompt the user to connect metamask to our app
  - Balance is fetched by reading the ERC20 balance from the Camp contract. It is refreshed every 1 second.

#### Step 3: Add NFTs grid to home page

- In this step, we add an NFT grid to the home page. The page queries the value of "\_tokenIds" from the Warriors contract and displays the details for each NFT.

#### Step 4: Add Mint NFT form

- In this step, we add a form to the "Mint" page. This form will only be visible to the owner of the contract. The owner will be able to mint a new NFT to a particular address using the form.
- The mint button makes call to the Warriors contract

#### Step 5: Add stake and unstake buttons

- In this step, we add "stake and "unstake" buttons to the NFT component. The logged-in users will be able to see these buttons next to the NFTs they own.
- The stake and unstake buttons make calls to the Staking contract

### Resources

Additional learning resources

- [Master Ethers.js for Blockchain](https://www.youtube.com/watch?v=yk7nVp5HTCk)
- [The Complete Guide to Full Stack Web3 Development](https://www.youtube.com/watch?v=nRMo5jjgCr4&t)

We used barebones ethers.js to interact with our smart contracts. To abstract some of the common tasks and speed up your development, you can take a look at the following libraries:

- [wagmi](https://github.com/tmm/wagmi)
- [web3-ui](https://github.com/developer-DAO/web3-ui)
