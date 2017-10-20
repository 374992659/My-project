<?php
/**
 * 微信相关业务
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/20
 * Time: 17:10
 */

namespace Api\Controller;


class WeChatController extends BaseController
{

    /*
     * 得到获取微信openId的code
     * @param url 回调地址
     * */
    public function getCode()
    {
        $url = $this->pdata['url'];
        //触发微信返回code码
        $baseUrl = urlencode($url);
        $url = $this->__CreateOauthUrlForCode($baseUrl);
        $this->echoEncrypData(0,'',$url);
//        Header("Location: $url");
        exit();
    }
    /**
     *
     * 构造获取code的url连接
     * @param string $redirectUrl 微信服务器回跳的url，需要url编码
     *
     * @return 返回构造好的url
     */
    private function __CreateOauthUrlForCode($redirectUrl)
    {
        $urlObj["appid"] = C('APPID');
        $urlObj["redirect_uri"] = "$redirectUrl";
        $urlObj["response_type"] = "code";
        $urlObj["scope"] = "snsapi_base";
        $urlObj["state"] = "STATE"."#wechat_redirect";
        $bizString = $this->ToUrlParams($urlObj);
        return "https://open.weixin.qq.com/connect/oauth2/authorize?".$bizString;
    }
    /**
     *
     * 通过code从工作平台获取openid机器access_token
     * @param string $code 微信跳转回来带上的code
     *
     * @return openid
     */
    public function GetOpenidFromMp()
    {
        $code = $this->pdata['code'];
        $url = $this->__CreateOauthUrlForOpenid($code);
        //初始化curl
        $ch = curl_init();
        //设置超时
//        curl_setopt($ch, CURLOPT_TIMEOUT, $this->curl_timeout);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,FALSE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
//        if(WxPayConfig::CURL_PROXY_HOST != "0.0.0.0"
//            && WxPayConfig::CURL_PROXY_PORT != 0){
//            curl_setopt($ch,CURLOPT_PROXY, WxPayConfig::CURL_PROXY_HOST);
//            curl_setopt($ch,CURLOPT_PROXYPORT, WxPayConfig::CURL_PROXY_PORT);
//        }
        //运行curl，结果以jason形式返回
        $res = curl_exec($ch);
        curl_close($ch);
        //取出openid
        $data = json_decode($res,true);
        $this->data = $data;
        $openid = $data['openid'];
        $this->echoEncrypData(0,'',$data);
        return $openid;
    }

    /**
     *
     * 拼接签名字符串
     * @param array $urlObj
     *
     * @return 返回已经拼接好的字符串
     */
    private function ToUrlParams($urlObj)
    {
        $buff = "";
        foreach ($urlObj as $k => $v)
        {
            if($k != "sign"){
                $buff .= $k . "=" . $v . "&";
            }
        }

        $buff = trim($buff, "&");
        return $buff;
    }
    /**
     *
     * 构造获取open和access_toke的url地址
     * @param string $code，微信跳转带回的code
     *
     * @return 请求的url
     */
    private function __CreateOauthUrlForOpenid($code)
    {
        $urlObj["appid"] =  C('APPID');;
        $urlObj["secret"] =  C('APPSECRET');
        $urlObj["code"] = $code;
        $urlObj["grant_type"] = "authorization_code";
        $bizString = $this->ToUrlParams($urlObj);
        return "https://api.weixin.qq.com/sns/oauth2/access_token?".$bizString;
    }
    /*
     * 获取基础支持的accessToken
     * */
    protected function getAccessToken(){
        $accesstoken =  S('accessToken');
        if(!$accesstoken){
            $url='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.C('APPID').'&secret='.C('APPSECRET');
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,FALSE);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,FALSE);
            curl_setopt($ch, CURLOPT_HEADER, FALSE);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
            //运行curl，结果以jason形式返回
            $res = curl_exec($ch);
            curl_close($ch);
            $data = json_decode($res,true);
            S('accessToken',json_encode($data),$data['expires_in']);
            return $data['access_token'];
        }else{
            return json_decode($accesstoken,true)['access_token'];
        }
    }
    /*
     * 推送消息给微信用户（模板消息）
     * */
    public function sendMessage(){
        $openId = $this->pdata['openId'];
        $accessToken = $this->getAccessToken();
//        $this->echoEncrypData(0,'',$openId);
        $postData = '{
           "touser":"'.$openId.'",
           "template_id":"59Whrb8yTsqLaEY7rXxRdBlPylOUyCf1t37cie9q0Xo",
           "url":"http://weixin.qq.com/",          
           "data":{
                   "first": {
                       "value":"恭喜你购买成功！",
                       "color":"#173177"
                   },
                   "keyword1":{
                       "value":"巧克力",
                       "color":"#173177"
                   },
                   "keyword2": {
                       "value":"39.8元",
                       "color":"#173177"
                   },
                   "keyword3": {
                       "value":"2014年9月22日",
                       "color":"#173177"
                   },
                   "keyword4": {
                       "value":"2014年9月22日",
                       "color":"#173177"
                   },
                   "keyword5": {
                       "value":"2014年9月22日",
                       "color":"#173177"
                   },
                   "remark":{
                       "value":"欢迎再次购买！",
                       "color":"#173177"
                   }
           }
        }';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='.$accessToken);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER,FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,FALSE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        $res = curl_exec($ch);
        curl_close($ch);
        $this->echoEncrypData(0,'',$res);
    }

}