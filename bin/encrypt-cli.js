#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// 获取可执行文件所在目录
const getExecutablePath = () => {
    return process.pkg ? path.dirname(process.execPath) : __dirname;
};

// 生成密钥对
function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    const execPath = getExecutablePath();
    fs.writeFileSync(path.join(execPath, 'public_key.pem'), publicKey);
    fs.writeFileSync(path.join(execPath, 'private_key.pem'), privateKey);
    console.log('密钥对已生成并保存为 public_key.pem 和 private_key.pem');
}

// 加密文件
function encryptFile(inputFile, outputFile, publicKeyFile) {
    const execPath = getExecutablePath();
    const publicKey = fs.readFileSync(path.resolve(execPath, publicKeyFile), 'utf8');
    const data = fs.readFileSync(inputFile);

    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        },
        data
    );

    fs.writeFileSync(outputFile, encryptedData);
    console.log(`文件已加密并保存为 ${outputFile}`);
}

// 解密文件
function decryptFile(inputFile, outputFile, privateKeyFile) {
    const execPath = getExecutablePath();
    const privateKey = fs.readFileSync(path.resolve(execPath, privateKeyFile), 'utf8');
    const encryptedData = fs.readFileSync(inputFile);

    const decryptedData = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        },
        encryptedData
    );

    fs.writeFileSync(outputFile, decryptedData);
    console.log(`文件已解密并保存为 ${outputFile}`);
}

program
    .version('1.0.0')
    .description('非对称加密文件命令行工具');

program
    .command('generate')
    .description('生成新的密钥对')
    .action(generateKeyPair);

program
    .command('encrypt <inputFile> <outputFile>')
    .description('使用公钥加密文件')
    .option('-k, --key <keyFile>', '公钥文件路径', 'public_key.pem')
    .action((inputFile, outputFile, options) => {
        encryptFile(inputFile, outputFile, options.key);
    });

program
    .command('decrypt <inputFile> <outputFile>')
    .description('使用私钥解密文件')
    .option('-k, --key <keyFile>', '私钥文件路径', 'private_key.pem')
    .action((inputFile, outputFile, options) => {
        decryptFile(inputFile, outputFile, options.key);
    });

program.parse(process.argv);