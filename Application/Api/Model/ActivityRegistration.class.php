<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/25
 * Time: 17:11
 */

namespace Api\Model;
use Think\Model;

class ActivityRegistration extends Model
{
    public function __construct($province_id,$city_id )
    {
        $this->name = 'activity_registration_'.$city_id;
        $this->connection = C('DB_GARDEN').$province_id;
        $this->db(0,$this->connection,true);
    }
    /*
     * 获取用户报名状态
     * @param user_code 用户code
     * */
    public function getEnrollStatus($user_code){
        $res = $this->where(['user_code'=>$user_code])->count();
        if(!$res)return false;
        return $res;
    }
}