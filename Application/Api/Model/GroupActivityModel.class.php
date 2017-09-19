<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/19
 * Time: 18:33
 */

namespace Api\Model;
use Think\Model;

class GroupActivityModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'group_subject';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }

    /*
     *  添加群活动
     * @param data 群活动数组
     * */
    public function addGroupActivity($data){
        $res =$this->add($data);
        if(!$res)return false;
        return true;
    }
}