<?php
/**
 * 城市广告
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/25
 * Time: 9:29
 */

namespace Api\Model;
use Think\Model;

class AdeverseModel extends Model
{
    public function __construct($province_id,$city_id )
    {
        $this->name = 'adverse_'.$city_id;
        $this->connection = C('DB_GARDEN').$province_id;
        $this->db(0,$this->connection,true);
    }

    /*
     * 添加广告
     * @param data 添加广告数据
     * */
    public function addAdverse($data){
        $res = $this->add($data);
        if(!$res)return false;
        return $res;
    }

    /*
     * 获取某条广告创建人的code
     * @param adverse_id 广告id
     * */
    public function getAdverseC($adverse_id){
        $code = $this->where(['id'=>$adverse_id])->getField('user_code');
        if(!$code)return false;
        return $code;
    }

    /*
     * 删除指定广告
     * @param adverse_id 广告id
     * */
    public function delAdverse($adverse_id){
        $res=$this->where(['id'=>$adverse_id])->delete();
        if(!$res)return false;
        return $res;
    }
    /*
     * 获取广告列表
     * @param city_id 城市id
     *@param garden_code 小区code
     * */
    public function getAdverseList($city_id,$garden_code=''){
        if($garden_code){
            $res=$this->field('id as adverse_id,title,content,create_time,user_code')->where(['garden_code'=>$garden_code,'status'=>1])->select();
        }else{
            $res=$this->field('id as adverse_id,title,content,create_time,user_code')->where(['status'=>1])->select();
        }
        if(!$res)return false;
        return $res;
    }
    /*
     * 获取我的广告列表
     * @param city_id 城市id
     *@param garden_code 小区code
     * */
    public function getMyAdverseList($city_id,$user_code,$garden_code=''){
        if($garden_code){
            $res=$this->field('id as adverse_id,title,content,create_time,user_code')->where(['garden_code'=>$garden_code,'status'=>1,'user_code'=>$user_code])->select();
        }else{
            $res=$this->field('id as adverse_id,title,content,create_time,user_code')->where(['status'=>1,'user_code'=>$user_code])->select();
        }
        if(!$res)return false;
        return $res;
    }
}