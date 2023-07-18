import { isDashaSashaPostType } from './post-type-deda-sasha.js';

export interface ParsedPost {
  messageId: string;
  userId: string;
  username: string;
  chatId: string;
  chatType: string;
  postDate: string;
  forwardFromChatId: string;
  forwardFromMessageId: string;
  forwardDate: string;
  photoUrls: string;
  postCaption: string;
  captionEntities: string;
}
/**
 * Parses the provided post data into a ParsedPost object.
 * @param postData The JSON data representing the post.
 * @returns The parsed post object if the data is in a supported format, otherwise undefined.
 */
export function getParsedPost(postData: any): ParsedPost | undefined {
  //TODO do it better in future
  if (isDashaSashaPostType(postData)) {
    const { message } = postData;

    const messageId = message.message_id || null;
    const userId = (message.from && message.from.id) || null;
    const username = (message.from && message.from.username) || null;
    const chatId = (message.chat && message.chat.id) || null;
    const chatType = (message.chat && message.chat.type) || null;
    const postDate = (message.date && new Date(message.date * 1000)) || null;
    const forwardFromChatId =
      (message.forward_from_chat && message.forward_from_chat.id) || null;
    const forwardFromMessageId = message.forward_from_message_id || null;
    const forwardDate =
      (message.forward_date && new Date(message.forward_date * 1000)) || null;
    const photoUrls =
      (message.photo && message.photo.map((item: any) => item.file_id)) || [];
    const postCaption = message.caption || null;
    const captionEntities =
      (message.caption_entities &&
        message.caption_entities.map((item: any) => item.type)) ||
      [];

    return {
      messageId,
      userId,
      username,
      chatId,
      chatType,
      postDate,
      forwardFromChatId,
      forwardFromMessageId,
      forwardDate,
      photoUrls,
      postCaption,
      captionEntities,
    };
  } else {
    console.error('Unsupported JSON format');
  }
}
