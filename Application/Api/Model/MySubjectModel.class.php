<?php
/**
 * 我的话题
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/22
 * Time: 16:14
 */

namespace Api\Model;
use Think\Model;

class MySubjectModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'my_subject';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }
    /*
     * 添加我的话题
     * */
    public function addMySubject($garden_code,$subject_id){
        $data=array(
            'garden_code'=>$garden_code,
            'subject_id'=>$subject_id,
        );
        $res=$this->add($data);
        if(!$res)return false;
        return true;
    }
    /*
     * 获取我的话题
     * */
    public function getMysubject(){
        $data= $this->field('distinct garden_code')->select();
        if(!$data)return false;
        return $data;
    }

}