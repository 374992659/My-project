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
    }

    /*
     * 为用户添加群
     * @param group_name 群名称
     * @param group_portrait 群头像
     * @param group_code 群识别符
     * @param group_num 群号
     * @param role  角色
     * @param group_type 群分类id
     * @param garden_code 小区code 可填
     * */
    public function addGroup($group_name,$group_portrait,$group_code,$group_num,$role,$group_type,$garden_code=''){
        $data=array(
            'group_name'=>$group_name,
            'group_portrait'=>$group_portrait,
            'group_code'=>$group_code,
            'group_num'=>$group_num,
            'role'=>$role,
            'group_type'=>$group_type,
            'garden_code'=>$garden_code
        );
        $res = $this->add($data);
        if(!$res){
            return false;
        }
        return true;
    }
    /*
     * 获取用户所在群
     * @param role 角色 可填 不填获取用户所有群
     * */
    public function getGroup($field = '*',$role=''){
        $where=array();
        if($role){
            $where = array(
                'role' =>$role,
            );
        }
        $where['status'] =1;
        $data = $this->field($field)->where($where)->select();
        if(!$data){
            return 1;
        }else{
            return $data;
        }
    }

}