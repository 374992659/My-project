<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/11/1
 * Time: 15:26
 */

namespace Api\Model;
use Think\Model;

class GardenMessageModel extends Model
{
    public function __construct($province_id,$city_id )
    {
        $this->name = 'garden_message_'.$city_id;
        $this->connection = C('DB_GARDEN').$province_id;
        $this->db(0,$this->connection,true);
    }
}