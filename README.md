# 非对称加密文件命令行工具使用指南

## 简介

这个命令行工具使用 RSA 算法进行非对称加密和解密操作。它允许用户生成密钥对、加密文件和解密文件。

## 安装

1. 确保您已经下载了适合您操作系统的可执行文件。
2. 将可执行文件放在您想要的目录中。
3. （可选）将该目录添加到系统的 PATH 环境变量中，以便从任何位置调用该工具。

## 基本用法

### Windows 系统：

使用 `encrypt-cli.exe`。

### macOS 系统：

使用 `encrypt-cli-macos`。

### Linux 系统：

使用 `encrypt-cli-linux`。

注意：在 macOS 和 Linux 上，您可能需要先赋予文件执行权限：
```
chmod +x encrypt-cli-macos
```
或
```
chmod +x encrypt-cli-linux
```

## 命令

为简洁起见，以下示例将使用 `encrypt-cli` 代表您系统对应的可执行文件名。请根据您的操作系统替换为正确的文件名。

### 1. 生成密钥对

```
encrypt-cli generate
```

这将在当前目录生成 `public_key.pem` 和 `private_key.pem` 两个文件。

### 2. 加密文件

```
encrypt-cli encrypt <输入文件> <输出文件>
```

例如：
```
encrypt-cli encrypt secret.txt encrypted.bin
```

默认使用当前目录下的 `public_key.pem` 进行加密。

### 3. 解密文件

```
encrypt-cli decrypt <输入文件> <输出文件>
```

例如：
```
encrypt-cli decrypt encrypted.bin decrypted.txt
```

默认使用当前目录下的 `private_key.pem` 进行解密。

### 4. 使用自定义密钥文件

您可以使用 `-k` 或 `--key` 选项指定不同的密钥文件：

加密：
```
encrypt-cli encrypt secret.txt encrypted.bin -k custom_public_key.pem
```

解密：
```
encrypt-cli decrypt encrypted.bin decrypted.txt -k custom_private_key.pem
```

## 注意事项

1. 请妥善保管您的私钥（`private_key.pem`）。任何拥有私钥的人都能解密您的文件。
2. 公钥（`public_key.pem`）可以安全地分享给需要向您发送加密文件的人。
3. 这个工具使用 RSA 加密，适合加密相对较小的文件（通常小于 256 字节）。对于大文件，您可能需要考虑先使用对称加密（如 AES），然后用这个工具加密对称密钥。
4. 加密和解密操作可能需要一些时间，特别是对于较大的文件。

## 故障排除

如果您遇到 "密钥文件不存在" 的错误，请确保您在正确的目录中运行命令，或使用 `-k` 选项指定正确的密钥文件路径。

如果遇到权限问题，请确保您有足够的权限来读取输入文件和写入输出文件。

## 安全建议

- 定期更新您的密钥对。
- 不要在不安全的环境中使用或存储私钥。
- 考虑使用额外的加密方法来保护您的私钥文件。