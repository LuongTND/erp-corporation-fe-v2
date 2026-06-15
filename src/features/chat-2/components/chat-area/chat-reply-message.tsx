interface Props {
  replyingToMessage: any
  setOpenReplyMessage: any
}

const ChatReplyMessage = ({ replyingToMessage, setOpenReplyMessage }: Props) => {
  console.log('Nhận được message không??', replyingToMessage)

  return (
    <div className="flex items-center justify-between px-5 py-4 bg-muted rounded-t-lg">
      <div className="w-[90%] text-xs flex flex-col gap-y-2">
        <p className="font-semibold text-foreground">
          <span className="text-muted-foreground">Đang trả lời </span>{replyingToMessage.senderName}
        </p>
        <p className="text-muted-foreground truncate">{replyingToMessage.content}</p>
      </div>
      <button
        onClick={() => setOpenReplyMessage(false)}
        className="text-muted-foreground hover:text-foreground transition-colors hover:cursor-pointer"
      >
        ✕
      </button>
    </div>
  )
}

export default ChatReplyMessage
