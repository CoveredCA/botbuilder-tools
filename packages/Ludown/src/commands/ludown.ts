import { name } from 'commander';
import { version } from '../../package.json';
import { IValidatorErrorObject } from '../interfaces/utils/validators/IValidatorErrorObject';
import * as ludownRes from '../res/ludown.json';
import { extractArguments } from '../utils/argument-extractor';
import { commandExecuterFactory } from '../utils/command-factory';
import { printError } from '../utils/printers';
import { invalidCommandValidatorFactory } from '../utils/validators/invalid-command-validator';

/**
 * @description
 * Fires up the main ludown command.
 */
export const init = () => {
	const mainCommand = commandExecuterFactory(async () => {
		const resolvedArguments = extractArguments(process.argv);
		const allowableCommands = ['parse', 'p', 'refresh', 'd', 'translate', 't'];

		// Register the ludown sub commands and their aliases.
		const ludownCommand = name('ludown')
			.description(ludownRes.description)
			.version(version, '-v, --version');

		ludownCommand.command('parse', ludownRes.commands.parse).alias('p');

		ludownCommand.command('refresh', ludownRes.commands.refresh).alias('d');

		ludownCommand.command('translate', ludownRes.commands.translate).alias('t');

		// Fire the command parser to handle version and help options.
		ludownCommand.parse(process.argv);

		try {
			// Validate the given sub commands.
			await invalidCommandValidatorFactory(allowableCommands).execute(resolvedArguments.command);
		} catch (err) {
			printError((<IValidatorErrorObject>err).message);
			ludownCommand.help();
		}
	});

	mainCommand.execute();
};