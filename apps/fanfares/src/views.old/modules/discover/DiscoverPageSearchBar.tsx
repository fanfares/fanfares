export interface SearchBarProps {
  updateSearch: (string) => void;
}

const DiscoverPageSearchBar = ({ updateSearch }: SearchBarProps) => {

  const handleChange = (event) => {
    updateSearch(event.target.value);
  };

  return (
    <div className="mt-10">
      <input
        id="e2e-discover-search-bar"
        onChange={handleChange}
        placeholder="Search..."
        className="left-[36px] w-full border-2 border-buttonAccent
                   p-3 rounded-md bg-transparent outline-none
                   placeholder:text-xl placeholder:font-thin
                   placeholder:text-skin-inverted"
      />
    </div>
  );
};

export default DiscoverPageSearchBar;
