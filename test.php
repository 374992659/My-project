<?php
/**
 * Created by PhpStorm.
 * User: Wang.yn
 * Date: 2017/10/13
 * Time: 11:33
 */
$m =new MongoClient();
$db = $m->local;
$collection = $db->test;
$collection->update(array('name'=>'123'),array('$set'=>array('value'=>'12121212')));



