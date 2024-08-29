import { forwardRef } from "react";

export const Input = forwardRef((props, ref, styles) => (
  <input
    {...props}
    ref={ref}
    className={`text-sm w-full bg-white placeholder:text-gray-500 font-semibold text-gray-800 px-4 py-3 rounded-md outline-none transition-all border border-gray-300`}
  />
));
