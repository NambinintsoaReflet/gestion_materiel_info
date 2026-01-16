const InputSmall = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">
      {label}
    </label>
    <input
      {...props}
      className="bg-[#1a1d21] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none transition-all disabled:opacity-50"
      onChange={(e) => props.onChange(e.target.value)}
    />
  </div>
);

export default InputSmall;