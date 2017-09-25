<?php
/**
 * 话题动态
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/22
 * Time: 9:05
 */

namespace Api\Model;
use Think\Model;

class SubjectDynamicsModel extends Model
{
    public function __construct($province_id,$city_id,$subject_id )
    {
        $this->name = 'subject_dynamics_'.$city_id.'_'.$subject_id;
        $this->connection = C('DB_GARDEN').$province_id;
        $this->db(0,$this->connection,true);
        $this->subject_id=$subject_id;
    }
    /*
     * 添加话题评论
     * @param content 评论内容
     * @param userinfo 用户信息
     * */
    public function addSubjectCommont($content,$userinfo){
        $data=array(
            'type'=>1,
            'content'=>$content,
            'user_code'=>$userinfo['user_code'],
            'nickname'=>$userinfo['nickname'],
            'portrait'=>$userinfo['portrait'],
            'create_time'=>time(),
        );
        $res = $this->add($data);
        if(!$res)return false;
        return $res;
    }
    /*
     * 获取评论创建人code
     * @param commont_id 评论id
     * */
        public function getSubjectCommontC($commont_id){
            $res= $this->where(['id'=>$commont_id,'type'=>1])->getField('user_code');
            if(!$res)return false;
            return $res;
        }


    /*
     * 删除评论
     *@param commont_id 评论id
     * */
    public function delSubjectCommont($commont_id){
        $type= $this->where(['id'=>$commont_id])->getField('type');
        if(intval($type) !== 1){
            return 600;
        }
        $res = $this->where(['id'=>$commont_id])->delete();
        if(!$res)return false;
        //删除评论点赞
        $this->where(['type'=>3,'commont_id'=>$commont_id])->delete();
        return true;
    }


    /*
     * 话题投票
     * @param userinfo用户信息
     * @param choise 选项
     * */
    public function addSubjectVote($userinfo,$choise,$content){
        $data=array(
            'type'=>4,
            'choise'=>$choise,
            'content'=>$content,
            'user_code'=>$userinfo['user_code'],
            'portrait'=>$userinfo['portrait'],
            'nickname'=>$userinfo['nickname'],
            'create_time'=>time(),
        );
        $res=$this->add($data);
        if(!$res)return false;
        return $res;
    }

    /*
     * 话题点赞
     * @param userinfo 用户信息
     * */
    public function addSubjectLikes($userinfo){
        $data=array(
            'type'=>2,
            'user_code'=>$userinfo['user_code'],
            'nickname'=>$userinfo['nickname'],
            'portrait'=>$userinfo['portrait'],
            'create_time'=>time(),
        );
        $res = $this->add($data);
        if(!$res) return false;
        return $res;
    }

    /*
     * 取消话题点赞
     * @param user_code 用户code
     * */
    public function cancelSubjectLikes($user_code){
        $res = $this->where(['user_code'=>$user_code,'type'=>2])->save(['status'=>0]);
        if(!$res)return false;
        return $res;
    }
    /*
   * 话题评论点赞
   * @param userinfo 用户信息
   * */
    public function addSubjectCommontLikes($commont_id,$userinfo){
        $data=array(
            'type'=>3,
            'user_code'=>$userinfo['user_code'],
            'nickname'=>$userinfo['nickname'],
            'portrait'=>$userinfo['portrait'],
            'commont_id'=>$commont_id,
            'create_time'=>time(),
        );
        $res = $this->add($data);
        if(!$res) return false;
        return $res;
    }
    /*
     * 取消评论点赞
     * @param user_code 用户code
     * */
    public function cancelSubjectCommontLikes($commont_id,$user_code){
        $res = $this->where(['user_code'=>$user_code,'type'=>3,'commont_id'=>$commont_id])->save(['status'=>0]);
        if(!$res)return false;
        return $res;
    }


}