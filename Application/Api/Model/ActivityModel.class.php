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
    /*
     * 获取指定城市所有约玩
     * */
    public function getActivityList(){
        $res = $this->field('id as activity_id,title,nickname,garden_name,start_time,end_time,collection_time,collection_place,picture')->order(['create_time'=>'desc'])->select();
        if(!$res)return false;
        return $res;
    }

    /*
     *获取活动详情
     * @param activity_id 活动id
     * */
    public function getActivityInfo($activity_id){
        $data= $this->where(['id'=>$activity_id])->find();
        if(!$data)return false;
        return $data;
    }
}