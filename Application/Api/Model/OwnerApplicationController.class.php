<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/27
 * Time: 10:23
 */

namespace Api\Model;
use Think\Model;

class OwnerApplicationController extends Model
{
    public function __construct( $city_id )
    {
        $this->name = 'owner_application_'.$city_id;
        $this->connection = C('DB_CERTIFICATION_APPLICATION');
        $this->db(0,$this->connection,true);
    }
    /*
     * 添加认证数据
     * */
    public function addApplication($data){
        $res = $this->add($data);
        if(!$res)return false;
        return $res;
    }
}