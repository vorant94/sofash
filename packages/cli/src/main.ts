import { Command } from 'commander';
import { cinemaCommand } from './cinema/cinema.command.js';

const program = new Command().addCommand(cinemaCommand);

await program.parseAsync();
