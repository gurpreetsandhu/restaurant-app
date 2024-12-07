const dotenv = require('dotenv');
const fs = require('fs');
const bcryptjs = require('bcryptjs');

const pathToConfig = '../config.env';
const path = require('path');
dotenv.config({'path': pathToConfig});

function hashPassword(password){
    const saltRounds = 10;
    const hashedPassword = bcryptjs.hash(password, saltRounds);
    const oldEnvFile = fs.readFileSync(path.join(__dirname, pathToConfig), 'utf8');
    const newEnvFile = `${oldEnvFile}\nHASHED_PASSWORD=${hashedPassword}\n`;
    fs.writeFileSync(path.join(__dirname, pathToConfig), newEnvFile, 'utf8');
} 

function checkPassword(password) {
    try {
        const isMatch = bcryptjs.compare(password, process.env.HASHED_PASSWORD);
        if (isMatch) {
            return true;
        } else {
           return false;
        }
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
}


function updateEnvFile(key, newValue) {
    try {
        // Read the .env file content
        const envContent = fs.readFileSync(path.join(__dirname, pathToConfig), 'utf-8');

        // Check if the key already exists in the .env file
        const keyRegex = new RegExp(`^${key}=.*`, 'm');  // regex to find the key (if exists)

        let updatedContent;

        if (keyRegex.test(envContent)) {
            // Replace the existing key-value pair
            updatedContent = envContent.replace(keyRegex, `${key}=${newValue}`);
        } else {
            // Add the new key-value pair at the end
            updatedContent = envContent + `\n${key}=${newValue}`;
        }

        // Write the updated content back to the .env file
        fs.writeFileSync(path.join(__dirname, pathToConfig), updatedContent, 'utf-8');
        console.log(`Successfully updated ${key} in .env file`);

    } catch (error) {
        console.error('Error updating .env file:', error);
    }
}

function updatePassword(password) {
    const envContent = fs.readFileSync(path.join(__dirname, pathToConfig), 'utf-8');
    let key = 'HASHED_PASSWORD';

    const keyRegex = new RegExp(`^${key}=.*`, 'm');  // regex to find the key (if exists)

    if (keyRegex.test(envContent)) {
        console.log('Passsword already hashed. In order to add new password remove the HASHED_PASSWORD from config file.')
        return checkPassword(password);
    } else{
        hashPassword(password);
        return true;
    }
        
}

async function updateUserName(userName) {
    updateEnvFile('USERNAME', userName);
}

module.exports = {
    updatePassword,
    updateUserName,
};