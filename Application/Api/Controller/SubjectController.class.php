<?php
/**
 * 热门话题广告类
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/20
 * Time: 15:45
 */

namespace Api\Controller;
use Api\Model;

class SubjectController extends VersionController
{
    /*
     * 发布热门话题
     * @param title 标题
     * @param content 内容
     * @param garden_code 小区code
     * @param garden_name 小区名称
     * @param choise 选择项 json格式
     * @param end_time 结束时间
     * @param picture 图片 可填
     * @param type 选择类型
     * @param is_public 是否公开
     * @param is_push 是否需要推送
     * */
    protected function addSubject_v1_0_0(){
        $title = $this->pdata['title'];
        $content = $this->pdata['content'];
        $garden_code = $this->pdata['garden_code'];
        $garden_name = $this->pdata['garden_name'];
        $choise = $this->pdata['choise'];
        $end_time = $this->pdata['end_time'];
        $picture = $this->pdata['picture'];
        $type = $this->pdata['type'];
        $is_public = $this->pdata['is_public'];
        $is_push = $this->pdata['is_push'];
        if(!$title || !$content || !$garden_code || !$garden_name || !$choise || !$end_time || !$type)$this->echoEncrypData(21);
        $table_id=substr($this->account_code,0,4);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $data = array(
            'title'=>$title,
            'content'=>$content,
            'garden_code'=>$garden_code,
            'garden_name'=>$garden_name,
            'choise'=>$choise,
            'end_time'=>$end_time,
            'picture'=>$picture,
            'type'=>$type,
            'user_code'=>$this->account_code,
            'nickname'=>$res['nickname'],
            'portrait'=>$res['portrait'],
            'create_time'=>time(),
        );
        if($is_public) { //公开话题
            $data['is_public'] = $is_public;
        }
        if($is_push){
            $data['is_push']=$is_push;
        }
        $city_id=substr($garden_code,0,4);
        $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
        $model=new Model\SubjectModel($province_id,$city_id);
        $res = $model->addSubject($data);
        if(!$res)$this->echoEncrypData(1,$model->getError());
        $database=new RegiestController();
        $database->executeSql('subject_dynamics.sql',array('province_id'=>$province_id,'city_id'=>$city_id,'subject_id'=>$res));
        //在我的话题关联表中添加记录
        $my_subject=new Model\MySubjectModel($this->account_code);
        $my_subject->addMySubject($garden_code,$res);
        $this->echoEncrypData(0);
    }
    /*
     * 话题展示
     * @param city_id 城市id
     * @param garden_code 小区code 可填
     * */
    protected function getSubjectList_v1_0_0(){
        $city_id=$this->pdata['city_id'];
        $garden_code=$this->pdata['garden_code'];
        if(!$garden_code && !$city_id)$this->echoEncrypData(21);
        if(!$garden_code){//未指定小区显示城市所有公开话题
            $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
            $model=new Model\SubjectModel($province_id,$city_id);
            $data=$model->getPublicSubject();
            if(!$data)$this->echoEncrypData(5);
            $this->echoEncrypData(0,'',$data);
        }else{//指定小区 判断该小区用户是否认证 认证通过显示小区所有话题 没有则显示小区公开话题
            $table_id=substr($this->account_code,0,4);
            $city_id=substr($garden_code,0,4);
            $res = M('baseinfo.user_info_'.$table_id)->where(['account_code'=>$this->account_code])->getField('user_garden');
            $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
            $model=new Model\SubjectModel($province_id,$city_id);
            if($res){
                $garden_arr=explode(';',$res);
                if(!$garden_arr){
                    $garden_arr[]=$res;
                }
                $result = array();
                foreach ($garden_arr as $k=>$v){
                    $arr=explode(',',$v);
                    $result[$arr[0]]=$arr[1];
                }
                if(array_key_exists($garden_code,$result)){
                    $data = $model->getGardenSubject($garden_code);
                    if(!$data)$this->echoEncrypData(5);
                    $this->echoEncrypData(0,'',$data);
                }else{
                    $data = $model->getGardenSubject($garden_code,1);
                    if(!$data)$this->echoEncrypData(5);
                    $this->echoEncrypData(0,'',$data);
                }
            }
        }
    }
    /*
     * 话题详情
     * @param garden_code 话题发布所属小区code
     * @param subject_id 话题id
     * */
    protected function getSubjectInfo_v1_0_0(){
        $garden_code=$this->pdata['garden_code'];
        $subject_id=$this->pdata['subject_id'];
        if(!$garden_code || !$subject_id)$this->echoEncrypData(21);
        $city_id=substr($garden_code,0,4);
        $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
        $model=new Model\SubjectModel($province_id,$city_id);
        $model->where(['subject_id'=>$subject_id])->setInc('read_num');
        $mode=new Model\SubjectDynamicsModel($province_id,$city_id,$subject_id);
        $data= $model->getSubjectInfo($subject_id);
        $choise_arr = json_decode($data['choise'],true);
        if($choise_arr){
            foreach($choise_arr as $key => $val){
                $data['choise_votes'][$key]['content']=$val;
                $data['choise_votes'][$key]['num']=0;
            }
        }
        $choiced_arr=$mode->field('choise')->where(['type'=>4,'status'=>1])->select();
        if($choiced_arr){ //统计票数
            foreach($choiced_arr as $k=>$v){
                $choice = json_decode($v['choise'],true);
                foreach($choice as $kk=>$vv){
                    if(array_key_exists($kk,$data['choise_votes'])){
                        $data['choise_votes'][$kk]['num']++;
                    }
                }
            }
        }
        $result =$mode->field('id as commont_id,content,choise,user_code,portrait,nickname,create_time,commont_likes_num')->where('status=1 and (type=1 or type=4)')->order(['create_time'=>'desc'])->select();//展示评论和投票
        $my_likes=$mode->field('commont_id')->where(['status'=>1,'type'=>3,'user_code'=>$this->account_code])->select();//我对评论的点赞
        $my_likes_arr=array();
        if($my_likes){
            foreach($my_likes as $keys=>$value){
                $my_likes_arr[]=$value['commont_id'];
            }
        }
        if($result){
            foreach($result as $kkk=>$vvv){
                if(in_array($vvv['commont_id'],$my_likes_arr)){
                    $result[$kkk]['is_likes']=1;
                }else{
                    $result[$kkk]['is_likes']=0;
                }
            }
        }
        $data['commont_list']=$result;
        $data['is_choised']=$mode->where(['type'=>4,'status'=>1,'user_code'=>$this->account_code])->count()?1:0;
        $data['is_likes']=$mode->where(['type'=>2,'status'=>1,'user_code'=>$this->account_code])->count()?1:0;
        $this->echoEncrypData(0,'',$data);
    }

    /*
     * 评论话题
     * @param garden_code 话题发布所属小区code
     * @param subject subject_id  话题id
     * @param subject content   评论内容
     * */
    protected function addSubjectCommont_v1_0_0(){
        $garden_code = $this->pdata['garden_code'];
        $subject_id = $this->pdata['subject_id'];
        $content  = $this->pdata['content'];
        if(!$garden_code || !$subject_id || !$content)$this->echoEncrypData(21);
        $city_id=substr($garden_code,0,4);
        $table_id=substr($this->account_code,0,4);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
        $model=new Model\SubjectDynamicsModel($province_id,$city_id,$subject_id);
        $userinfo=array(
            'user_code'=>$this->account_code,
            'nickname'=>$res['nickname'],
            'portrait'=>$res['portrait'],
        );
        $res = $model->addSubjectCommont($content,$userinfo);
        if(!$res)$this->echoEncrypData(1);
        $model->execute('update subject_'.$city_id.' set commont_num = commont_num+1 where id='.$subject_id);
        $this->echoEncrypData(0);
    }

    /*
     * 点赞/取消点赞话题
     * @param garden_code 话题发布所属小区code
     * @param subject subject_id  话题id
     * @param is_cancel 是否取消 可填
     * */
    protected function editSubjectLikes_v1_0_0(){
        $garden_code = $this->pdata['garden_code'];
        $subject_id = $this->pdata['subject_id'];
        $is_cancel =$this->pdata['is_cancel'];
        if(!$garden_code || !$subject_id )$this->echoEncrypData(21);
        $city_id=substr($garden_code,0,4);
        $table_id=substr($this->account_code,0,4);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $res['user_code']=$this->account_code;
        $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
        $model=new Model\SubjectDynamicsModel($province_id,$city_id,$subject_id);
        if(!$is_cancel){
            if($model->where(['type'=>2,'user_code'=>$res['user_code'],'status'=>1])->find())$this->echoEncrypData(1,'您已经点过赞了哦');
            $res = $model->addSubjectLikes($res);
            if(!$res)$this->echoEncrypData(1);
            $model->execute('update subject_'.$city_id.' set likes_num = likes_num +1 where id = '.$subject_id);
            $this->echoEncrypData(0);
        }else{
            if(!$model->where(['type'=>2,'user_code'=>$res['user_code'],'status'=>1])->find())$this->echoEncrypData(1,'您还没有点赞哦');
            $res = $model->cancelSubjectLikes($this->account_code);
            if(!$res)$this->echoEncrypData(1);
            $model->execute('update subject_'.$city_id.' set likes_num = likes_num -1 where id = '.$subject_id);
            $this->echoEncrypData(0);
        }
    }

    /*
    * 点赞/取消点赞话题评论
    * @param garden_code 话题发布所属小区code
    * @param subject subject_id  话题id
    *@param commont_id  评论id
    * @param is_cancel 是否取消 可填
    * */
    protected function editSubjectCommontLikes_v1_0_0(){
        $garden_code= $this->pdata['garden_code'];
        $subject_id= $this->pdata['subject_id'];
        $commont_id= $this->pdata['commont_id'];
        $is_cancel= $this->pdata['is_cancel'];
        if(!$garden_code || !$subject_id || !$commont_id)$this->echoEncrypData(21);
        $city_id=substr($garden_code,0,4);
        $table_id=substr($this->account_code,0,4);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $res['user_code']=$this->account_code;
        $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
        $model=new Model\SubjectDynamicsModel($province_id,$city_id,$subject_id);
        if(!$is_cancel){
            if($model->where(['type'=>3,'user_code'=>$res['user_code'],'status'=>1,'commont_id'=>$commont_id])->find())$this->echoEncrypData(1,'您已经点过赞了哦');
            $res = $model->addSubjectCommontLikes($commont_id,$res);
            if(!$res)$this->echoEncrypData(1);
            $model->execute('update subject_dynamics_'.$city_id.'_'.$subject_id.' set commont_likes_num =commont_likes_num+1 where id='.$commont_id);
            $this->echoEncrypData(0);
        }else{
            if(!$model->where(['type'=>3,'user_code'=>$res['user_code'],'status'=>1,'commont_id'=>$commont_id])->find())$this->echoEncrypData(1,'您还没有点赞哦');
            $res = $model->cancelSubjectCommontLikes($commont_id,$this->account_code);
            if(!$res)$this->echoEncrypData(1);
            $model->execute('update subject_dynamics_'.$city_id.'_'.$subject_id.' set commont_likes_num =commont_likes_num-1 where id='.$commont_id);
            $this->echoEncrypData(0);
        }
    }

    /*
    * 删除评论
    * @param garden_code 话题发布所属小区code
    * @param subject_id  话题id
    *@param commont_id  评论id
    * */
    protected function delSubjectCommont_v1_0_0(){
        $garden_code=$this->pdata['garden_code'];
        $subject_id=$this->pdata['subject_id'];
        $commont_id=$this->pdata['commont_id'];
        if(!$garden_code || !$subject_id || !$commont_id)$this->echoEncrypData(21);
        $city_id=substr($garden_code,0,4);
        $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
        $model=new Model\SubjectDynamicsModel($province_id,$city_id,$subject_id);
        $user_code=$model->getSubjectCommontC($commont_id);
        if($user_code !==$this->account_code)$this->echoEncrypData(500);
        $res = $model->delSubjectCommont($commont_id);
        if(is_numeric($res))$this->echoEncrypData($res);
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }
    /*
     * 话题投票
     * @param garden_code 话题发布所属小区code
     * @param subject_id  话题id
     * @param choise 投票选项 json
     * @param content 内容
     * */
    protected function addSubjectVote_v1_0_0(){
        $garden_code=$this->pdata['garden_code'];
        $subject_id=$this->pdata['subject_id'];
        $choise=$this->pdata['choise'];
        $content=$this->pdata['content'];
        if(!$garden_code || !$subject_id || !$choise || !$content)$this->echoEncrypData(21);
        $city_id=substr($garden_code,0,4);
        $table_id=substr($this->account_code,0,4);
        $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
        $model=new Model\SubjectDynamicsModel($province_id,$city_id,$subject_id);
        $userinfo = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $userinfo['user_code']=$this->account_code;
        if($model->where(['type'=>4,'status'=>1,'user_code'=>$this->account_code])->count())$this->echoEncrypData(1,'您已经参与过该投票了，无需重复操作');
        $res = $model->addSubjectVote($userinfo,$choise,$content);
        if(!$res )$this->echoEncrypData(1);
        $mode=new Model\SubjectModel($province_id,$city_id);
        $mode->where(['subject_id'=>$subject_id])->setInc('total_votes');
        $this->echoEncrypData(0);
    }
    /*
     * 我的话题
     * */
    protected function mySubejct_v1_0_0(){
        $account_code=$this->account_code;
        $my_subject=new Model\MySubjectModel($account_code);
        $subject_arr=$my_subject->getMysubject();
       if(!$subject_arr)$this->echoEncrypData(5);
       $subject_list=array();
       foreach($subject_arr as $k =>$v){
           $garden_code=$v['garden_code'];
           $city_id=substr($garden_code,0,4);
           $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
           $subject=new Model\SubjectModel($province_id,$city_id);
           $subject=$subject->getUserSubject($account_code,$garden_code);
            if($subject){
                foreach($subject as $key=>$val){
                    $subject_list[]=$val;
                }
            }
       }
      if(!$subject_list)$this->echoEncrypData(5);
        $this->echoEncrypData(0,'',$subject_list);
    }
    /*
     * 添加广告
     *@param city_id 城市id
     *@param garden_code 小区code 可填
     *@param title 标题
     *@param content 内容
     * */
    protected function addAd_v1_0_0(){
        $city_id=$this->pdata['city_id'];
        $garden_code=$this->pdata['garden_code'];
        $title=$this->pdata['title'];
        $content=$this->pdata['content'];
        if(!$city_id || !$title || !$content)$this->echoEncrypData(21);
        $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
        $table_id=substr($this->account_code,0,4);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $data=array(
            'title'=>$title,
            'content'=>$content,
            'user_code'=>$this->account_code,
            'portrait'=>$res['portrait'],
            'nickname'=>$res['nickname'],
            'create_time'=>time(),
        );
        if($garden_code){
            $data['garden_code']=$garden_code;
        }else{
            $data['is_public']=2;
        }
        $adverse=new Model\AdeverseModel($province_id,$city_id);
        $res= $adverse->addAdverse($data);
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }
    /*
     * 删除广告
     *@param city_id 城市id
     *@param  adverse_id 广告id
     * */
    protected function delAd_v1_0_0(){
        $city_id=$this->pdata['city_id'];
        $adverse_id=$this->pdata['adverse_id'];
        if(!$city_id || !$adverse_id)$this->echoEncrypData(21);
        $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
        $adverse=new Model\AdeverseModel($province_id,$city_id);
        $user_code = $adverse->getAdverseC($adverse_id);
        if(!$user_code)$this->echoEncrypData(1);
        if($user_code !== $this->account_code)$this->echoEncrypData(500);
        $res = $adverse->delAdverse($adverse_id);
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }

    /*
     * 广告列表
     *@param city_id 城市id
     *@param garden_code 小区code 可填
     * */
    protected function getAdList_v1_0_0(){
        $city_id=$this->pdata['city_id'];
        $garden_code=$this->pdata['garden_code'];
        if(!$city_id)$this->echoEncrypData(21);
        $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
        $adverse=new Model\AdeverseModel($province_id,$city_id);
        $data = $adverse->getAdverseList($city_id,$garden_code);
        if(!$data)$this->echoEncrypData(5);
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 我的广告列表
     * @param city_id 城市id
     * @param garden_code 小区code 可填
     * */
    protected function getMyAdList_v1_0_0(){
        $city_id=$this->pdata['city_id'];
        $garden_code=$this->pdata['garden_code'];
        if(!$city_id)$this->echoEncrypData(21);
        $province_id=M('baseinfo.swf_area')->where(['id'=>$city_id])->getField('parent_id');
        $adverse=new Model\AdeverseModel($province_id,$city_id);
        $data = $adverse->getMyAdverseList($city_id,$this->account_code,$garden_code);
        if(!$data)$this->echoEncrypData(5);
        $this->echoEncrypData(0,'',$data);
    }
}