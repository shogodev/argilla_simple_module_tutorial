<?php

Yii::app()->breadcrumbs->show(); // испорльзуется для отображения хлебных крошек

$this->widget('BGridView', [
  'dataProvider' => $model->search(),
  'filter'       => $model,
  'columns'      => [
    ['name' => 'name'],
    ['name' => 'notice', 'filter' => false],
    ['name' => 'content', 'filter' => false],

    ['class' => 'JToggleColumn', 'name' => 'visible', 'filter' => CHtml::listData($model->yesNoList(), 'id', 'name')],
    ['class' => 'BButtonColumn'],
  ],
]);