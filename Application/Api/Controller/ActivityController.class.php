<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/25
 * Time: 10:33
 */

namespace Api\Controller;
use Api\Model;

class ActivityController extends VersionController
{
    /*
     * 添加约玩信息
     * @param title 标题
     * @param start_time 开始时间
     * @param end_time 结束时间
     * @param destination 目的地
     * @param collection_time 集合时间
     * @param collection_place 集合地
     * @param contact 联系人
     * @param phone 联系电话
     * @param transport 交通方式 1：汽车自驾 2：徒步 3：自行车骑行 4：摩托车骑行
     * @param garden_code 小区code
     * @param garden_name 小区名称
     * @param total_num 目标人数
     * @param cost_type 花费类型 1：AA制 2：自驾游 3：发布人请客 ...
     * @param average_cost 人均消费
     * @param rote_planning 路线规划 可填
     * @param tag 标签 可填
     * @param picture 图片 可填
     * @param detailed_introduction 详细介绍 可填
     * */
    protected function addActivity_v1_0_0(){
        $title =$this->pdata['title'];
        $start_time =$this->pdata['start_time'];
        $end_time =$this->pdata['end_time'];
        $destination =$this->pdata['destination'];
        $collection_time =$this->pdata['collection_time'];
        $collection_place =$this->pdata['collection_place'];
        $contact =$this->pdata['contact'];
        $phone =$this->pdata['phone'];
        $transport =$this->pdata['transport'];
        $garden_code =$this->pdata['garden_code'];
        $garden_name =$this->pdata['garden_name'];
        $total_num =$this->pdata['total_num'];
        $cost_type =$this->pdata['cost_type'];
        $average_cost =$this->pdata['average_cost'];
        $rote_planning =$this->pdata['rote_planning'];
        $tag =$this->pdata['tag'];
        $picture =$this->pdata['picture'];
        $detailed_introduction =$this->pdata['detailed_introduction'];
        if(!$title || !$start_time  || !$end_time  || !$destination  || !$collection_time || !$collection_place  || !$contact  || !$phone  || !$transport  || !$garden_code  || !$garden_name  || !$total_num  || !$cost_type  || !$average_cost) $this->echoEncrypData(21);
        $city_id=substr($garden_code,0,4);
        $province_id=M('baseinfo.swf_area')->where(['city_code'=>$city_id])->getField('province_code');
        $table_id=substr($this->account_code,0,4);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $data=array(
            'title'=>$title,
            'start_time'=>$start_time,
            'end_time'=>$end_time,
            'destination'=>$destination,
            'collection_time'=>$collection_time,
            'collection_place'=>$collection_place,
            'contact'=>$contact,
            'phone'=>$phone,
            'transport'=>$transport,
            'garden_code'=>$garden_code,
            'garden_name'=>$garden_name,
            'total_num'=>$total_num,
            'cost_type'=>$cost_type,
            'average_cost'=>$average_cost,
            'rote_planning'=>$rote_planning,
            'tag'=>$tag,
            'picture'=>$picture,
            'detailed_introduction'=>$detailed_introduction,
            'user_code'=>$this->account_code,
            'nickname'=>$res['nickname'],
            'portrait'=>$res['portrait'],
            'create_time'=>time(),
        );
        $activity=new Model\ActivityModel($province_id,$city_id);
        $res =$activity->addActivity($data);
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }
    /*
     * 约玩列表
     * @param city_id 城市id
     * */
    protected function getActivityList_v1_0_0(){
        $city_id=$this->pdata['city_id'];
        if(!$city_id)$this->echoEncrypData(21);
        $province_id=M('baseinfo.swf_area')->where(['city_code'=>$city_id])->getField('province_code');
        $activity=new Model\ActivityModel($province_id,$city_id);
        $data = $activity->getActivityList();
        if(!$data)$this->echoEncrypData(5);
        $this->echoEncrypData(0,'',$data);
    }
    /*
     *约玩详情
     * @param city_id 城市id
     * @param activity_id  活动id
     * */
    protected function getActivityInfo_v1_0_0(){
        $city_id=$this->pdata['city_id'];
        $activity_id=$this->pdata['activity_id'];
        if(!$city_id || !$activity_id)$this->echoEncrypData(21);
        $province_id=M('baseinfo.swf_area')->where(['city_code'=>$city_id])->getField('province_code');
        $activity=new Model\ActivityModel($province_id,$city_id);
        $data =$activity->getActivityInfo($activity_id);
        if(!$data)$this->echoEncrypData(1);
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 约玩报名
     * @param city_id 城市id
     * @param activity_id  活动id
     * */
    protected function enrollActivity_v1_0_0(){
        $city_id =$this->pdata['city_id'];
        $activity_id =$this->pdata['activity_id'];
        if(!$city_id || !$activity_id)$this->echoEncrypData(21);
        $province_id=M('baseinfo.swf_area')->where(['city_code'=>$city_id])->getField('province_code');
        $table_id=substr($this->account_code,0,4);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $activity=new Model\ActivityModel($province_id,$city_id);
        $collection_time=$activity->where(['id'=>$activity_id])->getField('collection_time');
        if(time() > intval($collection_time))$this->echoEncrypData(1,'已超出报名时限');
        $activity_regist=new Model\ActivityRegistration($province_id,$city_id);
        $status = $activity_regist->getEnrollStatus($this->account_code);
        if($status)$this->echoEncrypData(1,'您已经报过名啦');
        $data=array(
            'activity_id'=>$activity_id,
            'user_code'=>$this->account_code,
            'nickname'=>$res['nickname'],
            'portrait'=>$res['portrait'],
            'create_time'=>time(),
        );
        $res = $activity_regist->add($data);
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }

}