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

}