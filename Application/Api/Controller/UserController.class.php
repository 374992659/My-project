<?php
/**
 * 用户退出登录、修改密码
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
     * App-用户退出登陆
     * */
    protected function logout_v1_0_0(){
        $account_code = $this->account_code;
        if(!$this->checkLogin($account_code)){
            $this->echoEncrypData(100);
        }else{
            session('account'.$account_code,null);
            $this->appToken=false; //不返回apptoken
            $this->echoEncrypData(0);
        }
    }
    /*
     * 判断登录
     * */
    protected function checkLogin($account_code){
        $account=session('account'.$account_code);
        if(!$account){
            return false;
        }
        return true;
    }

    /*
     * App-修改密码
     * @param oldPassword 原密码
     * @param newPassword 新密码
     * */
    protected function changePassword_v1_0_0(){
        $oldPassword = $this->pdata['oldPassword'];
        $newPassword = $this->pdata['newPassword'];
        if(!$oldPassword || !$newPassword){
            $this->echoEncrypData(1,'参数不完整');
        }
        $account_code=$this->account_code;
        $account=substr($account_code,6);
        if(!$this->checkLogin($account_code)){
            $this->echoEncrypData(100);
        }else {
            $res = M('user_info_'.$this->account['table_id'])->where(['account'=>$account,'password'=>md5(md5($oldPassword).$account)])->getField('id');
            if(!$res){
                $this->echoEncrypData(1,'账号或原密码错误');
            }else{
                $result= M('user_info_'.$this->account['table_id'])->where(['id'=>$res])->save(['password'=>md5(md5($newPassword).$account)]);
                if($result === false){
                    $this->echoEncrypData(1,'密码修改失败');
                }else{
                    session('account'.$account_code,null);
                    $this->appToken=false; //不返回apptoken
                    $this->echoEncrypData(0);
                }
            }
        }
    }

}