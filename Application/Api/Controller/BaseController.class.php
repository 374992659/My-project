<?php
/**
 * 数据加密解密
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
    public $table_id = 0;              //用户信息分表id
    public $pdata;                      //提交数据
    public $debugging = false;         //调试状态
    public $appToken = ''; //apptoken是否有true 或者false

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
            $this->nowVersion = isset($this->pdata['version'])&&$this->pdata['version']?$this->pdata['version']:$this->nowVersion;
            if( isset($this->pdata['apptoken']) && $this->pdata['apptoken'] ){
                $this->appToken =  true;
                $aestoken = json_decode($aesLib->aes128cbcHexDecrypt($this->pdata['apptoken'], C('APP_KEY.TOKEN_AES_IV'), C('APP_KEY.TOKEN_AES_KEY')), true);
                $this->account_code  = isset($aestoken['account_code'])&&$aestoken['account_code']?$aestoken['account_code']:0;
            }
//            $this->echoEncrypData(1,'',$this->pdata);
        }else{
            // 解密数据 验签
            if( isset($appdata['data']) && !empty($appdata['data']) ){
                //Aes解密
                $data = $aesLib->aes128cbcHexDecrypt($appdata['data'], C('APP_KEY.AES_IV'), C('APP_KEY.AES_KEY'));
                if( !$data ){
                    return $this->echoEncrypData(114, '');
                }
                $data = json_decode($data, true);
                if( !isset($_GET['is_wap']) || intval($_GET['is_wap'] )!= 1 ){
                    //验证签名
                    $rsaLib = new \Common\Lib\RsaLib();
                    if( !$rsaLib->checkSign($data[1], $data[0], C('APP_KEY.SIGN_PUBLIC_KEY')) ){
                        return $this->echoEncrypData(1, '签名错误');
                    }
                }
                $this->pdata =  json_decode(trim($data[1],'"'), true);
                $this->nowVersion = isset($this->pdata['version'])&&$this->pdata['version']?$this->pdata['version']:$this->nowVersion;
                if( isset($this->pdata['apptoken']) && $this->pdata['apptoken'] ){
                    $this->appToken =  true;
                    $aestoken = json_decode($aesLib->aes128cbcHexDecrypt($this->pdata['apptoken'], C('APP_KEY.TOKEN_AES_IV'), C('APP_KEY.TOKEN_AES_KEY')), true);
                    $this->account_code  = isset($aestoken['account_code'])&&$aestoken['account_code']?$aestoken['account_code']:0;
                }
            }
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
            if(isset($_GET['is_wap']) && intval($_GET['is_wap']) ==1)$sign='';
            $str = $aesLib->aes128cbcEncrypt(json_encode(array($sign, json_encode($arr))), C('APP_KEY.AES_IV'), C('APP_KEY.AES_KEY'));
            echo json_encode(array('data'=>$str));
            exit;
        }
    }
    /*
     * 获取错误信息
     * @param $code
     **/
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
            106 => '数据格式不正确',
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
            309=> '该分组下暂无好友',

            500 => '您无法执行该操作',

            600=>'功能模块参数错误',


        );
        return $code == '-999'? $error : (isset($error[$code])?$error[$code]: null);
    }
    /*
     * 检测参数是否为空
     * @param Array param 需要检测的参数
     * */
    public function checkParam($param){
        if($param){
            foreach($param as $k=>$v){
                if(!$this->pdata[$v]){
                    $this->echoEncrypData(21);
                }
            }
            return true;
        }
        $this->echoEncrypData(21);
    }
    /*
     * 创建数据库
     * */
    public function executeSql($fileName,$data){
        $sql=file_get_contents(C('SQL_PATH').$fileName);
        $sql=str_replace('$city_id',$data['city_id'],$sql);
        $sql=str_replace('$province_id',$data['province_id'],$sql);
        $sql=str_replace('$account_code',$data['account_code'],$sql);
        $sql=str_replace('$subject_id',$data['subject_id'],$sql);
        $model=M();
        $model->startTrans();
        $res=$model->execute($sql);
        if($res !== false){
            $model->commit();
        }else{
            $model->rollback();
            $this->echoEncrypData(3);
        }
    }
    /*
     * APP图片/文件上传
     * */
    public function uploadAppImg($path,$fileData){
        if ( !is_dir($path) ) {
            @mkdir($path, 0777, true);
            @chmod($path, 0777);
        }
        $file_arr = explode('@',$fileData);
        $imageUrl=array();
        foreach($file_arr as $k=>$v){
            $fileData = base64_decode($v);
            $ext = '.png';
            if($this->pdata['type']==='voice'){
                $ext = $this->pdata['ext'];
            }
            $filename = uniqid().$ext;
            $FilePath = $path.$filename;
            $query = file_put_contents($FilePath, $fileData);
            if ( $query > 0 ) {
                $imageUrl[$k]= $FilePath;
            }else{
                $imageUrl[$k]=false;
            }
        }
        $res  = false;
        foreach($imageUrl as $item){
            $res  = ($res or $item);
        }
        if($res){
            return $imageUrl;
        }else{
            return false;
        }
    }
}