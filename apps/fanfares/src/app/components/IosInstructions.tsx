import { FaExternalLinkAlt } from "react-icons/fa";

export function IosInstructions() {
  
  return (
    <details>
      <summary>nsecbunker instructions for iOS</summary>
      <ol className="list-decimal border backdrop-brightness-50 border-indigo-700 p-4 space-y-2 md:space-y-1 pt-3 mt-2 block">
        <li className="text-sm md:text-base ml-4 text-white text-opacity-70 marker:text-white">install <a href="https://use.nsec.app" className="text-blue-500" target="_blank" rel="noopener noreferrer">use.nsec.app<FaExternalLinkAlt className="inline"/></a> as a PWA by choosing "Add to Home Screen" on the share menu</li>
        <li className="text-sm md:text-base ml-4 text-white text-opacity-70 marker:text-white">add your account on the PWA</li>
        <li className="text-sm md:text-base ml-4 text-white text-opacity-70 marker:text-white">copy the account address <em>(example@nsec.app)</em> and login with nostr-login</li>
        <li className="text-sm md:text-base ml-4 text-white text-opacity-70 marker:text-white">click "Continue" when the login screen says "Almost Ready!"</li>
        <li className="text-sm md:text-base ml-4 text-white text-opacity-70 marker:text-white">use.nsec.app will open in a new tab (instead of PWA). Click Connect.</li>
        <li className="text-sm md:text-base ml-4 text-white text-opacity-70 marker:text-white">now you're logged in</li>
      </ol>
    </details>
  )
}