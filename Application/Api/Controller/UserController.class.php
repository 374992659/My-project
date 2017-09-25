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

}