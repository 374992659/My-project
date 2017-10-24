<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/13
 * Time: 11:33
 */
$m =new MongoClient();
$db = $m->baseinfo;
$collection = $db->user_area;
$collection->insert(array(
    '_id'=>getNextId($m,'baseinfo','user_area'),
    'account'=>'17608006763',
    'phone'=>'',
    'table_id'=>2701,
    'status'=>1,
    'account_code'=>'270117608006763',
    'portrait'=>'http://39.108.237.198/project/Application/Common/Source/Img/default_portrait.jpg',
    'nickname'=>'17608006763',
));




/*
 * 获取mongodb数据库中表的主键
 * */
 function getNextId($mongo,$dbName,$collectionName,$param=array()){

    $param += array(   //默认ID从1开始,间隔是1
        'init' => 1,
        'step' => 1,
    );

    $update = array('$inc'=>array('id'=>$param['step']));   //设置间隔
    $query = array('name'=>$collectionName);
    $command = array(
        'findandmodify' => 'counters',
        'update' => $update,
        'query' => $query,
        'new' => true
    );

    $id = $mongo->$dbName->command($command);
    if (isset($id['value']['id'])) {
        return $id['value']['id'];
    }else{
        $mongo->$dbName->insert(array(
            'name' => $collectionName,
            'id' => $param['init'],     //设置ID起始数值
        ));
        return $param['init'];
    }
}