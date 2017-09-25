<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/25
 * Time: 10:43
 */

namespace Api\Model;
use Think\Model;

class ActivityModel extends Model
{
    public function __construct($province_id,$city_id )
    {
        $this->name = 'activity_'.$city_id;
        $this->connection = C('DB_GARDEN').$province_id;
        $this->db(0,$this->connection,true);
    }
    /*
     * 添加约玩活动
     * @parma data
     * */
    public function addActivity($data){
        $res= $this->add($data);
        if(!$res)return false;
        return $res;
    }

}