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
use \Api\Model;
use Common\Lib;
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
        Gateway::sendToCurrentClient("Your client_id is $client_id\n");
        // 向所有人发送
        Gateway::sendToAll("$client_id login\n");
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
           $apptoken = $message->apptoken;
           $aesLib = new \Common\Lib\AesLib();
           $account_code=$apptoken?json_decode($aesLib->aes128cbcDecrypt($apptoken,C('APP_KEY.TOKEN_AES_IV'), C('APP_KEY.TOKEN_AES_KEY')),true):'';
       };
       if(!$account_code)return array('errcode'=>1,'errmsg'=>'请重新登录');
       switch ($message->type){
           case 1: Gateway::bindUid($client_id,$account_code);    //绑定客户端id及用户code
           $user_arr = session('user_arr');
           if(!in_array($account_code,$user_arr)){$user_arr[]=$account_code;session('user_arr',$user_arr);};
           $user_group = new Model\UserGroupModel($account_code);
           $group_arr=$user_group->getGroup();
           if($group_arr){
               foreach ($group_arr as $k=>$v){
                   Gateway::joinGroup($client_id,$v['group_code']);  //将用户加入群组
               }
           };break;
           case 2: Gateway::sendToAll("$client_id said $message->content"); // 向所有人发送
       }
   }
   
   /**
    * 当用户断开连接时触发
    * @param int $client_id 连接id
    */
   public static function onClose($client_id) {
       // 向所有人发送 
       GateWay::sendToAll("$client_id logout");
   }
}
