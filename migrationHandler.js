
const xmlParser = require('xml-js');
const fs = require("fs");
const { promisify } = require("util");

const readFile = promisify(fs.readFile);
const fileExists = promisify(fs.exists)
const execa = require('execa');


const handleMigrate = async (projectName, projectDir) => {

    try {

        // console.log(projectDir, projectName);


        const publishedBinFolder = `${projectDir}\\${projectName}\\bin\\Release\\Publish\\bin`
        const publishedFolder = `${projectDir}\\${projectName}\\bin\\Release\\Publish`
        const packageConfigPath = `${projectDir}\\${projectName}\\packages.config`


        let packageConfigExist = await fileExists(packageConfigPath)

        if (!packageConfigExist) {

            console.log(`packages.config does not exist`);
            process.exit(1)
        }


        const efVersion = await extractEntityFrameworkVersion(packageConfigPath);
        const migrateConsole = `${projectDir}\\packages\\EntityFramework.${efVersion}\\tools\\migrate.exe`


        let cmdString = `"${migrateConsole}" ${projectName}.dll Configuration /startUpDirectory:"${publishedBinFolder}"  /startupConfigurationFile="${publishedFolder}\\Web.config" `;

        console.log(cmdString);


        const stream = await execa.shell(cmdString).stdout;

        stream.pipe(process.stdout);

        stream.on('end', () => {
            process.exit(0)
        })




    } catch (error) {
        console.log(error)

        process.exit(1)

    }


}


const extractEntityFrameworkVersion = async (packageConfigPath) => {


    try {

        let xmlData = await readFile(packageConfigPath);
        let data = xmlParser.xml2js(xmlData, { compact: true, ignoreComment: true, alwaysChildren: true });

        let packages = data.packages.package

        let efPackage = packages.filter(x => x._attributes.id == "EntityFramework");

        if (efPackage.length > 0) {
            // console.log(efPackage);
            // console.log(efPackage[0]._attributes.version);
            return efPackage[0]._attributes.version
        } else {
            console.log(`EF not Found`);

            // process.exit(1)
        }

    } catch (error) {
        console.log(error);
        process.exit(1)

    }


}


module.exports = { handleMigrate, extractEntityFrameworkVersion };