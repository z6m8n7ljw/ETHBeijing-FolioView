import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useDispatch } from 'react-redux';
import { fetchAsset } from "@/store/assetSlice";
import Select from './Select';

const Filter = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
    dispatch(fetchAsset(newValue));
  };

  return (
    <div className="flex item-center">
      <div className="w-64 mr-4">
        <Datepicker
          inputClassName="outline-0 !py-1.5 !rounded-md ring-inset leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 outline-none"
          showShortcuts={true}
          value={value}
          onChange={handleValueChange}
        />
      </div>
      <div className="w-48">
        <Select />
      </div>
    </div>
  );
};

export default Filter;
