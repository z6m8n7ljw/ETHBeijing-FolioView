import React, { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useNetwork,
  useSignMessage,
  useSigner,
  useProvider,
  useDisconnect,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { addWallet, fetchAsset, fetchPL, fetchPortf } from "@/store/assetSlice";
import { useDispatch, useSelector } from "react-redux";
import Filter from "./Filter";
import { useGlobalModalContext, MODAL_TYPES } from "./ModalConext";
import MyPopover, { PopoverBtn } from "@/components/Popover";

const Header = () => {
  const { disconnect } = useDisconnect();
  const { showModal } = useGlobalModalContext();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const dispath = useDispatch();
  const wallets = useSelector((state) => state.asset.wallets);
  useEffect(() => {
    if (isConnected) {
      dispath(addWallet(address));
      dispath(fetchAsset());
      dispath(fetchPL());
      dispath(fetchPortf(wallets));
    }
  }, [isConnected]);

  const handleAddWallet = () => {
    showModal(MODAL_TYPES.ADD_WALLLET_MODAL, {});
  };

  const handleLogout = () => {
    disconnect();
  };

  return (
    <>
      <div
        className="flex justify-between items-center"
        style={{ justifyContent: "right" }}
      >
        <div className="flex items-center">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={() => {
              if (isConnected) {
                handleAddWallet();
              } else {
                openConnectModal();
              }
            }}
          >
            {isConnected ? "Add Wallet" : "Connect Wallet"}
          </button>
          {isConnected ? (
            <MyPopover
              trigger={
                <PopoverBtn className={"pt-1 ml-4 outline-none"}>
                  <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <img src={`/avatar.png`} />
                  </div>
                </PopoverBtn>
              }
            >
              {wallets.map((item, index) => (
                <a
                  key={index}
                  className="-m-1 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                    {item.length === 42 ? (
                      <img
                        src={`/logos/ethereum.png`}
                        alt=""
                        className="h-6 w-6 flex-shrink-0 rounded-ful"
                      />
                    ) : (
                      <img
                        src={`/logos/solana.png`}
                        alt=""
                        className="h-6 w-6 flex-shrink-0 rounded-full"
                      />
                    )}
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-900">{item}</p>
                  </div>
                </a>
              ))}
              {/* <div
                onClick={handleLogout}
                className="cursor-pointer p-4 flow-root rounded-md transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
              >
                <div className="flex pl-2">
                  <svg
                    fill="none"
                    height="16"
                    viewBox="0 0 18 16"
                    width="18"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.67834 15.5908H9.99963C11.5514 15.5908 12.399 14.7432 12.399 13.1777V10.2656H10.6354V12.9863C10.6354 13.5332 10.3688 13.8271 9.78772 13.8271H2.89026C2.3092 13.8271 2.0426 13.5332 2.0426 12.9863V3.15625C2.0426 2.60254 2.3092 2.30859 2.89026 2.30859H9.78772C10.3688 2.30859 10.6354 2.60254 10.6354 3.15625V5.89746H12.399V2.95801C12.399 1.39941 11.5514 0.544922 9.99963 0.544922H2.67834C1.12659 0.544922 0.278931 1.39941 0.278931 2.95801V13.1777C0.278931 14.7432 1.12659 15.5908 2.67834 15.5908ZM7.43616 8.85059H14.0875L15.0924 8.78906L14.566 9.14453L13.6842 9.96484C13.5406 10.1016 13.4586 10.2861 13.4586 10.4844C13.4586 10.8398 13.7321 11.168 14.1217 11.168C14.3199 11.168 14.4635 11.0928 14.6002 10.9561L16.7809 8.68652C16.986 8.48145 17.0543 8.27637 17.0543 8.06445C17.0543 7.85254 16.986 7.64746 16.7809 7.43555L14.6002 5.17285C14.4635 5.03613 14.3199 4.9541 14.1217 4.9541C13.7321 4.9541 13.4586 5.27539 13.4586 5.6377C13.4586 5.83594 13.5406 6.02734 13.6842 6.15723L14.566 6.98438L15.0924 7.33984L14.0875 7.27148H7.43616C7.01917 7.27148 6.65686 7.62012 6.65686 8.06445C6.65686 8.50195 7.01917 8.85059 7.43616 8.85059Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <p className="ml-4 text-sm font-medium text-gray-900">
                    Log out
                  </p>
                </div>
              </div> */}
            </MyPopover>
          ) : null}
        </div>
      </div>
      <div className="flex justify-between my-12">
        <h1 className="text-3xl title">Welcome back, Yao</h1>
        <Filter />
      </div>
    </>
  );
};

export default Header;
