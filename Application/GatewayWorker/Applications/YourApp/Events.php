<?php
/**
 * This file is part of workerman.
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the MIT-LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @author walkor<walkor@workerman.net>
 * @copyright walkor<walkor@workerman.net>
 * @link http://www.workerman.net/
 * @license http://www.opensource.org/licenses/mit-license.php MIT License
 */

/**
 * 用于检测业务代码死循环或者长时间阻塞等问题
 * 如果发现业务卡死，可以将下面declare打开（去掉//注释），并执行php start.php reload
 * 然后观察一段时间workerman.log看是否有process_timeout异常
 */
//declare(ticks=1);
use \GatewayWorker\Lib\Gateway;
use Think\Model;
use \Workerman\Autoloader;
require_once './src/Connection.php';
require_once '../Common/Lib/AesLib.class.php';
/**
 * 主逻辑
 * 主要是处理 onConnect onMessage onClose 三个方法
 * onConnect 和 onClose 如果不需要可以不用实现并删除
 */
class Events
{
    /**
     * 当客户端连接时触发
     * 如果业务不需此回调可以删除onConnect
     * 
     * @param int $client_id 连接id
     */
    public static function onConnect($client_id) {
        // 向当前client_id发送数据
        //Gateway::sendToCurrentClient("Your client_id is $client_id\n");
        // 向所有人发送
       // Gateway::sendToAll("$client_id login\n");
    }
   /**
    * 当客户端发来消息时触发
    * @param int $client_id 连接id
    * @param mixed $message 具体消息
    * PS: message中type为  1：表示用户上线 对该用户返回其在线好友的数组
    *                                   2：表示发送消息给好友
    *                                   3：发送消息给群组
    *                                   4：获取某一用户在线状态 在添加好友后使用
    *                                   5：获取群内用户在线状态
    *                                   6:   用户读取好友未读消息
    *                                   7： 用户读取群未读消息
    */
   public static function onMessage($client_id, $message) {
       $message = json_decode($message);
       $account_code = '';
       if($message){
           $aesLib = new \Common\Lib\AesLib();
           $account_code=$message->apptoken?json_decode($aesLib->aes128cbcHexDecrypt($message->apptoken,'5edd3f6060e20220','622102f9149e022d'),true):'';
       };
       if(!$account_code)return;

       switch ($message->type){
           case 1:  Gateway::bindUid($client_id,$account_code['account_code']);    //绑定客户端id及用户code
                        $_SESSION['account_code'] = $account_code['account_code'];
                        Gateway::updateSession($client_id,$account_code);
                        $table_id= substr($account_code['account_code'],0,4);
                        $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'friends_and_group_'.$account_code['account_code']);
//                        $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'friends_and_group_'.'030117608006762');
                        $group_arr = $db->select('group_code')->from('user_group')->where('status =1')->column();
//                        var_dump($group_arr);
                        if($group_arr){
                               foreach ($group_arr as $k=>$v){
                                   Gateway::joinGroup($client_id,$v);                                   //将用户加入群组
                               }
                        };
                        //获取用户在线的好友
                        $user_friends = $db->query('select user_code from user_friends');
                        $online_user = Gateway::getAllClientSessions();
//                        var_dump($online_user);
                        $online_friends = array();
                        if($user_friends){
                            foreach ($user_friends as $key=>$val){
                                $user_client_id=Gateway::getClientIdByUid($val['user_code']);
                                if($user_client_id){
                                    if(array_key_exists($user_client_id[0],$online_user)){
                                        $online_friends[]=$val['user_code'];
                                    }
                                }
                            }
                        }
                        //获取好友未读消息
                        $result = $db->select()->from('offline_user_message')->query();
                        $friends_new_message = array();
                        if($result){
                            $friend_db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'baseinfo');
                            foreach ($result as $k=>$v){
                                if(!array_key_exists($v['sender_code'],$friends_new_message)){
                                    $friends_new_message[$v['sender_code']]['sender_code'] = $v['sender_code'];  //用户code
                                    $friend_table_id= substr($v['sender_code'],0,4);
                                    $friends_new_message[$v['sender_code']]['sender_nickname'] = $friend_db->select('nickname')->from('user_info_'.$friend_table_id)->where('account_code ='.$v['sender_code'])->single();      //用户昵称
                                    $friends_new_message[$v['sender_code']]['sender_portrait'] = $friend_db->select('portrait')->from('user_info_'.$friend_table_id)->where('account_code ='.$v['sender_code'])->single();      //用户头像
                                    $friends_new_message[$v['sender_code']]['content'][] =array('type'=>$v['type'],'content'=>$v['content'],'send_time'=>$v['send_time']);
                                    $friends_new_message[$v['sender_code']]['message_num']=1;
                                    $friends_new_message[$v['sender_code']]['recent_time']=$v['send_time'];
                                }else{
                                    $friends_new_message[$v['sender_code']]['content'][] =array('type'=>$v['type'],'content'=>$v['content'],'send_time'=>$v['send_time']);
                                    $friends_new_message[$v['sender_code']]['message_num']++;
                                    if($friends_new_message[$v['sender_code']]['recent_time']<$v['send_time']){
                                        $friends_new_message[$v['sender_code']]['recent_time']=$v['send_time'];
                                    }
                                }
                            }
                            $friends_new_message = self::multi_array_sort($friends_new_message,'recent_time',SORT_DESC);   //时间倒序
                        }
                        //获取群未读消息
                        $group_new_message = array();
                        if($group_arr){
                            $group_arr_str = implode(',',$group_arr);             //用户群字符串
//                            $group_arr_str = substr($group_arr_str,0,(strlen($group_arr_str)));
//                            var_dump($group_arr_str);
                            $baseinfo = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'baseinfo');
                            $group_data = $baseinfo->select('group_num,group_code,user_code')->from('group_area')->where("group_code in (".$group_arr_str.")")->query();//群创建人
//                            var_dump($group_data);
                            $mongo = new MongoClient();
                            if($group_data){
                                foreach ($group_data as $key=>$val){
                                    $userdatastr = 'user_info_'.$val['user_code'];
                                    $user_database = $mongo->$userdatastr;
//                                $user_database = $mongo->user_info_030117608006762;
                                    $recent_time = 0;
                                    $count = '';
                                    $content = '';
                                    if($user_database->group_new_message->count()){
                                        $group_time = $mongo->baseinfo->user_group_time->findOne(array('user_code'=>$account_code['account_code'],'group_code'=>$val['group_code']),array('user_code','group_code','time'));
//                                    $group_time = $mongo->baseinfo->user_group_time->find(array('user_code'=>'030117608006762','group_code'=>$val['group_code']),array('time'));
//                                        $group_time = iterator_to_array($group_time);
                                        $time =$group_time['time']?$group_time['time']:0;
//                                        foreach ( $group_time as $item) {
//                                            $time = $item['time'];
//                                        }
//                                        var_dump($time);
                                        $count = $user_database->group_new_message->count(array('group'=>$val['group_code'],'send_time'=>array('$gte'=>$time)));
                                        $res=iterator_to_array($user_database->group_new_message->find(array('send_time'=>array('$gte'=>$time),'group'=>$val['group_code']))->sort(array('send_time'=>1)));
                                        foreach ($res as $kk=>$vv){
                                            $content[$kk]['group_code']=$vv['group'];
                                            $content[$kk]['sender_code']=$vv['sender_code'];
                                            $content[$kk]['sender_nickname']=$vv['sender_nickname'];
                                            $content[$kk]['sender_portrait']=$vv['sender_portrait'];
                                            $content[$kk]['send_time']=$vv['send_time'];
                                            $content[$kk]['type']=$vv['type'];
                                            $content[$kk]['content']=$vv['content'];
                                            if($vv['send_time']>$recent_time){
                                                $recent_time =$vv['send_time'];
                                            }
                                        }
                                    }
                                    $group_new_message[$val['group_code']]['group_num']=$val['group_num'];
                                    $group_new_message[$val['group_code']]['group_code']=$val['group_code'];
                                    $group_new_message[$val['group_code']]['count']=$count;
                                    $group_new_message[$val['group_code']]['content']=$content;
                                    $group_new_message[$val['group_code']]['recent_time']=$recent_time;
//                                    if( $group_new_message[$val['group_code']]['count'] == 0){
//                                        unset( $group_new_message[$val['group_code']]);
//                                    }
                                    $content = array();
                                }
                                $group_new_message = self::multi_array_sort($group_new_message,'recent_time',SORT_DESC);
                            }
                        }
                        //获取添加好友申请
                        $new_friends_apply=$db->select()->from('friends_apply')->where('status =0')->query();   //未处理的添加好友申请
                        $data = array(
                            'errcode'=>0,
                            'type'=>1,  //上线获取在线好友以及未读消息
                            'errmsg'=>'在线好友及消息',
                            'data'=>array(
                                'online_friends'=>$online_friends,
                                'friends_new_message'=>$friends_new_message,
                                'group_new_message'=>$group_new_message,
                                'new_friends_apply'=>$new_friends_apply,
                            )
                        );
                        $data2 = array(
                            'errcode'=>0,
                            'type'=>2,  //向好友发送上线通知
                            'errmsg'=>'上线',
                            'data'=>array(
                                'user_code'=>$account_code['account_code'],
                            )
                        );
                        Gateway::sendToUid($online_friends,json_encode($data2)); //给好友提示上线
                        Gateway::sendToClient($client_id,json_encode($data));     //获取在线好友列表 好友未读消息  群未读消息
                        break;
           case 2:  $friend_code = $message->account_code;                                                      //发送消息给好友
                        $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'baseinfo');
                        $table_id =substr($account_code['account_code'],0,4);
                        $user_info= $db->select('nickname,portrait')->from('user_info_'.$table_id)->where('account_code ='.$account_code['account_code'])->row();
                        $mongo =new MongoClient();
                        $userdatastr = 'user_info_'.$account_code;
                        $database1=$mongo->$userdatastr;
                        $collection1 = $database1->friends_chat;
                        $data1 = array(
                            '_id'=>self::getNextId($mongo,'user_info_'.$account_code,'friends_chat'),
                            'sender_code'=>$account_code['account_code'],
                            'sender_nickname'=>$user_info['nickname'],
                            'send_portrait'=>$user_info['portrait'],
                            'content'=>$message->content,
                            'type'=>$message->message_type,
                            'send_time'=>time(),
                        );
                        $collection1->insert($data1);    //发送用户聊天记录表插入数据
//                        $is_online = Gateway::isUidOnline($friend_code);
//                        if($is_online){                         //用户在线
//                            //接收用户聊天记录表插入数据
//                            $database2=$mongo->user_info_.$message->account_code;
//                            $collection2 = $database2->friends_chat;
//                            $data2 = array(
//                                '_id'=>self::getNextId($mongo,'user_info_'.$message->account_code,'friends_chat'),
//                                'sender_code'=>$account_code['account_code'],
//                                'sender_nickname'=>$user_info['nickname'],
//                                'send_portrait'=>$user_info['portrait'],
//                                'content'=>$message->content,
//                                'type'=>$message->type,
//                                'send_time'=>time(),
//                            );
//                            $collection2->insert($data2);
//                            $send_data = self::returnData(0,4,'',$data2);
//
//                        }else{                              //存储用户离线消息
                            $data2 = array(
                                '_id'=>self::getNextId($mongo,'user_info_'.$message->account_code,'friends_chat'),
                                'sender_code'=>$account_code['account_code'],
                                'sender_nickname'=>$user_info['nickname'],
                                'send_portrait'=>$user_info['portrait'],
                                'content'=>$message->content,
                                'type'=>$message->message_type,
                                'send_time'=>time(),
                            );
                            $db2 = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'friends_and_group_'.$message->account_code);
                            $db2->insert('offline_user_message')->cols(array(
                                'sender_code'=>$account_code['account_code'],
                                'content'=>$message->content,
                                'type'=>$message->message_type,
                                'send_time'=>time(),
                            ));
                            $send_data = self::returnData(0,4,'好友消息',$data2);
                            Gateway::sendToUid($message->account_code,json_encode($send_data));//发送给接收人
                            break;
//                        }
           case 3:  $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'baseinfo');//群聊
                        $table_id =substr($account_code['account_code'],0,4);
                       $user_info= $db->select('nickname,portrait')->from('user_info_'.$table_id)->where('account_code ='.$account_code['account_code'])->row();
                       $create_code = $db->select('user_code')->from('group_area')->where('group_code ='.$message->group)->single();
                       $mongo =new MongoClient();
                       $data =array(
                            '_id'=>self::getNextId($mongo,'user_info_'.$create_code,'group_chat'),
                            'sender_code'=>$account_code['account_code'],
                            'send_nickname'=>$user_info['nickname'],
                            'send_portrait'=>$user_info['send_portrait'],
                            'content'=>$message->content,
                            'send_time'=>time(),
                            'group'=>$message->group,
                            'type'=>$message->message_type,
                        );
                        $userdatastr = 'user_info_'.$create_code;
                        $database= $mongo->$userdatastr; //群聊记录保存在创建人分库
                        $collection = $database->group_chat;
                        $collection->insert($data);   //插入数据

                        $returnData =self::returnData(0,5,'群消息',$data);
                        Gateway::sendToGroup($message->group,json_encode($returnData));break; //发送消息给群组
           case 4:  $client_id = Gateway::getClientIdByUid($message->account_code);                //获取某一用户在线状态
                        $is_online = Gateway::isOnline($client_id);
                        $data =  array(
                            'errcode'=>0,
                            'type'=>6,
                            'errmsg'=>'在线状态',
                            'data'=>array(
                                'is_online'=>$is_online              //0:不在线 1：在线
                            )
                        );
                        Gateway::sendToCurrentClient(json_encode($data));
                        break;
           case 5:  $group_code = $message->group_code;                                                         //获取群内用户在线状态
                        $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'baseinfo');//查找群创建人code
                        $user_code = $db->select('user_code')->from('group_area')->where("group_code =$group_code")->single();
                        $db2 =new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'friends_and_group_'.$user_code);//查找群内用户
                        $user_arr  = $db2->select('user_code')->from('group_user')->where("group_code =$group_code")->column();
                        if($user_arr){
                            foreach ($user_arr as $key=>$val){
                                if(!Gateway::isUidOnline($val)){
                                    unset($user_arr[$key]);
                                }
                            }
                        }
                        $arr = array('group_online_user'=>$user_arr);
                        $data = self::returnData(0,7,'群在线用户',$arr);
                        Gateway::sendToCurrentClient(json_encode($data));
                        break;
           case 6:  $friend_code  = $message->account_code;  //拉取好友聊天
                        if(!$friend_code) die ;
                        $mongo= new MongoClient();
                        $baseinfo = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'baseinfo');
                        $table_id =substr($friend_code,0,4);
                        $user_info= $baseinfo->select('nickname,portrait')->from('user_info_'.$table_id)->where('account_code ='.$friend_code)->row();
                        $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'friends_and_group_'.$account_code['account_code']);
                        $data = $db->select()->from('offline_user_message')->where('sender_code ='.$friend_code)->query();
                        $data2 = array();
                        $id=array();
                        if($data){
                            foreach ($data as $k=>$v){
                                $data2[$k]['_id']=self::getNextId($mongo,'user_info_'.$account_code['account_code'],'friends_chat');
                                $data2[$k]['sender_code']=$v['sender_code'];
                                $data2[$k]['sender_nickname']=$user_info['nickname'];
                                $data2[$k]['send_portrait']=$user_info['portrait'];
                                $data2[$k]['content']=$v['content'];
                                $data2[$k]['type']=$v['type'];
                                $data2[$k]['send_time']=$v['send_time'];
                            }
                        }
                        if($data2){
                            $userdatastr = 'user_info_'.$account_code['account_code'];
                            $mongo->$userdatastr->group_new_message->batchInsert($data2);//插入聊天记录表
                            $db->delete()->from('offline_user_massage')->where('sender_code ='.$friend_code)->query();
                        }
                        $returnData =self::returnData(0,8,'好友消息读取成功');
                        Gateway::sendToCurrentClient(json_encode($returnData));break;
           case 7: $group_code =$message->group_code;            //读取群消息
                        $mongo =new MongoClient();
                        $data = $mongo->baseinfo->user_group_time->findOne(array('user_code'=>$account_code['account_code'],'group_code'=>$group_code),array('id','time'));
                        if($data){
                            $mongo->baseinfo->user_group_time->update(array('_id'=>$data['_id']),array('$set'=>array('time'=>time())));
                        }else{
                            $mongo->baseinfo->user_group_time->insert(array('_id'=>self::getNextId($mongo,'baseinfo','user_group_time'),'user_code'=>$account_code['account_code'],'group_code'=>$group_code,'time'=>time()));
                        }
                       $returnData =self::returnData(0,8,'群消息读取成功');
                       Gateway::sendToCurrentClient(json_encode($returnData));
                       break;
           case 8: $user_code = $message->user_code; //添加好友请求
                        if($user_code === $account_code['account_code']){
                            $returnData =self::returnData(0,8,'不能添加自己为好友哦');
                            Gateway::sendToCurrentClient(json_encode($returnData));
                        }
                        $baseinfo = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'baseinfo');
                        $table_id =substr($account_code['account_code'],0,4);
                        $user_info= $baseinfo->select('nickname,portrait')->from('user_info_'.$table_id)->where('account_code ='.$account_code['account_code'])->row();
                        $data = array(
                            'user_code'=>$account_code['account_code'],
                            'user_nickname'=>$user_info['nickname'],
                            'user_portrait'=>$user_info['portrait'],
                            'create_time'=>time(),
                            'status'=>0,
                        );
                        $group_data = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'group_and_friends_'.$user_code);
                        $group_data->insert('friends_apply')->cols($data);
                        break;
       }
   }
   
   /**
    * 当用户断开连接时触发
    * @param int $client_id 连接id
    */
   public static function onClose($client_id) {
       $user_code = $_SESSION['account_code'];
       Gateway::unbindUid($client_id,$user_code);
       $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'friends_and_group_'.$user_code);
//       $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'friends_and_group_'.'030117608006762');
       $user_friends = $db->select('user_code')->from('user_friends')->column();
       if($user_friends){
           $data = array(
               'errcode'=>0,
               'errmsg'=>'logout',
               'type'=>3,
               'data'=>array(
                   'user_code'=>$user_code,
               )
           );
           // 向所有好友发送
           Gateway::sendToUid($user_friends,json_encode($data));
       }
       $_SESSION['account_code']='';
   }
   public static function returnData($errcode,$type,$errmsg='',$data=''){
        $arr =array(
            'errcode'=>$errcode,
            'type'=>$type,
            'errmsg'=>$errmsg,
            'data'=>$data
        );
        return $arr;
   }
    /*
  * 获取mongodb数据库中表的主键
  * */
    public static function getNextId($mongo,$db,$name,$param=array()){

        $param += array(   //默认ID从1开始,间隔是1
            'init' => 1,
            'step' => 1,
        );

        $update = array('$inc'=>array('id'=>$param['step']));   //设置间隔
        $query = array('name'=>$name);
        $command = array(
            'findandmodify' => 'counters',
            'update' => $update,
            'query' => $query,
            'new' => true
        );

        $id = $mongo->$db->command($command);
        if (isset($id['value']['id'])) {
            return $id['value']['id'];
        }else{
            $mongo->$db->insert(array(
                'name' => $name,
                'id' => $param['init'],     //设置ID起始数值
            ));
            return $param['init'];
        }
    }
    /*
     * 二维数组排序
     * */
    public static function multi_array_sort($multi_array,$sort_key,$sort=SORT_ASC){
        if(is_array($multi_array)){
            foreach ($multi_array as $row_array){
                if(is_array($row_array)){
                    $key_array[] = $row_array[$sort_key];
                }else{
                    return false;
                }
            }
        }else{
            return false;
        }
        array_multisort($key_array,$sort,$multi_array);
        return $multi_array;
    }

}


//返回数据 type类型为 1 .为获取在线好友、好友未读消息、群未读消息  2.为好友上线通知（本地保存的好友列表更新） 3.为好友下线通知 4.好友消息  5群消息 6.用户在线状态 7.群在线用户 8.提示展示型消息