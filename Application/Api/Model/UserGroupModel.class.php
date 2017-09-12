<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/12
 * Time: 14:09
 */

namespace Api\Model;


use Think\Model;

class UserGroupModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'user_group';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
        $this->account_code = $account_code;
    }

    /*
     * 为用户添加群
     * @param group_name 群名称
     * @param group_portrait 群头像
     * @param group_code 群识别符
     * @param group_num 群号
     * @param role  角色
     * @param group_type 群分类id
     * */
    public function addGroup($group_name,$group_portrait,$group_code,$group_num,$role,$group_type){
        $data=array(
            'group_name'=>$group_name,
            'group_portrait'=>$group_portrait,
            'group_code'=>$group_code,
            'group_num'=>$group_num,
            'role'=>$role,
            'group_type'=>$group_type
        );
        $res = $this->add($data);
        if(!$res){
            return false;
        }
        return true;
    }

}