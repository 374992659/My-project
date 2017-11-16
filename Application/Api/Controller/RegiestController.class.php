<?php
/**
 * 用户登录注册类
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/9/15
 * Time: 9:23
 */

namespace Api\Controller;
use Api\Model;

class RegiestController extends BaseController
{
    /**
     * 获取图片验证码
     * */
    public function getPicCode(){
        $config =array(
                'fontSize'    =>   50,
                'length'      =>    4,
            );
        $Verify=new \Think\Verify($config);
        $Verify->useNoise = false;
        $Verify->entry();
    }
    /**
     * 验证码检查
     */
    function check_verify($code, $id = ""){
        $verify = new \Think\Verify();
        return $verify->check($code, $id);
    }
    /**
     *
     * 发送微信验证验证码
     * @param phone 手机号码
     */
    public function sendWxRegistMsg()
    {
        $phone = $this->pdata['phone'];
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$phone)){
            $this->echoEncrypData(106);
        }

        $SMS=new \Api\Controller\SendSmsController();
        $res = $SMS->SendMassage($phone,'wxregiest_', '美e家园', 'SMS_94280318', $code);
        if($code !== 0){
            $this->echoEncrypData($code);
        }else{
            $this->echoEncrypData(0,"短信验证码发送成功,有效时间为".C('SMS_validity')."分钟。");
        }
    }

    /*
     * 微信版- 用户绑定手机号
    * @param phone 手机号
    * @param area_id 区域id
     * @param  smscode 短信验证码
     * @param openId  微信openId
     * */
    public function wxBindPhone(){
        $phone = $this->pdata['phone'];
        $table_id = $this->pdata['area_id'];
        $smscode = $this->pdata['smscode'];
        $openId = $this->pdata['openId'];
        if(!$phone || !$table_id || !$smscode || !$openId)$this->echoEncrypData(21);
        //获取缓存验证码
        $key_yzm_val = 'wxregiest_'.$phone;
        $yzm_Mem = unserialize(S($key_yzm_val));
        $cache_code = $yzm_Mem['hash'];
        if( !$cache_code ){
            return $this->echoEncrypData(116);
        }

        if( $cache_code != $smscode ){
            $this->echoEncrypData(1,'验证码不正确');
        }

        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$phone)){
            $this->echoEncrypData(106);
        }
        $wx =session('wxdata'.$openId);
        $wx=json_decode(trim($wx,'"'),true);

        $model=new Model\UserAreaModel();
        $res=$model->addUserArea($openId,$phone,$table_id,$errmsg);
        if(!$res){
            $this->echoEncrypData(1,$errmsg);
        }else{
            $this->autoBuildDatabase($phone);
            //在其user_info表中添加数据
            $data = array(
                'phone' =>$phone,
                'nickname' =>$wx['nickname'],
                'account_code' =>$table_id.$phone,
                'portrait' =>$wx['headimgurl'],
                'create_time' =>time(),
                'create_addr_code' =>$table_id,
                'sex' =>$wx['sex'],
            );
            $res = M('baseinfo.user_info_'.$table_id)->add($data);
            if(!$res){
                $model->delUserArea($openId);
            }
            session_unset('wxdata'.$openId);
            $this->appToken=true;
            $this->account_code=$table_id.$phone;
            $this->echoEncrypData(0,'');
        }
    }

    /*
     * 获取全国区域数组
     * */
    public function getAreaArr(){
        $model=new Model\UserAreaModel();
        $res=$model->getArea();
        $this->echoEncrypData(0,'',$res);
    }

    /**
     *
     * 发送注册验证码
     * @param phone 手机号码
     */
    public function sendRegistMsg()
    {
        $phone = $this->pdata['phone'];
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$phone)){
            $this->echoEncrypData(106);
        }

        if ($this->account_code > 0) {
            $this->echoEncrypData(112, '已登录，无需重复注册');
        }
//        $customer = M('user_area')->where(array('phone' => $phone))->getField('id');
        $mongo = new \MongoClient();
        $customer =$mongo->baseinfo->user_area->findOne(array('phone'=>$phone),array('id'));
        if ($customer > 0) {
            $this->echoEncrypData(118, '已注册无需重复注册');
        }
        $SMS=new \Api\Controller\SendSmsController();
        $res = $SMS->SendMassage($phone,'regiest_', '美e家园', 'SMS_94280318', $code);
        if($code !== 0){
            $this->echoEncrypData($code);
        }else{
            $this->echoEncrypData(0,"短信验证码发送成功,有效时间为".C('SMS_validity')."分钟。");
        }
    }

    public function checkCity(){
        $province=$_GET['province'];
        $city=$_GET['city'];
        $province_id = M('baseinfo.swf_area')->where(['name'=>$province])->getField('id');
        if(!$province_id){
            $last_p_id=M('baseinfo.swf_area')->field('MAX(id)')->where(['parent_id'=>'0000'])->getField('id');
            var_dump($last_p_id) ;
        }
    }



    /*
     * 用户注册
     * @param account 账号
     * @param area_id 区域
     * @param password 密码
     * @param repassword 确认密码
     * @param piccode 图片验证码
     * @param openId 微信openid
     * @param inviter_code 邀请人code 可填 前端页面由url获取传递到后台接口  由微信扫描分享二维码跳转的注册页面会有此数据
     * */
    public function regiest(){
        $account   = trim($this->pdata['account']);
        $area_id = trim($this->pdata['area_id']);
        $password  = trim($this->pdata['password']);
        $repassword   = trim($this->pdata['repassword']);
        $piccode = trim($this->pdata['piccode']);
        $inviter_code = trim($this->pdata['inviter_code']);
        $openId = trim($this->pdata['openId']);
        if(intval($_GET['is_wap']) === 1){
            if(!$openId)$this->echoEncrypData(21);
        }
        if(!$account || !$password || !$repassword || !$area_id ||!$piccode){
            $this->echoEncrypData(1,'注册信息不完整');
        }
        if( !preg_match('/^[a-z\d]{6,12}$/i',trim($account))){ //账号格式 字母开头6-12位
            $this->echoEncrypData(106);
        }
        $mongo = new \MongoClient();
        $account_count = $mongo->baseinfo->user_area->count(array('account'=>$account));
        if( $account_count ){
            $this->echoEncrypData(1,'该账号已被注册');
        }
        if(md5($password) !== md5($repassword))$this->echoEncrypData(1,'请确认两次密码输入一致');
        $mongo = new \MongoClient();

        //注册积分
        $point = M('baseinfo.point_config')->Field('id,name,type,value')->where(['id'=>C('POINT_CONFIG.REGISTER')])->find();
        $mongo->baseinfo->user_area->insert(array(
            '_id'=>getNextId($mongo,'baseinfo','user_area'),
            'account'=> $account,
            'table_id'=>$area_id,
            'status'=>1,
            'account_code'=>$area_id.$account,
            'openId'=>$openId,
            'portrait'=>'Application/Common/Source/Img/default_portrait.jpg',
            'nickname'=>$account,
            'phone'=>'',
        ));
        $data2= array(
            'account' =>$account,
            'password' => md5(md5($password).$account),
            'nickname' => $account,
            'portrait'=>'Application/Common/Source/Img/default_portrait.jpg',
            'account_code' => $area_id.$account,
            'create_time' => time(),
            'total_point'=>$point['value'],
            'create_addr_code' => $area_id,
        );
        $this->autoBuildDatabase($account);
        $user_info=M("baseinfo.user_info_".$area_id);
        $user_info->startTrans();
        $res2=$user_info->add($data2);//添加注册用户信息
        $point_record = new Model\PointRecordModel($area_id.$account);
        $point_record->startTrans();
        $res3 = $point_record->add(array(//添加注册用户积分记录
            'name_id'=>$point['id'],
            'name'=>$point['name'],
            'type'=>$point['type'],
            'value'=>$point['value'],
            'create_time'=>time()
        ));
        if($res2 and $res3){
            if($inviter_code){ //存在邀请人
                $Level = $mongo->baseinfo->user_level->findOne(array('user_code'=>$inviter_code),array('level'));
                $level = $Level['level'];
                $mongo->baseinfo->user_level->insert(array(//设置注册用户等级
                    '_id'=>getNextId($mongo,'baseinfo','user_level'),
                    'user_code'=> $area_id.$account,
                    'inviter_code'=>$inviter_code,
                    'level'=>intval($level)+1
                ));
                //邀请注册
                $point_record2 = new Model\PointRecordModel($inviter_code);
                $invitet_city = substr($inviter_code,0,4);
                $inviter_point = M('baseinfo.point_config')->field('id,name,type,value')->where(['id'=>C('POINT_CONFIG.INVITE_REGISTER')])->find();//邀请注册得分无上限
                M()->startTrans();
                $res3 = M()->execute('update baseinfo.user_info_'.$invitet_city.' set total_point =total_point+'.$inviter_point['value'].' where account_code='."'".$inviter_code."'");
                $point_record2->startTrans();
                $res4 = $point_record2->add(array(
                    'name_id'=>$inviter_point['id'],
                    'name'=>$inviter_point['name'],
                    'type'=>$inviter_point['type'],
                    'value'=>$inviter_point['value'],
                    'create_time'=>time(),
                ));
                if(!$res3 || !$res4){
                    M()->rollback();
                    $user_info->rollback();
                    $point_record->rollback();
                    $point_record2->rollback();
                    $mongo->baseinfo->user_area->remove(array('account'=>$account));
                    $this->echoEncrypData(1,'注册失败',$inviter_code);
                }else{
                    $this->appToken=true;
                    $this->account_code = $area_id.$account;
                    $point_record2->commit();
                    M()->commit();
                    $user_info->commit();
                    $point_record->commit();
                    $this->echoEncrypData(0,'注册成功');
                }
//                }
            }else{
                $mongo->baseinfo->user_level->insert(array(
                    '_id'=>getNextId($mongo,'baseinfo','user_level'),
                    'user_code'=> $area_id.$account,
                    'inviter_code'=>null,
                    'level'=>0,
                ));
            }
            $this->appToken=true;
            $this->account_code = $area_id.$account;
            $user_info->commit();
            $point_record->commit();
            $this->echoEncrypData(0,'注册成功');
        }else{
            $user_info->rollback();
            $point_record->rollback();
            $mongo->baseinfo->user_area->remove(array('account'=>$account));
            $this->echoEncrypData(1,'注册失败',$inviter_code);
        }
    }

    /*
     * 發送忘記密碼短信認證
     *@param phone 手機號
     * */
    public function sendForgetPwd(){
        $phone=$this->pdata['phone'];
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$phone)){
            $this->echoEncrypData(106);
        }
//        $count = M('user_area')->where(['phone'=>$phone])->getField('status');
        $mongo = new \MongoClient();
        $count =$mongo->baseinfo->user_area->findOne(array('phone'=>$phone),array('status'));
        if(!$count){
            $this->echoEncrypData(1,'该手机号还未绑定账号!');
        }
        if( intval($count['status']) !== 1 ){
            $this->echoEncrypData(1,'该账号存在异常，暂无法执行该操作');
        }

        $SMS=new \Api\Controller\SendSmsController();
        $SMS->SendMassage($phone,'forgetPwd_', '美e家园', 'SMS_94280318', $code);
        if($code !== 0){
            $this->echoEncrypData($code);
        }else{
            $this->echoEncrypData(0,"短信验证码发送成功,有效时间为".C('SMS_validity')."分钟。");
        }
    }

    /*
     * 忘记密码
     * @param phone 手机号
     * @param smscode 短信验证码
     * @param newpwd 新密码
     * @param renewpwd  确认新密码
     * */
    public function forgetPassword(){
        $phone = $this->pdata['phone'];
        $smscode = $this->pdata['smscode'];
        $newpwd = $this->pdata['newpwd'];
        $renewpwd = $this->pdata['renewpwd'];
        if(!$phone || !$smscode || !$newpwd || !$renewpwd)$this->echoEncrypData(21);
        //获取缓存验证码
        if($newpwd !== $renewpwd)$this->echoEncrypData(1,'两次密码输入不一致');
        $key_yzm_val = 'forgetPwd_'.$phone;
        $yzm_Mem = unserialize(S($key_yzm_val));
        $cache_code = $yzm_Mem['hash'];
        if( !$cache_code ){
            return $this->echoEncrypData(116);
        }
        if( $cache_code != $smscode ){
            $this->echoEncrypData(1,'验证码不正确');
        }
//        $table_id=M('user_area')->field('table_id,account')->where(['phone'=>$phone])->find();
        $mongo = new \MongoClient();
        $table_id =$mongo->baseinfo->user_area->findOne(array('phone'=>$phone),array('table_id','account'));
        if($table_id){
            $res = M('user_info_'.$table_id['table_id'])->where(['phone'=>$phone])->save(['password'=>md5(md5($newpwd).$table_id['account'])]);
            if(!$res)$this->echoEncrypData(1);
            $this->echoEncrypData(0);
        }
        $this->echoEncrypData(1);
    }


    /*
     * 用户账号登陆
     * @param  account    账号
     * @param password  密码
     * @param openId 微信openid 微信端必填
     * */
    public function accountLogin(){
        $account=$this->pdata['account'];
        $password =$this->pdata['password'];
        $openId = $this->pdata['openId'];
        if(intval($_GET['is_wap']) === 1){
            if(!$openId)$this->echoEncrypData(21);
        }
        if(!$account || !$password){
            $this->echoEncrypData(1,'登陆参数不完整');
        }
        if( !preg_match('/^[a-z\d]{6,12}$/i',trim($account))){
            $this->echoEncrypData(106);
        }
//        $table_id = M('user_area')->field('table_id,account,status')->where(['account'=>$account])->find();
        $mongo = new \MongoClient();
        $table_id =$mongo->baseinfo->user_area->findOne(array('account'=>$account),array('table_id','account','status'));
        if(!$table_id){
            $this->echoEncrypData(1,'该用户不存在，请前往注册!');
        }
        if( intval($table_id['status']) !== 1 ){
            $this->echoEncrypData(1,'该账号存在异常，暂无法登陆',$table_id);
        }
        $res = M('user_info_'.$table_id['table_id'])->where(['account'=>$account,'password'=>md5(md5($password).$account)])->count();
        if(!$res){
            $this->echoEncrypData(1,'账号或密码错误');
        }else{
            $account['table_id'] = $table_id['table_id'];
            $this->account_code = $table_id['table_id'].$table_id['account'];
            $this->appToken=true;   //返回apptoken
            $mongo->baseinfo->user_area->update(array('account_code'=>$this->account_code),array('$set'=>array('openId'=>$openId)));
            session('account'.$this->account_code,$account);
            $this->echoEncrypData(0);
        }
    }

    /*
     * 发送手机登录验证码
     * @param phone 手机号
     * */
    public function sendPhoneLogin(){
        $phone=$this->pdata['phone'];
        if(!preg_match('/^1[3|4|5|7|8][0-9]{9}$/',$phone)){
            $this->echoEncrypData(106);
        }
//        $count = M('user_area')->where(['phone'=>$phone])->getField('status');
        $mongo = new \MongoClient();
        $count = $mongo->baseinfo->user_area->findOne(array('phone'=>$phone),array('status'));
        if(!$count){
            $this->echoEncrypData(1,'该用户不存在，请前往注册!');
        }
        if( intval($count['status']) !== 1 ){
            $this->echoEncrypData(1,'该账号存在异常，暂无法登陆');
        }
        if ($this->account_code > 0) {
            $this->echoEncrypData(112, '已登录，无需重复登录');
        }
        $SMS=new SendSmsController();
        $SMS->SendMassage($phone,'login_', '美e家园', 'SMS_94280318', $code);
        if($code !== 0){
            $this->echoEncrypData($code);
        }else{
            $this->echoEncrypData(0,"短信验证码发送成功,有效时间为".C('SMS_validity')."分钟。");
        }
    }


    /*
   * 用户手机号登陆
   *@param  phone    手机号
   * @param smscode 验证码
   * */
    public function phoneLogin(){
        $phone = $this->pdata['phone'];
        $smscode =$this->pdata['smscode'];
        if(!$phone || !$smscode){
            $this->echoEncrypData(21);
        }
        //获取缓存验证码
        $key_yzm_val = 'login_'.$phone;
        $yzm_Mem = unserialize(S($key_yzm_val));
        $cache_code = $yzm_Mem['hash'];
        if( !$cache_code ){
            return $this->echoEncrypData(116);
        }
        if( $cache_code != $smscode ){
            $this->echoEncrypData(1,'验证码不正确');
        }
//        $table_id=M('user_area')->field('table_id,account')->where(['phone'=>$phone])->find();
        $mongo = new \MongoClient();
        $table_id = $mongo->baseinfo->user_area->findOne(array('phone'=>$phone),array('table_id','account'));
        $account['table_id'] =$table_id['table_id'];
        $this->account_code = $table_id['table_id'].$table_id['account'];
        $this->appToken=true;   //返回apptoken
        session('account'.$this->account_code,$account);
        $this->echoEncrypData(0);
    }
    protected function checkLogin($account_code){
        $account=session('account'.$account_code);
        if(!$account){
            return false;
        }
        return true;
    }

    /*
    * 自动创建数据库
    * */
    protected function autoBuildDatabase($account){
        $model=new Model\UserAreaModel();
        $data=$model->getUserInfoByPhone($account);
        $this->executeSql('databases.sql',$data);
        $m =new \MongoClient();
        $baseinfo=$m->baseinfo;
        $baseinfo->online_user->insert(array('account_code'=>$data['account_code'],'status'=>0,'offline_time'=>0)); //用户表中加入数据
        $user_info = 'user_info_'.$data['account_code'];
        $db = $m->$user_info;
        $group_chat=$db->group_chat;//群聊记录
        $group_chat->createIndex(array('sender_code'=>1));
        $group_chat->createIndex(array('type'=>1));
        $group_chat->createIndex(array('send_time'=>1));
        $group_chat->createIndex(array('group'=>1));
        $group_new_message = $db->group_new_message;//群新消息
        $group_new_message->createIndex(array('sender_code'=>1));
        $group_new_message->createIndex(array('type'=>1));
        $group_new_message->createIndex(array('send_time'=>1));
        $group_new_message->createIndex(array('group'=>1));
        $friends_chat=$db->friends_chat;// 好友聊天记录
        $friends_chat->createIndex(array('sender_code'=>1));
        $friends_chat->createIndex(array('type'=>1));
        $friends_chat->createIndex(array('send_time'=>1));
        $counters=$db->counters;// 自增id表
        $counters->save(array('name'=>'group_chat','id'=>0));
        $counters->save(array('name'=>'friends_chat','id'=>0));
        $counters->save(array('name'=>'group_new_message','id'=>0));
    }
    public function executeSql($fileName,$data){
        $sql=file_get_contents(C('SQL_PATH').$fileName);
        $sql=str_replace('$city_id',$data['city_id'],$sql);
        $sql=str_replace('$province_id',$data['province_id'],$sql);
        $sql=str_replace('$account_code',$data['account_code'],$sql);
        $sql=str_replace('$subject_id',$data['subject_id'],$sql);
        $model=M();
        $model->startTrans();
        $res=$model->execute($sql);
        if($res !== false){
            $model->commit();
        }else{
            $model->rollback();
            $this->echoEncrypData(3);
        }
    }


}