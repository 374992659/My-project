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
    public function getErrorMsg($code)
    {
        $error = array(
            0 => '操作成功',
            1 => '操作失败',
            2 => '参数提交错误',
            21=>'参数提交不完整',
            3 => '服务器出错',
            4 => 'token error',
            5 => '暂无数据',

            100 => '未登录',
            101 => '本机登陆失效，你已在其他设备上登陆。',
            102 => '请重新登录。',
            103 => '已退出登录。',
            104 => '请输入用户名/密码。',
            105 => '请输入验证码。',
            106 => '手机号码格式不正确',
            107 => '已登录，无需重复登录。',
            108 => '验证码发送次数已超过最大次数。',
            109 => '验证码重复获取要间隔'.C('captcha_interval_second').'秒。',
            110 => '短信验证码发送失败,请稍后再操作。',
            111 => '短信验证码发送成功,有效时间为'.C('SMS_validity').'分钟。',
            112 => '已登录，无需重复注册。',
            113 => '手机验证码错误。',
            114 => '需要验证您的手机号码',
            115 => '账户已锁，无权限登录！',
            116 => '验证码超时',
            117 => '注册失败！',
            118 => '已注册无需重复注册',

            200 => '有可以升级的版本。',
            201 => '未获取到版本信息',
            202 => '当前已是最新版本',

            300 => '不存在该分组',
            301 =>'未搜索到好友信息',
            302 =>'该用户不存在',
            303 => '无需添加自己为好友',
            304 => '该用户已经是你的好友啦',
            305 => '创建群已超过5个,暂时无法创建更多',
            306 => '没有图片被选中',
            307 => '你不是群创建人或管理员无法执行此操作',
            308 => '选项不存在',

            500 => '您无法执行该操作',

            600=>'功能模块参数错误',


        );
        return $code == '-999'? $error : (isset($error[$code])?$error[$code]: null);
    }
}