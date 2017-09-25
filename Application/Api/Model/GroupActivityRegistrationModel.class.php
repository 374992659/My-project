<?php
/**
 * 群活动动态
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/20
 * Time: 10:55
 */

namespace Api\Model;
use Think\Model;

class GroupActivityRegistrationModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'group_activity_registration';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }

    /*
     * 群活动报名
     * @param data 报名数据
     * */
    public function enrollGroupActivity($data){
        $data=$this->add($data);
        if(!$data)return false;
        return true;
    }

    /*
     * 获取报名状态
     * @param user_code 用户code
     * @parma activity_id 报名id
     * */
    public function getEnroolStatus($activity_id,$user_code){
        $res =$this->where(['user_code'=>$user_code,'activity_id'=>$activity_id])->count();
        return $res;
    }
    /*
     * 取消报名
     * @param user_code 用户code
     * @parma activity_id 报名id
     * */
    public function cancelGroupActivityEnroll($activity_id,$user_code){
        $res =$this->where(['user_code'=>$user_code,'activity_id'=>$activity_id])->delete();
        return $res;
    }

}