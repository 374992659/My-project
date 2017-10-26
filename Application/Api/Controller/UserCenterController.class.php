<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/25
 * Time: 11:02
 */

namespace Api\Controller;


use think\console\command\make\Model;

class UserCenterController extends VersionController
{
    /*
     * 修改个人资料
     * @param portrait 用户头像
     * @param nickname 用户昵称
     * @param realname 真实姓名 可填
     * @param phone 手机号 可填
     * @param wechat_num 微信号 可填
     * @param qq_num QQ账号 可填
     * @param default_garden 常驻小区 可填
     * @param birth_year 出生年份 可填
     * @param birth_month 出生月份 可填
     * @param hobby 爱好  字符串 用英文逗号间隔 可填
     * */
    protected function updateUserInfo(){
        $account_code = $this->account_code;
        $city_id = substr($account_code,0,4);
        $portrait = $this->pdata['portrait'];
        $nickname = $this->pdata['nickname'];
        if(!$portrait || !$nickname)$this->echoEncrypData(21);
        $user_info = new \Api\Model\UserInfoModel($city_id);
        $res = $user_info->where(array('account_code'=>$account_code))->save(array(
            'portrait'=>$portrait,
            'nickname'=>$nickname,
            'realname'=>$this->pdata['realname'],
            'phone'=>$this->pdata['phone'],
            'wechat_num'=>$this->pdata['wechat_num'],
            'qq_num'=>$this->pdata['qq_num'],
            'default_garden'=>$this->pdata['default_garden'],
            'birth_year'=>$this->pdata['birth_year'],
            'birth_month'=>$this->pdata['birth_month'],
            'hobby'=>$this->pdata['hobby'],
        ));
        if($res !== false){
            $mongo = new \MongoClient();
            $mongo->baseinfo->user_area->update(array('account_code'=>$account_code),array(
                'portrait'=>$portrait,
                'nickname'=>$nickname,
            ));
            $this->echoEncrypData(0);
        }
        $this->echoEncrypData(1);
    }
    /*
     * 获取我的个人资料
     * */

}