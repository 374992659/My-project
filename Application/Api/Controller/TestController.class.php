<?php
namespace Api\Controller;
use Think\Controller;

class TestController extends Controller
{
    public function index()
    {
        //初始化微信SDK
        $weObj = new \Common\Lib\WechatSDKLib(array(
            'appid'		=> C('APPID'),
            'appsecret'	=> C('APPSECRET'),
            'token' 	=> C('WEIXIN_API_TOKEN'), //填写你设定的key
            'encodingaeskey' => C("ENCODINGAESKEY"), //填写加密用的EncodingAESKey，如接口为明文模式可忽略
        ));


        //未登录，有可能没有openid
        if( !$this->openId ){
//            if( IS_AJAX ){
//                return E('openid已过期，需先刷新获取openid');
//            }
            // 如果参数没有code，就跳转到微信获取认证
            if( !isset($_GET['code'])){
//                var_dump(get_active_url());die;
                $url = $weObj->getOauthRedirect( get_active_url(), rand(1000,9999), 'snsapi_userinfo');
                redirect($url);
                exit;
            }

            // 获取认证数据
            $wxuserdata = $weObj->getOauthAccessToken();
            if( !$wxuserdata ){
                return E('获取微信数据失败');
            }
            $this->openId = $wxuserdata['openid']; //获取openId
            $MemberModel = new \Api\Model\UserAreaModel();
            $customer = M('user_area')->where(array('openId'=>$wxuserdata['openid']))->count();
            if( $customer ){ //是否绑定手机
                //设置Session,openid 登录
                $res = $MemberModel->wxloginSetSession($this->openId);
                if(!$res){
                    $this->echoEncrypData(3);
                }
                $res['account_code'] = $res['table_id'].$res['phone'];
                $this->appToken = true;
                $this->phone =$res['phone'];
                session('account'.$res['phone'],$res);
            }else{
                //获取微信数据
                $wxdata = $weObj->getOauthUserinfo($wxuserdata['access_token'], $wxuserdata['openid']);
                if( empty($wxdata) || !$wxdata['nickname'] ){
                    return E('获取微信数据失败');
                }
                session('wxdata'.$wxuserdata['openid'], json_encode($wxdata));
            }
            $this->wxData = $wxuserdata;
        }
        $this->echoEncrypData(3);
        $this->display();
    }

    public function echoEncrypData($errcode=0, $errmsg=null, $data=null, $tokenParams=null)
    {
        header('Content-type: application/json');
        $aesLib = new \Common\Lib\AesLib();
        $aesToken = '';
        if( $this->appToken ){
            $aesArr = $tokenParams?array_merge(array('account_code'=>$this->account_code),$tokenParams):array('account_code'=>$this->account_code);
            $aesArrJson = json_encode($aesArr);
            $aesToken = $aesLib->aes128cbcEncrypt($aesArrJson, C('APP_KEY.TOKEN_AES_IV'), C('APP_KEY.TOKEN_AES_KEY'));
        }

        $arr = array(
            'errcode'   => $errcode,
            'errmsg'    => $errmsg ? $errmsg : $this->getErrorMsg($errcode),
            'data'      => $data?$data:null,
            'apptoken'  => $aesToken,
        );
        if( $this->debugging ){
            //调试
            echo json_encode($arr);
            exit;
        }else{
            //签名
            $rsaLib = new \Common\Lib\RsaLib();
            $sign = $rsaLib->getSign($arr, C('APP_KEY.SIGN_PRIVATE_KEY'));
            if(isset($_GET['is_wap']) && intval($_GET['is_wap']) ==1)$sign='';
            $str = $aesLib->aes128cbcEncrypt(json_encode(array($sign, json_encode($arr))), C('APP_KEY.AES_IV'), C('APP_KEY.AES_KEY'));
            echo json_encode(array('data'=>$str));
            exit;
        }
    }
}