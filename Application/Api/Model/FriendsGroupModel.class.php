<?php
/**
 * 好友 与 群
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/7
 * Time: 17:24
 */

namespace Api\Model;
use Think\Model;

class FriendsGroupModel extends Model
{
    public function __construct( $account_code )
{
    $this->name = 'friends_group';
    $this->connection = C('DB_USER_FRIENDS').$account_code;
    $this->db(0,$this->connection,true);
    $this->account_code = $account_code;
}

    /*
     * 获取用户好友分组
     * */
    public function getGroup(){
        $data = $this->order('id asc')->select();
        return $data;
    }
    /*
     * 添加好友分组
     * @param group_name 分组名称
     * */
    public function addGroup($group_name){
        if(!trim($group_name)){
            return 21;
        }
        $data=array(
            'user_code'=>$this->account_code,
            'group_name' =>$group_name,
            'status'    =>1
        );
        $res = $this->add($data);
        if(!$res){
            return 1;
        }
        return 0;
    }
    /*
     * 删除好友分组
     * @param group_id 分组id
     * */
    public function delGroup($group_id){
        if(!trim($group_id)){
            return 21;
        }
       $res = $this->where(['id'=>$group_id])->getField('id');
        if(!$res){
            return 300;
        }
        $result =$this->where(['id'=>$res])->delete();
        if(!$result){
            return 1;
        }
        return 0;
    }

    /*
     * 修改分组名称
     * @param group_id 分组id
     * @param group_name 新分组名称
     * */
    public function editGroup($group_id,$group_name){
        if(!trim($group_id || !trim($group_name))){
            return 21;
        }
        $res = $this->where(['id'=>$group_id])->getField('id');
        if(!$res){
            return 300;
        }
        $result =$this->where(['id'=>$res])->save(['group_name'=>$group_name]);
        if($result === false){
            return 1;
        }
        return 0;
    }

    /*
     * 判断用户有无该分组
     * @param group_id 分组id
     * */
    public function groupExists($group_id){
        $res= $this->where(['group_id'=>$group_id])->find();
        $result= $res ? true: false;
        return $result;
    }
}