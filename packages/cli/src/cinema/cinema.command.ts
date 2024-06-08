import { Command } from 'commander';
import { ravHenCommand } from './rav-hen/rav-hen.command.js';

export const cinemaCommand = new Command('cinema').addCommand(ravHenCommand);
