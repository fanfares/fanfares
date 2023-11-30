import { FAProLight, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { PublicKey } from '@solana/web3.js';
import moment from 'moment';
import { useState } from 'react';
import { toast } from 'react-toastify';
import useFirebaseChat, { FirebaseChatMessage } from 'src/controllers/hooks/chat-hook';
import { Text } from 'src/views/components/Text';

export interface ChatProps {
  creatorWallets: PublicKey[];
  mediaKey: PublicKey;
  poster: PublicKey;
  hasMinted: boolean | undefined;
}

const OVERRIED_GATED_CHAT = false;
const MAX_CHAT_LENGTH = 512;

function Chat(props: ChatProps) {
  const { hasMinted, poster, mediaKey, creatorWallets } = props;
  const [comment, setComment] = useState<string>('');

  const firebaseChat = useFirebaseChat(mediaKey, 50);

  const currentUsername = poster?.toString() ?? PublicKey.default.toString();

  const onChange = e => {
    const message = e.target.value as string;

    if (message.length >= MAX_CHAT_LENGTH) {
      toast.error(`Message has a capped length at ${MAX_CHAT_LENGTH}`);
    }
    setComment(message);
  };

  // Send comment on enter key
  const checkEnter = (e: { key: string }) => {
    if (e.key === 'Enter') {
      sendComment();
    }
  };

  const sendComment = async () => {
    //TODO change this back to gated
    if ((hasMinted || OVERRIED_GATED_CHAT) && poster) {
      if (comment && comment.length > 0) {
        firebaseChat.postMessage({
          userKey: poster,
          content: comment
        });
      }
      setComment('');
    } else {
      toast('You must be a member of the Podcast NFT first! \n\nIf you already are, connect your wallet.');
    }
  };

  const formatDate = (date: moment.MomentInput) => {
    return moment(date).calendar();
  };

  const renderComment = (messageData: FirebaseChatMessage) => {
    if (!messageData) return null;

    const isCreator = creatorWallets.find(wallet => wallet.toString() === messageData.userKey) !== undefined;

    return (
      <div
        key={messageData.id}
        className={`flex w-full p-2 ${currentUsername === messageData.userKey ? `justify-end ` : null}`}
      >
        <div className={`flex flex-col gap-0 ${currentUsername === messageData.userKey ? 'items-end' : 'items-start'}`}>
          <div className=" rounded-2xlpx-4  flex w-full items-baseline py-2 ">
            <p className="text-sm font-medium ">
              {isCreator ? '👑 ' : ''}
              {messageData.userKey.slice(0, 4) + '...' + messageData.userKey.slice(-4)}
            </p>

            <p className=" pl-2 text-xs">
              {new Date(messageData.date).toISOString().split('T')[0]}

              {formatDate(new Date(messageData.date))}
            </p>
          </div>
          <div
            className={`flex max-w-[250px] items-center justify-center  rounded px-4 text-left lg:max-w-[370px] 

            ${currentUsername === messageData.userKey ? 'bg-skin-button-accent-hover' : 'bg-skin-button-accent'}`}
          >
            <Text className="w-full gap-2 break-words">{messageData.content}</Text>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full max-h-[40vh] w-full flex-col justify-center    rounded-2xl border border-buttonDisabled drop-shadow-md transition-all ease-linear md:mb-40 md:max-h-[65vh]">
      <div className="flex items-center justify-center rounded-t-2xl bg-skin-fill/20 py-2 text-center text-lg drop-shadow-lg backdrop-blur-sm ">
        <p className="text-lg font-bold uppercase text-skin-inverted">MEMBER&apos;S CHAT</p>
      </div>
      <div className="overflow-y-auto" id="chatContainer" ref={firebaseChat.scrollRef}>
        <div className="bg-black" />
        {firebaseChat.messages.map(renderComment)}
      </div>
      <div className="relative flex w-full items-center justify-end rounded-b-2xl border-t border-buttonDisabled bg-skin-fill/20 py-2">
        <input
          className="w-full bg-transparent px-4 pr-8 text-skin-base outline-none placeholder:text-skin-base"
          placeholder="Send a message..."
          onChange={onChange}
          value={comment}
          onKeyDown={checkEnter}
          type="text"
        />

        <button
          aria-label="Send message"
          type="button"
          onClick={() => sendComment()}
          className="absolute mx-4 cursor-pointer text-skin-inverted transition-all duration-200 hover:scale-125 hover:text-skin-muted"
        >
          <FontAwesomeIcon icon={FAProLight.faPaperPlane} />
        </button>
      </div>
    </div>
  );
}

export default Chat;
