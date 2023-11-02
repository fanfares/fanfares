import { useCallback } from "react";

enum ContentType {
  video = "video",
  image = "image",
  text = "text",
  link = "link",
  audio = "audio",
  youtube = "youtube",
  mention = "mention",
  hashtag = "hashtag",
}
interface Content {
  type: ContentType;
  content: string;
}

function parseContent(content: string): Content[] {
  const parsedContents: Content[] = [];

  // Split content by spaces to analyze each part
  const parts = content.split(/\s+/);

  for (const part of parts) {
    // Image detection
    if (/\.(webm|mov|mp4)$/.test(part)) {
      parsedContents.push({ type: ContentType.video, content: part });
    }
    // Image detection
    if (/\.(jpeg|jpg|gif|png|webp)$/.test(part)) {
      parsedContents.push({ type: ContentType.image, content: part });
    }
    // Link detection, excluding image and YouTube links
    else if (
      /^https?:\/\/.+/i.test(part) &&
      !/youtu(be\.com|\.be)/i.test(part)
    ) {
      parsedContents.push({ type: ContentType.link, content: part });
    }
    // YouTube detection
    else if (/youtu(be\.com|\.be)/i.test(part)) {
      let embedUrl = "";

      // Long YouTube URL: https://www.youtube.com/watch?v=VuJ2XgbIK7E&t=15s
      const longMatch = part.match(/youtube\.com\/watch\?v=([^&]+)(?:&.*)?/);
      if (longMatch) {
        embedUrl = `https://www.youtube.com/embed/${longMatch[1]}`;
        if (part.includes("&t=")) {
          const timeParam = part.match(/&t=([^&]+)/);
          if (timeParam) {
            embedUrl += `?${timeParam[0]}`;
          }
        }
      }

      // Short YouTube URL: https://youtu.be/VuJ2XgbIK7E
      const shortMatch = part.match(/youtu\.be\/([^&]+)/);
      if (shortMatch) {
        embedUrl = `https://www.youtube.com/embed/${shortMatch[1]}`;
      }

      if (embedUrl) {
        parsedContents.push({ type: ContentType.youtube, content: embedUrl });
      }
    }

    // Mention detection
    else if (/nostr:[a-zA-Z0-9:.]+/.test(part)) {
        parsedContents.push({ type: ContentType.mention, content: part });
    }
    // Hashtag detection
    else if (/^#\w+/.test(part)) {
      parsedContents.push({ type: ContentType.hashtag, content: ` ${part} ` });
    }
    // Everything else is treated as text
    else {
      parsedContents.push({ type: ContentType.text, content: ` ${part} ` });
    }
  }

  return parsedContents;
}

export interface RenderContentProps {
  rawContent: string;
}

export function RenderContent(props: RenderContentProps) {
  const { rawContent } = props;
  const parsedContent = parseContent(rawContent);


  const renderContent = useCallback(
    (content: Content) => {
      switch (content.type) {
        case ContentType.video:
          return <video src={content.content} />;
        case ContentType.image:
          return <img src={content.content} />;
        case ContentType.text:
          return <span>{content.content}</span>;
        case ContentType.link:
          return (
            <a
              className="text-stone-400 hover:text-stone-200"
              href={content.content}
            >
              {content.content.substring(0, 21)}...
            </a>
          );
        case ContentType.audio:
          return <audio src={content.content} />;
        case ContentType.youtube:
          return (
            <iframe
              width="560"
              height="315"
              src={content.content}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          );
        case ContentType.mention:
          return <a className="text-yellow-400 hover:text-yellow-300">{content.content.substring(6, 21)}...</a>;
        case ContentType.hashtag:
          return (
            <a className="text-blue-400 hover:text-blue-300">
              {content.content}
            </a>
          );
        default:
          return null;
      }
    },
    []
  );

  return <div>{parsedContent.map(renderContent)}</div>;
}
