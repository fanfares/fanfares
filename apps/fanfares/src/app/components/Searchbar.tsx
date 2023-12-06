import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/pro-solid-svg-icons"
// import { faSearch } from "@fortawesome/pro-duotone-svg-icons"

export default function Searchbar() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target) {
      setSearchQuery(event.target.value)
    }
  }

  return (
    <label className="flex items-center w-full gap-2 px-2 py-1 transition-all duration-300 ease-in-out border rounded-md outline-none md:w-40 border-buttonAccent md:px-3 md:py-2 group md:focus-within:w-full md:ml-auto">
      <input
        id="searchbar"
        onChange={handleSearch}
        placeholder="Search..."
        className="w-full bg-transparent outline-none group placeholder:text-sm md:placeholder:text-xl placeholder:font-thin placeholder:text-skin-inverted focus:outline-none focus:none focus:border-buttonAccent"
      />
      <FontAwesomeIcon
        icon={faSearch}
        className={`group text-lg font-bold text-skin-base`}
      />
    </label>
  )
}
