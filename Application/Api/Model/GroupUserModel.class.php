<?php
/**
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
        $this->account_code = $account_code;
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

}