<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/13
 * Time: 11:33
 */
$m =new MongoClient();
$db = $m->baseinfo;
$collection = $db->group_area;
$collection->insert(array(
    '_id'=>getNextId($m,'baseinfo','group_area'),
    'group_num'=>'359367',
    'group_code'=>'2701359367',
    'table_id'=>2701,
    'user_code'=>'270117608006762',
    'status'=>1,
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