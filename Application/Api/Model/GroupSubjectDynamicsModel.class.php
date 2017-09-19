<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/19
 * Time: 12:24
 */

namespace Api\Model;
use Think\Model;

class GroupSubjectDynamicsModel extends Model
{
    public function __construct( $account_code,$subject_id )
    {
        $this->name = 'group_subject_dynamics_'.$subject_id;
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }

    /*
     *添加记录
     * @param data 数据数组
     * */
    public function addGroupSubjectDynamics($data){
        if(!$this->add($data))return false;
        return true;
    }

    /*
     * 获取话题评论
     * @param type 动态类型
     * */
    public function getGroupSubjectDynamics($type){
        $data = $this->where(['type'=>$type])->select();
        if(!$data)return false;
        return $data;
    }

}