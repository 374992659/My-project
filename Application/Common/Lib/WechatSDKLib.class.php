<?php
namespace Common\Lib;

require_once './ThinkPHP/Library/Vendor/wechat.class.php';

/**
 * 微信支付回调
 * @author 130010101@qq.com
 *
 */
class WechatSDKLib extends \Wechat
{
	/**
	 * 设置缓存，按需重载
	 * @param string $cachename
	 * @param mixed $value
	 * @param int $expired
	 * @return boolean
	 */
	protected function setCache($cachename,$value,$expired){
		F($cachename, array('value'=>$value, 'expired'=>$expired+NOW_TIME));
		return false;
	}

	/**
	 * 获取缓存，按需重载
	 * @param string $cachename
	 * @return mixed
	 */
	public function getCache($cachename){
		$cache = F($cachename);
		if( $cache && $cache['expired']>NOW_TIME ){
			return $cache['value'];
		}
		return false;
	}

	/**
	 * 清除缓存，按需重载
	 * @param string $cachename
	 * @return boolean
	 */
	protected function removeCache($cachename){
		F($cachename, null);
		return false;
	}
}