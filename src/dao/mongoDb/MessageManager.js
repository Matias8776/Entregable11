import messagesModel from '../models/messages.js';

export default class MessageManager {
  getMessages = async () => {
    try {
      return await messagesModel.find().lean().exec();
    } catch (error) {
      return error.message;
    }
  };

  createMessage = async (message) => {
    try {
      return await messagesModel.create(message);
    } catch (error) {
      return error.message;
    }
  };
}
