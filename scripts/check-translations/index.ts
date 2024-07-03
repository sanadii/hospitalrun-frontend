/* eslint-disable no-console */
// import { Resource } from 'i18next';
import resources from '../../src/shared/locales';

const checkRecursiveTranslation = async (
  comparingLanguage: string,
  searchingPath: string[],
  defaultLanguageObject: any,
  comparingLanguageObject: any
) => {
  const chalk = await import('chalk');
  const warning = chalk.default.hex('orange');

  if (typeof defaultLanguageObject === 'string' || typeof comparingLanguageObject === 'string') {
    if (typeof defaultLanguageObject === 'object') {
      console.log(
        warning(
          `Found a string for path ${searchingPath.join(
            '-->',
          )} and language ${comparingLanguage} while it is an object for the default language`,
        ),
      );
    }
    return;
  }
  const defaultKeys: string[] = Object.keys(defaultLanguageObject);
  const translatedKeys: string[] = Object.keys(comparingLanguageObject);
  if (defaultKeys.length === 0 || translatedKeys.length === 0) {
    return;
  }
  defaultKeys.forEach((key) => {
    if (!comparingLanguageObject[key]) {
      console.warn(
        warning(
          `The key ${key} is not present for path ${searchingPath.join(
            '-->',
          )} and language ${comparingLanguage}`,
        ),
      );
    } else {
      checkRecursiveTranslation(
        comparingLanguage,
        [...searchingPath, key],
        defaultLanguageObject[key],
        comparingLanguageObject[key],
      );
    }
  });
};

const run = async () => {
  const chalk = await import('chalk');
  const success = chalk.default.hex('green');
  const error = chalk.default.bold.red;

  if (!resources) {
    console.log(error('We have a big problem.... the resources are not loaded correctly!'));
    process.exit(1);
  }

  const languages = Object.keys(resources);
  const defaultLanguage = 'en';

  console.log(
    success(
      '🏁 Start finding translation problems by comparing all languages with the default one (English)',
    ),
  );
  console.log('');

  if (!resources[defaultLanguage]) {
    console.log(error('We have a big problem.... the English language is not found!'));
    process.exit(1);
  }

  for (const language of languages) {
    if (language === defaultLanguage) {
      continue;
    }
    console.log(success(`Checking ${language}`));
    console.log('');
    await checkRecursiveTranslation(
      language,
      [language],
      resources[defaultLanguage].translation,
      resources[language].translation,
    );
    console.log('');
  }
};

run().catch((err) => {
  console.error('Error running the translation check script:', err);
  process.exit(1);
});
