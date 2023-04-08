import React, { useState, createContext, useContext } from "react";
import AddWalletModal from "./modals/AddWallet";

export const MODAL_TYPES = {
  ADD_WALLLET_MODAL: "ADD_WALLLET_MODAL"
};

const MODAL_COMPONENTS = {
  [MODAL_TYPES.ADD_WALLLET_MODAL]: AddWalletModal
};

const initalState = {
  showModal: () => {},
  hideModal: () => {},
  store: {}
};

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal = ({ children }) => {
  const [store, setStore] = useState();
  const { modalType, modalProps } = store || {};

  const showModal = (modalType, modalProps = {}) => {
    setStore({
      ...store,
      modalType,
      modalProps
    });
  };

  const hideModal = () => {
    setStore({
      ...store,
      modalType: null,
      modalProps: {}
    });
  };

  const renderComponent = () => {
    const ModalComponent = MODAL_COMPONENTS[modalType];
    if (!modalType || !ModalComponent) {
      return null;
    }
    return <ModalComponent id="global-modal" {...modalProps} />;
  };

  return (
    <GlobalModalContext.Provider value={{ store, showModal, hideModal }}>
      {renderComponent()}
      {children}
    </GlobalModalContext.Provider>
  );
};
