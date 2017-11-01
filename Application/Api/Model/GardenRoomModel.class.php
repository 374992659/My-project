<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/30
 * Time: 10:35
 */

namespace Api\Model;
use Think\Model;

class GardenRoomModel extends Model
{
    public function __construct($province_id,$city_id )
    {
        $this->name = 'garden_room_'.$city_id;
        $this->connection = C('DB_GARDEN').$province_id;
        $this->db(0,$this->connection,true);
    }
    /*
     * 获取小区房间租户或业主数量
     * @param garden_code 小区code
     * @param room_num 房间号码
     * @param role 角色 1：业主 2：租户
     * */
    public function getRoomRoleNum($garden_code,$room_num,$role){
        $count = $this->where(['garden_code'=>$garden_code,'room_num'=>$room_num,'role'=>$role])->count();
        return $count;
    }
    /*
     * 添加小区房间成员
     * @param garden_code 小区code
     * @param room_num 房间号码
     * */
}