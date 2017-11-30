<?php
/**
 * 用户好友
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/7
 * Time: 17:20
 */

namespace Api\Controller;
use Api\Model;
use think\Exception;

class FriendsController extends VersionController
{
    /*
     *查询好友分组以及分组下人数
     * */
    public function getGroup_v1_0_0(){
        $account_code = $this->account_code;
        $model = new Model\FriendsGroupModel($account_code);
        $data1 = $model->getGroup();
        $model = new Model\UserFriendsModel($account_code);
        $data2 = $model->getFriendsNum();
        if($data1){
            foreach ($data1 as $k=>$v){
                $v['total']=0;
                $v['friend_user']=array();
                if($data2){
                    foreach ($data2 as $key =>$val){
                        if(intval($v['id'])===intval($val['group_id'])){
                            $v['total']=$val['total'];
                            $v['friend_user']=$val['friend_user'];
                        }
                    }
                }
                $data1[$k]=$v;
            }
        }
        $this->echoEncrypData(0,'',$data1);

    }
    /*
     * 添加好友分组
     * @param group_name 分组名称
     * */
    protected function addGroup_v1_0_0(){
        $group_name=$this->pdata['group_name'];
        $account_code = $this->account_code;
        $model = new Model\FriendsGroupModel($account_code);
        $count = $model->where(['group_name'=>$this->pdata['group_name'],'status'=>1])->count();
        if($count)$this->echoEncrypData(1,'该分组名称已经存在了哦');
        $code = $model->addGroup($group_name);
        $this->echoEncrypData($code);
    }
    /*
     * 删除好友分组
     * @param group_id 分组id
     * */
    protected function delGroup_v1_0_0(){
        $group_id=$this->pdata['group_id'];
        if($group_id ==1 ){
            $this->echoEncrypData(1,'该分组不允许删除');
        }
        $account_code = $this->account_code;
        $model = new Model\FriendsGroupModel($account_code);
        $model2 = new Model\UserFriendsModel($account_code);
        $res=$model2->resetUserGroup($group_id);
        if($res){
            $code = $model->delGroup($group_id);
            $this->echoEncrypData($code);
        }
        $this->echoEncrypData(1,'操作失败，请稍后重试');
    }
    /*
     * 修改好友分组
      * @param group_id 分组id
     * @param group_name 新分组名称
     * */
    protected function editGroup_v1_0_0(){
        $this->checkParam(array('group_id','group_name'));
        $group_id=$this->pdata['group_id'];
        if($group_id ==1 ){
            $this->echoEncrypData(1,'该分组不允许修改');
        }
        $group_name=$this->pdata['group_name'];
        $account_code = $this->account_code;
        $model = new Model\FriendsGroupModel($account_code);
        $code = $model->editGroup($group_id,$group_name);
        $this->echoEncrypData($code);
    }
    /*
     * 设置个人资料页隐藏信息
     * @param hide_field 隐藏字段名  多个字段名用逗号隔开列入 signature,hobby,birth_year,birth_month
     * */
    protected function settingHideField_v1_0_0(){
        $hide_field = $this->pdata['hide_field'];
        $account_code = $this->account_code;
        $mongo = new \MongoClient();
        $table_id= $mongo->baseinfo->user_area->findOne(array('accoun_code'=>$account_code))['table_id'];
        $res = M('baseinfo.user_info_'.$table_id)->where(['account_code'=>$account_code])->save(['hide_field'=>$hide_field]);
        if($res!==false){
            $this->echoEncrypData(0);
        }else{
            $this->echoEncrypData(1);
        }
    }
    /*
     * 获取用户详情
     * @param user_code 用户code
     * */
    protected function getFriendInfo_v1_0_0(){
        $this->checkParam(array('user_code'));
        $account_code = $this->account_code;
        $user_code = $this->pdata['user_code'];
        //1.验证是否是用户自己或者好友
        $user_friends  =new Model\UserFriendsModel($account_code);
        if($user_code !== $account_code){
            $count = $user_friends->where(['friend_user_code'=>$user_code])->count();
            if(!$count)$this->echoEncrypData(1,'该用户不是您的好友');
        }
        $user_city_id = substr($user_code,0,6);
        $data  = M('baseinfo.user_info_'.$user_city_id)->field('portrait,nickname,account,realname,default_garden,phone,create_time,hobby,user_garden,hide_field')->where(['account_code'=>$user_code])->find();
        if($data){
            $data['group_id']= $user_friends->where(['friend_user_code'=>$user_code])->getField('group_id');
            $mongo = new \MongoClient();
            if($data['user_garden']){
                $arr = explode(';',$data['user_garden']);
                $garden_arr = array();
                foreach ($arr as $item) {
                    $arr = explode(',',$item);
                    $garden_arr[] =$arr[0];
                }
                $garden_arr=array_unique($garden_arr);
                foreach($garden_arr as $value){
                    $re_data[] = $mongo->baseinfo->garden_area->findOne(array('garden_code'=>$value))['garden_name'];
                }
                $data['user_garden'] = $re_data;
            }
        }
        if($this->account_code !==$user_code){
            if($data['hide_field']){
                $arr = explode(',',$data['hide_field']);
                foreach ($data as $k=>$v){
                    if(in_array($k,$arr)){
                        $data[$k]='用户隐藏了该信息';
                    }
                }
            }
        }
        if($data)$this->echoEncrypData(0,'',$data);
        $this->echoEncrypData(1);
    }
    /*
     * 更改好友所属分组
     * @param user_code 好友code
     * @param group_id 分组id
     * */
    protected function changeFriendGroup_v1_0_0(){
        $this->checkParam(array('user_code','group_id'));
        $account_code = $this->account_code;
        $user_code =$this->pdata['user_code'];
        $group_id = $this->pdata['group_id'];
       $user_friends = new Model\UserFriendsModel($account_code);
       $old_group_id = $user_friends->where(['friends_user_code'=>$user_code])->getField('group_id');
       if(intval($old_group_id) ===intval($group_id))$this->echoEncrypData(1,'不能移动到相同分组下');
       $res = $user_friends->where(['friend_user_code'=>$user_code])->save(['group_id'=>$group_id]);
       if($res)$this->echoEncrypData(0);
       $this->echoEncrypData(1);
    }
    /*
    *更新好友信息
    * @param user_code 用户code
    * */
    protected function updateFriendsInfo_v1_0_0()
    {
        $this->checkParam(array('user_code'));
        $user_city_id = substr($this->pdata['user_code'], 0, 6);
        $account_code = $this->account_code;
        $user_info = M('baseinfo.user_info_' . $user_city_id)->field('nickname,portrait,signature')->where(['account_code' => $this->pdata['user_code']])->find();
        $model = new Model\UserFriendsModel($account_code);
        $res = $model->where(['friend_user_code'=>$this->pdata['user_code']])->save(['friend_nickname'=>$user_info['nickname'],'friend_portrait'=>$user_info['portrait'],'friend_signature'=>$user_info['signature']]);
        if($res)$this->echoEncrypData(0);
        $this->echoEncrypData(1);
    }
    /*
     * 获取分组下的好友信息
     *@parma group_id 分组id
     * */
    protected function getGroupFriends_v1_0_0(){
        $group_id = $this->pdata['group_id'];
        if(!trim($group_id)){
            $this->echoEncrypData(21);
        }
        $account_code = $this->account_code;
        $model =new Model\UserFriendsModel($account_code);
        $data=$model->getGroupFriends($group_id);
        if(is_numeric($data)){
            $this->echoEncrypData($data);
        }else{
            $this->echoEncrypData(0,'',$data);
        }
    }

    /*
     * 搜索好友
     * @param key 关键词
     * */
    protected function searchFriends_v1_0_0(){
        $key=$this->pdata['key'];
        if(!trim($key)){
            $this->echoEncrypData(21);
        }
        $account_code = $this->account_code;
        $model =new Model\UserFriendsModel($account_code);
        $data=$model->searchFriends($key);
        if(!$data){
            $this->echoEncrypData(301);
        }else{
            $this->echoEncrypData(0,'',$data);
        }
    }

    /*
     * 添加好友
     * @param account_code 用户code
     * @param group_id 分组id
     * */
    protected function addFriend_v1_0_0(){
        $account_code=$this->pdata['account_code'];
        $group_id=intval($this->pdata['group_id']);
        if(!trim($account_code) || !trim($group_id)){
            $this->echoEncrypData(21);
        }
        if($account_code === $this->account_code){
            $this->echoEncrypData(303);
        }
        $table_id=substr($account_code,0,6);
        $data1=M('baseinfo.user_info_'.$table_id)->field('account_code as friend_user_code , nickname as friend_nickname , portrait as friend_portrait , signature as friend_signature')->where(['account_code'=>$account_code])->find();
        if(!$data1){
            $this->echoEncrypData(302);
        }else{
            $data1['group_id'] =$group_id;
            $account=$this->account_code;
            $table_id2=substr($account,0,6);
            $data2 = M('baseinfo.user_info_'.$table_id2)->field('account_code as user_code , nickname ,portrait,signature')->where(['account_code'=>$account])->find();
            $data = array_merge($data1,$data2);
        }
        $redata['user_code'] = $data['friend_user_code'];
        $redata['nickname'] = $data['friend_nickname'];
        $redata['portrait'] = $data['friend_portrait'];
        $redata['friend_user_code'] = $data['user_code'];
        $redata['friend_nickname'] = $data['nickname'];
        $redata['friend_portrait'] = $data['portrait'];
        $redata['group_id'] = 1;
        $redata['friend_signature'] = $data['signature'];
        $model1=new Model\UserFriendsModel($account);
        $model1->startTrans();
        $res1 =$model1->addFriends($data);
        $model2 =new Model\UserFriendsModel($account_code); // 好友的好友表添加我的数据
        $model2->startTrans();
        $res2 =$model2->addFriends($redata);
        if(!$res1 || !$res2){
            $model1->rollback();
            $model2->rollback();
            $this->echoEncrypData(1,'添加好友失败,请重试');
        }else{
            if(is_numeric($res1)){
                $this->echoEncrypData($res1);
            }
            if(is_numeric($res2)){
                $this->echoEncrypData($res2);
            }
            $model1->commit();
            $model2->commit();
            $this->echoEncrypData(0);
        }
    }
    /*
     * 删除好友
     * @param user_code 删除好友code
     * */
    protected function delFriend_v1_0_0(){
        $this->checkParam(array('user_code'));
        $account_code = $this->account_code;
        $user_code = $this->pdata['user_code'];
        $user_friends1 = new Model\UserFriendsModel($account_code);// 操作人分表
        $user_friends2 = new Model\UserFriendsModel($user_code);//好友分表
        $offline_user_message1 = new Model\OfflineUserMessageModel($account_code); //操作人离线消息表
        $offline_user_message2 = new Model\OfflineUserMessageModel($user_code); //好友离线消息表
        $user_friends1->startTrans();
        $user_friends2->startTrans();
        $offline_user_message1->startTrans();
        $offline_user_message2->startTrans();
        $res1 = $user_friends1->where(['friend_user_code'=>$user_code])->delete();
        $res2 = $user_friends2->where(['friend_user_code'=>$account_code])->delete();
        $res3 = $offline_user_message1->where(['sender_code'=>$user_code])->delete();
        $res4 = $offline_user_message2->where(['sender-code'=>$account_code])->delete();
        $mongo = new \MongoClient();
        if(($res1 !==false) and ($res2 !==false) and ($res3!==false) and ($res3!==false)){
            $user_friends1->commit();
            $user_friends2->commit();
            $offline_user_message1->commit();
            $offline_user_message2->commit();
            $user_info1 = 'user_info_'.$account_code;
            $user_info2 = 'user_info_'.$user_code;
            $mongo->$user_info1->friends_chat->remove(array('or'=>array('sender_code'=>$user_code,'getter_code'=>$user_code)));//清除聊天记录
            $mongo->$user_info2->friends_chat->remove(array('or'=>array('sender_code'=>$account_code,'getter_code'=>$account_code)));
            $this->echoEncrypData(0);
        }else{
            $user_friends1->rollback();
            $user_friends2->rollback();
            $offline_user_message1->rollback();
            $offline_user_message2->rollback();
            $this->echoEncrypData(1);
        }
    }

    /*
     * 按账号搜索用户
     * @param account 用户账号
     * */
    protected function searchUserCode_v1_0_0(){
        $user_code = $this->pdata['account'];
        if(!$user_code){
            $this->echoEncrypData(21);
        }
        $mongo = new \MongoClient();
        $data = $mongo->baseinfo->user_area->findOne(array('account'=>$user_code),array('table_id'));
//        $data = M('baseinfo.user_area')->where('account ='.$user_code)->getField('table_id');
        if(!$data){
            $this->echoEncrypData(1,'该用户不存在');
        }
        $data =$data['table_id'];
        $res=M('user_info_'.$data)->field('account,account_code,signature,portrait,nickname')->where('account ='.$user_code)->find();
        if(!$res){
            $this->echoEncrypData(1,'该用户不存在');
        }
        $this->echoEncrypData(0,'',$res);
    }


    /*
     * 高级搜索
     * @param area_id 区域id  可填 不填默认用户注册地
     * @param min_age   最小年龄 可填
     * @param max_age  最大年龄  可填
     * @param sex 性别  可填  0：保密 1：男 2：女
     * */
    protected function searchUser_v1_0_0(){
        $area_id=$this->pdata['area_id'];
        $min_age=$this->pdata['min_age'];
        $max_age=$this->pdata['max_age'];
        $sex=intval($this->pdata['sex']);
        if(!$area_id){
            $area_id = substr($this->account_code,0,6);
        }
        $map = array();
        if($min_age){
            $map['age'] =array('EGT',$min_age);
        }
        if($max_age){
            $map['age'] =array('ELT',$max_age);
        }
        if($sex){
            $map['sex'] = $sex;
        }
        try{
            $data=M('user_info_'.$area_id)->field('account,account_code,signature,portrait,nickname')->where($map)->select();
            if(!$data){
                $this->echoEncrypData(1,'未找到符合条件的用户');
            }else{
                $this->echoEncrypData(0,'',$data);
            }
        }catch (Exception $e){
            $this->echoEncrypData(1,'未找到符合条件的用户');
        }

    }
    /*
     * 获取所有好友
     * */
    protected function getAllFriends_v1_0_0(){
        $account_code = $this->account_code;
        $model = new Model\UserFriendsModel($this->account_code);
        $data = $model->select();
        if($data){
            $this->echoEncrypData(0,'',$data);
        }
        $this->echoEncrypData(5);
    }

}