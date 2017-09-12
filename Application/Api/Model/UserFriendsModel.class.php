<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/8
 * Time: 9:43
 */

namespace Api\Model;
use Think\Model;

class UserFriendsModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'user_friends';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
        $this->account_code = $account_code;
    }

    /*
     * 获取每个分组下总人数以及在线人数
     * */
    public function getFriendsNum(){
        $data = $this->query('select group_id,count(*) as total from user_friends group by group_id');
        if($data){
            foreach($data as $k=>$v){
                $v['friend_user'] = $this->query('select friend_user_code from user_friends where group_id='. $v['group_id']);
                if($v['friend_user']){
                    $online=0;
                    foreach($v['friend_user'] as $key => $val){
                        $table_id = substr($val['friend_user_code'],0,4);
                        $val['is_online'] = M('baseinfo.user_info_'.$table_id)->where(['account_code'=>$val['friend_user_code']])->getField('is_online');
                        if( $val['is_online'] == 1){
                            $online = $online+1;
                        }
                        $v['online_num']=$online;
                        $v['friend_user'][$key] =$val;
                    }
                }
                unset($v['friend_user']);
                $data[$k]=$v;
            }
        }
        return $data;
    }

    /*
     * 删除分组后把该分组下的好友全部设置为默认分组
     * @param group_id 分组id
     * */
    public function resetUserGroup($group_id){
        if(!trim($group_id)){
            return false;
        }
        $res = $this->where(['group_id' =>$group_id])->save(['group_id'=>1]);
        if($res === fasle){
            return false;
        }
        return true;
    }
    /*
     * 根据分组id获取分组内的好友信息
     * @param group_id 分组id
     * */
    public function getGroupFriends($group_id){
        $account = $this->account_code;
        $FriendsGroup=new FriendsGroupModel($account);
        if(!$FriendsGroup->groupExists($group_id)){
            return false;
        }
        $res = $this->field('friend_user_code,friend_nickname,friend_portrait,friend_signature,group_id')->where(['group_id' =>$group_id])->select();
        foreach($res as $k =>$v){
            $res[$k]['is_online'] = $this->is_online($v['friend_user_code']);
        }
        return $res;
    }

    /*
     * 搜索好友
     * @param key 关键词
     * */
    public function searchFriends($key){
        $data =$this->field('friend_user_code,friend_nickname,friend_portrait,friend_signature')->where("friend_user_code like '%".$key."%'  or friend_nickname like '%".$key."%'")->select();
        if(!$data){
            return false;
        }else{
            return $data;
        }
    }
    /*
     * 添加好友
     * @param data 拼接好的添加数据
     * */
    public function addFriends($data){
        if($this->is_myFriend($data['friend_user_code'])){
            return 304;
        }
        $res = $this->add($data);
        if(!$res){
            return false;
        }else{
            return true;
        }
    }
    /*
     *判断某一用户是否在线
     * @param account_code 用户code
     * */
    public function is_online($account_code){
        $table_id = substr($account_code,0,4);
        $res = M('baseinfo.user_info_'.$table_id)->where(['account_code'=>$account_code])->getField('is_online');
        return $res;
    }
    /*
     * 判断是否是我的好友
     * @param friend_user_code 判断对象的code
     * */
    public function is_myFriend($friend_user_code){
        $res = $this->where(['friend_user_code' => $friend_user_code])->count();
        if(!$res){
            return false;
        }else{
            return true;
        }
    }


}