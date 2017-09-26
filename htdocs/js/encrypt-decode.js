/**
 * 加密解密公用
 * Created by Gao on 2017/7/4.
 */

var key = '625202f9149e061d';
key = CryptoJS.enc.Utf8.parse(key);
var iv = "5efd3f6060e20330";
iv = CryptoJS.enc.Utf8.parse(iv);


/**
 * 加密提交参数
 * @param   json_data
 * @returns string
 */
function jsEncryptData( json_data )
{
    var plaintText = JSON.stringify(json_data);
    var encryptedData = CryptoJS.AES.encrypt(plaintText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var encryptedBase64Str = encryptedData.toString();

    return encryptedData.ciphertext.toString();
}


/**
 * 解密返回结果
 * @param data
 */
function jsDecodeData( data )
{
    var text = data.data;
    var encryptedHexStr = CryptoJS.enc.Hex.parse(text);
    var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);

    return JSON.parse(JSON.parse(decryptedStr)[1]);
}
