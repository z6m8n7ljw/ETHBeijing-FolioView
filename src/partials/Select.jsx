import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useSelector, useDispatch } from "react-redux";
import { selectChain } from "@/store/assetSlice";

const chains = [
  {
    id: "1",
    name: "ethereum",
    avatar: "",
  },
  {
    id: "137",
    name: "polygon",
    avatar: "",
  },
  {
    id: "56",
    name: "bsc",
    avatar: "",
  },
  {
    id: "",
    name: "solana",
    avatar: "",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Select() {
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.asset.selectedChains);
  useEffect(() => {
    dispatch(selectChain(chains));
  }, []);

  return (
    <Listbox
      value={selected}
      onChange={(value) => dispatch(selectChain(value))}
      multiple
    >
      {({ open }) => (
        <>
          {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Listbox.Label> */}
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring focus:ring-blue-500/20 text-sm leading-6">
              {selected?.length ? (
                <span className="flex items-center">
                  {selected.map((item, i) => {
                    return (
                      <img
                        key={i}
                        src={`/logos/${item.name}.png`}
                        alt=""
                        className="h-6 w-6 flex-shrink-0 rounded-full mr-1"
                      />
                    );
                  })}
                  {selected?.length === 1 ? (
                    <span className="ml-3 block truncate">
                      {selected[0]?.name}
                    </span>
                  ) : null}
                </span>
              ) : (
                <div className="h-6 w-6"></div>
              )}
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition-all ease-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {chains.map((chain) => (
                  <Listbox.Option
                    key={chain.id}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={chain}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <img
                            src={`/logos/${chain.name}.png`}
                            alt=""
                            className="h-5 w-5 flex-shrink-0 rounded-full"
                          />
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "ml-3 block truncate"
                            )}
                          >
                            {chain.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
