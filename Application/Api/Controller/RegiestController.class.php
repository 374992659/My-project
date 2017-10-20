<?php
/**
 * 用户登录注册类
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/15
 * Time: 9:23
 */

namespace Api\Controller;
use Api\Model;
use Common\Lib\WxPayApi;
class RegiestController extends BaseController
{
    /*
     * 获取图片验证码
     * */
    public function getPicCode(){
        $config =array(
                'fontSize'    =>   50,
                'length'      =>    4,
            );
        $Verify=new \Think\Verify($config);
        $Verify->useNoise = false;
        $Verify->entry();
    }
    /**
     * 验证码检查
     */
    function check_verify($code, $id = ""){
        $verify = new \Think\Verify();
        return $verify->check($code, $id);
    }
    /**
     *
     * 发送微信验证验证码
     * @param phone 手机号码
     */
    public function sendWxRegistMsg()
    {
        $phone = $this->pdata['phone'];
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$phone)){
            $this->echoEncrypData(106);
        }

        $SMS=new \Api\Controller\SendSmsController();
        $res = $SMS->SendMassage($phone,'wxregiest_', '美e家园', 'SMS_94280318', $code);
        if($code !== 0){
            $this->echoEncrypData($code);
        }else{
            $this->echoEncrypData(0,"短信验证码发送成功,有效时间为".C('SMS_validity')."分钟。");
        }
    }

    /*
     * 微信版- 用户绑定手机号
    * @param phone 手机号
    * @param area_id 区域id
     * @param  smscode 短信验证码
     * @param openId  微信openId
     * */
    public function wxBindPhone(){
        $phone = $this->pdata['phone'];
        $table_id = $this->pdata['area_id'];
        $smscode = $this->pdata['smscode'];
        $openId = $this->pdata['openId'];
        if(!$phone || !$table_id || !$smscode || !$openId)$this->echoEncrypData(21);
        //获取缓存验证码
        $key_yzm_val = 'wxregiest_'.$phone;
        $yzm_Mem = unserialize(S($key_yzm_val));
        $cache_code = $yzm_Mem['hash'];
        if( !$cache_code ){
            return $this->echoEncrypData(116);
        }

        if( $cache_code != $smscode ){
            $this->echoEncrypData(1,'验证码不正确');
        }

        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$phone)){
            $this->echoEncrypData(106);
        }
        $wx =session('wxdata'.$openId);
        $wx=json_decode(trim($wx,'"'),true);

        $model=new Model\UserAreaModel();
        $res=$model->addUserArea($openId,$phone,$table_id,$errmsg);
        if(!$res){
            $this->echoEncrypData(1,$errmsg);
        }else{
            $this->autoBuildDatabase($phone);
            //在其user_info表中添加数据
            $data = array(
                'phone' =>$phone,
                'nickname' =>$wx['nickname'],
                'account_code' =>$table_id.$phone,
                'portrait' =>$wx['headimgurl'],
                'create_time' =>time(),
                'create_addr_code' =>$table_id,
                'sex' =>$wx['sex'],
            );
            $res = M('baseinfo.user_info_'.$table_id)->add($data);
            if(!$res){
                $model->delUserArea($openId);
            }
            session_unset('wxdata'.$openId);
            $this->appToken=true;
            $this->account_code=$table_id.$phone;
            $this->echoEncrypData(0,'');
        }
    }

    /*
     * 获取全国区域数组
     * */
    public function getAreaArr(){
        $model=new Model\UserAreaModel();
        $res=$model->getArea();
        $this->echoEncrypData(0,'',$res);
    }

    /**
     *
     * 发送注册验证码
     * @param phone 手机号码
     */
    public function sendRegistMsg()
    {
        $phone = $this->pdata['phone'];
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$phone)){
            $this->echoEncrypData(106);
        }

        if ($this->account_code > 0) {
            $this->echoEncrypData(112, '已登录，无需重复注册');
        }

        $customer = M('user_area')->where(array('phone' => $phone))->getField('id');
        if ($customer > 0) {
            $this->echoEncrypData(118, '已注册无需重复注册');
        }
        $SMS=new \Api\Controller\SendSmsController();
        $res = $SMS->SendMassage($phone,'regiest_', '美e家园', 'SMS_94280318', $code);
        if($code !== 0){
            $this->echoEncrypData($code);
        }else{
            $this->echoEncrypData(0,"短信验证码发送成功,有效时间为".C('SMS_validity')."分钟。");
        }
    }

    /*
     * 用户注册
     * @param account 账号
     * @param area_id 区域
     * @param password 密码
     * @param repassword 确认密码
     * @param piccode图片验证码
     * */
    public function regiest(){
        $account   = trim($this->pdata['account']);
        $area_id = trim($this->pdata['area_id']);
        $password  = trim($this->pdata['password']);
        $repassword   = trim($this->pdata['repassword']);
        $piccode = trim($this->pdata['piccode']);
        if(!$account || !$password || !$repassword || !$area_id ||!$piccode){
            $this->echoEncrypData(1,'注册信息不完整');
        }
//        if(!$this->check_verify($piccode))$this->echoEncrypData(1,'验证码不正确');
        if( !preg_match('/^[a-z\d]{6,12}$/i',trim($account))){ //账号格式 字母开头6-12位
            $this->echoEncrypData(106);
        }
        $account_count = M('user_area')->where(['account'=>$account])->count();
        if( $account_count ){
            $this->echoEncrypData(1,'该账号已被注册');
        }
        if(md5($password) !== md5($repassword))$this->echoEncrypData(1,'请确认两次密码输入一致');
        $data1 = array(
            'account' =>$account,
            'table_id' => $area_id
        );
        $res1=M()->table('baseinfo.user_area')->add($data1);
        $data2= array(
            'account' =>$account,
            'password' => md5(md5($password).$account),
            'nickname' => $account,
            'portrait'=>'http://39.108.237.198/project/Application/Common/Source/Img/default_portrait.jpg',
            'account_code' => $area_id.$account,
            'create_time' => time(),
            'create_addr_code' => $area_id
        );
        $this->autoBuildDatabase($account);
        $res2=M()->table("baseinfo.user_info_".$area_id)->add($data2);
        if($res1 and $res2){
            $this->appToken=true;
            $this->account_code = $area_id.$account;
            $this->echoEncrypData(0,'注册成功');
        }else{
            $this->echoEncrypData(1,'注册失败');
        }
    }

    /*
     * 發送忘記密碼短信認證
     *@param phone 手機號
     * */
    public function sendForgetPwd(){
        $phone=$this->pdata['phone'];
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$phone)){
            $this->echoEncrypData(106);
        }
        $count = M('user_area')->where(['phone'=>$phone])->getField('status');
        if(!$count){
            $this->echoEncrypData(1,'该手机号还未绑定账号!');
        }
        if( intval($count['status']) !== 1 ){
            $this->echoEncrypData(1,'该账号存在异常，暂无法执行该操作');
        }

        $SMS=new \Api\Controller\SendSmsController();
        $SMS->SendMassage($phone,'forgetPwd_', '美e家园', 'SMS_94280318', $code);
        if($code !== 0){
            $this->echoEncrypData($code);
        }else{
            $this->echoEncrypData(0,"短信验证码发送成功,有效时间为".C('SMS_validity')."分钟。");
        }
    }

    /*
     * 忘记密码
     * @param phone 手机号
     * @param smscode 短信验证码
     * @param newpwd 新密码
     * @param renewpwd  确认新密码
     * */
    public function forgetPassword(){
        $phone = $this->pdata['phone'];
        $smscode = $this->pdata['smscode'];
        $newpwd = $this->pdata['newpwd'];
        $renewpwd = $this->pdata['renewpwd'];
        if(!$phone || !$smscode || !$newpwd || !$renewpwd)$this->echoEncrypData(21);
        //获取缓存验证码
        if($newpwd !== $renewpwd)$this->echoEncrypData(1,'两次密码输入不一致');
        $key_yzm_val = 'forgetPwd_'.$phone;
        $yzm_Mem = unserialize(S($key_yzm_val));
        $cache_code = $yzm_Mem['hash'];
        if( !$cache_code ){
            return $this->echoEncrypData(116);
        }
        if( $cache_code != $smscode ){
            $this->echoEncrypData(1,'验证码不正确');
        }
        $table_id=M('user_area')->field('table_id,account')->where(['phone'=>$phone])->find();
        if($table_id){
            $res = M('user_info_'.$table_id['table_id'])->where(['phone'=>$phone])->save(['password'=>md5(md5($newpwd).$table_id['account'])]);
            if(!$res)$this->echoEncrypData(1);
            $this->echoEncrypData(0);
        }
        $this->echoEncrypData(1);
    }


    /*
     * 用户账号登陆
     *@param  account    账号
     * @param password  密码
     * */
    public function accountLogin(){
        $account=$this->pdata['account'];
        $password =$this->pdata['password'];
        if(!$account || !$password){
            $this->echoEncrypData(1,'登陆参数不完整');
        }
        if( !preg_match('/^[a-z\d]{6,12}$/i',trim($account))){
            $this->echoEncrypData(106);
        }
        $table_id = M('user_area')->field('table_id,account,status')->where(['account'=>$account])->find();
        if(!$table_id){
            $this->echoEncrypData(1,'该用户不存在，请前往注册!');
        }
        if( intval($table_id['status']) !== 1 ){
            $this->echoEncrypData(1,'该账号存在异常，暂无法登陆');
        }
        $res = M('user_info_'.$table_id['table_id'])->where(['account'=>$account,'password'=>md5(md5($password).$account)])->count();
        if(!$res){
            $this->echoEncrypData(1,'账号或密码错误');
        }else{
            $account['table_id'] =$table_id['table_id'];
            $this->account_code = $table_id['table_id'].$table_id['account'];
            $this->appToken=true;   //返回apptoken
            session('account'.$this->account_code,$account);
            $this->echoEncrypData(0);
        }
    }

    /*
     * 发送手机登录验证码
     * @param phone 手机号
     * */
    public function sendPhoneLogin(){
        $phone=$this->pdata['phone'];
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$phone)){
            $this->echoEncrypData(106);
        }
        $count = M('user_area')->where(['phone'=>$phone])->getField('status');
        if(!$count){
            $this->echoEncrypData(1,'该用户不存在，请前往注册!');
        }
        if( intval($count['status']) !== 1 ){
            $this->echoEncrypData(1,'该账号存在异常，暂无法登陆');
        }
        if ($this->account_code > 0) {
            $this->echoEncrypData(112, '已登录，无需重复登录');
        }
        $SMS=new \Api\Controller\SendSmsController();
        $SMS->SendMassage($phone,'login_', '美e家园', 'SMS_94280318', $code);
        if($code !== 0){
            $this->echoEncrypData($code);
        }else{
            $this->echoEncrypData(0,"短信验证码发送成功,有效时间为".C('SMS_validity')."分钟。");
        }
    }


    /*
   * 用户手机号登陆
   *@param  phone    手机号
   * @param smscode 验证码
   * */
    public function phoneLogin(){
        $phone = $this->pdata['phone'];
        $smscode =$this->pdata['smscode'];
        if(!$phone || !$smscode){
            $this->echoEncrypData(21);
        }
        //获取缓存验证码
        $key_yzm_val = 'login_'.$phone;
        $yzm_Mem = unserialize(S($key_yzm_val));
        $cache_code = $yzm_Mem['hash'];
        if( !$cache_code ){
            return $this->echoEncrypData(116);
        }
        if( $cache_code != $smscode ){
            $this->echoEncrypData(1,'验证码不正确');
        }
        $table_id=M('user_area')->field('table_id,account')->where(['phone'=>$phone])->find();
        $account['table_id'] =$table_id['table_id'];
        $this->account_code = $table_id['table_id'].$table_id['account'];
        $this->appToken=true;   //返回apptoken
        session('account'.$this->account_code,$account);
        $this->echoEncrypData(0);
    }
    protected function checkLogin($account_code){
        $account=session('account'.$account_code);
        if(!$account){
            return false;
        }
        return true;
    }

    /*
    * 自动创建数据库
    * */
    protected function autoBuildDatabase($account){
        $model=new Model\UserAreaModel();
        $data=$model->getUserInfoByPhone($account);
        $this->executeSql('databases.sql',$data);
        $m =new \MongoClient();
        $baseinfo=$m->baseinfo;
        $baseinfo->online_user->insert(array('account_code'=>$data['account_code'],'status'=>0,'offline_time'=>0)); //用户表中加入数据
        $user_info = 'user_info_'.$data['account_code'];
        $db = $m->$user_info;
        $group_chat=$db->group_chat;//群聊记录
        $group_chat->createIndex(array('sender_code'=>1));
        $group_chat->createIndex(array('type'=>1));
        $group_chat->createIndex(array('send_time'=>1));
        $group_chat->createIndex(array('group'=>1));
        $group_new_message = $db->group_new_message;//群新消息
        $group_new_message->createIndex(array('sender_code'=>1));
        $group_new_message->createIndex(array('type'=>1));
        $group_new_message->createIndex(array('send_time'=>1));
        $group_new_message->createIndex(array('group'=>1));
        $friends_chat=$db->friends_chat;// 好友聊天记录
        $friends_chat->createIndex(array('sender_code'=>1,'type'=>1,'send_time'=>1));
        $friends_chat->createIndex(array('type'=>1));
        $friends_chat->createIndex(array('send_time'=>1));
        $counters=$db->counters;// 自增id表
        $counters->save(array('name'=>'group_chat','id'=>0));
        $counters->save(array('name'=>'friends_chat','id'=>0));
        $counters->save(array('name'=>'group_new_message','id'=>0));
    }
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
     * 获取微信openId
     * @param url 回调地址
     * */
    public function getOpenid()
    {
        $url = $this->pdata['url'];
        //通过code获得openid
        if (!isset($_GET['code'])){
            //触发微信返回code码
//            $baseUrl = urlencode('http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'].$_SERVER['QUERY_STRING']);
            $baseUrl = urlencode($url);
//            $this->echoEncrypData(0,'',$url);
            $url = $this->__CreateOauthUrlForCode($baseUrl);
            Header("Location: $url");
            exit();
        } else {
            //获取code码，以获取openid
            $code = $_GET['code'];
            $openid = $this->getOpenidFromMp($code);
            return $openid;
        }
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
    public function GetOpenidFromMp($code)
    {
        $url = $this->__CreateOauthUrlForOpenid($code);
        //初始化curl
        $ch = curl_init();
        //设置超时
        curl_setopt($ch, CURLOPT_TIMEOUT, $this->curl_timeout);
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
}