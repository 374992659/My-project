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
        $this->name = 'group_activity';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }

    /*
     *  添加群活动
     * @param data 群活动数组
     * */
    public function addGroupActivity($data){
        $res =$this->add($data);
        if(!$res) return false;
        return true;
    }
    /*
     * 群活动列表
     * @param group_num  群号码
     * */
    public function getActivityList($group_num){
        $data =$this->field('id as activity_id,title,nickname,garden_name,start_time,end_time,collection_time,collection_place,picture')->where(['group_num'=>$group_num])->order(['create_time'=>'desc'])->select();
        if(!$data)return false;
        return $data;
    }

    /*
     * 群活动详情
     * @param activity_id 活动id
     * */
    public function getGroupActivityInfo($activity_id){
        $data=$this->where(['id'=>$activity_id])->find();
        if(!$data)return false;
        return $data;
    }


}