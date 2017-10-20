<?php
/**
 * 群话题
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/19
 * Time: 9:45
 */

namespace Api\Model;
use Think\Model;

class GroupSubjectModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'group_subject';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);

    }
    /*
     * 发布群话题
     * @param data 群话题数组
     * */
    public function addGroupSubject($data){
        if(!$res=$this->add($data))return false;
        return $res;
    }

    /*
     * 获取群话题列表
     * @param group_num 群号码
     * */
    public function getGroupSubjectList($group_num){
        if(!$data=$this->field('id as subject_id,title,content,read_num,commont_num')->where(['group_num'=>$group_num])->order(['read_num'=>'desc','create_time'=>'desc'])->select())return false;
        return$data;
    }

    /*
     * 获取某一话题详情
     * @param subject_id 话题id
     * */
    public function getGroupSubjectInfo($subject_id){
        $subject_id= intval($subject_id);
        $data = $this->where(['subject_id'=>$subject_id])->find();
        if(!$data)return false;
        return $data;
    }

}