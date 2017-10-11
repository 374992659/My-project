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
//                        $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'friends_and_group_'.$account_code['account_code']);
                        $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'friends_and_group_'.'030117608006762');
                        $group_arr = $db->query('select group_code  from user_group where status = 1;');
                        if($group_arr){
                               foreach ($group_arr as $k=>$v){
                                   Gateway::joinGroup($client_id,$v['group_code']);                                   //将用户加入群组
                               }
                        };
                        //获取用户在线的好友
                        $user_friends = $db->query('select user_code from user_friends');
                        $online_user = Gateway::getAllClientSessions();
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
                        $data = array(
                            'errocode'=>0,
                            'data'=>array(
                                'type'=>1,
                                'online_friends'=>$online_friends,
                            )
                        );
                        Gateway::sendToClient($client_id,json_encode($data));
                        break;
           case 2:  Gateway::sendToUid($message->account_code,$message->content);break; //发送消息给好友
           case 3:  Gateway::sendToGroup($message->group,$message->content);break;   //发送消息给群组
       }
   }
   
   /**
    * 当用户断开连接时触发
    * @param int $client_id 连接id
    */
   public static function onClose($client_id) {
       $user_code = $_SESSION['account_code'];
       $db = new Workerman\MySQL\Connection('127.0.0.1', '3306', 'root', 'meiyijiayuan1709', 'friends_and_group_'.'030117608006762');
        $user_friends = $db->select('user_code')->from('user_friends')->column();
        var_dump($user_friends);
       // 向所有人发送 
       GateWay::sendToAll(json_encode($_SESSION['account_code']));
   }
}


//返回数据 type类型为 1 为获取在线用户列表
