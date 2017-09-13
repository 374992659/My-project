<?php
/**
 * 用户群
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/8
 * Time: 18:19
 */

namespace Api\Controller;
use Api\Model;


class GroupController extends VersionController
{
    /*
     * 获取群分类列表
     * */
    protected function getGroupType_v1_0_0(){
        $data = M('baseinfo.group_type')->where(['status' =>1])->select();
        if(!$data){
            $this->echoEncrypData(1,'暂无数据');
        }else{
            $this->echoEncrypData(0,'',$data);
        }
    }
     /*
      * 创建群
      * @param group_name 群名称
      * @param group_portrait 群头像
      * @param group_type  群分类id
      * */
    protected function addGroup_v1_0_0(){
        $group_name = $this->pdata['group_name'] ;
        $group_portrait = $this->pdata['group_portrait'] ;
        $group_type = $this->pdata['group_type'] ;
        if(!$group_name || !$group_portrait || !$group_type) $this->echoEncrypData(21);
        $group_num = $this->createGroupCode();
        if(!$group_num) $this->echoEncrypData(1,'群创建失败，请重试');
        $table_id=substr($this->account_code,0,4);
        $group_code=$table_id.$group_num;
       $data=array(
            'group_num'=>$group_num,
            'group_code'=>$group_code,
            'table_id'=>$table_id,
            'user_code'=>$this->account_code
       );
       $count = M('baseinfo.group_area')->where(['user_code'=>$this->account_code])->count();
       if(intval($count) >= 5){
           $this->echoEncrypData(305);
       }
        $res1 = M('baseinfo.group_area')->add($data);
        $mode = new Model\UserGroupModel($this->account_code);
        $res2 =$mode->addGroup($group_name,$group_portrait,$group_code,$group_num,1,$group_type);   //role角色id
        $data = M('baseinfo.user_info_'.$table_id)->field(['nickname,portrait'])->where(['sccount_code'=>$this->account_code])->find();
        $user_code = $this->account_code;
        $nickname = $data['nickname'];
        $portrait = $data['portrait'];
        $model = new Model\GroupUserModel($this->account_code);
        $res3 = $model->addUser($group_code,$group_num,$group_name,$group_portrait,$user_code,$nickname,$portrait,1);
        if($res1 && $res2 && $res3)$this->echoEncrypData(0);
        $this->echoEncrypData(1);
    }
    /*
   * 上传群头像
   * */
    protected function uploadGroupP_v1_0_0(){
        if(!$_FILES){
            $this->echoEncrypData(306);
        }
        import('Vendor.UploadFile');
        $model = new \UploadFile();
        $save_path= APP_PATH.'Common/Upload/Img/GroupPortrait/'.date(m).date(d).'/';
        $res = $model->upload($save_path);
        if(!$res){
            $this->echoEncrypData(1,'图片上传失败');
        }
        foreach($res as $k=>$v){
            $data['file_path'][]=$res[$k]['savepath'].$res[$k]['savename'];
        }
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 获取我所在的群信息
     * @param value 需要获取的群类型 1:我创建的群 2：我管理的群  3.我加入的群（普通身份）
     * */
    protected function getMyGroup_v1_0_0(){
        $value = $this->pdata['value'];
        if(!$value) $this->echoEncrypData(21);
        $value = intval($value);
        if(!in_array($value,array(1,2,3))) $this->echoEncrypData(2);
        switch ($value) {
            case 1:$role = 1;break;
            case 2:$role = 2;break;
            case 3:$role = 3;break;
        }
        $model = new Model\UserGroupModel($this->account_code);
        $field='group_name,group_portrait,group_code,group_num,group_type,role';
        $res = $model->getGroup($field,$role);
        if($res == 1){
            $this->echoEncrypData(5);
        }
        $this->echoEncrypData(0,'',$res);
    }
    /*
     *获取群内用户
     * @param group_num 群号码
     * */
    protected function getGroupUser_v1_0_0(){
        $group_num=$this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
        $res = M('baseinfo.group_area')->field('group_code,user_code')->where(['group_num'=>$group_num])->find();
        if(!$res)$this->echoEncrypData(1,'未获取到群信息');
        $model = new Model\GroupUserModel($res['user_code']);
        $data=$model->getGroupUser($res['group_code']);
        if(is_numeric($data)){
            $this->echoEncrypData($data);
        }
        $this->echoEncrypData(0,'',$data);
    }

   /*
    * 添加群公告
    * @param title 公告标题
    * @param content 公告内容
    * @param portrait  公告图片 可填
    * @param group_num 所属群号码
    * */
    protected function addGroupNotice_v1_0_0(){
        $title = $this->pdata['title'];
        $content = $this->pdata['content'];
        $portrait = $this->pdata['portrait'];
        $user_code = $this->account_code;
        $group_num = $this->pdata['group_num'];
        if(!$title || !$content  || !$user_code  || !$group_num)$this->echoEncrypData(21);
        //查看用户是否是该群管理员或者创建人
        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $mode=new Model\GroupUserModel($create_code);
        $role = $mode->getUserRole($group_num,$this->account_code);
        if(!$role)$this->echoEncrypData(1);
        $role = intval($role);
        if($role !==1 && $role !==2 ){
            $this->echoEncrypData(307);
        }
        $model=new Model\GroupNoticeModel($create_code);
        $res = $model->addGroupNotice($title,$content,$portrait,$user_code,$group_num);
        if(!$res){
            $this->echoEncrypData(1);
        }
        $this->echoEncrypData(0);
    }

    /*
     * 获取群公告
     * @param group_num 所属群号码
     * */
    protected function getGroupNotice_v1_0_0(){
        $group_num = $this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $model=new Model\GroupNoticeModel($create_code);
        $res = $model->getGroupNotice($group_num);
        if(!$res) $this->echoEncrypData(5);
        $this->echoEncrypData(0,'',$res);
    }
    /*
     * 删除群公告
     * @param group_num 群号码
     * @param id 群公告id
     * */
    protected function delGroupNotice_v1_0_0(){
        $group_num=$this->pdata['group_num'];
        $id=$this->pdata['id'];
        if(!$id ||!$group_num)$this->echoEncrypData(21);
        //查看用户是否是该群管理员或者创建人
        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $mode=new Model\GroupUserModel($create_code);
        $role = $mode->getUserRole($group_num,$this->account_code);
        if(!$role)$this->echoEncrypData(1);
        $role = intval($role);
        if($role !==1 && $role !==2 ){
            $this->echoEncrypData(307);
        }
        $model=new Model\GroupNoticeModel($create_code);
        $res = $model->delGroupNotice($group_num,$id);
        if(!$res) $this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }
    /*
     * 上传图片到群相册
     * @param group_num 群号码
     * */
    protected function addGroupPic_v1_0_0(){
        $group_num=$this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        import('Vendor.UploadFile');
        $upload =new \UploadFile();
        $path=APP_PATH.'Common/Upload/Img/GroupPicture/'.date(m).date(d).'/';
        $res = $upload->upload($path);
        if(!$res){
            $this->echoEncrypData(1,'图片上传失败');
        }
        foreach($res as $k=>$v){
            $data[]=$res[$k]['savepath'].$res[$k]['savename'];
        }
        $picture_path=serialize($data);
        $user_code=$this->account_code;
        $model =new Model\GroupPictureModel($create_code);
        $res = $model->addGroupPic($picture_path,$user_code,$group_num);
        if(!$res) $this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }

    /*
     * 获取群相册
     * @param group_num 群号码
     * */
    protected function getGroupPic_v1_0_0(){
        $group_num=$this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $model =new Model\GroupPictureModel($create_code);
        $data = $model->getGroupPicture($group_num);
        if(is_numeric($data)) $this->echoEncrypData($data);
        foreach ($data as $k =>$v){
            $data[$k]['picture_path'] = unserialize($v['picture_path']);
        }
        $this->echoEncrypData(0,'',$data);
    }

    /*
     * 删除群相册
     *@param picture_id 相册编号
     * @param group_num 群号码
     * */
    protected function delGroupPic(){
        $picture_id =$this->pdata['picture_id'];
        $group_num=$this->pdata['group_num'];
        if(!$picture_id ||!$group_num)$this->echoEncrypData(21);
        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $mode=new Model\GroupUserModel($create_code);
        $role = $mode->getUserRole($group_num,$this->account_code);
        if(!$role)$this->echoEncrypData(1);
        $role = intval($role);
        $model =new Model\GroupPictureModel($create_code);
        if($role !==1 && $role !==2 ){    //是否是创建者或者管理员
            $user_code = $model->where(['id'=>$picture_id])->getField('user_code');  //是否是上传者
            if($user_code !== $this->account_code){
                $this->echoEncrypData(500);
            }
        }
    }


    /*
     * 生成群号码
     * */
    public function createGroupCode(){
        for($i=0;$i<=6;$i++){//最多可向后扩展6为数字
            for($j=0;$j<=10 ;$j++){ //连续创建五次失败就扩展1位数
                $code =mt_rand(1,9);//总共生成6位随机字串
                for($k=1;$k <=(5+$i) ;$k++){
                    $code .=mt_rand(0,9);
                }
                $res = M('baseinfo.group_area')->where(['group_num'=>$code])->find();
                if(!$res){
                    return $code;
                }
            }
        }
        return false;
    }

}