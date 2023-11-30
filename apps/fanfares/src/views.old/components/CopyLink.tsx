import { faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { LinkedinShareButton, TwitterShareButton } from "react-share"
import { toast } from "react-toastify"
import Button from "./Button"
// import { Text } from "./Text"

export interface CopyLinkParams {
  title?: string
  quote: string
  shareUrl: string
  textID?: string
  copyButtonID?: string
  // hashtag: string;
}

export function CopyLink(param: CopyLinkParams) {
  const { quote, shareUrl, title, textID, copyButtonID } = param

  const copyToClipboard = async () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Copied to clipboard! Share it on your socials 😉", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    })
  }

  const renderSocialShare = () => {
    return (
      <>
        {/* <LinkedinShareButton title="Excalibur Podcast" summary={quote} url={shareUrl}>
          <FontAwesomeIcon
            className="w-6 p-2 text-xl transition-all duration-500 rounded bg-skin-button-accent drop-shadow-2xl hover:bg-white hover:text-buttonAccentHover"
            icon={faLinkedin}
          />
        </LinkedinShareButton>
        <TwitterShareButton title={quote} url={shareUrl}>
          <FontAwesomeIcon
            className="w-6 p-2 text-xl transition-all duration-500 rounded bg-skin-button-accent drop-shadow-2xl hover:bg-white hover:text-buttonAccentHover"
            icon={faTwitter}
          />
        </TwitterShareButton> */}

        {/* <FacebookShareButton quote={quote} url={shareUrl} hashtag={hashtag}>
          <FontAwesomeIcon
            className="p-2 text-lg transition-all rounded bg-skin-button-accent hover:text-buttonAccentHover"
            icon={faFacebook}
          />
        </FacebookShareButton>

        <WhatsappShareButton title={quote} url={shareUrl}>
          <FontAwesomeIcon
            className="p-2 text-lg transition-all rounded bg-skin-button-accent hover:text-buttonAccentHover"
            icon={faWhatsapp}
          />
        </WhatsappShareButton>
        <TelegramShareButton title={quote} url={shareUrl}>
          <FontAwesomeIcon
            className="p-2 text-lg transition-all rounded bg-skin-button-accent hover:text-buttonAccentHover"
            icon={faTelegram}
          />
        </TelegramShareButton> */}
      </>
    )
  }

  return (
    <div>
      {/* <Text></Text> */}
      <p className="mx-auto mt-2 text-xl font-bold text-center md:text-2xl">
        {title}
      </p>
      {/* <Text></Text> */}

      <div className="flex items-center justify-between h-10 mx-auto mt-4 w-72">
        <Button
          buttonType="default"
          text="Copy Link"
          id={copyButtonID}
          className=""
          onClick={copyToClipboard}
        />

        {/* <p className="text-xs text-center text-skin-muted"></p> */}
        <div className="space-x-2 text-right">{renderSocialShare()}</div>
      </div>
      <p
        onClick={copyToClipboard}
        id={textID}
        className="flex items-center justify-center h-10 px-4 mx-auto mt-4 text-xs text-center truncate rounded outline-none appearance-none 0mx-auto w-fit bg-skin-button-accent text-skin-muted placeholder:text-center placeholder:text-xs placeholder:text-skin-muted ">
        {shareUrl.slice(0, 40) + "..." + shareUrl.slice(shareUrl.length - 5)}
      </p>
    </div>
  )
}
