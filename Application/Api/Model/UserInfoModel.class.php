<?php
/**
 * 用户中心
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/25
 * Time: 11:27
 */

namespace Api\Model;
use Think\Model;

class UserInfoModel extends Model
{
    public function __construct( $city_id )
    {
        $this->name = 'user_info_'.$city_id;
        $this->connection = C('DB_CONFIG_DEFAULT');
        $this->db(0,$this->connection,true);
    }
    /*
     * 获取用户信息
     * @param String $account_code 用户code
     * @param Array $field 需要获取的字段 可填
     * */
    public function getUserinfo($account_code,$field=''){
        if($field){
            $field_str = implode(',',$field);
            $data = $this->field($field_str)->where(['account_code'=>$account_code])->find();
            if(!$data)return false;
            return $data;
        }else{
            $data = $this->where(['account_code'=>$account_code])->find();
            if(!$data)return false;
            return $data;
        }
    }
}