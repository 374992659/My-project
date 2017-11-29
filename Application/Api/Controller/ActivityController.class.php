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
        $city_id=substr($garden_code,0,6);
        $province_id=M('baseinfo.swf_area')->where(['city_code'=>$city_id])->getField('province_code');
        $table_id=substr($this->account_code,0,6);
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
     * 约玩上传照片
     * 参数 ： 微信版 无 |APP imageData 文件流
     * */
    protected function uploadActivityPic_v1_0_0(){
        if(intval($_GET['is_wap']) !==1){
            $a = $this->pdata['imageData'];
            if ( empty($a) ) return $this->echoEncrypData(1,'没有文件被选中');
            $save_path= APP_PATH.'Common/Upload/Img/GroupActivity/'.date(m).date(d).'/';
            $res = $this->uploadAppImg($save_path,$a);
            if($res){
                $this->echoEncrypData(0,'',$res);
            }else{
                $this->echoEncrypData(1,'图片上传失败');
            }
        }else{
            if(!$_FILES){
                $this->echoEncrypData(306);
            }
            import('Vendor.UploadFile');
            $model = new \UploadFile();
            $save_path= APP_PATH.'Common/Upload/Img/GroupActivity/'.date(m).date(d).'/';
            $res = $model->upload($save_path);
            if(!$res){
                $this->echoEncrypData(1,$model->getErrorMsg());
            }
            foreach($res as $k=>$v){
                $data['file_path'][]=$res[$k]['savepath'].$res[$k]['savename'];
            }
            $this->echoEncrypData(0,'',$data);
        }
    }
    /*
     * 约玩列表
     * @param city_id 城市id
     * @param garden_code小区code 可填
     * */
        protected function getActivityList_v1_0_0(){
        $city_id=$this->pdata['city_id'];
        $garden_code =$this->pdata['garden_code'];
        if(!$city_id )$this->echoEncrypData(21);
        $province_id=M('baseinfo.swf_area')->where(['city_code'=>$city_id])->getField('province_code');
        $activity=new Model\ActivityModel($province_id,$city_id);
        $data = $activity->getActivityList($garden_code);
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
        $activity_registration = new Model\ActivityRegistration($province_id,$city_id);
        $data['enroll_status']=$activity_registration->getEnrollStatus($this->account_code,$activity_id);
        $total=$activity_registration->field('SUM(num) as total')->where(['activity_id'=>$activity_id])->find();
        $data['enroll_total']=$total['total']?$total['total']:0;
        $data['enroll_list']=$activity_registration->where(['activity_id'=>$activity_id])->select();
        $data['transport']=C('ACTIVITY_TRANSPORT')[$data['transport']];
        $data['cost_type']=C('COST_TYPE')[$data['cost_type']];
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 约玩报名
     * @param city_id 城市id
     * @param activity_id  活动id
     * @param num 报名人数
     * @param name  姓名
     * @param phone 联系电话
     * */
    protected function enrollActivity_v1_0_0(){
        $this->checkParam(array('city_id','activity_id','num','name','phone'));
        $province_id=M('baseinfo.swf_area')->where(['city_code'=>$this->pdata['city_id']])->getField('province_code');
        $mongo = new \MongoClient();
        $table_id = $mongo->baseinfo->user_area->findOne(array('account_code'=>$this->account_code))['table_id'];
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait,user_garden')->where(['account_code'=>$this->account_code])->find();
        if(!$res['user_garden'])$this->echoEncrypData(1,'你没有通过该小区的认证');
        $garden_arr = explode(';',$res['user_garden']);
        $Array=array();
        foreach ($garden_arr as $k=>$v){
            $Array[]=explode(',',$v)[0];
        }
        $activity=new Model\ActivityModel($province_id,$this->pdata['city_id']);
        if(!in_array($activity->where(['id'=>$this->pdata['activity_id']])->getField('garden_code'),$Array))$this->echoEncrypData(1,'你没有通过该小区的认证');
        $collection_time=$activity->where(['activity_id'=>$this->pdata['activity_id']])->getField('collection_time');
        if(time() > intval($collection_time))$this->echoEncrypData(1,'已超出报名时限');
        $activity_regist=new Model\ActivityRegistration($province_id,$this->pdata['city_id']);
        $status = $activity_regist->getEnrollStatus($this->account_code,$this->pdata['activity_id']);
        if($status)$this->echoEncrypData(1,'您已经报过名啦');
        $data=array(
            'activity_id'=>$this->pdata['activity_id'],
            'user_code'=>$this->account_code,
            'nickname'=>$res['nickname'],
            'portrait'=>$res['portrait'],
            'name'=>$this->pdata['name'],
            'phone'=>$this->pdata['phone'],
            'num'=>$this->pdata['num'],
            'create_time'=>time(),
        );
        $res = $activity_regist->add($data);
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }
    /*
     * 取消报名
     * @param city_id 城市id
     * @param activity_id  活动id
     * */
    protected function cancelEnrollActivity_v1_0_0(){
        $this->checkParam(array('city_id','activity_id'));
        $province_id=M('baseinfo.swf_area')->where(['city_code'=>$this->pdata['city_id']])->getField('province_code');
        $activity=new Model\ActivityModel($province_id,$this->pdata['city_id']);
        $time=$activity->field('start_time,end_time')->where(['activity_id'=>$this->pdata['activity_id']])->find();
        $now_time =time();
        if(intval($time['start_time'])<$now_time&&$now_time< intval($time['end_time']))$this->echoEncrypData(1,'活动期间不能取消报名');
        if(intval($time['end_time'])<$now_time)$this->echoEncrypData(1,'活动已经结束');
        $activity_regist=new Model\ActivityRegistration($province_id,$this->pdata['city_id']);
        $count = $activity_regist->where(['activity_id'=>$this->pdata['activity_id'],'user_code'=>$this->account_code])->count();
        if(!$count)$this->echoEncrypData(1,'您还没有报名');
        $res = $activity_regist->where(['activity_id'=>$this->pdata['activity_id'],'user_code'=>$this->account_code])->delete();
        if($res!==false)$this->echoEncrypData(0);
        $this->echoEncrypData(1);
    }



}