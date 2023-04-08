import React from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

const MyRadioGroup = (props) => {
  const { options = [], value, onChange } = props;
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      className="flex rounded-md p-1 bg-white shadow-md"
    >
      {options.map((option, index) => (
        <RadioGroup.Option
          key={index}
          value={option}
          className={({ active, checked }) =>
            `${checked ? "bg-slate-300 bg-opacity-75" : ""} relative flex cursor-pointer px-4 py-1 outline-none rounded-md`
          }
        >
          <CheckIcon className="hidden ui-checked:block" />
          {typeof option === "string" ? option : option.label || option.name}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
};
export default MyRadioGroup;
