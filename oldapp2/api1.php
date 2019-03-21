<?php
        $url = "http://imescustomerapi.evalai.com/api/StaticData/GetIndustryNames/mstIndCatID=10003";
        $data = json_decode(file_get_contents($url), true);
        echo "id: ", $data['id'];
        echo '<br>';
        echo "Name: ", $data['name'];
        echo '<br>';
        echo "Logo: ", '<img src="', $data['logo'], ' " height="30" width="30">';
?>