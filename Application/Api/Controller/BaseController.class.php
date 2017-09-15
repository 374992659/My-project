<?php
/**
 * 数据加密解密以及微信用户设置登陆信息
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/1
 * Time: 17:36
 */

namespace Api\Controller;
use Think\Controller;

class BaseController extends Controller
{
    public $nowVersion   = '1.0.0';     //当前版本号，默认1.0.1
    public $account = '' ;                   //用户数据
    public $account_code = 0;              //用户code
    public $pdata;                      //提交数据
    public $debugging = false;         //调试状态
    public $isweixin = false;	//是否为微信
    public $openId = '';		//微信OPENID
    public $wxData= '';       //微信用户信息
    public $appToken = ''; //apptoken是否有true 或者false
    public $phone   =    '';//用户手机号
    public function _initialize(){
        //获取数据
        if ( $_SERVER['REQUEST_METHOD'] == 'GET' )
        {
            $appdata = $_GET;
        }
        else{
            $appdata = $_POST;
        }
        $debugg1 = isset($_GET['debugging'])?$_GET['debugging']:'';
        $debugg2 = isset($_POST['debugging'])?$_POST['debugging']:'';
        $aesLib = new \Common\Lib\AesLib();
        if ( $debugg1 == 'test' || $debugg2 == 'test' ) $this->debugging = true;
        if( $this->debugging == true ){
            $this->pdata = $_POST;
            var_dump( $this->pdata);
            $this->nowVersion = isset($this->pdata['version'])&&$this->pdata['version']?$this->pdata['version']:$this->nowVersion;
            var_dump($this->pdata['apptoken']);die;
            if( isset($this->pdata['apptoken']) && $this->pdata['apptoken'] ){
                $this->appToken =  true;
                $aestoken = json_decode($aesLib->aes128cbcHexDecrypt($this->pdata['apptoken'], C('APP_KEY.TOKEN_AES_IV'), C('APP_KEY.TOKEN_AES_KEY')), true);
                $this->account_code  = isset($aestoken['account_code'])&&$aestoken['account_code']?$aestoken['account_code']:0;
            }
        }else{
            // 解密数据 验签
            if( isset($appdata['data']) && !empty($appdata['data']) ){
                //Aes解密
                $data = $aesLib->aes128cbcHexDecrypt($appdata['data'], C('APP_KEY.AES_IV'), C('APP_KEY.AES_KEY'));
                if( !$data ){
                    return $this->echoEncrypData(1, '解密出错');
                }
                $data = json_decode($data, true);
                if( !isset($_GET['is_wap']) || $_GET['is_wap'] != 1 ){
                    //验证签名
                    $rsaLib = new \Common\Lib\RsaLib();
                    if( !$rsaLib->checkSign($data[1], $data[0], C('APP_KEY.SIGN_PUBLIC_KEY')) ){
                        return $this->echoEncrypData(1, '签名错误');
                    }
                }
                $this->pdata = json_decode(trim($data[1], '"'), true);
                $this->nowVersion = isset($this->pdata['version'])&&$this->pdata['version']?$this->pdata['version']:$this->nowVersion;
                if( isset($this->pdata['apptoken']) && $this->pdata['apptoken'] ){
                    $this->appToken =  $this->pdata['apptoken'];
                    $aestoken = json_decode($aesLib->aes128cbcHexDecrypt($this->pdata['apptoken'], C('APP_KEY.TOKEN_AES_IV'), C('APP_KEY.TOKEN_AES_KEY')), true);
                    $this->account_code  = isset($aestoken['account_code'])&&$aestoken['account_code']?$aestoken['account_code']:0;
                }
            }else{
                return $this->echoEncrypData(1, '未获取到验证数据');
            }
        }
        $phone= substr($this->account_code,4) ? substr($this->account_code,4):'';
        if($this->setUserData($phone) !== true){ //没有session数据
            $this->isweixin =is_weixin();
            if( $this->isweixin ){//微信打开
                $this->setWeixinData();
            }
        }
    }
    /*
        * 设置用户数据
        * */
    public function setUserData($phone){
        $this->account =session('account'.$phone);
        $this->account_code = $this->account['account_code'];
        $this->openId = $this->account['openId'];
        $this->phone =$this->account['phone'];
        if( $this->phone ){
            return true;
        }
        return false;
    }

    //获取微信数据
    public function setWeixinData()
    {
        //初始化微信SDK
        $weObj = new \Common\Lib\WechatSDKLib(array(
            'appid'		=> C('APPID'),
            'appsecret'	=> C('APPSECRET'),
            'token' 	=> C('WEIXIN_API_TOKEN'), //填写你设定的key
            'encodingaeskey' => C("ENCODINGAESKEY"), //填写加密用的EncodingAESKey，如接口为明文模式可忽略
//            'agentid'=>'1', //应用的id
//            'debug'=>true, //调试开关
//            '_logcallback'=>'logg', //调试输出方法，需要有一个string类型的参数
        ));


        //未登录，有可能没有openid
        if( !$this->openId ){
            if( IS_AJAX ){
                return E('openid已过期，需先刷新获取openid');
            }

            //如果参数没有code，就跳转到微信获取认证
            if( !isset($_GET['code']) ){
                $url = $weObj->getOauthRedirect( get_active_url(), rand(1000,9999), 'snsapi_userinfo');
                redirect($url);
                exit;
            }

            //获取认证数据
            $data = $weObj->getOauthAccessToken();
            if( !$data ){
                return E('获取微信数据失败');
            }
            $this->openId = $data['openid']; //获取openId
            $MemberModel = new \Api\Model\UserAreaModel();
            $customer = M('user_area')->where(array('openId'=>$data['openid']))->getField('phone');
            if( $customer ){ //是否绑定手机
                //设置Session,openid登录
                $res = $MemberModel->wxloginSetSession($this->openId);
                if(!$res){
                    $this->echoEncrypData(3);
                }
                $res['account_code'] = $res['table_id'].$res['phone'];
                $this->appToken = true;
                $this->phone =$res['phone'];
                session('account'.$res['phone'],$res);
            }
            else{
                //获取微信数据
                $wxdata = $weObj->getOauthUserinfo($data['access_token'], $data['openid']);
                if( empty($wxdata) || !$wxdata['nickname'] ){
                    return E('获取微信数据失败');
                }
                session('wxdata'.$data['openid'], json_encode($wxdata));
                $this->echoEncrypData(114);
            }
            $this->wxData = $data;
        }
    }

    /*
     * 公用加密返回数据方法
     * */
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
            $str = $aesLib->aes128cbcEncrypt(json_encode(array($sign, json_encode($arr))), C('APP_KEY.AES_IV'), C('APP_KEY.AES_KEY'));
            echo json_encode(array('data'=>$str));
            exit;
        }
    }
    /**
     * 获取错误信息
     * @param $code
     */
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

            500 => '您无法执行该操作',

            600=>'功能模块参数错误',


        );
        return $code == '-999'? $error : (isset($error[$code])?$error[$code]: null);
    }




}