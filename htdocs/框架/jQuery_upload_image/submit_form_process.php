<?php
	header("Content-type: text/html; charset=utf-8"); 
	//不存在当前上传文件则上传
	if(!file_exists($_FILES['upload_file']['name'])) move_uploaded_file($_FILES['upload_file']['tmp_name'],iconv('utf-8','gb2312',$_FILES['upload_file']['name']));
	//输出图片文件<img>标签
    echo "<textarea><img src='{$_FILES['upload_file']['name']}'/></textarea>";
//End_php