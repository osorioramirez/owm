import translator, { readMessageFiles, getDefaultMessages, createSingleMessagesFile } from 'react-intl-translations-manager';

export default async function translations() {
  const messagesDirectory = './src/infrastructure/intl/messages';
  const translationsDirectory = './src/infrastructure/intl/translations';
  translator({
    messagesDirectory,
    translationsDirectory,
    languages: ['es'],
  });

  const { messages } = getDefaultMessages(readMessageFiles(messagesDirectory));
  createSingleMessagesFile({ messages, directory: translationsDirectory, fileName: 'en.json' });
}
