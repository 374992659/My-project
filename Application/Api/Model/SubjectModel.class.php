<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/20
 * Time: 18:04
 */

namespace Api\Model;
use Think\Model;

class SubjectModel extends Model
{
    public function __construct($province_id,$city_id )
    {
        $this->name = 'subject_'.$city_id;
        $this->connection = C('DB_GARDEN').$province_id;
        $this->db(0,$this->connection,true);
    }

    /*
     * 添加热门话题
     * @param data 话题内容数组
     * */
    public function addSubject($data){
        $res =$this->add($data);
        if(!$res)return false;
        return $res;
    }
    /*
     * 获取城市公共话题
     * */
    public function getPublicSubject(){
        $data = $this->field('id as subject_id,title,content,garden_code,read_num,commont_num,status')->where(['is_public'=>1])->order(['create_time'=>'desc'])->select();
        if(!$data)return false;
        return $data;
    }

    /*
     * 获取指定某小区的话题
     * @param garden_code 小区code
     * @param only_public 是否执行显示公共话题 可填
     * */
    public function getGardenSubject($garden_code,$only_public=''){
        if(!$only_public){
            $data = $this->field('id as subject_id,title,content,garden_code,read_num,commont_num,status')->where(['garden_code'=>$garden_code])->order(['create_time'=>'desc'])->select();
        }else{
            $data = $this->field('id as subject_id,title,content,garden_code,read_num,commont_num,status')->where(['garden_code'=>$garden_code,'is_public'=>1])->order(['create_time'=>'desc'])->select();
        }
        if(!$data)return false;
        return $data;
    }
    /*
     * 获取某一话题详情
     * @param subject_id 话题详情
     * */
    public function getSubjectInfo($subject_id){
        $data =$this->where(['id'=>$subject_id])->find();
        if(!$data)return false;
        return $data;
    }
    /*
     * 获取某一用户指定小区所有话题
     * @param user_code 用户code
     * @param garden_code 小区code
     * */
    public function getUserSubject($user_code,$garden_code){
        $data=$this->field('id as subject_id,title,content,garden_code,read_num,commont_num,status')->where(['user_code'=>$user_code,'garden_code'=>$garden_code])->order(['create_time'=>'desc'])->select();
        if(!$data)return false;
        return $data;
    }
}