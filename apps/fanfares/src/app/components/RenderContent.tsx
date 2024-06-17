import { generatePrivateKey } from "nostr-tools"
import { useCallback } from "react"

enum ContentType {
  video = "video",
  image = "image",
  text = "text",
  link = "link",
  audio = "audio",
  youtube = "youtube",
  mention = "mention",
  hashtag = "hashtag",
  linefeed = "linefeed",
}
interface Content {
  type: ContentType
  content: string
}

function parseContent(content: string): Content[] {
  const parsedContents: Content[] = []

  const lines = content.split(/\n/)

  for (const line of lines) {
    // Split content by spaces to analyze each part
    const parts = line.split(/\s+/)

    for (const part of parts) {
      // Video detection
      if (/\.(webm|mov|mp4)$/.test(part)) {
        parsedContents.push({ type: ContentType.video, content: part })
      }
      // Image detection
      else if (/\.(jpeg|jpg|gif|png|webp)$/.test(part)) {
        parsedContents.push({ type: ContentType.image, content: part })
      }
      // Link detection, excluding image and YouTube links
      else if (
        /^https?:\/\/.+/i.test(part) &&
        !/youtu(be\.com|\.be)/i.test(part)
      ) {
        parsedContents.push({ type: ContentType.link, content: part })
      }
      // YouTube detection
      else if (/youtu(be\.com|\.be)/i.test(part)) {
        let embedUrl = ""

        // Long YouTube URL: https://www.youtube.com/watch?v=VuJ2XgbIK7E&t=15s
        const longMatch = part.match(/youtube\.com\/watch\?v=([^&]+)(?:&.*)?/)
        if (longMatch) {
          embedUrl = `https://www.youtube.com/embed/${longMatch[1]}`
          if (part.includes("&t=")) {
            const timeParam = part.match(/&t=([^&]+)/)
            if (timeParam) {
              embedUrl += `?${timeParam[0]}`
            }
          }
        }

        // Short YouTube URL: https://youtu.be/VuJ2XgbIK7E
        const shortMatch = part.match(/youtu\.be\/([^&]+)/)
        if (shortMatch) {
          embedUrl = `https://www.youtube.com/embed/${shortMatch[1]}`
        }

        if (embedUrl) {
          parsedContents.push({ type: ContentType.youtube, content: embedUrl })
        }
      }

      // Mention detection
      else if (/nostr:[a-zA-Z0-9:.]+/.test(part)) {
        parsedContents.push({ type: ContentType.mention, content: part })
      }
      // Hashtag detection
      else if (/^#\w+/.test(part)) {
        parsedContents.push({ type: ContentType.hashtag, content: ` ${part} ` })
      }
      // Everything else is treated as text
      else {
        parsedContents.push({ type: ContentType.text, content: ` ${part} ` })
      }
    }
    parsedContents.push({ type: ContentType.linefeed, content: "\n" })
  }

  return parsedContents
}

export interface RenderContentProps {
  rawContent: string
}

export function RenderContent(props: RenderContentProps) {
  const { rawContent } = props
  const parsedContent = parseContent(rawContent)

  // Separate image content from other content
  const nonImageContents = parsedContent.filter(
    content => content.type !== ContentType.image
  )
  const imageContents = parsedContent.filter(
    content => content.type === ContentType.image
  )

  const renderContent = useCallback(
    (content: Content, index: number) => {
      const key = `${content.type}-${index}`

      switch (content.type) {
        case ContentType.linefeed:
          return <br key={key} />
        case ContentType.video:
          return (
            <video
              key={key}
              controls
              className="rounded max-w-md mt-2 mx-auto aspect-video"
              src={content.content}
            />
          )
        case ContentType.image:
          return (
            <img
              key={key}
              className={`rounded drop-shadow-md mt-2 ${
                imageContents.length > 1
                  ? "w-full h-full object-cover"
                  : "max-w-md mx-auto"
              }`}
              src={content.content}
            />
          )
        case ContentType.text:
          return (
            <span key={key} className="tracking-wide text-sm font-light">
              {content.content}
            </span>
          )
        case ContentType.link:
          return (
            <a
              key={key}
              className="text-stone-400 hover:text-stone-200 tracking-wide text-sm font-light"
              href={content.content}>
              {content.content.substring(0, 21)}...
            </a>
          )
        case ContentType.audio:
          return <audio key={key} src={content.content} />
        case ContentType.youtube:
          return (
            <div
              className="relative w-full max-w-md mx-auto content-center aspect-video mt-2"
              key={key}>
              <iframe
                src={content.content}
                title="YouTube video player"
                frameBorder="0"
                className="absolute top-0 left-0 w-full h-full rounded object-contain"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen></iframe>
            </div>
          )
        case ContentType.mention:
          return (
            <a
              key={key}
              className="text-yellow-400 hover:text-yellow-300 tracking-wide text-sm font-light">
              {content.content.substring(6, 21)}...
            </a>
          )
        case ContentType.hashtag:
          return (
            <a
              key={key}
              className="text-blue-400 hover:text-blue-300 tracking-wide text-sm font-light">
              {content.content}
            </a>
          )
        default:
          return null
      }
    },
    [imageContents.length]
  )

  const renderImages = useCallback((content: Content, index: number) => {
    const key = `${content.type}-${index}`
    return (
      <img
        key={key}
        className="rounded drop-shadow-md mt-2 w-full h-full object-cover"
        src={content.content}
        style={{ width: "100%", height: "100%" }}
      />
    )
  }, [])

  return (
    <div>
      <div>{nonImageContents.map(renderContent)}</div>
      {imageContents.length > 0 && (
        <div
          className={`grid ${
            imageContents.length > 1 ? "grid-cols-2 gap-2" : ""
          }`}>
          {imageContents.map(
            imageContents.length > 1 ? renderImages : renderContent
          )}
        </div>
      )}
    </div>
  )
}
