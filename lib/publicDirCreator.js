// This file is responsible for creating the public directory and copying the contents of the templates directory to the public directory.
// it must be called from server.js if the public directory does not exist.
const path = require('path');
const fs = require("fs");
function getTemplatePath(file = '') {
    if(process.pkg) {
        return path.join(path.dirname(process.pkg.defaultEntrypoint), 'templates', file);
    }
    return path.join(
         __dirname,
        'templates',
        file
    )
}
function publicDirCreator() {
    let templateDirPath;
    const publicDir = path.join(
        process.cwd(),
         'public'
    );
    if(!fs.existsSync(publicDir)){
        fs.mkdirSync(publicDir);
    }

    const files = fs.readdirSync(getTemplatePath());
    files.forEach(file => {
        fs.copyFileSync(getTemplatePath(file), path.join(publicDir, file));
        console.log('Copied', file);
    });

}

module.exports = publicDirCreator;