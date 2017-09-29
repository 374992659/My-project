<?php
/**
 * 用户地区
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/4
 * Time: 14:39
 */

namespace Api\Model;
use Think\Model;

class UserAreaModel extends Model
{
    /*
     * 返回全国地区
     * */
    public function getArea(){
        $data=M('swf_area')->select();
        return $data;
    }


    /**添加手机号，openId以及区域标号到user_area
     * @param string $openId
     * @param string $phone
     * @param string $user_area
     */
    public function addUserArea($openId,$phone,$table_id, & $errmsg){
        $data=M('user_area')->field('openId,status')->where(array('openId'=>$openId))->find();
        if($data){
            $errmsg='该账号已绑定手机号，请勿重复操作';
            return false;
        }
        if($data && $data['status'] !== 1){
            $errmsg='该账号已被暂停使用';
            return false;
        }
        $data = array(
            'openId'=>$openId,
            'table_id'=>$table_id,
            'phone'=>$phone,
            'status'=>1
        );
        $res = M('User_area')->add($data);
        if(!$res){
            $errmsg = '手机号码绑定失败';
            return false;
        }
        return $data;
    }

    /*
     * 删除user信息
     * @param string openId 微信openId
     * */
    public function delUserArea($openId){
        if($openId)return false;
        $res = $this->where(['openId'=>$openId])->delete();
        if(!$res) return false;
        return true;
    }


    /*
     * 由电话号码获取用户信息（所在区域、省份等）
     * @param string account 账号
     * */
    public function getUserInfoByPhone($account,& $errmsg){
        $data=M('user_area')->field('id,table_id as city_id')->where(array('account' =>$account))->find();
        if(!$data){
            $errmsg = '该账号不存在';
            return false;
        }else{
            $res= M('swf_area')->field('parent_id')->where(array('id'=>$data['city_id']))->find();
            $data['province_id']=$res['parent_id'];
            $data['account_code'] = $data['city_id'].$account;
            return $data;
        }
    }


    /*
     * 微信自动登录设置session值添加返回apptoken
     * @param openId 微信openId
     * */
    public function wxloginSetSession($openId){
        if(!$openId)return false;
        $data = M('baseinfo.user_area')->field('phone,openId,table_id')->where(['openId'=>$openId])->find();
        if(!$data)return false;
        return $data;
    }

    public function setCustomerRegistByOpenid($openId){
        echo $openId;
    }

}