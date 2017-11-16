<?php
/**
 * 群投票
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/15
 * Time: 17:21
 */

namespace Api\Model;
use Think\Model;

class GroupVoteModel extends Model
{
    public function __construct( $account_code )
    {
        $this->name = 'group_vote';
        $this->connection = C('DB_USER_FRIENDS').$account_code;
        $this->db(0,$this->connection,true);
    }

    /*
     * 发布群投票
     * @param data 投票数据
     * */
    public function addGroupVote($data){
        $res = $this->add($data);
        if(!$res){
            return false;
        }
        return true;
    }

    /*
     * 删除投票
     * @param group_num 群号码
     * @param vote_id  投票id
     * */
    public function delGroupVote($group_num,$vote_id){
        $res = $this->where(['group_num'=>$group_num,'id'=>$vote_id])->delete();
        if(!$res){
            return false;
        }
        return true;
    }

    /*
     * 获取群投票列表
     * @param group_num 群号码
     * */
    public function getVoteList($group_num){
        $res= $this->field('id as vote_id,title,content,picture,create_time,end_time,group_num,user_code,nickname,portrait,total_user')->where(['group_num'=>$group_num])->order('create_time desc')->select();
        if(!$res)return 5;
        return $res;
    }

    /*
     * 获取某一投票详情
     * @param vote_id 投票id
     * */
    public function getVoteInfo($vote_id){
        $res =$this->field('id as vote_id,title,content,picture,choice,create_time,end_time,group_num,user_code,nickname,portrait,anonymous,type,total_user')->where(['id'=>$vote_id])->find();
        if(!$res)return false;
        return $res;
    }

}