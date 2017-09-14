<?php
/**
 * 用户登陆、注册、退出登录、修改密码
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/5
 * Time: 15:21
 */

namespace Api\Controller;
use Api\Model;
include_once './ThinkPHP/Library/Vendor/Sms.php';
class UserController extends VersionController
{
    /*
      * 微信版-用户绑定手机号
     * @param phone 手机号
     * @param area_id 区域id
      * */
    protected function wxBindPhone_v1_0_0(){
        $phone = $this->pdata['phone'];
        $openId = $this->openId;
//        if( !form_validate('phone',trim($phone))){
//            $this->echoEncrypData(106);
//        }
        echo $this->openId;die;
        $table_id = $this->pdata['area_id'];
        if(!$phone || !$openId || !$table_id){
            $this->echoEncrypData(21);
        }
        $model=new Model\UserAreaModel();
        $res=$model->addUserArea($openId,$phone,$table_id,$this->errmsg);
        if(!$res){
            $this->echoEncrypData(1,$this->errmsg);
        }else{
            $this->autoBuildDatabase($phone);
            $this->echoEncrypData(0);
        }
    }

    /*
     * 获取全国区域数组
     * */
    protected function getAreaArr_v1_0_0(){
        $model=new Model\UserAreaModel();
        $res=$model->getArea();
        $this->echoEncrypData(0,'',$res);
    }

    /**
     *
     * 发送注册验证码
     * @param phone 手机号码
     */
    protected function sendRegistMsg_v1_0_0()
    {
        $phone = $this->pdata['phone'];
        if (!form_validate('phone', trim($phone))) {
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
     * APP-用户注册
     * @param phone 手机号码
     * @param area_id 区域编号
     * @param password 密码
     * @param smscode 短信验证码
     * */
    protected function regiest_v1_0_0(){
        $phone   = trim($this->pdata['phone']);
        $area_id = trim($this->pdata['area_id']);
        $password  = trim($this->pdata['password']);
        $smscode   = trim($this->pdata['smscode']);
        if(!$phone || !$password || !$smscode || !$area_id){
            $this->echoEncrypData(1,'注册信息不完整');
        }
        if( !form_validate('phone',trim($phone))){
            $this->echoEncrypData(106);
        }
        $account = M('user_area')->where(['phone'=>$phone])->count();
        if( $account ){
            $this->echoEncrypData(1,'该手机号用户已注册');
        }
        //获取缓存验证码
        $key_yzm_val = 'regiest_'.$phone;
        $yzm_Mem = unserialize(S($key_yzm_val));
        $cache_code = $yzm_Mem['hash'];
//        $cache_code = 5465;//测试

        if( !$cache_code ){
            return $this->echoEncrypData(116);
        }

        if( $cache_code != $smscode ){
            $this->echoEncrypData(1,'验证码不正确');
        }
        $data1 = array(
            'phone' =>$phone,
            'table_id' => $area_id
        );
        $res1=M()->table('baseinfo.user_area')->add($data1);
        $data2= array(
            'phone' =>$phone,
            'password' => md5(md5($password).$phone),
            'nickname' => $phone,
            'account_code' => $area_id.$phone,
            'create_time' => time(),
            'create_addr_code' => $area_id
        );
        $this->autoBuildDatabase($phone);
        $res2=M()->table("baseinfo.user_info_".$area_id)->add($data2);
        if($res1 and $res2){
            $this->echoEncrypData(0);
        }else{
            $this->echoEncrypData(1,'注册失败');
        }
    }

    /*
     * App-用户登陆
     *@param  phone   手机号
     * @param password 密码
     * */
    protected function login_v1_0_0(){
        $phone = $this->pdata['phone'];
        $password =$this->pdata['password'];
        if(!$phone || !$password){
            $this->echoEncrypData(1,'登陆参数不完整');
        }
        if( !form_validate('phone',trim($phone))){
            $this->echoEncrypData(106);
        }
        $table_id = M('user_area')->field('table_id,openId,status')->where(['phone'=>$phone])->find();
        if(!$table_id){
            $this->echoEncrypData(1,'该用户不存在，请注册！');
        }
        if( $table_id['status'] != 1 ){
            $this->echoEncrypData(1,'该账号存在异常，暂无法登陆');
        }
        if($this->checkLogin($phone)){
            $this->echoEncrypData(1,'您已登陆，无需重复操作');
        }
        $res = M('user_info_'.$table_id['table_id'])->where(['phone'=>$phone,'password'=>md5(md5($password).$phone)])->count();
        if(!$res){
            $this->echoEncrypData(1,'账号或密码错误');
        }else{
            $account['phone'] = $phone;
            $account['openId'] =$table_id['openId'];
            $account['table_id'] =$table_id['table_id'];
            $account['account_code']=$account['table_id'].$account['phone'];
            $this->account_code = $account['account_code'];
            $this->account = $account;
            session('account'.$phone,$account);
            $this->echoEncrypData(0);
        }
    }

    /*
     * App-用户退出登陆
     * @phone 手机号
     * */
    protected function logout_v1_0_0(){
        $phone = $this->pdata['phone'];
        if(!$phone){
            $this->echoEncrypData(1,'参数不完整');
        }
        if( !form_validate('phone',trim($phone))){
            $this->echoEncrypData(106);
        }
        if(!$this->checkLogin($phone)){
            $this->echoEncrypData(100);
        }else{
            session_unset('account');
            session_unset('account'.$phone);
            $this->echoEncrypData(0);
        }
    }

    /*
     * App-修改密码
     * @param  phone手机号
     * @param oldPassword 原密码
     * @param newPassword 新密码
     * */
    protected function changePassword_v1_0_0(){
        $phone = $this->pdata['phone'];
        $oldPassword = $this->pdata['oldPassword'];
        $newPassword = $this->pdata['newPassword'];
        if(!$phone || !$oldPassword || !$newPassword){
            $this->echoEncrypData(1,'参数不完整');
        }
        if(!$this->checkLogin($phone)){
            $this->echoEncrypData(100);
        }else {
            $res = M('user_info_'.$this->account['table_id'])->where(['phone'=>$phone,'password'=>md5(md5($oldPassword).$phone)])->getField('id');
            if(!$res){
                $this->echoEncrypData(1,'账号或密码错误');
            }else{
                $result= M('user_info_'.$this->account['table_id'])->where(['id'=>$res])->save(['password'=>md5(md5($newPassword).$phone)]);
                if($result === false){
                    $this->echoEncrypData(1,'密码修改失败');
                }else{
                    session_unset('account'.$phone);
                    $this->echoEncrypData(0);
                }
            }
        }
    }


    /*
     * 自动创建数据库
     * */
    protected function autoBuildDatabase($phone){

        $model=new Model\UserAreaModel();
        $data=$model->getUserInfoByPhone($phone);
        $this->executeSql('databases.sql',$data);
    }
    protected function executeSql($fileName,$data){
        $sql=file_get_contents(C('SQL_PATH').$fileName);
        $sql=str_replace('$city_id',$data['city_id'],$sql);
        $sql=str_replace('$province_id',$data['province_id'],$sql);
        $sql=str_replace('$account_code',$data['account_code'],$sql);
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
}