import { createContext, useContext } from 'react';;

export const IpfsContext = createContext({
    ipfsClient: null,
});
export const AccountContext = createContext("");
export const ContractsContext = createContext({
    radioStartContract: null
})

export function useIpfs() {
    return useContext(IpfsContext);
}
export function useAccount() {
    return useContext(AccountContext);
}
export function useContracts() {
    return useContext(ContractsContext);
}