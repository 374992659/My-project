<?php
namespace Common\Lib;

/**
 * Rsa加解密
 * @author 130010101@qq.com
 *
 */
class RsaLib
{
	/**
	 * 私钥加密
	 * @param string $data
	 * @param string $privKeyPath
	 * @return
	 */
	public static function privEncrypt($data, $privKeyPath)
	{
		if(!is_string($data)){
			return null;
		}
		$privKey = openssl_pkey_get_private( file_get_contents($privKeyPath) );
		return openssl_private_encrypt($data, $encrypted, $privKey ) ? base64_encode($encrypted) : null;
	}
	
	/**
	 * 私钥解密
	 * @param string $encrypted
	 * @param string $privKeyPath
	 * @return
	 */
	public static function privDecrypt($encrypted, $privKeyPath)
	{
		if(!is_string($encrypted)){
			return null;
		}
		$privKey = openssl_pkey_get_private( file_get_contents($privKeyPath) );
		return (openssl_private_decrypt(base64_decode($encrypted), $decrypted, $privKey))? $decrypted : null;
	}
	
	/**
	 * 公钥加密
	 * @param string $data
	 * @param string $publicKeyPath
	 * @return
	 */
	public static function publicEncrypt($data, $publicKeyPath)
	{
		if(!is_string($data)){
			return null;
		}
		$publicKey = openssl_pkey_get_public( file_get_contents($publicKeyPath) );
		return openssl_public_encrypt($data, $encrypted, $publicKey ) ? base64_encode($encrypted) : null;
	}
	
	/**
	 * 公钥解密
	 * @param string $encrypted
	 * @param string $publicKeyPath
	 * @return
	 */
	public static function publicDecrypt($encrypted, $publicKeyPath)
	{
		if(!is_string($encrypted)){
			return null;
		}
		$publicKey = openssl_pkey_get_public( file_get_contents($publicKeyPath) );
		return (openssl_public_decrypt(base64_decode($encrypted), $decrypted, $publicKey))? $decrypted : null;
	}
	
	/**
	 * getSignMsg 计算签名
	 *
	 * @param array $params	计算签名数据
	 * @param string $privKeyPath
	 * @return string 返回密文
	 */
	public function getSign($params, $privKeyPath)
	{
		$params_str = json_encode($params);
	
		$priv_key = file_get_contents ( $privKeyPath );
		$pkeyid = openssl_pkey_get_private ( $priv_key );
		openssl_sign ( $params_str, $sign, $pkeyid, OPENSSL_ALGO_SHA1 );
		openssl_free_key ( $pkeyid );
		return base64_encode ( $sign );
	}
	
	/**
	 * checkSignMsg 回调签名验证
	 *
	 * @param array $params 参与签名验证的数据
	 * @param string $publicKeyPath
	 * @return boolean  签名结果
	 */
	public function checkSign($paramsStr, $sign, $publicKeyPath)
	{
		$cert = file_get_contents ( $publicKeyPath );
		$pubkeyid = openssl_pkey_get_public ( $cert );
		$ok = openssl_verify ( $paramsStr, base64_decode($sign), $cert, OPENSSL_ALGO_SHA1 );
		openssl_free_key ( $pubkeyid );
	
		return $ok == 1 ? true : false;
	}
}