import fs from 'fs';
import { join } from 'path';
import Promise from 'bluebird';
import { IIntlMessage } from '../../../domain';
import config from '../../config';

// Get locales
const locales = config.locales.map(locale => locale.id);

// A folder with messages
// In development, source dir will be used
const MESSAGES_DIR = process.env.MESSAGES_DIR || join(__dirname, './intl');

const readFile = Promise.promisify(fs.readFile);

export default async (root, { locale }): IIntlMessage[] => {
  if (!locales.includes(locale)) {
    throw new Error(`Locale '${locale}' not supported`);
  }
  let localeData;
  try {
    localeData = await readFile(join(MESSAGES_DIR, `translations/${locale}.json`));
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Locale '${locale}' not found`);
    }
  }
  const translations = JSON.parse(localeData);
  return Object.keys(translations).map(messageId => ({
    id: `${messageId}.${locale}`,
    messageId,
    message: translations[messageId],
  }));
};
