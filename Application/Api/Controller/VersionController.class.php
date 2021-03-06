<?php
/**
 * 接口入口地址、App版本检测、接口分配、登录状态判断
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/5
 * Time: 15:54
 */

namespace Api\Controller;


class VersionController extends BaseController
{
    public function _initialize(){
        parent::_initialize();
    }

    /**
     * 唯一入口方法访问
     */
    public function apiPort()
    {
        //获取用户数据
        $account_code= $this->account_code;
        if(!$account_code )$this->echoEncrypData(100);
        if(!$this->setUserData($account_code)){    //从session中获取数据
            $account_num=substr($account_code,6);
//            $data=M('user_area')->field('table_id,account')->where(['account'=>$account_num])->find();
            $mongo = new \MongoClient();
            $data = $mongo->baseinfo->user_area->findOne(array('account'=>$account_num),array('table_id','account'));
            $account['table_id'] =$data['table_id'];
            session('account'.$account_code,$account);
            $this->setUserData($account_code);
        }
        $service = I('get.service/s');
        if( !$service ){
            return;
        }
        $loc = strpos($service, '_');
        if( !$loc ){
            return;
        }

        $class = substr($service, 0, $loc);  //类名
        $funname = substr($service, $loc+1);  //方法名

        //版本更新与注册设备
        if( $funname == 'checkVersion' ){
            A(ucwords($class))->$funname();
            return;
        }
        $version = str_replace(".","_",$this->nowVersion);

        //版本判断-接口分配
        if( $this->nowVersion == '1.0.1' || $this->nowVersion == '1.0.0' ){
            $version = '1_0_0';
        }
        $this->commonRedirect($class, $funname, $version);
    }

    /*
      * 通过设置用户数据
      * */
    public function setUserData($account_code){
        if(!$account_code)return false;
        $this->account =session('account'.$account_code);
        $this->table_id =$this->account['table_id'];
        if( $this->table_id ){
            return true;
        }
        return false;
    }

    /**
     * 处理方法调用地址
     * @param $class   类名
     * @param $funname  方法名
     * @param $version  版本处理后字符
     */
    protected function commonRedirect($class, $funname, $version)
    {
        $funname = $funname.'_v'.$version;
        A(ucwords($class))->$funname();
    }

//    //获取微信数据
//    public function setWeixinData()
//    {
//        //初始化微信SDK
//        $weObj = new \Common\Lib\WechatSDKLib(array(
//            'appid'		=> C('APPID'),
//            'appsecret'	=> C('APPSECRET'),
//            'token' 	=> C('WEIXIN_API_TOKEN'), //填写你设定的key
//            'encodingaeskey' => C("ENCODINGAESKEY"), //填写加密用的EncodingAESKey，如接口为明文模式可忽略
//        ));
//
//
//        //未登录，有可能没有openid
//        if( !$this->openId ){
////            if( IS_AJAX ){
////                return E('openid已过期，需先刷新获取openid');
////            }
//            // 如果参数没有code，就跳转到微信获取认证
//            if( !isset($_GET['code'])){
//                $url = $weObj->getOauthRedirect( get_active_url(), rand(1000,9999), 'snsapi_userinfo');
//                session('url',$this->pdata['url']);
//                $this->echoEncrypData(114,'',$url);
//                exit;
//            }
//
//            // 获取认证数据
//            $wxuserdata = $weObj->getOauthAccessToken();
//            if( !$wxuserdata ){
//                return E('获取微信数据失败');
//            }
//            $this->openId = $wxuserdata['openid']; //获取openId
//            $MemberModel = new \Api\Model\UserAreaModel();
//            $customer = M('user_area')->where(array('openId'=>$wxuserdata['openid']))->count();
//            if( $customer ){ //是否绑定手机
//                //设置Session,openid 登录
//                $res = $MemberModel->wxloginSetSession($this->openId);
//                if(!$res){
//                    $this->echoEncrypData(3);
//                }
//                $res['account_code'] = $res['table_id'].$res['phone'];
//                $this->appToken = true;
//                $this->phone =$res['phone'];
//                session('account'.$res['phone'],$res);
//            }else{
//                //获取微信数据
//                $wxdata = $weObj->getOauthUserinfo($wxuserdata['access_token'], $wxuserdata['openid']);
//                if( empty($wxdata) || !$wxdata['nickname'] ){
//                    return E('获取微信数据失败');
//                }
//                session('wxdata'.$wxuserdata['openid'], json_encode($wxdata));
//                $url=session('url');
//                session('url',null);
//                redirect($url.'?openId='.$wxdata['openid']);
//            }
//            $this->wxData = $wxuserdata;
//        }
//    }
//    public function https_request($url,$data = null){
//        $curl = curl_init();
//        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
//        curl_setopt($curl, CURLOPT_TIMEOUT, 500);
//        // 为保证第三方服务器与微信服务器之间数据传输的安全性，所有微信接口采用https方式调用，必须使用下面2行代码打开ssl安全校验。
//        // 如果在部署过程中代码在此处验证失败，请到 http://curl.haxx.se/ca/cacert.pem 下载新的证书判别文件。
//        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true);
//        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, true);
//        curl_setopt($curl, CURLOPT_URL, $url);
//
//        $res = curl_exec($curl);
//        curl_close($curl);
//
//        return $res;
//    }
//
//    public function checkLogin(){
//        $phone = $this->phone;
//        if(!$phone){
//            $this->echoEncrypData(100);
//        }
//    }


//    public function getUserinfo(){
//        $account_code = $this->account_code;
//        if(!$account_code){//用户丢失account_code，通过openid获取phone以及所在区域
//            $data=M('user_area')->field('phone','table_id')->where(array('phone'=>$this->phone))->find();
//            if(!$data){          //用户还未进行手机号绑定
//                $this->echoEncrypData(114,'');
//            }else{
//                $this->account_code = $data['table_id'].$data['phone'];
//                $data['account_code'] = $this->account_code;
//                $this->account = $data;
//                session('account'.$data['phone'],$this->account);
//            }
//        }else{
//            $table_id = substr($account_code,0,4);
//            $phone = substr($account_code,4);
//            $this->account=array('phone'=>$phone,'table_id'=>$table_id,'openId'=>$this->openId,'account_code'=>$account_code);
//            $this->account_code=$this->account['account_code'];
//            session('account'.$phone,$this->account);
//        }
//    }
}