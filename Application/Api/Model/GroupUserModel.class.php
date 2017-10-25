<?php
/**
 * 群用户
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/12
 * Time: 14:33
 */

namespace Api\Model;


use Think\Model;

class GroupUserModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'group_user';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }


    /*
     * 为群添加用户
     * @param group_code 群识别符
     * @param group_num 群号码
     * @param group_name   群名称
     * @param group_portrait    群头像
     * @param user_code 用户code
     * @param nickname 用户昵称
     * @param portrait  用户头像
     * @param role  用户角色 1：创建人 2：管理员 3：普通成员
     * */
    public function addUser($group_code,$group_num,$group_name,$group_portrait,$user_code,$nickname,$portrait,$role){
        $data=array(
            'group_code' =>$group_code,
            'group_num' =>$group_num,
            'group_name' =>$group_name,
            'group_portrait' =>$group_portrait,
            'user_code' =>$user_code,
            'nickname' =>$nickname,
            'portrait' =>$portrait,
            'role' =>$role,
        );
        $res = $this->add($data);
        if(!$res){
            return false;
        }
        return true;
    }
    /*
     *获取群所有用户
     * @group_code 群识别符
     * */
    public function getGroupUser($group_code){
        if(!$group_code)return 21 ;
        $data = $this->field('user_code,nickname,portrait,role')->where(['group_code'=>$group_code])->select();
        if(!$data) return 5;
        return $data;
    }


    /*
     * 获取群内某一用户的身份
     * @group_num 群号码
     * @user_code 用户code
     * */
    public function getUserRole($group_num,$user_code){
        $data = $this->where(['group_num'=>$group_num,'user_code'=>$user_code])->getField('role');
        if(!$data) return false;
        return $data;
    }


}