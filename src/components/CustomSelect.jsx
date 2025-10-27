import Select from "react-select";

// ✅ Composant réutilisable
const CustomSelect = ({ options, placeholder, onChange, value }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#3d454d",
      borderColor: "gray",
      borderRadius: "0.375rem",
      minHeight: "38px",
      padding: "0 0.5rem",
      fontSize: "0.875rem",
      boxShadow: "none",
      color: "white",
      "&:hover": {
        borderColor: "#4d5460",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#3d454d",
      borderRadius: "0.375rem",
      marginTop: "0.25rem",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "6.5rem",
      overflowY: "auto",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#4d5460" : "#3d454d",
      color: "white",
      cursor: "pointer",
      fontSize: "0.875rem",
      padding: "0.5rem 0.75rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#bbb",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <div className="space-y-2">
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        styles={customStyles}
        menuPlacement="auto"
        isSearchable
      />
    </div>
  );
};



export default CustomSelect;
