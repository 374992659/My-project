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
      * @param garden_code  小区code 可填
      * */
    protected function addGroup_v1_0_0(){
        $group_name = $this->pdata['group_name'] ;
        $group_portrait = $this->pdata['group_portrait'] ;
        $group_type = $this->pdata['group_type'] ;
        $garden_code = $this->pdata['garden_code'] ;
        if(!$group_name || !$group_portrait || !$group_type) $this->echoEncrypData(21);
        if(intval($group_type) == 3){ //社区群
            if(!$garden_code)$this->echoEncrypData(21);
        }
        $group_num = $this->createGroupCode();
        if(!$group_num) $this->echoEncrypData(1,'群创建失败，请重试');
        $table_id=substr($this->account_code,0,6);
        $group_code=$table_id.$group_num;
//       $data=array(
//            'group_num'=>$group_num,
//            'group_code'=>$group_code,
//            'group_name'=>$group_name,
//            'group_portrait'=>$group_portrait,
//            'table_id'=>$table_id,
//            'user_code'=>$this->account_code
//       );
//       $count = M('baseinfo.group_area')->where(['user_code'=>$this->account_code])->count();
       $mongo = new \MongoClient();
       $count = $mongo->baseinfo->group_area->count(array('user_code'=>$this->account_code,'status'=>1));
       if(intval($count) >= 5){
           $this->echoEncrypData(305);
       }
//        $res1 = M('baseinfo.group_area')->add($data);
        $mongo = new \MongoClient();
        $res1= $mongo->baseinfo->group_area->insert(array(
            '_id'=>getNextId($mongo,'baseinfo','group_area'),
            'group_num'=>$group_num,
            'group_code'=>$group_code,
            'table_id'=>$table_id,
            'group_name'=>$group_name,
            'group_portrait'=>$group_portrait,
            'user_code'=>$this->account_code,
            'group_type'=>$group_type,
            'garden_code'=>$garden_code,
            'status'=>1,
            ));
        $mode = new Model\UserGroupModel($this->account_code);
        $res2 =$mode->addGroup($group_name,$group_portrait,$group_code,$group_num,1,$group_type,$garden_code);   //role角色id
        $data = M('baseinfo.user_info_'.$table_id)->field(['nickname,portrait'])->where(['account_code'=>$this->account_code])->find();
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
            $this->echoEncrypData(1,$model->getErrorMsg());
        }
        foreach($res as $k=>$v){
            $data['file_path'][]=$res[$k]['savepath'].$res[$k]['savename'];
        }
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 获取我所在的群信息
     * @param value 需要获取的群类型 1:我创建的群 2：我管理的群  3.我加入的群（普通身份）可填 不填返回所有群
     * */
    protected function getMyGroup_v1_0_0(){
        $value = $this->pdata['value'];
        $value = intval($value);
        if(!$value){
            $role=0;
        }else{
            switch ($value) {
                case 1:$role = 1;break;
                case 2:$role = 2;break;
                case 3:$role = 3;break;
            }
        }
        $model = new Model\UserGroupModel($this->account_code);
        $field='group_name,group_portrait,group_code,group_num,group_type,role';
        $res = $model->getGroup($field,$role);
        if($res == 1){
            $this->echoEncrypData(5);
        }
        foreach ($res as $k=>$v){
            $res[$k]['group_type_name']= M('baseinfo.group_type')->where(['status' =>1,'id'=>$res[$k]['group_type']])->getField('group_type_name');
        }

        $this->echoEncrypData(0,'',$res);
    }
    /*
     * 添加群成员
     * @param user_code 用户code 或者 多个用户的code 用英文逗号间隔
     * @param group_num 群号码
     * */
    protected function addGroupUser_v1_0_0(){
        $user_code = $this->pdata['user_code'];
        $group_num = $this->pdata['group_num'];
        if(!$user_code || !$group_num)$this->echoEncrypData(21);
        $mongo = new \MongoClient();
        $create_data = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num));
        if(count(explode(',',$user_code))>1){
            $arr = explode(',',$user_code);
        }else{
            $arr[]=$user_code;
        }
        $res =true;
        $group_user = new Model\GroupUserModel($create_data['user_code']);
        $group_user->startTrans();
        foreach ($arr as $k=>$v){
            $count = $group_user->where(['user_code'=>$v,'group_num'=>$group_num])->getField('id');
            if(!$count){
                $user_data = $mongo->baseinfo->user_area->findOne(array('account_code'=>$v),array('nickname','portrait'));
                $result1 = $group_user->addUser($create_data['group_code'],$group_num,$create_data['group_name'],$create_data['group_portrait'],$v,$user_data['nickname'],$user_data['portrait'],3);  //1.将用户添加至创建人群用户表
                $user_group = new Model\UserGroupModel($v);
                $user_group->startTrans();
                $result2 = $user_group->addGroup($create_data['group_name'],$create_data['group_portrait'],$create_data['group_code'],$group_num,3,$create_data['group_type'],$create_data['garden_code']);
                if(!$result1 || !$result2){
                    $res = false;
                    break;
                }
            }
        }
        if($res){
            $group_user->commit();
            if($user_group){
                $user_group->commit();
            }
            $this->echoEncrypData(0);
        }else{
            $group_user->rollback();
            if($user_group){
                $user_group->rollback();
            }
            $this->echoEncrypData(1,'',array($create_data));
        }
    }

    /*
     * 移除群成员
     * @param group_num 群号码
     * @param user_code 被移除人code
     * */
    protected function delGroupNum_v1_0_0(){
        $account_code=$this->account_code;
        $this->checkParam(array('group_num','user_code'));
        $mongo =new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->find(array('group_num'=>$this->pdata['group_num']))['user_code'];
        $mode =new Model\GroupUserModel($create_code);
        if($account_code !== $create_code){
            $role = $mode->where(['group_num'=>$this->pdata['group_num'],'user_code'=>$account_code])->getField('role');
            if($account_code !== $this->pdata['user_code']){ //不是管理员、群主 也可以移除自己 （退出群）
                if(intval($role) >2){
                    $this->echoEncrypData(1,'无权执行此操作');
                }
            }
        }
        if($this->pdata['user_code'] === $create_code){
            $this->echoEncrypData(1,'不能移除群主');
        }

        $mode->startTrans();
        $res1 = $mode->where(['group_num'=>$this->pdata['group_num'],'user_code'=>$this->pdata['user_code']])->delete();
        $user_group = new Model\UserGroupModel($this->pdata['user_code']);
        $user_group->startTrans();
        $res2 = $user_group->where(['group_num'])->delete();
        if($res1 and $res2){
            $mode->commit();
            $user_group->commit();
            $this->echoEncrypData(0);
        }else{
            $mode->rollback();
            $user_group->rollback();
            $this->echoEncrypData(1);
        }
    }


    /*
     * 设置/取消群禁言
     * @param group_num 群号码
     * @param is_cancel 是否取消 可填 传递此参数 is_cancel=1
     * */
    protected function setGroupCommunity_v1_0_0(){
        $account_code = $this->account_code;
        $group_num = $this->pdata['group_num'];
        $is_cancel = $this->pdata['is_cancel'];
        if(!$group_num)$this->echoEncrypData(21);
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        if($account_code !== $create_code){
            $mode =new Model\GroupUserModel($create_code);
            $role = $mode->where(['group_num'=>$group_num,'user_code'=>$account_code])->getField('role');
            if(intval($role) >2){
                $this->echoEncrypData(1,'无权执行此操作');
            }
        }
        $model =new Model\UserGroupModel($create_code);
        if(intval($is_cancel) === 1){
            $res = $model->where(['group_num'=>$group_num])->save(['community_status'=>1]);
        }else{
            $res = $model->where(['group_num'=>$group_num])->save(['community_status'=>2]);
        }
        if($res !== false){
            $this->echoEncrypData(0);
        }else{
            $this->echoEncrypData(1);
        }
    }
    /*
     * 解散群
     * @param  group_num群号码
     * */
    protected function setGroupStatus_v1_0_0(){
        $group_num = $this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        if($create_code !== $this->account_code){
            $this->echoEncrypData(1,'无权执行此操作');
        }
        $model  = new Model\UserGroupModel($this->account_code);
        $res = $model->where(['group_num'=>$group_num])->save(['status'=>2]);
        $mongo->baseinfo->group_area->update(array('group_num'=>$group_num),array('$set'=>array('status'=>2)));
        if($res){
            $this->echoEncrypData(0);
        }else{
            $this->echoEncrypData(1);
        }
    }

    /*
     * 获取群内用户
     * @param group_num 群号码
     * */
    protected function getGroupUser_v1_0_0(){
        $group_num=$this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
//        $res = M('baseinfo.group_area')->field('group_code,user_code')->where(['group_num'=>$group_num])->find();
        $mongo =new \MongoClient();
        $res = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('group_code','user_code'));
        if(!$res)$this->echoEncrypData(1,'未获取到群信息');
        $model = new Model\GroupUserModel($res['user_code']);
        $data=$model->getGroupUser($res['group_code']);
        $mode = new Model\UserGroupModel($res['user_code']);
        $community_status = $mode->getCommunity($group_num);
        $status = $mode->getGroupStatus($group_num);
        if(intval($status) ===2){
            $new_model = new Model\UserGroupModel($this->account_code);
            $new_model->where(['group_num'=>$group_num])->save(['status'=>2]);
        }
        $return=array(
            'Number_data'=>$data,
            'community_status'=>$community_status,
            'status'=>$status,
        );
        if(is_numeric($data)){
            $this->echoEncrypData($data);
        }
        $this->echoEncrypData(0,'',$return);
    }

    /*
     * 设置管理员
     * @param group_num 群号码
     * @param user_code 用户code
     * */
    protected function setGroupManager_v1_0_0(){
        $group_num =$this->pdata['group_num'];
        $user_code =$this->pdata['user_code'];
        if(!$group_num || !$user_code)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $mode =new Model\GroupUserModel($create_code);
        $role= $mode->where(['user_code'=>$this->account_code,'group_num'=>$this->pdata['group_num']])->getField('role');
        if(intval($role) !== 1)$this->echoEncrypData(500);
        $count =$mode->where(['role' =>2,'group_num'=>$group_num])->count();
        if($count >=3 )$this->echoEncrypData(1,'管理员数量已达上限');
        if($this->account_code === $user_code)$this->echoEncrypData(1,'您是群主，请选择其他用户为管理员');
        $res = $mode->where(['user_code'=>$user_code,'group_num'=>$group_num])->save(['role'=>2]);
        if(!$res)$this->echoEncrypData(1,'请勿重复操作哟');
        $this->echoEncrypData(0);
    }
    /*
     * 取消管理员
     * @param group_num 群号码
     * @param user_code 用户code
     * */
    protected function unsetGroupManager_v1_0_0(){
        $group_num =$this->pdata['group_num'];
        $user_code =$this->pdata['user_code'];
        if(!$group_num || !$user_code)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        if($user_code === $this->account_code)$this->echoEncrypData(1,'不能取消自己');
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $mode =new Model\GroupUserModel($create_code);
        $role= $mode->where(['user_code'=>$this->account_code])->getField('role');
        if(intval($role) !== 1)$this->echoEncrypData(500);
        $res = $mode->where(['user_code'=>$user_code,'group_num'=>$group_num])->getField('role');
        if(intval($res) !== 2)$this->echoEncrypData(1,'该用户不是管理员');
        $result= $mode->where(['user_code'=>$user_code,'group_num'=>$group_num])->save(['role'=>3]);
        if(!$result)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }


    /*
     * 转让群
     * @param group_num 群号码
     * @param user_code 用户code
     * */
    protected function changeGroupCre_v1_0_0(){
        $group_num =$this->pdata['group_num'];
        $user_code =$this->pdata['user_code'];
        if(!$group_num || !$user_code)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $mode =new Model\GroupUserModel($create_code);
        $role= $mode->where(['user_code'=>$this->account_code])->getField('role');
        if(intval($role) !== 1)$this->echoEncrypData(500);
        $mode->startTrans();
        $res1 = $mode->where(['user_code'=>$user_code,'group_num'=>$group_num])->save(['role'=>1]);
        $res2 =$mode->where(['user_code'=>$this->account_code,'group_num'=>$group_num])->save(['role'=>3]);
        if($res1 && $res2){
            $mode->commit();
            $this->echoEncrypData(0);
        }else{
            $mode->rollback();
            $this->echoEncrypData(1,'转让对象必须是该群成员');
        }
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
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $mode=new Model\GroupUserModel($create_code);
        $role = $mode->getUserRole($group_num,$this->account_code);
        if(!$role)$this->echoEncrypData(1);
        $role = intval($role);
        if($role !==1 && $role !==2 ){
            $this->echoEncrypData(307);
        }
        $model=new Model\GroupNoticeModel($create_code);
        $table_id=substr($this->account_code,0,6);
        $nickname =M('baseinfo.user_info_'.$table_id)->where(['account_code'=>$user_code])->getField('nickname');
        $res = $model->addGroupNotice($title,$content,$portrait,$user_code,$nickname,$group_num);
        if(!$res){
            $this->echoEncrypData(1);
        }
        $this->echoEncrypData(0);
    }
    /*
     * 上传群公告图片
     * */
    protected function uploadNoticePic_V1_0_0(){
        import('Vendor.UploadFile');
        $upload =new \UploadFile();
        $path=APP_PATH.'Common/Upload/Img/NoticePicture/'.date(m).date(d).'/';
        $res = $upload->upload($path);
        if(!$res){
            $this->echoEncrypData(1,$upload->getErrorMsg());
        }
        foreach($res as $k=>$v){
            $data[]=$res[$k]['savepath'].$res[$k]['savename'];
        }
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 获取群公告
     * @param group_num 所属群号码
     * */
    protected function getGroupNotice_v1_0_0(){
        $group_num = $this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
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
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
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
   * 上传群文件 单个文件上传
   * @param group_num  群号码
   * */
    protected function uploadGroupFile_v1_0_0(){
        $group_num = $this->pdata['group_num'];
        if($group_num)$this->echoEncrypData(21);
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        import('Vendor.UploadFile');
        $upload =new \UploadFile();
        $path=APP_PATH.'Common/Upload/Group/GroupFiles/'.date(m).date(d).'/';//群文件夹
        $res = $upload->upload($path);
        if(!$res){
            $this->echoEncrypData(1,$upload->getErrorMsg());
        }
//        var_dump($res);die;
        foreach($res as $k=>$v){
            $data[]=$res[$k]['savepath'].$res[$k]['savename'];
        }
        $file_path=serialize($data);
        $user_code=$this->account_code;
        $user_info= $mongo->baseinfo->user_area->findOne(array('account_code'=>$user_code));
        $model =new Model\GroupFileModel($create_code);
        $res = $model->add(array(
            'file_path'=>$file_path,
            'user_code'=>$user_info['account_code'],
            'nickname'=>$user_info['nickname'],
            'portrait'=>$user_info['portrait'],
            'create_time'=>time(),
            'group_num'=>$group_num,
            'show_name'=>$res[0]['name'],
        ));
        if(!$res) $this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }
    /*
     * 获取群文件列表
     * @param 群号码
     * */
    protected function getGroupFileList_v1_0_0(){
        $group_num=$this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $group_file =new Model\GroupFileModel($create_code);
        $time = time()-C('GROUP_FILE_LIFE');
        $data = $group_file->where(['group_num'=>$group_num,'create_time'=>array('EGT'=>$time)])->select();//查询有效期内的群文件
        if(!$data)$this->echoEncrypData(5);
        foreach ($data as $k =>$v){
            $data[$k]['file_path'] = unserialize($v['file_path']);
        }
        $this->echoEncrypData(0,'',$data);
    }

    /*
     * 上传图片到群相册
     * @param group_num 群号码
     * */
    protected function addGroupPic_v1_0_0(){
        $group_num=$this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        import('Vendor.UploadFile');
        $upload =new \UploadFile();
        $path=APP_PATH.'Common/Upload/Img/GroupPicture/'.date(m).date(d).'/';
        $res = $upload->upload($path);
        if(!$res){
            $this->echoEncrypData(1,$upload->getErrorMsg());
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
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
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
    protected function delGroupPic_v1_0_0(){
        $picture_id =$this->pdata['picture_id'];
        $group_num=$this->pdata['group_num'];
        if(!$picture_id ||!$group_num)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code');
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
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
        $res = $model->delGroupPic($group_num,$picture_id);
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }

    /*
     * 上传投票图片
     * */
    protected function uploadVotePic_V1_0_0(){
        import('Vendor.UploadFile');
        $upload =new \UploadFile();
        $path=APP_PATH.'Common/Upload/Img/VotePicture/'.date(m).date(d).'/';
        $res = $upload->upload($path);
        if(!$res){
            $this->echoEncrypData(1,$upload->getErrorMsg());
        }
        foreach($res as $k=>$v){
            $data[]=$res[$k]['savepath'].$res[$k]['savename'];
        }
        $this->echoEncrypData(0,'',$data);
    }


    /*
     * 发布投票
     * @param title 标题
     * @param content 内容
     * @param picture 图片
     * @param choice 选项 ,采用数组转json形式 类似：{'A':'赞成','B':'反对'}
     * @param type 话题类型 多选 单选
     * @param garden_code 所属小区code
     * @parma group_num 所属群号
     * @param end_time 结束时间
     * @param anonymous 是否匿名
     * */
    protected function addVote_v1_0_0(){
        $title = $this->pdata['title'];
        $content = $this->pdata['content'];
        $picture = $this->pdata['picture'];
        $choice = $this->pdata['choice'];
        $type = $this->pdata['type'];
        $group_num =$this->pdata['group_num'];
        $garden_code = $this->pdata['garden_code'];
        $end_time = $this->pdata['end_time'];
        $anonymous = $this->pdata['anonymous'];
        if(!$title || !$content || !$picture || !$choice || !$type || !$garden_code || !$end_time || !$anonymous || !$group_num)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $account_code=$this->account_code;
        $table_id=substr($this->account_code,0,6);
        if(!$table_id)$this->echoEncrypData(1);
        $res = M('baseinfo.user_info_'.$table_id)->Field('nickname,portrait')->where(['account_code'=>$account_code])->find();
        $data=array(
            'title'=>$title,
            'content'=>$content,
            'picture'=>$picture,
            'choice'=>$choice,
            'type'=>$type,
            'group_num'=>$group_num,
            'garden_code'=>$garden_code,
            'end_time'=>$end_time,
            'anonymous'=>$anonymous,
            'user_code'=>$this->account_code,
            'nickname'=>$res['nickname'],
            'portrait'=>$res['portrait'],
            'create_time'=>time(),
        );
        $model=new Model\GroupVoteModel($create_code);
        $result = $model->addGroupVote($data);
        if(!$result)$this->echoEncrypData(1,$data);
        $this->echoEncrypData(0);
    }

    /*
     * 删除投票活动
     * @param group_num 群号码
     * @param vote_id   投票id
     * */
    protected function delVote_v1_0_0(){
        $group_num =$this->pdata['group_num'];
        $vote_id =$this->pdata['vote_id'];
        if(!$group_num || !$vote_id)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $account_code=$this->account_code;
        $model =new Model\GroupVoteModel($create_code);
        $mode = new Model\GroupUserModel($create_code);
        $role = $mode->getUserRole($group_num,$account_code);
        $count =$model->where(['group_num'=>$group_num,'id'=>$vote_id,'user_code'=>$account_code])->count();
        if(!in_array(intval($role),array(1,2)) && !$count){
            $this->echoEncrypData(500);
        }
        if(!$model->delGroupVote($group_num,$vote_id)){
            $this->echoEncrypData(1);
        }
        $this->echoEncrypData(0);
    }
    /*
     * 参与投票
     * @param group_num 群号码
     * @param vote_id 投票id
     * @param choised 选项,采用数组转json形式
     * */
    protected function makeVoteChoice_v1_0_0(){
        $group_num =$this->pdata['group_num'];
        $vote_id =$this->pdata['vote_id'];
        $choised =$this->pdata['choised'];
        if(!$group_num || !$vote_id || !$choised)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $account_code=$this->account_code;
        $table_id= substr($this->account_code,0,6);
        if(!$table_id)$this->echoEncrypData(1);
        $res = M('baseinfo.user_info_'.$table_id)->Field('nickname,portrait')->where(['account_code'=>$account_code])->find();
        $mode=new Model\GroupVoteModel($create_code);
        $result = $mode->where(['group_num'=>$group_num,'vote_id'=>$vote_id])->getField('choice');
        $array=json_decode($result,true);
        $choised = json_decode($choised,true);
        $choice_content=array();
        foreach ($choised as  $k=>$v){
            if(!array_key_exists($v,$array))$this->echoEncrypData(308);
            $choice_content[$v] = $array[$v];
        }
        $choised = json_encode($choised);
        $choice_content =json_encode($choice_content);
        $data = array(
            'vote_id' =>$vote_id,
            'user_code' =>$account_code,
            'group_num' =>$group_num,
            'choised'=>$choised,
            'choice_content' =>$choice_content,
            'nickname' =>$res['nickname'],
            'portrait' =>$res['portrait'],
            'create_time'=>time(),
        );
        $model=new Model\VoteUserModel($create_code);
        $res = $model->addVoteUser($data);
        $mode->execute('update group_vote set total_user = total_user+1 where id = '.$vote_id);
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }
    /*
     * 投票列表
     * @param group_num 群号码
     * */
    protected function getVoteList_v1_0_0(){
        $group_num =$this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $model = new Model\GroupVoteModel($create_code);
        $res = $model->getVoteList($group_num);
        if(is_numeric($res))$this->echoEncrypData($res);
        $this->echoEncrypData(0,'',$res);
    }

    /*
     * 投票详情
     *@param group_num 群号码
     *@param vote_id   投票id
     * */
    protected function getVoteInfo_v1_0_0(){
        $group_num = $this->pdata['group_num'];
        $vote_id =$this->pdata['vote_id'];
        if(!$group_num || !$vote_id)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $mode = new Model\GroupVoteModel($create_code);
        $data = $mode->getVoteInfo($vote_id);
        $choice_arr = json_decode($data['choice'],true);
        foreach($choice_arr as $k =>$v){
            $new_arr[$k]['comtent']=$v;
            $new_arr[$k]['num']=0;
        }
        if(!$data)$this->echoEncrypData(1);
        $model =new Model\VoteUserModel($create_code);
        $res = $model->getVoteChoice($group_num,$vote_id);
        $have_choised=0;
        if($res){
            foreach($res as $k=>$v){
                if($this->account_code === $v['user_code']){
                    $have_choised=json_decode($v['choised'],true);
                }
                $arr = json_decode($v['choised']);
                foreach($arr as  $k=>$v){
                    if(array_key_exists($v,$new_arr)){
                        $new_arr[$v]['num']= $new_arr[$v]['num']+1;
                    }
                }
            }
        }
        $data['have_choise']=$have_choised;
        $data['vote_info'] =$new_arr;
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 发布群话题
     * @param title 标题
     * @param content　内容
     * @param picture　图片
     * @param group_num 群号码
     * */
    protected function addGroupSubject_v1_0_0(){
        $title = $this->pdata['title'];
        $content = $this->pdata['content'];
        $picture =$this->pdata['picture'];
        $group_num =$this->pdata['group_num'];
        if(!$title || !$content)$this->echoEncrypData(21);
        $table_id=substr($this->account_code,0,6);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $data = array(
            'title'=>$title,
            'content'=>$content,
            'picture'=>$picture,
            'group_num'=>$group_num,
            'user_code'=>$this->account_code,
            'nickname'=>$res['nickname'],
            'portrait'=>$res['portrait'],
            'create_time'=>time(),
        );
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $model = new Model\GroupSubjectModel($create_code);
        if(!$subject_id=$model->addGroupSubject($data))$this->echoEncrypData(1);
        $database=new RegiestController();
        $database->executeSql('group_subject_dynamics.sql',array('account_code'=>$create_code,'subject_id'=>$subject_id));
        $this->echoEncrypData(0);
    }
    /*
     * 上传群话题图片
     * */
    protected function uploaSubjectPic_V1_0_0(){
        import('Vendor.UploadFile');
        $upload =new \UploadFile();
        $path=APP_PATH.'Common/Upload/Img/SubjectPicture/'.date(m).date(d).'/';
        $res = $upload->upload($path);
        if(!$res){
            $this->echoEncrypData(1,$upload->getErrorMsg());
        }
        foreach($res as $k=>$v){
            $data[]=$res[$k]['savepath'].$res[$k]['savename'];
        }
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 添加话题评论
     *@param content 内容
     *@param subject_id 话题id
     *@param group_num  群号码
     * */
    protected function addGroupSubjectCommon_v1_0_0(){
        $content = trim($this->pdata['content']);
        $subject_id = trim($this->pdata['subject_id']);
        $group_num = trim($this->pdata['group_num']);
        if(!$content || !$subject_id || !$group_num)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $table_id=substr($this->account_code,0,6);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $data = array(
            'type'=>1,
            'content'=>$content,
            'user_code'=>$this->account_code,
            'portrait'=>$res['portrait'],
            'nickname'=>$res['nickname'],
            'create_time'=>time(),
        );
        $model=new Model\GroupSubjectDynamicsModel($create_code,$subject_id);
        $model->startTrans();
        $res1=$model->addGroupSubjectDynamics($data);
        $res2=$model->execute('update group_subject set commont_num = commont_num+1 where id ='.$subject_id);
        if(!$res1 || !$res2){
            $model->rollback();
            $this->echoEncrypData(1);
        }
        //评论积分
        M()->startTrans();
        $point = M('baseinfo.point_config')->field('id,name,type,value')->where(['id'=>C('POINT_CONFIG.COMMENT')])->find();
        $point_record = new Model\PointRecordModel($this->account_code);
        $point_record->startTrans();
        $res3 = $point_record->add(array(
            'name_id'=>$point['id'],
            'name'=>$point['name'],
            'type'=>$point['type'],
            'value'=>$point['value'],
            'create_time'=>time(),
        ));
        $res4 = true;
        if($limit_point = $this->getPointLimitStatus($this->account_code)){
            $add = $point['value'];
            if($limit_point < $point['value']){
                $add = $limit_point;
            }
            $res4 = M()->quer('update set baseinfo.user_info_'.$table_id.' set total_point =total_point+'.$add.' where account_code ='.$this->account_code);
        }
        if(!$res3 || !$res4){
            $model->rollback();
            $point_record->rollback();
            M()->rollback();
            $this->echoEncrypData(1);
        }
        $point_record->commit();
        M()->commit();
        $model->commit();
        $this->echoEncrypData(0);
    }
    /*
     * 删除群话题评论
     * @param group_num 群号码
     * @param subject_id 话题id
     * @param commont_id 群话题评论id
     * */
    protected function delGroupSubjectCommon_v1_0_0(){
        $subject_id = $this->pdata['subject_id'];
        $commont_id=$this->pdata['commont_id'];
        $group_num =$this->pdata['group_num'];
        if(!$subject_id || !$commont_id || !$group_num)$this->echoEncrypData(21);
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $model=new Model\GroupSubjectDynamicsModel($create_code,$subject_id);
        $res = $model->delgroupSubjectDynamics($commont_id);
        $new_model = new Model\GroupSubjectModel($create_code);
        $res = $new_model->where('id ='.$subject_id)->getField('commont_num');
        $new_model->where('id ='.$subject_id)->save(['commont_num'=>$res-1]);
        if(!$res){
            $this->echoEncrypData(1);
        }
        $point = M('baseinfo.point_config')->field('id,name,type,value')->where(['id'=>C('POINT_CONFIG.DEL_COMMENT')])->find();
        $point_record = new Model\PointRecordModel($this->account_code);
        $point_record->add(array(
            'name_id'=>$point['id'],
            'name'=>$point['name'],
            'type'=>$point['type'],
            'value'=>$point['value'],
            'create_time'=>time(),
        ));
        $city_id = substr($this->account_code,0,6);
        M()->execute('update baseinfo.user_info_'.$city_id.' set total_point =total_point-'.$point['value'].' where account_code ='.$this->account_code);
        $this->echoEncrypData(0);
    }
    /*
     * 群话题点赞
     * @param group_num 群号码
     * @param subject_id 话题id
     * @param is_cancel 是否取消 可填 需要取消则传递此参数等于1
     * */
    protected function addGroupSubjectLikes_v1_0_0(){
        $subject_id = trim($this->pdata['subject_id']);
        $group_num = trim($this->pdata['group_num']);
        $is_cancel =$this->pdata['is_cancel'];
        if(!$subject_id || !$group_num)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $table_id=substr($this->account_code,0,6);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $data = array(
            'type'=>2,
            'user_code'=>$this->account_code,
            'portrait'=>$res['portrait'],
            'nickname'=>$res['nickname'],
            'create_time'=>time(),
        );
        $model=new Model\GroupSubjectDynamicsModel($create_code,$subject_id);
        if(intval($is_cancel) === 1){
            $id = $model->where(['group_num'=>$group_num,'user_code'=>$this->account_code,'type'=>2])->getField('id');
            if(!$id){
                $this->echoEncrypData(1,'您还没有点过赞哦');
            }else{
                $res = $model->where(['id'=>$id])->delete();
                if(!$res){
                    $this->echoEncrypData(1);
                }
                $point= M('baseinfo.point_config')->field('id,name,type,value')->where(['id'=>C('POINT_CONFIG.CANCEL_LIKES')])->find();
                $point_record =new Model\PointRecordModel($this->account_code);
                $point_record->add(array(
                    'name_id'=>$point['id'],
                    'type'=>$point['type'],
                    'name'=>$point['name'],
                    'value'=>$point['value'],
                    'create_time'=>time(),
                ));
                M()->execute('update baseinfo.user_info_'.$table_id.' set total_point=total_point-'.$point['value'].' where account_code='."'".$this->account_code."'");
                $this->echoEncrypData(0);
            }
        }
        $model->startTrans();
        $res1=$model->addGroupSubjectDynamics($data);
        $res2=$model->execute('update group_subject set likes_num = likes_num+1 where id ='.$subject_id);
        $point= M('baseinfo.point_config')->field('id,name,type,value')->where(['id'=>C('POINT_CONFIG.LIKES')])->find();
        $point_record = new Model\PointRecordModel($this->account_code);
        $point_record->startTrans();
        M()->startTrans();
        $res3 = $point_record->add(array(
            'name_id'=>$point['id'],
            'name'=>$point['name'],
            'type'=>$point['type'],
            'value'=>$point['value'],
            'create_time'=>time(),
        ));
        $res4 = true;
        if($point_limit = $this->getPointLimitStatus($this->account_code)){
            $point_limit > $point['value']?$add = $point['value']:$add =$point_limit;
            $res4 = M()->execute('update baseinfo.user_info_'.$table_id.' set total_point=total_point+'.$add.' where account_code='."'".$this->account_code."'");
        }
        if(!$res1 || !$res2 || !$res3 || !$res4){
            $model->rollback();
            $point_record->rollback();
            M()->rollback();
            $this->echoEncrypData(1);
        }
        $point_record->commit();
        M()->commit();
        $model->commit();
        $this->echoEncrypData(0);
    }
    /*
     * 群话题评论点赞/取消点赞
     * @param group_num 群号码
     * @param commont_id 群话题评论id
     * @param subject_id 话题id
     * @param is_cancel 是否取消 可填 需要取消则传递此参数等于1
     * */
    protected function addGroupSubjectCommontLikes_v1_0_0(){
        $subject_id = trim($this->pdata['subject_id']);
        $group_num = trim($this->pdata['group_num']);
        $commont_id = trim($this->pdata['commont_id']);
        $is_cancel = trim($this->pdata['is_cancel']);
        if( !$subject_id || !$group_num || !$commont_id )$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $table_id=substr($this->account_code,0,6);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $data = array(
            'type'=>3,
            'commont_id'=>$commont_id,
            'user_code'=>$this->account_code,
            'portrait'=>$res['portrait'],
            'nickname'=>$res['nickname'],
            'create_time'=>time(),
        );
        $model=new Model\GroupSubjectDynamicsModel($create_code,$subject_id);
        if(intval($is_cancel) === 1){
            $id = $model->where(['group_num'=>$group_num,'user_code'=>$this->account_code,'type'=>3,'commont_id'=>$commont_id])->getField('id');
            if(!$id){
                $this->echoEncrypData(1,'您还没有点过赞哦');
            }else{
                $res = $model->where(['id'=>$id])->delete();
                if(!$res){
                    $this->echoEncrypData(1);
                }
                $point= M('baseinfo.point_config')->field('id,name,type,value')->where(['id'=>C('POINT_CONFIG.CANCEL_LIKES')])->find();
                $point_record =new Model\PointRecordModel($this->account_code);
                $point_record->add(array(
                    'name_id'=>$point['id'],
                    'type'=>$point['type'],
                    'name'=>$point['name'],
                    'value'=>$point['value'],
                    'create_time'=>time(),
                ));
                M()->execute('update baseinfo.user_info_'.$table_id.' set total_point=total_point-'.$point['value'].' where account_code='."'".$this->account_code."'");
                $this->echoEncrypData(0);
            }
        }
        $model->startTrans();
        $res1=$model->addGroupSubjectDynamics($data);
        $res2=$model->execute('update group_subject_dynamics_'.intval($subject_id).' set commont_likes=commont_likes+1 where id='.$commont_id);
        $point= M('baseinfo.point_config')->field('id,name,type,value')->where(['id'=>C('POINT_CONFIG.LIKES')])->find();
        $point_record = new Model\PointRecordModel($this->account_code);
        $point_record->startTrans();
        M()->startTrans();
        $res3 = $point_record->add(array(
            'name_id'=>$point['id'],
            'name'=>$point['name'],
            'type'=>$point['type'],
            'value'=>$point['value'],
            'create_time'=>time(),
        ));
        $res4 = true;
        if($point_limit = $this->getPointLimitStatus($this->account_code)){
            $point_limit > $point['value']?$add = $point['value']:$add =$point_limit;
            $res4 = M()->execute('update baseinfo.user_info_'.$table_id.' set total_point=total_point+'.$add.' where account_code='."'".$this->account_code."'");
        }
        if(!$res1 || !$res2 || !$res3 || !$res4){
            $model->rollback();
            $point_record->rollback();
            M()->rollback();
            $this->echoEncrypData(1);
        }
        $point_record->commit();
        M()->commit();
        $model->commit();
        $this->echoEncrypData(0);
    }
    /*
     * 话题列表
     * @param group_num
     * */
    protected function getGroupSubjectList_v1_0_0(){
        $group_num = $this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $model= new Model\GroupSubjectModel($create_code);
        $data = $model->getGroupSubjectList($group_num);
        if(!$data)$this->echoEncrypData(5);
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 话题详情
     * @param subject_id 话题id
     * @param group_num 群号码
     * */
    protected function getGroupSubjectInfo_v1_0_0(){
        $subject_id=$this->pdata['subject_id'];
        $group_num=$this->pdata['group_num'];
        if(!$group_num || !$subject_id)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $model= new Model\GroupSubjectModel($create_code);
        $data =$model->getGroupSubjectInfo($subject_id);
        if(!$data)$this->echoEncrypData(1);
        $mode= new Model\GroupSubjectDynamicsModel($create_code,$subject_id);
        $res = $mode->getGroupSubjectDynamics(1);//1:评论 2：话题点赞 3：评论点赞
        $is_like = $mode->where(['subject_id'=>$subject_id,'user_code'=>$this->account_code,'type'=>2])->count();
        $res2 = $mode->field('commont_id')->where(['subject_id'=>$subject_id,'user_code'=>$this->account_code,'type'=>3])->select();//我的所有评论点赞
        $commont_likes = array();
        if($res2){
            foreach($res2 as $key=>$val){
                $commont_likes[$val['commont_id']]=$val['commont_id'];
            }
        }
        if($res){
            foreach ($res as $k=>$v){
                if(array_key_exists($v['id'],$commont_likes)){
                    $v['is_likes'] = 1;
                }else{
                    $v['is_likes'] =0;
                }
                $res[$k]=$v;
            }
        }
        $is_like?$data['is_like']=1:$data['is_like']=0;
        $data['commont_list']=$res;
        $model->execute('update group_subject set read_num = read_num+1 where id='.$subject_id);
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 获取活动交通方式
     * */
    public function getTransport_v1_0_0(){
        $data=C('ACTIVITY_TRANSPORT');
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 费用类型
     * */
    public function getCostType_v1_0_0(){
        $data = C('COST_TYPE');
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 添加群活动
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
     * @param group_num 群号码
     * */
    protected function addGroupActivity_v1_0_0(){
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
        $group_num =$this->pdata['group_num'];
        if(!$title || !$start_time  || !$end_time  || !$destination  || !$collection_time || !$collection_place  || !$contact  || !$phone  || !$transport  || !$garden_code  || !$garden_name  || !$total_num  || !$cost_type  || !$average_cost || !$group_num) $this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
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
            'group_num'=>$group_num,
            'rote_planning'=>$rote_planning,
            'tag'=>$tag,
            'picture'=>$picture,
            'detailed_introduction'=>$detailed_introduction,
            'user_code'=>$this->account_code,
            'nickname'=>$res['nickname'],
            'portrait'=>$res['portrait'],
            'create_time'=>time(),
        );
        $model =new Model\GroupActivityModel($create_code);
        $res =$model->addGroupActivity($data);
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }

    /*
     * 群活动列表
     * @param group_num 群号码
     * */
    protected function getGroupActivityList_v1_0_0(){
        $group_num=$this->pdata['group_num'];
        if(!$group_num)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $model=new Model\GroupActivityModel($create_code);
        $data = $model->getActivityList($group_num);
        if(!$data)$this->echoEncrypData(1);
        $this->echoEncrypData(0,'',$data);
    }

    /*
     * 群活动详情
     * @param group_num 群号码
     * @param acticity_id  活动id
     * */
    protected function getGroupActivityInfo_v1_0_0(){
        $group_num=$this->pdata['group_num'];
        $activity_id=$this->pdata['activity_id'];
        if(!$group_num || !$activity_id)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $model=new Model\GroupActivityModel($create_code);
        $data = $model->getGroupActivityInfo($activity_id);
        $mode =new Model\GroupActivityRegistrationModel($create_code);
        if($data){
            $data['enroll_status']=$mode->getEnroolStatus($activity_id,$this->account_code); //报名状态 0：未报名
        }
        if(!$data)$this->echoEncrypData(1);
        $data['transport']=C('ACTIVITY_TRANSPORT')[$data['transport']];
        $data['cost_type']=C('COST_TYPE')[$data['cost_type']];
        $this->echoEncrypData(0,'',$data);
    }
    /*
     * 群活动报名
     * @param group_num 群号码
     * @param activity_id  活动id
     * */
    protected function enrollGroupActivity_v1_0_0(){
        $group_num=$this->pdata['group_num'];
        $activity_id=$this->pdata['activity_id'];
        if(!$group_num || !$activity_id)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $table_id=substr($this->account_code,0,6);
        $res = M('baseinfo.user_info_'.$table_id)->field('nickname,portrait')->where(['account_code'=>$this->account_code])->find();
        $mode=new Model\GroupActivityModel($create_code);
        $collection_time=$mode->where(['id'=>$activity_id])->getField('collection_time');
        if(time() > intval($collection_time))$this->echoEncrypData(1,'活动报名期限已过');
        $model=new Model\GroupActivityRegistrationModel($create_code);
        $data=array(
            'activity_id'=>intval($activity_id),
            'group_num'=>$group_num,
            'user_code'=>$this->account_code,
            'portrait'=>$res['portrait'],
            'nickname'=>$res['nickname'],
            'create_time'=>time(),
        );
        $result=$model->getEnroolStatus($activity_id,$this->account_code);
        if($result >0)$this->echoEncrypData(1,'您已经报名了，无需重复操作哦');
        $res = $model->enrollGroupActivity($data);
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
    }
    /*
     * 取消报名
     * @param group_num 群号码
     * @param activity_id  活动id
     * */
    protected function cancelGroupActivityEnroll_v1_0_0(){
        $group_num=$this->pdata['group_num'];
        $activity_id=$this->pdata['activity_id'];
        if(!$group_num || !$activity_id)$this->echoEncrypData(21);
//        $create_code = M('baseinfo.group_area')->where(['group_num'=>$group_num])->getField('user_code'); //群创建人code
        $mongo = new \MongoClient();
        $create_code = $mongo->baseinfo->group_area->findOne(array('group_num'=>$group_num),array('user_code'));
        $create_code = $create_code['user_code'];
        $model=new Model\GroupActivityRegistrationModel($create_code);
        $result=$model->getEnroolStatus($activity_id,$this->account_code);
        if($result == 0)$this->echoEncrypData(1,'您还没有报名哦');
        $res = $model->cancelGroupActivityEnroll($activity_id,$this->account_code);
        if(!$res)$this->echoEncrypData(1);
        $this->echoEncrypData(0);
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
//                $res = M('baseinfo.group_area')->where(['group_num'=>$code])->find();
                $mongo = new \MongoClient();
                $res = $mongo->baseinfo->group_area->count(array('group_num'=>$code));
                if(!$res){
                    return $code;
                }
            }
        }
        return false;
    }
    /*
    * 判断用户今日是否已达分数上限
    * 没超过上限则返回与上线分的差值
    * */
    public function getPointLimitStatus($account_code){
        $point_limit = M('baseinfo.point_config')->where(['id'=>C('POINT_CONFIG.DAY_LIMIT')])->getField('value');
        $today = strtotime('today');
        $point_record = new Model\PointRecordModel($account_code);
        $today_point = $point_record->where([
            'create_time'=>['egt',$today],
            'type'=>1,
            'id'=>['neq',C('INVITE_REGISTER')],
        ])->count('value'); //邀请他人注册得分不计入得分上限
        if(intval($today_point) < intval($point_limit)){
            return (intval($point_limit) - intval($today_point));
        }
        return false;
    }
}