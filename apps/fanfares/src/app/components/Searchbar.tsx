import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
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
    <div className="flex items-center w-full gap-2 px-2 py-1 transition-all duration-500 linear border rounded-md outline-none md:w-40 border-buttonAccent md:px-3 md:py-2 md:focus-within:w-full md:ml-auto">
      <input
        id="searchbar"
        onChange={handleSearch}
        placeholder="Search..."
        className="w-full bg-transparent outline-none  placeholder:text-sm md:placeholder:text-xl placeholder:font-thin placeholder:text-skin-inverted focus:outline-none focus:none focus:border-buttonAccent"
      />
      <FontAwesomeIcon
        icon={faSearch}
        className={`text-xl font-bold text-skin-base`}
      />
    </div>
  )
}
