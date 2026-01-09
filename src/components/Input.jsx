const Input = ({ label, name, type, value, onChange, placeholder }) => {
  return (
    <input
      type={type}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 text-sm rounded bg-[#3d454d] border border-gray-500"
    />
  );
};

export default Input;
