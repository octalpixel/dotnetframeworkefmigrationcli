#!/usr/bin/env node

const program = require('commander');
const migrationHandler = require('./migrationHandler')

program
    .command('migrate')
    .description('Run the Migration Script For Entity Framework')
    .option("-p, --project-name <projectName>", 'Name of Project')
    .option('-d, --project-dir <projectDir>', 'Project Directory')
    .action((options) => {


        if (options.projectName == undefined) {
            process.exit(1)
        }
        if (options.projectDir == undefined) {
            process.exit(1)
        }

        let { projectName, projectDir } = options

        migrationHandler.handleMigrate(projectName, projectDir)




    })

program.parse(process.argv);

