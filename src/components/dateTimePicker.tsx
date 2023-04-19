import React, { ChangeEvent, FC } from "react";

interface DateTimePickerProps {
  value: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  id: string;
  name: string;
}

export const DateTimePicker: FC<DateTimePickerProps> = ({
  value,
  handleChange,
  label,
  id,
  name,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        type="datetime-local"
        name={name}
        id={name}
        className="w-full appearance-none rounded-md focus:outline-none focus:border-none focus:ring-2 focus:ring-black"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};
