#!/usr/bin/env node

const program = require('commander');
const migrationHandler = require('./migrationHandler')
const fs = require("fs");
const { promisify } = require("util");

const fileExists = promisify(fs.exists)


const exitProcess = () => {
    process.exit(1)
}


program
    .command('migrate')
    .description('Run the Migration Script For Entity Framework')
    .option("-p, --project-name <projectName>", 'Name of Project')
    .option('-d, --project-dir <projectDir>', 'Project Directory')
    .action(async (options) => {


        try {

            let { projectName, projectDir } = options

            if (projectName == undefined) {
                console.log(`Project Name not specified`);

                exitProcess()
            }
            if (projectDir == undefined) {
                console.log(`Project Directory Not Specified`);

                exitProcess()
            }

            let projectDirExist = await fileExists(projectDir)

            if (!projectDirExist) {
                console.log(`Project Directory does not exist`);

                exitProcess()
            }

            let migrationExist = await fileExists(`${projectDir}\\${projectName}\\Migrations`)

            if (!migrationExist) {
                console.log(`Migration Files do not exist`);
                exitProcess();

            }





            migrationHandler.handleMigrate(projectName, projectDir)

        } catch (error) {

            console.log(error);
            process.exit(1);


        }






    })

program.parse(process.argv);

