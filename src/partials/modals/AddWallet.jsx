import MyModal from "@/components/Modal";
import {useDispatch, useSelector} from "react-redux";
import {useGlobalModalContext} from "../ModalConext";
import {addWallet, fetchAsset, fetchPL, fetchPortf} from "@/store/assetSlice";
import {useState} from "react";

const AddWalletModal = () => {
  const {hideModal} = useGlobalModalContext();
  const dispath = useDispatch();
  const [address, setAddress] = useState("");
  const wallets = useSelector((state) => state.asset.wallets);

  const onOk = () => {
    dispath(addWallet(address));
    dispath(fetchAsset());
    dispath(fetchPL());
    dispath(fetchPortf([...wallets, address]));
    hideModal();
  };

  return (<MyModal isOpen={true} onClose={hideModal} onOk={onOk} title="Add wallet">
      <form>
        <div className="relative">
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-4 text-sm outline-none text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-300 focus:border-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Paste address here..."
            required
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </div>
      </form>
    </MyModal>);
};

export default AddWalletModal;
