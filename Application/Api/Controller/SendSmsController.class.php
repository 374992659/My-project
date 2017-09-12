<?php
/**
 * 发送短信
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/6
 * Time: 17:44
 */

namespace Api\Controller;
use Think\Controller;
include_once './ThinkPHP/Library/Vendor/Sms.php';

class SendSmsController extends Controller
{
    /*
     * 发送短信验证码
     * @param   string      $phone      手机号
     * @param   string      $keyPrefix  缓存标识前缀
     * @param   string        $sign         签名
     * @param   string      $tempId     短信模板id
     * @param   int         $validTime  有效时间
     * @param   int         $limitNum   限制条数
     * */
    public function SendMassage($phone, $keyPrefix, $sign, $tempId, &$code=0, $validTime=600, $limitNum=5){
        //同一手机验证码发送次数和间隔限制
        if( $this->limitYzmNums($phone, $keyPrefix, $limitNum) ) {
            $code = 108;
            return false;
        }

        //验证码相关构建
        $key_yzm_val = $keyPrefix.$phone;
        $var = array('sentime' => '', 'num' => '', 'hash' => '', 'phone' => '');
        $tmp = (($x = S($key_yzm_val)) && $x) ? unserialize($x) : '';
        if ( !empty($tmp) ) {
            $now = time();
            $var = array_merge($var, $tmp);

            if ((($now - $var['sentime']) <= C('CAPTCHA_INTERVAL_SECOND'))) {
                $code = 109;
                return false;
            }
            $var['sentime'] = time();
            $var['hash']    = mt_rand('111111', '999999');
            $var['num']     = $var['num'] + 1;
            $var['phone']   = $phone;
        } else {
            $var['sentime'] = time();
            $var['num']     = 1;
            $var['hash']    = mt_rand('111111', '999999');
            $var['phone']   = $phone;
        }
        //发送短信
        $SendSms = new \Sms(C('ACCESSKEYID'), C('ACCESSKEYSECRET'));;
        $res = $SendSms->sendSms($sign, $tempId, $phone,array('code'=>$var['hash']));
        if($res->Code !='OK' ){
            $code=110;
            return false;
        }
        //存入缓存
        $val   = serialize($var);
        S($key_yzm_val, $val, array('expire'=>$validTime));
        $code = 0;
        return true;
    }

    /**
     * 验证码发送限制
     */
    private function limitYzmNums($phone, $keyPrefix, $limitNum) {
        if (empty($phone)) {
            return true;
        }
        //phone限制检测
        $key      = $keyPrefix.$phone;
        $limitNumsPhone = S($key);
        $valPhone = isset($limitNumsPhone) ? unserialize($limitNumsPhone) : '';
        if (isset($valPhone['num']) && $valPhone['num'] >= $limitNum) {
            return true;
        } else {
            return false;
        }
    }
}